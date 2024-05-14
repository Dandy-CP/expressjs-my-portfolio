import { Request, Response } from "express";
import { validationResult } from "express-validator";
import prisma from "@/prisma/prisma";
import { successHandler, errorHandler } from "@/middleware/responseHandler";
import { blogType } from "@/types/blog.types";

export const getListBlog = async (req: Request, res: Response) => {
  const { page, limit } = req.query;

  try {
    const [data, meta] = await prisma.blog
      .paginate()
      .withPages({ page: Number(page) || 1, limit: Number(limit) || 10 });

    return successHandler({
      res,
      data,
      meta,
      message: "Success Get List Blog",
    });
  } catch (error) {
    return errorHandler({ error, res });
  }
};

export const getBlogByName = async (req: Request, res: Response) => {
  const { title } = req.query;

  try {
    await prisma.blog
      .findFirst({
        where: { title: { endsWith: title as string, mode: "insensitive" } },
      })
      .then((data) => {
        if (!data) {
          return errorHandler({
            res,
            customMessage: `blog with title ${title} not found`,
            customStatus: 404,
          });
        }

        return successHandler({
          res,
          data,
          message: "Success Get Detail Blog",
        });
      });
  } catch (error) {
    return errorHandler({ error, res });
  }
};

export const createBlog = async (req: Request, res: Response) => {
  const bodyValue = req.body as blogType;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  try {
    await prisma.blog
      .create({
        data: bodyValue,
      })
      .then((data) => {
        return successHandler({
          res,
          data,
          message: "Success Create Blog",
        });
      });
  } catch (error) {
    return errorHandler({ error, res });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  const bodyValue = req.body as blogType;
  const { id } = req.query;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  try {
    const idValue = await prisma.blog.findUnique({
      where: { id: id as string },
    });

    if (!idValue) {
      return errorHandler({
        res,
        customMessage: `blog with ID ${id} not found`,
        customStatus: 404,
      });
    }

    await prisma.blog
      .update({ where: { id: id as string }, data: bodyValue })
      .then((data) => {
        return successHandler({
          res,
          data,
          message: `Success Update Blog with ID ${id}`,
        });
      });
  } catch (error) {
    return errorHandler({ error, res });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const idValue = await prisma.blog.findUnique({
      where: { id: id as string },
    });

    if (!idValue) {
      return errorHandler({
        res,
        customMessage: `blog with ID ${id} not found`,
        customStatus: 404,
      });
    }

    await prisma.blog.delete({ where: { id: id as string } }).then((data) => {
      return successHandler({
        res,
        message: `Success Delete Blog with ID ${id}`,
      });
    });
  } catch (error) {
    return errorHandler({ error, res });
  }
};

export const incrementViewBlog = async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    await prisma.blog
      .update({
        where: { id: id as string },
        data: { blogViews: { increment: 1 } },
      })
      .then((data) => {
        return successHandler({
          res,
          data,
          message: `Success Increment View Blog with ID ${id}`,
        });
      });
  } catch (error) {
    return errorHandler({ error, res });
  }
};
