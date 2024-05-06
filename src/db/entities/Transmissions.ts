import {
  Column,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cars } from "./Cars";
import { Models } from "./Models";

@Entity("transmissions", { schema: "public" })
export class Transmissions {
  @PrimaryGeneratedColumn({ type: "integer", name: "transmission_id" })
  transmissionId: number;

  @Column("character varying", { name: "type", unique: true, length: 50 })
  type: string;

  @OneToMany(() => Cars, (cars) => cars.transmission)
  cars: Cars[];

  @ManyToMany(() => Models, (models) => models.transmissions)
  models: Models[];
}
