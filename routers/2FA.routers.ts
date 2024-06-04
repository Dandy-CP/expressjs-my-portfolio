import express, { Application } from "express";
import authGuard from "@/middleware/authGuard";
import { body } from "express-validator";
import errorValidationMapper from "@/middleware/errorValidationMapper";
import {
  enable2FA,
  verify2FA,
  validate2FA,
  disable2FA,
} from "@/controllers/2FA.controllers";

const twoFARoute = (app: Application) => {
  const router = express.Router();

  router.post("/enable2FA", authGuard, enable2FA);
  router.post(
    "/verify2FA",
    authGuard,
    body("totp_secret", "totp_secret is Required").exists(),
    body("token_pin", "token_pin is Required").exists(),
    errorValidationMapper,
    verify2FA
  );
  router.post(
    "/validate2FA",
    body("id", "id is Required").exists(),
    body("token_pin", "token_pin is Required").exists(),
    errorValidationMapper,
    validate2FA
  );
  router.post(
    "/disable2FA",
    authGuard,
    body("token_pin", "token_pin is Required").exists(),
    errorValidationMapper,
    disable2FA
  );

  app.use("/auth", router);
};

export default twoFARoute;
