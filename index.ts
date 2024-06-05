import express, { Request, Response, Application } from "express";
import connectRedis from "connect-redis";
import session from "express-session";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import dotenv from "dotenv";
import redis from "@/config/redisClient";
import prisma from "@/prisma/prisma";
import validateEnv from "@/utils/validateEnv";
import {
  authRouter,
  twoFARoute,
  myProjectsRouter,
  certificateRoute,
  identityRouter,
  blogRouter,
  commentBlogRouter,
} from "@/routers";

dotenv.config();
validateEnv();
redis.connect();

const app: Application = express();
const PORT = process.env.PORT || 8080;
const Environment = process.env.NODE_ENV;

app.use(
  cors({
    origin: "*",
    methods: "GET,PUT,PATCH,POST,DELETE",
  })
);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    store: new connectRedis({ client: redis }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 240 * 60 * 60 * 1000,
    },
  })
);
app.use((req, res, next) => {
  console.log("\n");
  console.log(`[server]: Request Route ${req.path}`);
  console.log(`[server]: Request Methode: ${req.method}`);
  console.log(`[server]: Time: ${new Date()}`);

  next();
});

app.get("/", async (req: Request, res: Response) => {
  try {
    const checkDatabase = await prisma.$queryRaw`SELECT 1`;
    const statusDatabase = checkDatabase ? "Running" : "Error";
    const statusRedis = redis.isReady;

    res.status(200).json({
      message: "Welcome To My Portfolio Rest API",
      database: statusDatabase,
      redis: statusRedis,
    });
  } catch (error) {
    res.status(500).json({
      message: "Welcome To My Portfolio Rest API",
      database: "Error",
      error: error.message,
    });
  }
});

authRouter(app);
twoFARoute(app);
myProjectsRouter(app);
certificateRoute(app);
identityRouter(app);
blogRouter(app);
commentBlogRouter(app);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: `Route ${req.path} Not Found`,
    status: 404,
  });
});

redis.on("error", (error) => {
  console.error(`[Redis]: Opps Something Wrong ${error.message}`);
});

redis.on("connect", () => {
  console.log("[Redis]: Connected to redis successfully ✅");
});

app
  .listen(PORT, async () => {
    console.info(`[server]: Server started on PORT ${PORT} 🚀`);
    console.info(`[server]: Running on ${Environment} 👨‍💻👩‍💻`);
    console.log("\n");
  })
  .on("error", (error) => {
    console.error(`[server]: Opps Something Wrong ${error.message}`);
  });

module.exports = app;
