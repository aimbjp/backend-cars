import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";

@Entity("messages", { schema: "public" })
export class Messages {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "sender_id" })
  senderId: number;

  @Column("integer", { name: "receiver_id" })
  receiverId: number;

  @Column("text", { name: "content", nullable: true })
  content: string | null;

  @Column("jsonb", { name: "media_url", nullable: true })
  mediaUrl: object | null;

  @Column("timestamp without time zone", {
    name: "timestamp",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  timestamp: Date | null;

  @Column("character varying", {
    name: "status",
    nullable: true,
    length: 50,
    default: () => "'sent'",
  })
  status: string | null;

  @ManyToOne(() => Users, (users) => users.messages)
  @JoinColumn([{ name: "receiver_id", referencedColumnName: "id" }])
  receiver: Users;

  @ManyToOne(() => Users, (users) => users.messages2)
  @JoinColumn([{ name: "sender_id", referencedColumnName: "id" }])
  sender: Users;
}
