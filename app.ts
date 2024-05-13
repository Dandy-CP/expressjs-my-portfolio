import express, { Request, Response, Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import dotenv from "dotenv";
import validateEnv from "@/utils/validateEnv";
import myProjectsRouter from "@/routers/myprojects.routers";
import blogRouter from "./routers/blog.routers";

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

app.get("/", (res: Response) => {
  res.status(200).send({
    statusCode: 200,
    message: "Welcome To My Portfolio Rest API",
  });
});

myProjectsRouter(app);
blogRouter(app);

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
