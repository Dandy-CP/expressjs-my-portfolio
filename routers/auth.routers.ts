import express, { Application } from "express";
import authGuard from "@/middleware/authGuard";
import authValidator from "@/middleware/validator/auth.validator";
import errorValidationMapper from "@/middleware/errorValidationMapper";
import {
  login,
  register,
  changePassword,
  refreshToken,
  logout,
} from "@/controllers/auth.controllers";

const authRouter = (app: Application) => {
  const router = express.Router();

  router.post("/login", authValidator("login"), errorValidationMapper, login);

  router.post(
    "/signup",
    authValidator("signup"),
    errorValidationMapper,
    register
  );

  router.post(
    "/change-password",
    authGuard,
    authValidator("change-password"),
    errorValidationMapper,
    changePassword
  );

  router.post(
    "/refresh-token",
    authValidator("refresh-token"),
    errorValidationMapper,
    refreshToken
  );

  router.post("/logout", authGuard, logout);

  app.use("/auth", router);
};

export default authRouter;
