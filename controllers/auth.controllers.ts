import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "@/prisma/prisma";
import { successHandler, errorHandler } from "@/middleware/responseHandler";
import generateToken from "@/middleware/generateToken";
import {
  authLoginBodyType,
  authRegisterBodyType,
  changePasswordBodyType,
  refreshTokenBodyType,
  decodeTypeJWT,
} from "@/types/auth";

export const login = async (req: Request, res: Response) => {
  const bodyValue = req.body as authLoginBodyType;

  try {
    const userInDB = await prisma.admin_user.findUnique({
      where: {
        email: bodyValue.email,
      },
    });

    if (!userInDB) {
      return res.status(401).json({
        message: "Wrong Email Or Password",
      });
    }

    const checkPassword = await bcrypt.compare(
      bodyValue.password,
      userInDB.password
    );

    if (checkPassword) {
      const { accessToken, refreshToken } = generateToken(userInDB);

      return successHandler({
        res,
        data: {
          name: userInDB.name,
          email: userInDB.email,
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      });
    }

    return res.status(401).json({
      message: "Wrong Email Or Password",
    });
  } catch (error) {
    return errorHandler({ error, res });
  }
};

export const register = async (req: Request, res: Response) => {
  let bodyValue = req.body as authRegisterBodyType;
  const hashPassword = bcrypt.hashSync(bodyValue.password, 10);

  bodyValue.password = hashPassword;

  try {
    const userInDB = await prisma.admin_user.findUnique({
      where: {
        email: bodyValue.email,
      },
    });

    if (userInDB) {
      return res.status(422).json({
        message: "User has been registered",
      });
    }

    await prisma.admin_user.create({ data: bodyValue }).then((data) => {
      return successHandler({
        res,
        message: "Success Register",
      });
    });
  } catch (error) {
    return errorHandler({ error, res });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const bodyValue = req.body as changePasswordBodyType;
  const userID = req.user.id;

  try {
    const userInDB = await prisma.admin_user.findUnique({
      where: {
        id: userID,
      },
    });

    const checkOldPassword = await bcrypt.compare(
      bodyValue.oldPassword,
      userInDB.password
    );

    if (!checkOldPassword) {
      return res.status(422).json({
        message: "Wrong Old Password",
      });
    }

    const hashNewPassword = bcrypt.hashSync(bodyValue.newPassword, 10);

    await prisma.admin_user
      .update({
        where: {
          id: userID,
        },
        data: {
          password: hashNewPassword,
        },
      })
      .then((data) => {
        return successHandler({
          res,
          message: "Success Change Password",
        });
      });
  } catch (error) {
    return errorHandler({ error, res });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const bodyValue = req.body as refreshTokenBodyType;

  try {
    jwt.verify(
      bodyValue.refreshToken,
      process.env.JWT_REFRESH_SECRET,
      { algorithms: ["HS256"] },
      (error, decode: decodeTypeJWT) => {
        if (error) {
          return res.status(422).json({
            message: error.message,
          });
        }

        const { accessToken, refreshToken } = generateToken({
          id: decode.id,
          name: decode.name,
        });

        return successHandler({
          res,
          data: {
            accessToken: accessToken,
            refreshToken: refreshToken,
          },
        });
      }
    );
  } catch (error) {
    return errorHandler({ error, res });
  }
};
