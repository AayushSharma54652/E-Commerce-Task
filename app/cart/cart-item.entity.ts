import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToOne,
    JoinColumn,
  } from "typeorm";
  import { Cart } from "./cart.entity";
  import { Product } from "../product/product.entity";
  
  @Entity("cart_items")
  export class CartItem extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: "CASCADE" })
    @JoinColumn({ name: "cart_id" })
    cart: Cart;
  
    @ManyToOne(() => Product, (product) => product.cartItems, { 
      eager: true, 
      onDelete: "CASCADE" 
    })
    @JoinColumn({ name: "product_id" })
    product: Product;
  
    @Column("int")
    quantity: number;
  
    @Column("decimal", { precision: 10, scale: 2 })
    totalPrice: number;
  }
  