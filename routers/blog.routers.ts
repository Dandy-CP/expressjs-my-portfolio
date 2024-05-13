import express, { Application } from "express";
import { query } from "express-validator";
import blogValidator from "@/middleware/validator/blog.validator";
import {
  getListBlog,
  getBlogByName,
  createBlog,
  updateBlog,
  deleteBlog,
} from "@/controllers/blog.controllers";

const blogRouter = (app: Application) => {
  const router = express.Router();

  router.get("/list", getListBlog);
  router.get(
    "/detail",
    query("title", "Parameter id is required").notEmpty(),
    getBlogByName
  );
  router.post("/create", blogValidator(), createBlog);
  router.put(
    "/update",
    query("id", "Parameter id is required").notEmpty(),
    blogValidator(),
    updateBlog
  );
  router.delete(
    "/delete",
    query("id", "Parameter id is required").notEmpty(),
    deleteBlog
  );

  app.use("/blog", router);
};

export default blogRouter;
