import { Request, Response } from "express";
import { validationResult } from "express-validator";
import prisma from "@/prisma/prisma";
import { successHandler, errorHandler } from "@/middleware/responseHandler";
import { blogCommentBodyType } from "@/types/blogComment.type";

export const getBlogComment = async (req: Request, res: Response) => {
  const { id } = req.query;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  try {
    await prisma.blogComment
      .findMany({ where: { blogId: id as string } })
      .then((data) => {
        return successHandler({
          res,
          data,
          message: `Success Get Blog Comment with ID ${id}`,
        });
      });
  } catch (error) {
    return errorHandler({ error, res });
  }
};

export const createBlogComment = async (req: Request, res: Response) => {
  const { name, comment } = req.body as blogCommentBodyType;
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
        customMessage: `Blog with ID ${id} not found`,
        customStatus: 404,
      });
    }

    await prisma.blogComment
      .create({
        data: {
          name,
          comment,
          blog: {
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
          message: "Success Post Blog Comment",
        });
      });
  } catch (error) {
    return errorHandler({ error, res });
  }
};

export const deleteCommentBlog = async (req: Request, res: Response) => {
  const { id } = req.query;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  try {
    const idValue = await prisma.blogComment.findUnique({
      where: { id: id as string },
    });

    if (!idValue) {
      return errorHandler({
        res,
        customMessage: `comment with ID ${id} not found`,
        customStatus: 404,
      });
    }

    await prisma.blogComment
      .delete({ where: { id: id as string } })
      .then((data) => {
        return successHandler({
          res,
          message: `Success Delete Comment with ID ${id}`,
        });
      });
  } catch (error) {
    return errorHandler({ error, res });
  }
};
