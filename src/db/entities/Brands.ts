import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Models } from "./Models";

@Entity("brands", { schema: "public" })
export class Brands {
  @PrimaryGeneratedColumn({ type: "integer", name: "brand_id" })
  brandId: number;

  @Column("character varying", { name: "name", unique: true, length: 255 })
  name: string;

  @OneToMany(() => Models, (models) => models.brand)
  models: Models[];
}
