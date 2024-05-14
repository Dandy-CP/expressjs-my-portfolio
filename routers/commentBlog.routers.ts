import express, { Application } from "express";
import { query } from "express-validator";
import {
  getBlogComment,
  createBlogComment,
  deleteCommentBlog,
} from "@/controllers/commentBlog.controllers";
import commentBlogValidator from "@/middleware/validator/commentBlog.validator";

const commentBlogRouter = async (app: Application) => {
  const router = express.Router();

  app.use("/commentBlog", router);

  router.get(
    "/get",
    query("id", "Parameter id is required").notEmpty(),
    query("id", "id must be UUID").isUUID(),
    getBlogComment
  );

  router.post(
    "/create",
    query("id", "Parameter id is required").notEmpty(),
    query("id", "id must be UUID").isUUID(),
    commentBlogValidator(),
    createBlogComment
  );

  router.delete(
    "/delete",
    query("id", "Parameter id is required").notEmpty(),
    query("id", "id must be UUID").isUUID(),
    deleteCommentBlog
  );
};

export default commentBlogRouter;
