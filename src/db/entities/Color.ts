import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cars } from "./Cars";
import { Models } from "./Models";


@Entity("color", { schema: "public" })
export class Color {
  @PrimaryGeneratedColumn({ type: "integer", name: "color_id" })
  colorId: number;

  @Column("character varying", { name: "type", unique: true, length: 50 })
  type: string;

  @OneToMany(() => Cars, (cars) => cars.color)
  cars: Cars[];

  @ManyToMany(() => Models, (models) => models.colors)
  @JoinTable({
    name: "model_colors",
    joinColumns: [{ name: "color_id", referencedColumnName: "colorId" }],
    inverseJoinColumns: [{ name: "model_id", referencedColumnName: "modelId" }],
    schema: "public",
  })
  models: Models[];
}
