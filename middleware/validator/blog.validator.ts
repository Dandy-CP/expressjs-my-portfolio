import { check } from "express-validator";

const blogValidator = () => {
  return [
    check("title", "title is Required").exists().notEmpty(),
    check("title", "title must be string").isString(),

    check("content", "content is Required").exists().notEmpty(),
    check("content", "content must be string").isString(),

    check("category", "category is Required").exists().notEmpty(),
    check("category", "category must be string").isString(),

    check("tag", "tag must be Array of string").custom((value, { req }) => {
      const isArray = Array.isArray(JSON.parse(req.body.tag));

      if (isArray) {
        return true;
      } else {
        return false;
      }
    }),

    check("tag", "tag Array cannot be empty").custom((value, { req }) => {
      const isArrayEmpty = JSON.parse(req.body.tag).length;

      if (isArrayEmpty === 1) {
        return true;
      } else {
        return false;
      }
    }),

    check("blogThumbnail", "blogThumbnail is Required").custom(
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
      "blogThumbnail",
      "blogThumbnail must be Image Type PNG/JPG/JPEG"
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

export default blogValidator;
