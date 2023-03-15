import express, { NextFunction } from 'express';
import { Note } from './entity/Note';
import { User } from './entity/User';
import { UserNote } from './entity/UserNote';
import * as yup from 'yup';
import { ValidationError } from 'yup';
import bcrypt from 'bcryptjs';

const router = express.Router();

const signUpSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, 'username must be at least 3 characters')
    .max(255),
  email: yup.string().email('email must be a valid email'),
  password: yup
    .string()
    .min(3, 'password must be at least 3 characters')
    .max(255),
});

const loginSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, 'username must be at least 3 characters')
    .max(255),
  password: yup
    .string()
    .min(3, 'password must be at least 3 characters')
    .max(255),
});

const YupError = (err: ValidationError, next: NextFunction) => {
  const { message } = err;

  //   throw new UserInputError(message, {
  //     name: path,
  //     inputName: path,
  //   });
  // TODO: fix yup error
  return next(message);
};

router.get('/users/me', (req, res) => {
  const user =
    req.session && req.session.userId ? User.findOne(req.session.userId) : null;

  res.send({
    user,
  });
});

router.post('/users/signup', async (req, res, next) => {
  const body = req.body;

  try {
    await signUpSchema.validate(body);
  } catch (err) {
    YupError(err, next);
  }

  const password = await bcrypt.hash(body.password, 10);

  const user = await User.create({
    username: body.username,
    email: body.email,
    password,
  }).save();

  req.session.userId = user.id;

  res.send(user);
});

router.post('/users/login', async (req, res, next) => {
  const body = req.body;
  try {
    await loginSchema.validate(body);
  } catch (err) {
    YupError(err, next);
  }

  const user = await User.findOne(
    { username: body.username },
    { select: ['id', 'username', 'password'] }
  );

  if (!user) {
    return next('user is not found!');
    // throw new UserInputError("user is not found!", {
    //   name: "username",
    //   inputName: "username",
    // });
  }

  const valid = await bcrypt.compare(body.password, user.password);

  if (!valid) {
    return next('password incorrect');
    // throw new UserInputError("password incorrect", {
    //   name: "password",
    //   inputName: "password",
    // });
  }

  req.session.userId = user.id;

  res.send(user);
});

router.get('/notes', async (req, res, next) => {
  if (!req.session.userId) {
    return next('not logged in');
  }

  const notes = await Note.createQueryBuilder('note')
    .leftJoinAndSelect('note.users', 'un')
    .where('un.userId = :userId', { userId: req.session.userId })
    .orderBy('note.updatedAt', 'DESC')
    .getMany();

  res.send(notes);
});

router.post('/notes', async (req, res, next) => {
  const { title, body } = req.body;

  if (!req.session.userId) {
    return next('not logged in');
  }

  const note = await Note.create({
    title,
    body,
  }).save();

  await UserNote.create({
    userId: req.session.userId,
    noteId: note.id,
  }).save();

  res.send(note);
});

router.get('/notes/:id', async (req, res, next) => {
  if (!req.session.userId) {
    return next('not logged in');
  }

  const { id } = req.params;

  const note = await Note.createQueryBuilder('note')
    .where('note.id = :noteId', { noteId: id })
    .leftJoinAndSelect('note.users', 'un')
    .getOne();

  if (!note) {
    return next('not found');
  }

  if (!note.users.find((u) => u.userId === req.session.userId)) {
    return next('not authorized');
  }

  res.send(note);
});

router.put('/notes/:id', async (req, res, next) => {
  if (!req.session.userId) {
    return next('not logged in');
  }

  const { id } = req.params;

  const { title, body } = req.body;

  const note = await Note.createQueryBuilder('note')
    .where('note.id = :noteId', { noteId: id })
    .leftJoinAndSelect('note.users', 'un')
    .getOne();

  if (!note) {
    return next('not found');
  }

  if (!note.users.find((u) => u.userId === req.session.userId)) {
    return next('not authorized');
  }

  note.title = title;
  note.body = body;

  const updatedNote = await note.save();

  res.send(updatedNote);
});

router.delete('/notes/:id', async (req, res, next) => {
  if (!req.session.userId) {
    return next('not logged in');
  }

  const { id } = req.params;

  const note = await Note.createQueryBuilder('note')
    .where('note.id = :noteId', { noteId: id })
    .leftJoinAndSelect('note.users', 'un')
    .getOne();

  if (!note) {
    return next('not found');
  }

  if (!note.users.find((u) => u.userId === req.session.userId)) {
    return next('not authorized');
  }

  await note.remove();

  res.send(true);
});

module.exports = router;