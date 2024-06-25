import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";

@Entity("contact_info", { schema: "public" })
export class ContactInfo {
  @PrimaryGeneratedColumn({ type: "integer", name: "contact_info_id" })
  contactInfoId: number;

  @Column("jsonb", { name: "contact_info", nullable: true })
  contactInfo: object | null;

  @OneToMany(() => Users, (users) => users.contactInfo)
  users: Users[];
}
