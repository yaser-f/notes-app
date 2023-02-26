import { Context } from "./types/graphql-utils";
import { UserInputError } from "apollo-server-core";
import { User } from "./entity/User";
import { Note } from "./entity/Note";
import { UserNote } from "./entity/UserNote";
import bcrypt from "bcryptjs";
import * as yup from "yup";
import { ValidationError } from "yup";

const signUpSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, "username must be at least 3 characters")
    .max(255),
  email: yup.string().email("email must be a valid email"),
  password: yup
    .string()
    .min(3, "password must be at least 3 characters")
    .max(255),
});

const loginSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, "username must be at least 3 characters")
    .max(255),
  password: yup
    .string()
    .min(3, "password must be at least 3 characters")
    .max(255),
});

const YupError = (err: ValidationError) => {
  const { message, path } = err;

  throw new UserInputError(message, {
    name: path,
    inputName: path,
  });
};

export const resolvers = {
  Query: {
    currentUser: async (_: any, __: any, { req }: Context) => {
      return req.session && req.session.userId
        ? User.findOne(req.session.userId)
        : null;
    },
    notes: async (_: any, __: any, { req }: Context) => {
      if (!req.session.userId) {
        throw new Error("not logged in");
      }

      const notes = await Note.createQueryBuilder("note")
        .leftJoinAndSelect("note.users", "un")
        .where("un.userId = :userId", { userId: req.session.userId })
        .orderBy("note.updatedAt", "DESC")
        .getMany();

      return notes;
    },
    note: async (_: any, { id }: { id: string }, { req }: Context) => {
      if (!req.session.userId) {
        throw new Error("not logged in");
      }

      const note = await Note.createQueryBuilder("note")
        .where("note.id = :noteId", { noteId: id })
        .leftJoinAndSelect("note.users", "un")
        .getOne();

      if (!note) {
        throw new Error("not found");
      }

      if (!note.users.find((u) => u.userId === req.session.userId)) {
        throw new Error("not authorized");
      }

      return note;
    },
  },
  Mutation: {
    signUp: async (
      _: any,
      args: {
        username: string;
        email: string;
        password: string;
      },
      { req }: Context
    ) => {
      try {
        await signUpSchema.validate(args);
      } catch (err) {
        return YupError(err);
      }

      const password = await bcrypt.hash(args.password, 10);

      const user = await User.create({
        username: args.username,
        email: args.email,
        password,
      }).save();

      // throw new UserInputError("username is already taken!", {
      //   name: "username",
      //   inputName: "username",
      // });

      req.session.userId = user.id;

      return user;
    },
    login: async (
      _: any,
      args: { username: string; password: string },
      { req }: Context
    ) => {
      try {
        await loginSchema.validate(args);
      } catch (err) {
        return YupError(err);
      }

      const user = await User.findOne(
        { username: args.username },
        { select: ["id", "username", "password"] }
      );

      if (!user) {
        throw new UserInputError("user is not found!", {
          name: "username",
          inputName: "username",
        });
      }

      const valid = await bcrypt.compare(args.password, user.password);

      if (!valid) {
        throw new UserInputError("password incorrect", {
          name: "password",
          inputName: "password",
        });
      }

      req.session.userId = user.id;

      return user;
    },
    addNote: async (
      _: any,
      { title, body }: { title: string; body: string },
      { req }: Context
    ) => {
      if (!req.session.userId) {
        throw new Error("not logged in");
      }

      const note = await Note.create({
        title: title,
        body: body,
      }).save();

      await UserNote.create({
        userId: req.session.userId,
        noteId: note.id,
      }).save();

      return note;
    },
    updateNote: async (
      _: any,
      { id, title, body }: { id: string; title: string; body: string },
      { req }: Context
    ) => {
      if (!req.session.userId) {
        throw new Error("not logged in");
      }

      const note = await Note.createQueryBuilder("note")
        .where("note.id = :noteId", { noteId: id })
        .leftJoinAndSelect("note.users", "un")
        .getOne();

      if (!note) {
        throw new Error("not found");
      }

      if (!note.users.find((u) => u.userId === req.session.userId)) {
        throw new Error("not authorized");
      }

      note.title = title;
      note.body = body;

      const updatedNote = await note.save();

      return updatedNote;
    },
    removeNote: async (_: any, { id }: { id: string }, { req }: Context) => {
      if (!req.session.userId) {
        throw new Error("not logged in");
      }

      const note = await Note.createQueryBuilder("note")
        .where("note.id = :noteId", { noteId: id })
        .leftJoinAndSelect("note.users", "un")
        .getOne();

      if (!note) {
        throw new Error("not found");
      }

      if (!note.users.find((u) => u.userId === req.session.userId)) {
        throw new Error("not authorized");
      }

      await note.remove();

      return true;
    },
  },
};
