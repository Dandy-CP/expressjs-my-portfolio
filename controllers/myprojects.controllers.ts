import { Request, Response } from "express";
import prisma from "@/prisma/prisma";
import uploadHandler from "@/middleware/uploadHandler";
import deleteFileHandler from "@/middleware/deleteFileHandler";
import { successHandler, errorHandler } from "@/middleware/responseHandler";
import { myProjectType } from "@/types/myprojects.types";

export const getListProjects = async (req: Request, res: Response) => {
  const { page, limit } = req.query;

  try {
    const [data, meta] = await prisma.my_projects
      .paginate()
      .withPages({ page: Number(page) || 1, limit: Number(limit) || 10 });

    return successHandler({
      res,
      data,
      meta,
    });
  } catch (error) {
    return errorHandler({ error, res });
  }
};

export const createNewProjects = async (req: Request, res: Response) => {
  let bodyValue = req.body as myProjectType;
  const file = req.file;

  const { dataPath, errorMsg } = await uploadHandler({
    bucketName: "myprojects",
    bufferFiles: file,
  });

  if (errorMsg) {
    return errorHandler({ res, customMessage: errorMsg, customStatus: 500 });
  } else {
    bodyValue.tech_stack = JSON.parse(bodyValue.tech_stack as any);
    bodyValue.thumbnail = dataPath;
  }

  try {
    await prisma.my_projects
      .create({
        data: bodyValue,
      })
      .then((data) => {
        return successHandler({
          res,
          data,
          message: "Success Create Projects",
        });
      });
  } catch (error) {
    return errorHandler({ error, res });
  }
};

export const updateProjects = async (req: Request, res: Response) => {
  const bodyValue = req.body as myProjectType;
  const { id } = req.query;
  const file = req.file;

  if (file) {
    const { dataPath, errorMsg } = await uploadHandler({
      bucketName: "myprojects",
      bufferFiles: file,
    });

    if (errorMsg) {
      return errorHandler({ res, customMessage: errorMsg, customStatus: 500 });
    } else {
      bodyValue.tech_stack = JSON.parse(bodyValue.tech_stack as any);
      bodyValue.thumbnail = dataPath;
    }
  } else {
    bodyValue.tech_stack = JSON.parse(bodyValue.tech_stack as any);
  }

  try {
    const projectInDB = await prisma.my_projects.findUnique({
      where: { id: id as string },
    });

    if (!projectInDB) {
      return errorHandler({
        res,
        customMessage: `project with ID ${id} not found`,
        customStatus: 404,
      });
    }

    await prisma.my_projects
      .update({
        where: {
          id: id as string,
        },
        data: bodyValue,
      })
      .then((data) => {
        return successHandler({
          res,
          data,
          message: `Success Update Project with ID ${id}`,
        });
      });
  } catch (error) {
    return errorHandler({ error, res });
  }
};

export const deleteProjects = async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const projectInDB = await prisma.my_projects.findUnique({
      where: { id: id as string },
    });

    if (!projectInDB) {
      return errorHandler({
        res,
        customMessage: `project with ID ${id} not found`,
        customStatus: 404,
      });
    }

    const { errorMsg } = await deleteFileHandler({
      bucketName: "myprojects",
      fileName: [projectInDB.thumbnail],
    });

    if (errorMsg) {
      return errorHandler({
        res,
        customMessage: errorMsg,
        customStatus: 500,
      });
    }

    await prisma.my_projects
      .delete({
        where: {
          id: id as string,
        },
      })
      .then((data) => {
        return successHandler({
          res,
          message: `Success Delete Project with id ${id}`,
        });
      });
  } catch (error) {
    return errorHandler({ error, res });
  }
};
