import { decodeTypeJWT } from "@/types/auth";

declare global {
  namespace Express {
    export interface Request {
      user: decodeTypeJWT;
    }
  }
}

declare module "express-session" {
  interface SessionData {
    user: decodeTypeJWT;
  }
}
