// BodyType.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Cars } from './Cars';
import { Models } from './Models';

@Entity("body_type", { schema: "public" })
export class BodyType {
  @PrimaryGeneratedColumn({ type: "integer", name: "body_type_id" })
  bodyTypeId: number;

  @Column("character varying", { name: "type", unique: true, length: 50 })
  type: string;

  @OneToMany(() => Cars, (cars) => cars.bodyType)
  cars: Cars[];

  @ManyToMany(() => Models, (models) => models.bodyTypes)
  @JoinTable({
    name: "model_body_types",
    joinColumns: [{ name: "body_type_id", referencedColumnName: "bodyTypeId" }],
    inverseJoinColumns: [{ name: "model_id", referencedColumnName: "modelId" }],
    schema: "public",
  })
  models: Models[];
}
