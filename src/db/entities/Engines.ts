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

@Entity("engines", { schema: "public" })
export class Engines {
  @PrimaryGeneratedColumn({ type: "integer", name: "engine_id" })
  engineId: number;

  @Column("character varying", { name: "type", nullable: true, length: 50 })
  type: string | null;

  @Column("character varying", { name: "capacity", nullable: true, length: 50 })
  capacity: string | null;

  @OneToMany(() => Cars, (cars) => cars.engine)
  cars: Cars[];

  @ManyToMany(() => Models, (models) => models.engines)
  @JoinTable({
    name: "model_engines",
    joinColumns: [{ name: "engine_id", referencedColumnName: "engineId" }],
    inverseJoinColumns: [{ name: "model_id", referencedColumnName: "modelId" }],
    schema: "public",
  })
  models: Models[];
}
