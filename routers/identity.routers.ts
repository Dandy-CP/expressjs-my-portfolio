import express, { Application } from "express";
import { query } from "express-validator";
import authGuard from "@/middleware/authGuard";
import errorValidationMapper from "@/middleware/errorValidationMapper";
import identityValidator from "@/middleware/validator/identity.validator";
import multerHandler from "@/middleware/multer";
import {
  getIdentity,
  createIdentity,
  updateIdentity,
  deleteIdentity,
  createTechStack,
  updateTechStack,
  deleteTechStack,
} from "@/controllers/identity.controllers";

const identityRouter = (app: Application) => {
  const router = express.Router();

  router.get("/detail", getIdentity);

  router.post(
    "/create",
    authGuard,
    multerHandler({
      typeUpload: "fields",
      arrayField: [
        { name: "cv_file", maxCount: 1 },
        { name: "photo_file", maxCount: 1 },
      ],
    }),
    identityValidator("create/update"),
    errorValidationMapper,
    createIdentity
  );

  router.put(
    "/update",
    authGuard,
    multerHandler({
      typeUpload: "fields",
      arrayField: [
        { name: "cv_file", maxCount: 1 },
        { name: "photo_file", maxCount: 1 },
      ],
    }),
    query("id", "Parameter id is required").notEmpty(),
    identityValidator("create/update"),
    errorValidationMapper,
    updateIdentity
  );

  router.delete(
    "/delete",
    authGuard,
    query("id", "Parameter id is required").notEmpty(),
    errorValidationMapper,
    deleteIdentity
  );

  router.post(
    "/create-tech-stack",
    authGuard,
    multerHandler({ typeUpload: "single", fieldName: "tech_image" }),
    identityValidator("tech-stack"),
    errorValidationMapper,
    createTechStack
  );

  router.put(
    "/update-tech-stack",
    authGuard,
    multerHandler({ typeUpload: "single", fieldName: "tech_image" }),
    query("id", "Parameter id is required").notEmpty(),
    identityValidator("tech-stack"),
    errorValidationMapper,
    updateTechStack
  );

  router.delete(
    "/delete-tech-stack",
    authGuard,
    query("id", "Parameter id is required").notEmpty(),
    errorValidationMapper,
    deleteTechStack
  );

  app.use("/identity", router);
};

export default identityRouter;
