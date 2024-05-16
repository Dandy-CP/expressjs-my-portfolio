import express, { Application } from "express";
import { query } from "express-validator";
import multerHandler from "@/middleware/multer";
import myProjectValidator from "@/middleware/validator/myproject.validator";
import {
  getListProjects,
  createNewProjects,
  updateProjects,
  deleteProjects,
} from "@/controllers/myprojects.controllers";

const myProjectsRouter = (app: Application) => {
  const router = express.Router();

  app.use("/projects", router);

  router.get("/list", getListProjects);

  router.post(
    "/create",
    multerHandler({ typeUpload: "single", fieldName: "projectImage" }),
    myProjectValidator(),
    createNewProjects
  );

  router.put(
    "/update",
    multerHandler({ typeUpload: "single", fieldName: "projectImage" }),
    myProjectValidator(),
    updateProjects
  );

  router.delete(
    "/delete",
    query("id", "Parameter id is required").notEmpty(),
    deleteProjects
  );
};

export default myProjectsRouter;
