import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Note } from "./Note";
import { User } from "./User";

@Entity()
@Unique(["noteId", "userId"])
export class UserNote extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column()
  noteId: string;

  @Index()
  @Column()
  userId: string;

  @ManyToOne(() => Note, (note) => note.users, {
    primary: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "noteId" })
  note: Note;

  @ManyToOne(() => User, (user) => user.notes, {
    primary: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user: User;
}
