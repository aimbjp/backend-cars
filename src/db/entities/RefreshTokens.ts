import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";

@Entity("refresh_tokens", { schema: "public" })
export class RefreshTokens {
  @PrimaryGeneratedColumn({ type: "integer", name: "token_id" })
  tokenId: number;

  @Column("character varying", { name: "token", unique: true, length: 255 })
  token: string;

  @Column("timestamp with time zone", { name: "expires_at" })
  expiresAt: Date;

  @Column("timestamp with time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @ManyToOne(() => Users, (users) => users.refreshTokens, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
