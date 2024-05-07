import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cars } from "./Cars";
import { BodyType } from "./BodyType";
import { Color } from "./Color";
import { Drives } from "./Drives";
import { Engines } from "./Engines";
import { Transmissions } from "./Transmissions";
import { Brands } from "./Brands";

@Entity("models", { schema: "public" })
export class Models {
  @PrimaryGeneratedColumn({ type: "integer", name: "model_id" })
  modelId: number;

  @Column("character varying", { name: "name", unique: true, length: 255 })
  name: string;

  @OneToMany(() => Cars, (cars) => cars.model)
  cars: Cars[];

  @ManyToMany(() => BodyType, (bodyType) => bodyType.models)
  bodyTypes: BodyType[];

  @ManyToMany(() => Color, (color) => color.models)
  colors: Color[];

  @ManyToMany(() => Drives, (drives) => drives.models)
  drives: Drives[];

  @ManyToMany(() => Engines, (engines) => engines.models)
  engines: Engines[];

  @ManyToMany(() => Transmissions, (transmissions) => transmissions.models)
  @JoinTable({
    name: "model_transmissions",
    joinColumns: [{ name: "model_id", referencedColumnName: "modelId" }],
    inverseJoinColumns: [
      { name: "transmission_id", referencedColumnName: "transmissionId" },
    ],
    schema: "public",
  })
  transmissions: Transmissions[];

  @ManyToOne(() => Brands, (brands) => brands.models)
  @JoinColumn([{ name: "brand_id", referencedColumnName: "brandId"}])
  brand: Brands | null;
}
