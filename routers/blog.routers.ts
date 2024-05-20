import express, { Application } from "express";
import { query } from "express-validator";
import multerHandler from "@/middleware/multer";
import authGuard from "@/middleware/authGuard";
import errorValidationMapper from "@/middleware/errorValidationMapper";
import blogValidator from "@/middleware/validator/blog.validator";
import {
  getListBlog,
  getBlogByName,
  getBlogByID,
  createBlog,
  updateBlog,
  deleteBlog,
  incrementViewBlog,
  likeBlog,
  dislikeBlog,
} from "@/controllers/blog.controllers";

const blogRouter = (app: Application) => {
  const router = express.Router();

  router.get("/list", getListBlog);

  router.get(
    "/detail",
    query("title", "Parameter title is required").notEmpty(),
    errorValidationMapper,
    getBlogByName
  );

  router.get(
    "/content",
    query("id", "Parameter id is required").notEmpty(),
    errorValidationMapper,
    getBlogByID
  );

  router.post(
    "/create",
    authGuard,
    multerHandler({ typeUpload: "single", fieldName: "blogThumbnail" }),
    blogValidator(),
    errorValidationMapper,
    createBlog
  );

  router.put(
    "/update",
    authGuard,
    multerHandler({ typeUpload: "single", fieldName: "blogThumbnail" }),
    query("id", "Parameter id is required").notEmpty(),
    blogValidator(),
    errorValidationMapper,
    updateBlog
  );

  router.delete(
    "/delete",
    authGuard,
    query("id", "Parameter id is required").notEmpty(),
    errorValidationMapper,
    deleteBlog
  );

  router.put(
    "/incrementViewBlog",
    query("id", "Parameter id is required").notEmpty(),
    errorValidationMapper,
    incrementViewBlog
  );

  router.put(
    "/like",
    query("id", "Parameter id is required").notEmpty(),
    errorValidationMapper,
    likeBlog
  );

  router.put(
    "/dislike",
    query("id", "Parameter id is required").notEmpty(),
    errorValidationMapper,
    dislikeBlog
  );

  app.use("/blog", router);
};

export default blogRouter;
