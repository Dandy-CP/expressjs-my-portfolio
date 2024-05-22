import { Request, Response } from "express";
import prisma from "@/prisma/prisma";
import uploadHandler from "@/middleware/uploadHandler";
import deleteFileHandler from "@/middleware/deleteFileHandler";
import { successHandler, errorHandler } from "@/middleware/responseHandler";
import { bodyIdentityTypes, bodyTechStackTypes } from "@/types/identity.types";

export const getIdentity = async (req: Request, res: Response) => {
  try {
    await prisma.identity
      .findFirst({ include: { tech_stack: true } })
      .then((data) => {
        return successHandler({
          res,
          data,
        });
      });
  } catch (error) {
    return errorHandler({ error, res });
  }
};

export const createIdentity = async (req: Request, res: Response) => {
  let bodyValue = req.body as bodyIdentityTypes;
  const files = req.files;

  const cvFile = files["cv_file"][0];
  const photoFile = files["photo_file"][0];

  const { dataPath: cvPath, errorMsg: cvError } = await uploadHandler({
    bucketName: "identity",
    bufferFiles: cvFile,
  });

  if (cvError) {
    return errorHandler({ res, customMessage: cvError, customStatus: 500 });
  } else {
    bodyValue.cv_file = cvPath;
  }

  const { dataPath: photoPath, errorMsg: photoError } = await uploadHandler({
    bucketName: "identity",
    bufferFiles: photoFile,
  });

  if (photoError) {
    return errorHandler({
      res,
      customMessage: photoError,
      customStatus: 500,
    });
  } else {
    bodyValue.image_profile = photoPath;
  }

  try {
    await prisma.identity.create({ data: bodyValue }).then((data) => {
      return successHandler({
        res,
        data,
        message: "Success Create Identity",
      });
    });
  } catch (error) {
    return errorHandler({ error, res });
  }
};

export const updateIdentity = async (req: Request, res: Response) => {
  let bodyValue = req.body as bodyIdentityTypes;
  const { id } = req.query;
  const files = req.files;

  const cvFile = files?.["cv_file"]?.[0];
  const photoFile = files?.["photo_file"]?.[0];

  const dataInDB = await prisma.identity.findUnique({
    where: { id: id as string },
  });

  if (!dataInDB) {
    return errorHandler({
      res,
      customMessage: `Identity with ID ${id} not found`,
      customStatus: 404,
    });
  }

  if (cvFile) {
    const { errorMsg: errorOnDelete } = await deleteFileHandler({
      bucketName: "identity",
      fileName: [dataInDB.cv_file],
    });

    if (errorOnDelete) {
      return errorHandler({
        res,
        customMessage: errorOnDelete,
        customStatus: 500,
      });
    }

    const { dataPath: cvPath, errorMsg: cvError } = await uploadHandler({
      bucketName: "identity",
      bufferFiles: cvFile,
    });

    if (cvError) {
      return errorHandler({
        res,
        customMessage: cvError,
        customStatus: 500,
      });
    } else {
      bodyValue.cv_file = cvPath;
    }
  }

  if (photoFile) {
    const { errorMsg: errorOnDelete } = await deleteFileHandler({
      bucketName: "identity",
      fileName: [dataInDB.image_profile],
    });

    if (errorOnDelete) {
      return errorHandler({
        res,
        customMessage: errorOnDelete,
        customStatus: 500,
      });
    }

    const { dataPath: photoPath, errorMsg: photoError } = await uploadHandler({
      bucketName: "identity",
      bufferFiles: photoFile,
    });

    if (photoError) {
      return errorHandler({
        res,
        customMessage: photoError,
        customStatus: 500,
      });
    } else {
      bodyValue.image_profile = photoPath;
    }
  }

  try {
    await prisma.identity
      .update({ where: { id: id as string }, data: bodyValue })
      .then((data) => {
        return successHandler({
          res,
          data,
          message: "Success Update Identity",
        });
      });
  } catch (error) {
    return errorHandler({ error, res });
  }
};

