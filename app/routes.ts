import express from "express";
import userRoutes from "./user/user.route";
import productRoutes from "./product/product.route";
import cartRoutes from "./cart Previous/cart.route";
import paymentRoutes from "./payment/payment.route";
import orderRoutes from "./order/order.route";


const router = express.Router();

router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/payment", paymentRoutes);
router.use("/orders", orderRoutes);

export default router;