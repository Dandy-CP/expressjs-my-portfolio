import { decodeTypeJWT } from "@/types/auth";

declare global {
  namespace Express {
    export interface Request {
      user: decodeTypeJWT;
    }
  }
}
