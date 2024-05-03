import express, { Application } from "express";
import { query } from "express-validator";
import myProjectValidator from "@/middleware/validator/myproject.validator";
import {
  getListProjects,
  createNewProjects,
  updateProjects,
  deleteProjects,
} from "@/controllers/my-projects.controllers";

const myProjectsRouter = (app: Application) => {
  const router = express.Router();

  router.get("/list", getListProjects);
  router.post("/create", myProjectValidator(), createNewProjects);
  router.put(
    "/update",
    query("id", "Parameter id is required").notEmpty(),
    myProjectValidator(),
    updateProjects
  );
  router.delete(
    "/delete",
    query("id", "Parameter id is required").notEmpty(),
    deleteProjects
  );

  app.use("/projects", router);
};

export default myProjectsRouter;