export const deleteIdentity = async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const dataInDB = await prisma.identity.findUnique({
      where: { id: id as string },
    });

    if (!dataInDB) {
      return errorHandler({
        res,
        customMessage: `identity with ID ${id} not found`,
        customStatus: 404,
      });
    }

    const { errorMsg } = await deleteFileHandler({
      bucketName: "identity",
      fileName: [dataInDB.cv_file, dataInDB.image_profile],
    });

    if (errorMsg) {
      return errorHandler({
        res,
        customMessage: errorMsg,
        customStatus: 500,
      });
    }

    await prisma.tech_stack
      .deleteMany({ where: { identityID: id as string } })
      .then(async (data) => {
        await prisma.identity
          .delete({ where: { id: id as string } })
          .then((data) => {
            return successHandler({
              res,
              message: "Success Delete Identity",
            });
          });
      });
  } catch (error) {
    return errorHandler({ error, res });
  }
};

export const createTechStack = async (req: Request, res: Response) => {
  let bodyValue = req.body as bodyTechStackTypes;
  const { id } = req.query;
  const file = req.file;

  const { dataPath, errorMsg } = await uploadHandler({
    bucketName: "identity",
    bufferFiles: file,
  });

  if (errorMsg) {
    return errorHandler({ res, customMessage: errorMsg, customStatus: 500 });
  } else {
    bodyValue.imageTech = dataPath;
  }

  try {
    await prisma.tech_stack
      .create({
        data: {
          ...bodyValue,
          identity: {
            connect: {
              id: id as string,
            },
          },
        },
      })
      .then((data) => {
        return successHandler({
          res,
          data,
          message: "Success Create tech stack",
        });
      });
  } catch (error) {
    return errorHandler({ error, res });
  }
};

export const updateTechStack = async (req: Request, res: Response) => {
  let bodyValue = req.body as bodyTechStackTypes;
  const { id } = req.query;
  const file = req.file;

  const dataInDB = await prisma.tech_stack.findUnique({
    where: { id: id as string },
  });

  if (!dataInDB) {
    return errorHandler({
      res,
      customMessage: `Tech Stack with ID ${id} not found`,
      customStatus: 404,
    });
  }

  if (file) {
    const { errorMsg: errorOnDelete } = await deleteFileHandler({
      bucketName: "identity",
      fileName: [dataInDB.imageTech],
    });

    if (errorOnDelete) {
      return errorHandler({
        res,
        customMessage: errorOnDelete,
        customStatus: 500,
      });
    }

    const { dataPath, errorMsg } = await uploadHandler({
      bucketName: "identity",
      bufferFiles: file,
    });

    if (errorMsg) {
      return errorHandler({ res, customMessage: errorMsg, customStatus: 500 });
    } else {
      bodyValue.imageTech = dataPath;
    }
  }

  try {
    await prisma.tech_stack
      .update({
        where: { id: id as string },
        data: {
          ...bodyValue,
          identity: {
            connect: {
              id: dataInDB.identityID,
            },
          },
        },
      })
      .then((data) => {
        return successHandler({
          res,
          data,
          message: "Success Update Tech Stack",
        });
      });
  } catch (error) {
    return errorHandler({ error, res });
  }
};

export const deleteTechStack = async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const dataInDB = await prisma.tech_stack.findUnique({
      where: { id: id as string },
    });

    if (!dataInDB) {
      return errorHandler({
        res,
        customMessage: `Tech Stack with ID ${id} not found`,
        customStatus: 404,
      });
    }

    const { errorMsg: errorOnDelete } = await deleteFileHandler({
      bucketName: "identity",
      fileName: [dataInDB.imageTech],
    });

    if (errorOnDelete) {
      return errorHandler({
        res,
        customMessage: errorOnDelete,
        customStatus: 500,
      });
    }

    await prisma.tech_stack
      .delete({ where: { id: id as string } })
      .then((data) => {
        return successHandler({
          res,
          message: `Success Delete Tech Stack with id ${id}`,
        });
      });
  } catch (error) {
    return errorHandler({ error, res });
  }
};
