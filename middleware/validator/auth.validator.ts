import { body } from "express-validator";

const authValidator = (route: string) => {
  switch (route) {
    case "login":
      return [
        body("email", "email is Required").exists().notEmpty(),
        body("email", "email must be string").isString(),

        body("password", "password is Required").exists().notEmpty(),
        body("password", "password must be string").isString(),
      ];
    case "signup":
      return [
        body("name", "name is Required").exists().notEmpty(),
        body("name", "name must be string").isString(),

        body("email", "email is Required").exists().notEmpty(),
        body("email", "email must be string").isString(),

        body("password", "password is Required").exists().notEmpty(),
        body("password", "password must be string").isString(),
      ];
    case "change-password":
      return [
        body("oldPassword", "oldPassword is Required").exists().notEmpty(),
        body("oldPassword", "oldPassword must be string").isString(),

        body("newPassword", "oldPassword is Required").exists().notEmpty(),
        body("newPassword", "oldPassword must be string").isString(),
      ];
    case "refresh-token":
      return [
        body("refreshToken", "refreshToken is Required").exists().notEmpty(),
        body("refreshToken", "refreshToken must be string").isString(),
      ];
  }
};

export default authValidator;
