import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import redis from "@/config/redisClient";
import prisma from "@/prisma/prisma";
import setSession from "@/middleware/setSession";
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
  let session = req.session;

  const sessionValue = await redis.get(`sess:${session.id}`);

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

    if (sessionValue) {
      return res.status(401).json({
        message: "User Has Been Authenticated",
      });
    }

    if (!userInDB.is_2fa) {
      const checkPassword = await bcrypt.compare(
        bodyValue.password,
        userInDB.password
      );

      if (checkPassword) {
        const { accessToken, refreshToken } = generateToken(userInDB);

        setSession({
          methode: "Set",
          session,
          valueSession: {
            id: userInDB.id,
            name: userInDB.name,
            accessToken: accessToken,
            refreshToken: refreshToken,
          },
        });

        return successHandler({
          res,
          data: {
            accessToken: accessToken,
            refreshToken: refreshToken,
          },
        });
      }
    }

    if (userInDB.is_2fa) {
      const checkPassword = await bcrypt.compare(
        bodyValue.password,
        userInDB.password
      );

      if (checkPassword) {
        return successHandler({
          res,
          message: "2FA is enabled please validate",
          data: {
            id: userInDB.id,
          },
        });
      }
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
  let session = req.session.user;
  const hashPassword = bcrypt.hashSync(bodyValue.password, 10);

  bodyValue.password = hashPassword;

  try {
    if (session) {
      return res.status(401).json({
        message: "Cannot Register When User Authenticated",
      });
    }

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
  const userID = req.session.user.id;

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
  const session = req.session;
  const sessionValue = await redis.get(`sess:${session.id}`);

  const isSessionExpired = (sessionValue: string) => {
    const valueJSON = JSON.parse(sessionValue);

    return (
      new Date().getTime() >= new Date(valueJSON?.cookie?.expires).getTime()
    );
  };

  try {
    if (!sessionValue) {
      return res.status(403).json({
        message: "Your not authenticated, please Login",
      });
    }

    if (isSessionExpired(sessionValue)) {
      return res.status(403).json({
        message: "Session Is Expired",
      });
    }

    jwt.verify(
      bodyValue.refreshToken,
      process.env.JWT_REFRESH_SECRET,
      { algorithms: ["HS256"] },
      (error, decode: decodeTypeJWT) => {
        if (error) {
          return errorHandler({ error, res });
        }

        const { accessToken, refreshToken } = generateToken({
          id: decode.id,
          name: decode.name,
        });

        const { error: errorSession } = setSession({
          methode: "Reload",
          session,
        });

        if (errorSession) {
          return errorHandler({ error: errorSession, res });
        }

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

export const logout = async (req: Request, res: Response) => {
  let session = req.session;

  try {
    const { error } = setSession({
      methode: "Destroy",
      session,
    });

    if (error) {
      return errorHandler({ error, res });
    }

    return successHandler({
      res,
      message: "Success Log Out",
    });
  } catch (error) {
    return errorHandler({ error, res });
  }
};
