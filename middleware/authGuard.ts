import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { errorHandler } from "@/middleware/responseHandler";
import { decodeTypeJWT } from "@/types/auth";

const authGuard = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({
      message: "A token is required for authentication",
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    { algorithms: ["HS256"] },
    (error, decode) => {
      if (error) {
        return errorHandler({ res, error });
      }

      req.user = decode as decodeTypeJWT;
      return next();
    }
  );
};

export default authGuard;
