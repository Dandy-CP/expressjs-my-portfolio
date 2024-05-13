import { body } from "express-validator";

const blogValidator = () => {
  return [
    body("title", "title is Required").exists().notEmpty(),
    body("title", "title must be string").isString(),

    body("author", "author is Required").exists().notEmpty(),
    body("author", "author must be string").isString(),

    body("content", "content is Required").exists().notEmpty(),
    body("content", "content must be string").isString(),

    body("thumbnail", "thumbnail is Required").exists().notEmpty(),
    body("thumbnail", "thumbnail must be string").isString(),
    body("thumbnail", "thumbnail must be URL string").isURL(),

    body("tag", "tag is Required").exists().notEmpty(),
    body("tag", "tag must be Array String, Min 1").isArray({ min: 1 }),
  ];
};

export default blogValidator;
