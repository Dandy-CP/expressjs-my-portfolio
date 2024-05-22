import { check } from "express-validator";

const identityValidator = (path: string) => {
  switch (path) {
    case "create/update":
      return [
        check("summary", "summary is Required").exists().notEmpty(),
        check("summary", "summary must be string").isString(),

        check("cv_file", "cv_file is Required").custom((value, { req }) => {
          const files = req.files;
          const path = req.path;
          const isFileExist = files?.["cv_file"]?.[0]?.buffer;
          console.log(files);

          if (path === "/update") {
            return true;
          }

          if (isFileExist) {
            return true;
          } else {
            return false;
          }
        }),
        check("cv_file", "cv_file must be Type PDF").custom(
          (value, { req }) => {
            const files = req.files;
            const isPDFType = files?.["cv_file"]?.[0]?.mimetype.includes("pdf");
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

        check("photo_file", "photo_file is Required").custom(
          (value, { req }) => {
            const files = req.files;
            const path = req.path;
            const isFileExist = files?.["photo_file"]?.[0]?.buffer;

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
        check("photo_file", "photo_file must be Image Type Image").custom(
          (value, { req }) => {
            const files = req.files;
            const isImageType =
              files?.["photo_file"]?.[0]?.mimetype.includes("image");
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
    case "tech-stack":
      return [
        check("nameTech", "nameTech is Required").exists().notEmpty(),
        check("nameTech", "nameTech must be string").isString(),

        check("tech_image", "tech_image is Required").custom(
          (value, { req }) => {
            const path = req.path;
            const isFileExist = req.file?.buffer;

            if (path === "/update-tech-stack") {
              return true;
            }

            if (isFileExist) {
              return true;
            } else {
              return false;
            }
          }
        ),
        check("tech_image", "tech_image must be Image Type Image").custom(
          (value, { req }) => {
            const isImageType = req.file?.mimetype.includes("image");
            const path = req.path;

            if (path === "/update-tech-stack") {
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
  }
};

export default identityValidator;
