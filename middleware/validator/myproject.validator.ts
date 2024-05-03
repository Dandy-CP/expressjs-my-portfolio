import { body } from "express-validator";

const myProjectValidator = () => {
  return [
    body("title", "title is Required").exists().notEmpty(),
    body("title", "title must be string").isString(),

    body("description", "description is Required").exists().notEmpty(),
    body("description", "description must be string").isString(),

    body("demo", "demo is Required").exists().notEmpty(),
    body("demo", "demo must be string").isString(),
    body("demo", "demo must be URL").isURL(),

    body("github", "github is Required").exists().notEmpty(),
    body("github", "github must be string").isString(),
    body("github", "github must be URL").isURL(),

    body("thumbnail", "thumbnail is Required").exists().notEmpty(),
    body("thumbnail", "thumbnail must be string").isString(),
    body("thumbnail", "thumbnail must be URL").isURL(),

    body("tech_stack", "tech_stack is Required").exists().notEmpty(),
    body("tech_stack", "tech_stack is Required").isArray({ min: 1 }),
  ];
};

export default myProjectValidator;
