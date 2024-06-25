import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Listings } from "./Listings";

@Entity("list_status", { schema: "public" })
export class ListStatus {
  @PrimaryGeneratedColumn({ type: "integer", name: "list_status_id" })
  listStatusId: number;

  @Column("character varying", { name: "type", unique: true, length: 50 })
  type: string;

  @OneToMany(() => Listings, (listings) => listings.listStatus)
  listings: Listings[];
}
