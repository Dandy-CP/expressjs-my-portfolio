import express, { Application } from "express";
import { query } from "express-validator";
import blogValidator from "@/middleware/validator/blog.validator";
import {
  getListBlog,
  getBlogByName,
  createBlog,
  updateBlog,
  deleteBlog,
  incrementViewBlog,
} from "@/controllers/blog.controllers";

const blogRouter = (app: Application) => {
  const router = express.Router();

  app.use("/blog", router);

  router.get("/list", getListBlog);

  router.get(
    "/detail",
    query("title", "Parameter id is required").notEmpty(),
    getBlogByName
  );

  router.post("/create", blogValidator(), createBlog);

  router.put(
    "/incrementViewBlog",
    query("id", "Parameter id is required").notEmpty(),
    query("id", "id must be UUID").isUUID(),
    incrementViewBlog
  );

  router.put(
    "/update",
    query("id", "Parameter id is required").notEmpty(),
    query("id", "id must be UUID").isUUID(),
    blogValidator(),
    updateBlog
  );

  router.delete(
    "/delete",
    query("id", "Parameter id is required").notEmpty(),
    deleteBlog
  );
};

export default blogRouter;
