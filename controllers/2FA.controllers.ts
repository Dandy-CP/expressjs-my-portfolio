import { Request, Response } from "express";
import prisma from "@/prisma/prisma";
import generateToken from "@/middleware/generateToken";
import handler2FA from "@/middleware/2FAHandler";
import setSession from "@/middleware/setSession";
import { successHandler, errorHandler } from "@/middleware/responseHandler";
import { I2FABody } from "@/types/2FA.types";

export const enable2FA = async (req: Request, res: Response) => {
  const { id } = req.session.user;

  try {
    const userInDB = await prisma.admin_user.findUnique({
      where: {
        id: id,
      },
    });

    if (!userInDB) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    if (userInDB.is_2fa) {
      return res.status(500).json({
        message: "User Has Been Enabled 2FA",
      });
    }

    const { qrCode, secret } = await handler2FA({
      methode: "enable",
      label: userInDB.name,
    });

    return successHandler({
      res,
      data: {
        qrCode: qrCode,
        secret: secret,
      },
    });
  } catch (error) {
    return errorHandler({ error, res });
  }
};

export const verify2FA = async (req: Request, res: Response) => {
  const { token_pin, totp_secret } = req.body as I2FABody;
  const { id } = req.session.user;

  try {
    const userInDB = await prisma.admin_user.findUnique({
      where: {
        id: id,
      },
    });

    if (!userInDB) {
      return res.status(401).json({
        message: "User Not Found",
      });
    }

    if (userInDB.is_2fa) {
      return res.status(500).json({
        message: "User Has Been Enabled 2FA",
      });
    }

    const { token } = await handler2FA({
      methode: "verify",
      label: userInDB.name,
      secret_totp: totp_secret,
    });

    if (token === token_pin) {
      await prisma.admin_user
        .update({
          where: { id: id },
          data: {
            totp_secret: totp_secret,
            is_2fa: true,
          },
        })
        .then((data) => {
          return successHandler({
            res,
            message: "2FA is success Enabled",
          });
        });
    } else {
      return successHandler({
        res,
        message: "Token Pin Is Invalid",
      });
    }
  } catch (error) {
    return errorHandler({ error, res });
  }
};

export const validate2FA = async (req: Request, res: Response) => {
  const { id, token_pin } = req.body as I2FABody;
  let session = req.session;

  try {
    const userInDB = await prisma.admin_user.findUnique({
      where: {
        id: id,
      },
    });

    if (!userInDB) {
      return res.status(401).json({
        message: "User Not Found",
      });
    }

    if (!userInDB.is_2fa) {
      return res.status(500).json({
        message: "User Has Not Enabled 2FA",
      });
    }

    const { token } = await handler2FA({
      methode: "verify",
      label: userInDB.name,
      secret_totp: userInDB.totp_secret,
    });

    if (token === token_pin) {
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
    } else {
      return successHandler({
        res,
        message: "Token Pin Is Invalid",
      });
    }
  } catch (error) {
    return errorHandler({ error, res });
  }
};

export const disable2FA = async (req: Request, res: Response) => {
  const { token_pin } = req.body as I2FABody;
  const { id } = req.session.user;

  try {
    const userInDB = await prisma.admin_user.findUnique({
      where: {
        id: id,
      },
    });

    if (!userInDB) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    if (!userInDB.is_2fa) {
      return res.status(500).json({
        message: "User Has Not Enabled 2FA",
      });
    }

    const { token } = await handler2FA({
      methode: "verify",
      label: userInDB.name,
      secret_totp: userInDB.totp_secret,
    });

    if (token === token_pin) {
      await prisma.admin_user
        .update({
          where: { id: id },
          data: { totp_secret: null, is_2fa: false },
        })
        .then((data) => {
          return successHandler({
            res,
            message: "2FA success disabled",
          });
        });
    } else {
      return successHandler({
        res,
        message: "Token Pin Is Invalid",
      });
    }
  } catch (error) {
    return errorHandler({ error, res });
  }
};
