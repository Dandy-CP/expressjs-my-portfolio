import { Request, Response } from "express";
import { validationResult } from "express-validator";
import prisma from "@/prisma/prisma";
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
      message: "Success Get List Projects",
    });
  } catch (error) {
    return errorHandler({ error, res });
  }
};

export const createNewProjects = async (req: Request, res: Response) => {
  const bodyValue = req.body as myProjectType;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
    return;
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

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
    return;
  }

  try {
    const idValue = await prisma.my_projects.findUnique({
      where: { id: Number(id) },
    });

    if (!idValue) {
      return errorHandler({
        res,
        customMessage: `project with ID ${id} not found`,
        customStatus: 404,
      });
    }

    await prisma.my_projects
      .update({
        where: {
          id: Number(id),
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

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
    return;
  }

  try {
    const idValue = await prisma.my_projects.findUnique({
      where: { id: Number(id) },
    });

    if (!idValue) {
      return errorHandler({
        res,
        customMessage: `project with ID ${id} not found`,
        customStatus: 404,
      });
    }

    await prisma.my_projects
      .delete({
        where: {
          id: Number(id),
        },
      })
      .then((data) => {
        return successHandler({
          res,
          data,
          message: `Success Delete Project with id ${id}`,
        });
      });
  } catch (error) {
    return errorHandler({ error, res });
  }
};
