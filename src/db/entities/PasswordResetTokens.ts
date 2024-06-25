import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("password_reset_tokens", { schema: "public" })
export class PasswordResetTokens {
  @PrimaryGeneratedColumn({ type: "integer", name: "reset_token_id" })
  resetTokenId: number;

  @Column("character varying", { name: "email", length: 255 })
  email: string;

  @Column("character varying", { name: "token", length: 255 })
  token: string;

  @Column("timestamp without time zone", { name: "expires_at" })
  expiresAt: Date;
}
