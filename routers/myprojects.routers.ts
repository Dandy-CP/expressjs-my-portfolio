import express, { Application } from "express";
import { query } from "express-validator";
import multerHandler from "@/middleware/multer";
import errorValidationMapper from "@/middleware/errorValidationMapper";
import myProjectValidator from "@/middleware/validator/myproject.validator";
import authGuard from "@/middleware/authGuard";
import {
  getListProjects,
  createNewProjects,
  updateProjects,
  deleteProjects,
} from "@/controllers/myprojects.controllers";

const myProjectsRouter = (app: Application) => {
  const router = express.Router();

  router.get("/list", getListProjects);

  router.post(
    "/create",
    authGuard,
    multerHandler({ typeUpload: "single", fieldName: "projectImage" }),
    myProjectValidator(),
    errorValidationMapper,
    createNewProjects
  );

  router.put(
    "/update",
    authGuard,
    multerHandler({ typeUpload: "single", fieldName: "projectImage" }),
    myProjectValidator(),
    errorValidationMapper,
    updateProjects
  );

  router.delete(
    "/delete",
    authGuard,
    query("id", "Parameter id is required").notEmpty(),
    errorValidationMapper,
    deleteProjects
  );

  app.use("/projects", router);
};

export default myProjectsRouter;
