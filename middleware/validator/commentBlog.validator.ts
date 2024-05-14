import { body } from "express-validator";

const commentBlogValidator = () => {
  return [
    body("name", "name is Required").exists().notEmpty(),
    body("name", "name must be string").isString(),

    body("comment", "comment is Required").exists().notEmpty(),
    body("comment", "comment must be string").isString(),
  ];
};

export default commentBlogValidator;
