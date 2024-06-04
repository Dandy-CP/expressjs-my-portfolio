import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redis = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

export default redis;
