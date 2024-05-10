import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cars } from "./Cars";
import { ListStatus } from "./ListStatus";
import { Users } from "./Users";

@Entity("listings", { schema: "public" })
export class Listings {
  @PrimaryGeneratedColumn({ type: "integer", name: "listing_id" })
  listingId: number;

  @Column("numeric", { name: "price", nullable: true })
  price: string | null;

  @Column("numeric", { name: "tax", nullable: true })
  tax: string | null;

  @Column("character varying", { name: "pts", nullable: true, length: 50 })
  pts: string | null;

  @Column("character varying", { name: "vin", nullable: false, length: 50 })
  VIN: string;

  @Column("character varying", { name: "place", nullable: true, length: 255 })
  place: string;

  @Column("jsonb", { name: "media_url", nullable: true, default: () => ['http://pumase.ru/media-listings/default.png'] })
  media_url: string[] | null;

  @Column("integer", { name: "owners_count", nullable: true })
  ownersCount: number | null;

  @Column("character varying", { name: "customs", nullable: true, length: 50 })
  customs: string | null;

  @Column("boolean", {
    name: "exchange",
    nullable: true,
    default: () => "false",
  })
  exchange: boolean | null;

  @Column("timestamp with time zone", {
    name: "date_posted",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  datePosted: Date | null;

  @Column("integer", { name: "views", nullable: true, default: () => "0" })
  views: number | null;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @ManyToOne(() => Cars, (cars) => cars.listings)
  @JoinColumn([{ name: "car_id", referencedColumnName: "carId" }])
  car: Cars;

  @ManyToOne(() => ListStatus, (listStatus) => listStatus.listings)
  @JoinColumn([
    { name: "list_status_id", referencedColumnName: "listStatusId" },
  ])
  listStatus: ListStatus;

  @ManyToOne(() => Users, (users) => users.listings)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
