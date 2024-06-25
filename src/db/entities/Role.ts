import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";

@Entity("role", { schema: "public" })
export class Role {
  @PrimaryGeneratedColumn({ type: "integer", name: "role_id" })
  roleId: number;

  @Column("character varying", { name: "type", unique: true, length: 20 })
  type: string;

  @OneToMany(() => Users, (users) => users.role_2)
  users: Users[];
}
