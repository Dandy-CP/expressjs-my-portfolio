import { check } from "express-validator";

const certificateValidator = () => {
  return [
    check("title", "title is Required").exists().notEmpty(),
    check("title", "title must be string").isString(),

    check("certif_file", "certif_file is Required").custom((value, { req }) => {
      const files = req.files;
      const path = req.path;
      const isFileExist = files?.["certif_file"]?.[0]?.buffer;

      if (path === "/update") {
        return true;
      }

      if (isFileExist) {
        return true;
      } else {
        return false;
      }
    }),
    check("certif_file", "certif_file must be Image Type PDF").custom(
      (value, { req }) => {
        const files = req.files;
        const isPDFType = files?.["certif_file"]?.[0]?.mimetype.includes("pdf");
        const path = req.path;

        if (path === "/update") {
          return true;
        }

        if (isPDFType) {
          return true;
        } else {
          return false;
        }
      }
    ),

    check("thumbnail_file", "thumbnail_file is Required").custom(
      (value, { req }) => {
        const files = req.files;
        const path = req.path;
        const isFileExist = files?.["thumbnail_file"]?.[0]?.buffer;

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
    check("thumbnail_file", "thumbnail_file must be Image Type Image").custom(
      (value, { req }) => {
        const files = req.files;
        const isImageType =
          files?.["thumbnail_file"]?.[0]?.mimetype.includes("image");
        const path = req.path;

        if (path === "/update") {
          return true;
        }

        if (isImageType) {
          return true;
        } else {
          return false;
        }
      }
    ),
  ];
};

export default certificateValidator;
