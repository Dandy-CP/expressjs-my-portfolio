import express, { Application } from "express";
import { query } from "express-validator";
import authGuard from "@/middleware/authGuard";
import multerHandler from "@/middleware/multer";
import errorValidationMapper from "@/middleware/errorValidationMapper";
import certificateValidator from "@/middleware/validator/certificate.validator";
import {
  getCertificate,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from "@/controllers/certificate.controllers";

const certificateRoute = (app: Application) => {
  const router = express.Router();

  router.get("/list", getCertificate);

  router.post(
    "/create",
    authGuard,
    multerHandler({
      typeUpload: "fields",
      arrayField: [
        { name: "certif_file", maxCount: 1 },
        { name: "thumbnail_file", maxCount: 1 },
      ],
    }),
    certificateValidator(),
    errorValidationMapper,
    createCertificate
  );

  router.put(
    "/update",
    authGuard,
    multerHandler({
      typeUpload: "fields",
      arrayField: [
        { name: "certif_file", maxCount: 1 },
        { name: "thumbnail_file", maxCount: 1 },
      ],
    }),
    query("id", "Parameter id is required").notEmpty(),
    certificateValidator(),
    errorValidationMapper,
    updateCertificate
  );

  router.delete(
    "/delete",
    authGuard,
    query("id", "Parameter id is required").notEmpty(),
    errorValidationMapper,
    deleteCertificate
  );

  app.use("/certificate", router);
};

export default certificateRoute;
