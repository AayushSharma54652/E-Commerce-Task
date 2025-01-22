import "reflect-metadata";
import express, { type Express, type Request, type Response } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import http from "http";
import cors from "cors";
import "reflect-metadata";
import { connectDatabase } from ".//app/common/services/database";


const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');


import { initDB } from "./app/common/services/database.service";
import { loadConfig } from "./app/common/helper/config.hepler";
import { type IUser } from "./app/user/user.dto";
import errorHandler from "./app/common/middleware/error-handler.middleware";
import routes from "./app/routes";
import cookieParser from "cookie-parser";
import rateLimiter from "./app/common/middleware/rateLimiter.middleware";

loadConfig();

declare global {
  namespace Express {
    interface User extends Omit<IUser, "password"> { }
    interface Request {
      id: string;
      user?: User;
    }
  }
}

const port = Number(process.env.PORT) ?? 5000;

const app: Express = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser()); // 
app.use(rateLimiter);
app.use(cors())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// const initApp = async (): Promise<void> => {
//   // init mongodb
//   await initDB();

//   // set base path to /api
//   app.use("/api", routes);

//   app.get("/", (req: Request, res: Response) => {
//     res.send({ status: "ok" });
//   });



//   // error handler
//   app.use(errorHandler);
//   http.createServer(app).listen(port, () => {
//     console.log("Server is running on port", port);
//   });
// };

// void initApp();


(async () => {
  try {
    // Connect to the database
    await connectDatabase();

    // Middleware and routes setup
    app.use(express.json());

    app.get("/", (req, res) => {
      res.send("API is running!");
    });

    app.use("/api", routes);

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Application failed to start:", error);
  }
})();