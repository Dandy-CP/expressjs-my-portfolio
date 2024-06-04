import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import redis from "@/config/redisClient";
import { errorHandler } from "@/middleware/responseHandler";

const authGuard = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const session = req.session;

  const token = authHeader?.split(" ")[1];
  const sessionValue = await redis.get(`sess:${session.id}`);

  const isTokenExpired = (token: string) => {
    const arrayToken = token.split(".");
    const tokenPayload = JSON.parse(atob(arrayToken[1]));

    return Math.floor(new Date().getTime() / 1000) >= tokenPayload?.exp;
  };

  const isSessionExpired = (sessionValue: string) => {
    const valueJSON = JSON.parse(sessionValue);

    return (
      new Date().getTime() >= new Date(valueJSON?.cookie?.expires).getTime()
    );
  };

  if (!authHeader) {
    return res.status(403).json({
      message: "A token is required for authentication",
    });
  }

  if (!sessionValue) {
    return res.status(403).json({
      message: "Your not authenticated, please Login",
    });
  }

  if (isTokenExpired(token)) {
    return res.status(403).json({
      message: "Token Is Expired",
    });
  }

  if (isSessionExpired(sessionValue)) {
    return res.status(403).json({
      message: "Session Is Expired",
    });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    { algorithms: ["HS256"] },
    (error, decode) => {
      if (error) {
        return errorHandler({ res, error });
      }

      return next();
    }
  );
};

export default authGuard;
