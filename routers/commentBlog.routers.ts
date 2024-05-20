import express, { Application } from "express";
import { query } from "express-validator";
import authGuard from "@/middleware/authGuard";
import commentBlogValidator from "@/middleware/validator/commentBlog.validator";
import errorValidationMapper from "@/middleware/errorValidationMapper";
import {
  getBlogComment,
  createBlogComment,
  deleteCommentBlog,
  likeBlogComment,
  dislikeBlogComment,
} from "@/controllers/commentBlog.controllers";

const commentBlogRouter = async (app: Application) => {
  const router = express.Router();

  router.get(
    "/get",
    query("id", "Parameter id is required").notEmpty(),
    errorValidationMapper,
    getBlogComment
  );

  router.post(
    "/create",
    query("id", "Parameter id is required").notEmpty(),
    commentBlogValidator(),
    errorValidationMapper,
    createBlogComment
  );

  router.delete(
    "/delete",
    authGuard,
    query("id", "Parameter id is required").notEmpty(),
    errorValidationMapper,
    deleteCommentBlog
  );

  router.put(
    "/like",
    query("id", "Parameter id is required").notEmpty(),
    errorValidationMapper,
    likeBlogComment
  );

  router.put(
    "/dislike",
    query("id", "Parameter id is required").notEmpty(),
    errorValidationMapper,
    dislikeBlogComment
  );

  app.use("/comment-Blog", router);
};

export default commentBlogRouter;
