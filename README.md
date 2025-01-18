# E-Commerce Platform Backend

This is the backend implementation of an e-commerce platform. It allows users to manage their accounts, add products to the cart, place orders, and track the status of those orders. The backend is built with Node.js, Express, MongoDB, and JWT-based authentication. 

## Features

- **User Authentication**: Secure registration, login, profile update, and logout using JWT.
- **Product Management**: CRUD operations for managing products (admin access required).
- **Cart Management**: Add, update, remove, and view cart items.
- **Order Management**: Create orders, update order status, and view order details.
- **Admin Features**: Admin users can create, update, and delete products, and manage orders.
- **Rate Limiting**: Limiting the number of requests to prevent abuse.
- **Error Handling**: Custom error handling middleware for consistent responses.
- **Validation**: Request data validation for key actions like creating orders, adding products, etc.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Rate Limiting**: express-rate-limit
- **Middleware**: Custom middlewares for error handling, authentication, and admin checks
- **Validation**: express-validator

## Installation

### Prerequisites

- Node.js
- MongoDB (local or Atlas)
- A `.env` file with necessary configurations

### Steps to Run the Project

1. **Clone the repository**:

    ```bash
    git clone https://github.com/yourusername/e-commerce-backend.git
    cd e-commerce-backend
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Set up environment variables**:

    Create a `.env` file in the root of the project and add the following:

    ```
    PORT=3000
    JWT_SECRET_KEY=your-jwt-secret-key
    MONGO_URI=mongodb://localhost:27017/your-database-name
    ```

4. **Run the server**:

    ```bash
    npm start
    ```

    The server will be running at `http://localhost:3000`.

## API Endpoints

### User Authentication

- **POST /api/users/register**: Register a new user.
- **POST /api/users/login**: Login an existing user and get JWT tokens.
- **GET /api/users/profile**: Get the current user's profile (protected).
- **PUT /api/users/profile**: Update the current user's profile (protected).
- **POST /api/users/logout**: Logout the user.

### Products (Admin Only)

- **POST /api/products**: Create a new product (Admin only).
- **PUT /api/products/:productId**: Update an existing product (Admin only).
- **GET /api/products**: Get a list of all products (with optional filters).
- **GET /api/products/:productId**: Get a product by its ID.
- **DELETE /api/products/:productId**: Delete a product (Admin only).

### Cart

- **GET /api/cart**: Get or create the user's cart (protected).
- **POST /api/cart/add-to-cart**: Add a product to the user's cart (protected).
- **DELETE /api/cart/remove/:productId**: Remove a product from the user's cart (protected).
- **PUT /api/cart/update/:productId**: Update the quantity of a product in the user's cart (protected).
- **GET /api/cart/view-cart**: View the user's cart (protected).
- **DELETE /api/cart/clear-cart**: Clear the user's cart (protected).

### Orders

- **POST /api/orders/create**: Create a new order (protected).
- **GET /api/orders/:id**: Get a specific order by its ID (protected).
- **GET /api/orders**: Get all orders for the user (protected).
- **PUT /api/orders/update-status/:id**: Update the status of an order (Admin only).
- **DELETE /api/orders/delete/:id**: Delete an order (protected).
- **GET /api/orders/status/:id**: Get the status of a specific order (protected).

## Middleware

### Auth Middleware

- **authMiddleware**: Ensures that only authenticated users can access protected routes. It verifies the JWT in the request headers.

### Admin Middleware

- **isAdmin**: Ensures that only admin users can access certain routes like managing products and updating order statuses.

### Error Handling Middleware

- **catchError**: Catches any errors in the request lifecycle and formats them in a consistent manner.

### Rate Limiting Middleware

- **express-rate-limit**: Limits the number of requests a user can make within a given time frame (e.g., 100 requests per 15 minutes).

## Validation

- **User Validation**: Ensures that user data (registration, login, profile update) follows the correct structure.
- **Product Validation**: Validates incoming product data during creation and updates.
- **Cart Validation**: Validates adding, updating, or removing items from the cart.
- **Order Validation**: Validates order creation and order status updates.

