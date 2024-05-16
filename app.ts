import express, { Request, Response, Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import dotenv from "dotenv";
import prisma from "@/prisma/prisma";
import validateEnv from "@/utils/validateEnv";
import { myProjectsRouter, blogRouter, commentBlogRouter } from "@/routers";

dotenv.config();
validateEnv();

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

app.get("/", async (req: Request, res: Response) => {
  try {
    const checkDatabase = await prisma.$queryRaw`SELECT 1`;
    const statusDatabase = checkDatabase ? "Running" : "Error";

    res.status(200).json({
      message: "Welcome To My Portfolio Rest API",
      database: statusDatabase,
    });
  } catch (error) {
    res.status(200).json({
      message: "Welcome To My Portfolio Rest API",
      database: "Error",
      error: error.message,
    });
  }
});

myProjectsRouter(app);
blogRouter(app);
commentBlogRouter(app);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: `Route ${req.path} Not Found`,
    status: 404,
  });
});

app
  .listen(PORT, async () => {
    console.info(`[server]: Server started on PORT ${PORT} 🚀`);
    console.info(`[server]: Running on ${Environment} 👨‍💻👩‍💻`);
  })
  .on("error", (error) => {
    console.error(`[server]: Opps Something Wrong ${error.message}`);
  });
