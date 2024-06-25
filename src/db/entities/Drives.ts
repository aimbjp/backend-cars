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

@Entity("drives", { schema: "public" })
export class Drives {
  @PrimaryGeneratedColumn({ type: "integer", name: "drive_id" })
  driveId: number;

  @Column("character varying", { name: "type", unique: true, length: 50 })
  type: string;

  @OneToMany(() => Cars, (cars) => cars.drive)
  cars: Cars[];

  @ManyToMany(() => Models, (models) => models.drives)
  @JoinTable({
    name: "model_drives",
    joinColumns: [{ name: "drive_id", referencedColumnName: "driveId" }],
    inverseJoinColumns: [{ name: "model_id", referencedColumnName: "modelId" }],
    schema: "public",
  })
  models: Models[];
}
