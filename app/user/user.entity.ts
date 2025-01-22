import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Cart } from "../cart/cart.entity";

@Entity("users") // Table name in PostgreSQL
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") // Use UUID as the primary key
  id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", unique: true, length: 255 })
  email: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @Column({ type: "varchar", nullable: true })
  refreshToken: string | null;

  @Column({
    type: "enum",
    enum: ["CUSTOMER", "ADMIN"],
    default: "CUSTOMER",
  })
  role: "CUSTOMER" | "ADMIN";

  @Column({ type: "boolean", default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];
}
