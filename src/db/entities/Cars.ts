import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BodyType } from "./BodyType";
import { Color } from "./Color";
import { Drives } from "./Drives";
import { Engines } from "./Engines";
import { Models } from "./Models";
import { Transmissions } from "./Transmissions";
import { Listings } from "./Listings";
import { Reviews } from "./Reviews";

@Entity("cars", { schema: "public" })
export class Cars {
  @PrimaryGeneratedColumn({ type: "integer", name: "car_id" })
  carId: number;

  @Column("integer", { name: "year", nullable: true })
  year: number | null;

  @ManyToOne(() => BodyType, (bodyType) => bodyType.cars)
  @JoinColumn([{ name: "body_type_id", referencedColumnName: "bodyTypeId" }])
  bodyType: BodyType;

  @ManyToOne(() => Color, (color) => color.cars)
  @JoinColumn([{ name: "color_id", referencedColumnName: "colorId" }])
  color: Color;

  @ManyToOne(() => Drives, (drives) => drives.cars)
  @JoinColumn([{ name: "drive_id", referencedColumnName: "driveId" }])
  drive: Drives;

  @ManyToOne(() => Engines, (engines) => engines.cars)
  @JoinColumn([{ name: "engine_id", referencedColumnName: "engineId" }])
  engine: Engines;

  @ManyToOne(() => Models, (models) => models.cars)
  @JoinColumn([{ name: "model_id", referencedColumnName: "modelId" }])
  model: Models;

  @ManyToOne(() => Transmissions, (transmissions) => transmissions.cars)
  @JoinColumn([
    { name: "transmission_id", referencedColumnName: "transmissionId" },
  ])
  transmission: Transmissions;

  @OneToMany(() => Listings, (listings) => listings.car)
  listings: Listings[];

  @OneToMany(() => Reviews, (reviews) => reviews.car)
  reviews: Reviews[];
}
