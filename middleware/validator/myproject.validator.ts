import { check, query } from "express-validator";

const myProjectValidator = () => {
  return [
    query("id", "Parameter id is required").custom((value, { req }) => {
      const path = req.path;

      if (path === "/create" || path === "/delete") {
        return true;
      } else {
        return false;
      }
    }),

    check("title", "title is Required").exists().notEmpty(),
    check("title", "title must be string").isString(),

    check("description", "description is Required").exists().notEmpty(),
    check("description", "description must be string").isString(),

    check("demo", "demo is Required").exists().notEmpty(),
    check("demo", "demo must be string").isString(),
    check("demo", "demo must be URL").isURL(),

    check("github", "github is Required").exists().notEmpty(),
    check("github", "github must be string").isString(),
    check("github", "github must be URL").isURL(),

    check("tech_stack", "tech_stack is Required").exists(),
    check("tech_stack", "tech_stack must be Array of string").custom(
      (value, { req }) => {
        const isArray = Array.isArray(JSON.parse(req.body.tech_stack));

        if (isArray) {
          return true;
        } else {
          return false;
        }
      }
    ),

    check("projectImage", "projectImage is Required").custom(
      (value, { req }) => {
        const isFileExist = req.file?.buffer;
        const path = req.path;

        if (path === "/update") {
          return true;
        }

        if (isFileExist) {
          return true;
        } else {
          return false;
        }
      }
    ),
    check(
      "projectImage",
      "projectImage must be Image Type PNG/JPG/JPEG"
    ).custom((value, { req }) => {
      const isImageType = req.file?.mimetype.includes("image");
      const path = req.path;

      if (path === "/update") {
        return true;
      }

      if (isImageType) {
        return true;
      } else {
        return false;
      }
    }),
  ];
};

export default myProjectValidator;
