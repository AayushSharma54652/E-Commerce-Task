import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../../user/user.entity"; 
import { Product } from "../../product/product.entity";
import { Cart } from "../../cart/cart.entity";
import { CartItem } from "../../cart/cart-item.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost", // Update with your database host
  port: 5432,        // Default PostgreSQL port
  username: "postgres", // Loaded from environment variables if required
  password: "1234",     // Loaded from environment variables if required
  database: "ecommerce", 
  synchronize: false,   // Disable synchronization for migrations
  logging: true,        // Enable query logging for debugging
  entities: [User, Product, Cart, CartItem], // Path to your entity files
  migrations: ["app/migrations/*.ts"], // Path to migration files
  migrationsTableName: "migrations", // Table to track applied migrations
}); 

export const connectDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established successfully!");
  } catch (error) {
    console.error("Error during database connection initialization:", error);
    throw error;
  }
};
