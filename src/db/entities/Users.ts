import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Listings } from "./Listings";
import { Messages } from "./Messages";
import { RefreshTokens } from "./RefreshTokens";
import { Reviews } from "./Reviews";
import { ContactInfo } from "./ContactInfo";
import { Role } from "./Role";

@Entity("users", { schema: "public" })
export class Users {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "username", unique: true, length: 255 })
  username: string;

  @Column("character varying", { name: "password", length: 255 })
  password: string;

  @Column("timestamp with time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("character varying", { name: "email", unique: true, length: 255 })
  email: string;

  @Column("character varying", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("character varying", { name: "surname", nullable: true, length: 255 })
  surname: string | null;

  @Column("character varying", {
    name: "role",
    nullable: true,
    length: 10,
    default: () => "'user'",
  })
  role: string | null;

  @Column("double precision", {
    name: "rating",
    nullable: true,
    default: () => "0.0",
  })
  rating: number | null;

  @OneToMany(() => Listings, (listings) => listings.user)
  listings: Listings[];

  @OneToMany(() => Messages, (messages) => messages.receiver)
  messages: Messages[];

  @OneToMany(() => Messages, (messages) => messages.sender)
  messages2: Messages[];

  @OneToMany(() => RefreshTokens, (refreshTokens) => refreshTokens.user)
  refreshTokens: RefreshTokens[];

  @OneToMany(() => Reviews, (reviews) => reviews.user)
  reviews: Reviews[];

  @ManyToOne(() => ContactInfo, (contactInfo) => contactInfo.users)
  @JoinColumn([
    { name: "contact_info_id", referencedColumnName: "contactInfoId" },
  ])
  contactInfo: ContactInfo;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn([{ name: "role_id", referencedColumnName: "roleId" }])
  role_2: Role;
}
