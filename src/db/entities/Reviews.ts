import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cars } from "./Cars";
import { Users } from "./Users";

@Entity("reviews", { schema: "public" })
export class Reviews {
  @PrimaryGeneratedColumn({ type: "integer", name: "review_id" })
  reviewId: number;

  @Column("integer", { name: "rating", nullable: true })
  rating: number | null;

  @Column("text", { name: "comment", nullable: true })
  comment: string | null;

  @Column("timestamp with time zone", {
    name: "date_posted",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  datePosted: Date | null;

  @ManyToOne(() => Cars, (cars) => cars.reviews)
  @JoinColumn([{ name: "car_id", referencedColumnName: "carId" }])
  car: Cars;

  @ManyToOne(() => Users, (users) => users.reviews)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
