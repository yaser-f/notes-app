// import bcrypt from "bcryptjs";
import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToMany,
  Index,
} from "typeorm";
import { UserNote } from "./UserNote";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { length: 255, unique: true, select: false })
  email: string;

  @Index({ unique: true })
  @Column("varchar", { length: 255 })
  username: string;

  @Column("text", { select: false })
  password: string;

  @OneToMany(() => UserNote, (un) => un.user)
  notes: UserNote[];

  //   @BeforeInsert()
  //   async BeforeInsert() {
  //     this.password = await bcrypt.hash(this.password, 10);
  //     this.name = this.username;
  //   }
}
