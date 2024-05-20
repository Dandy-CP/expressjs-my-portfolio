import { Request, Response } from "express";
import prisma from "@/prisma/prisma";
import { successHandler, errorHandler } from "@/middleware/responseHandler";
import { blogCommentBodyType } from "@/types/blogComment.type";

export const getBlogComment = async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    await prisma.blog_comment
      .findMany({ where: { blogId: id as string } })
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

export const createBlogComment = async (req: Request, res: Response) => {
  const bodyValue = req.body as blogCommentBodyType;
  const { id } = req.query;

  try {
    const blogInDB = await prisma.blog.findUnique({
      where: { id: id as string },
    });

    if (!blogInDB) {
      return errorHandler({
        res,
        customMessage: `Blog with ID ${id} not found`,
        customStatus: 404,
      });
    }

    await prisma.blog_comment
      .create({
        data: {
          ...bodyValue,
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
        });
      });
  } catch (error) {
    return errorHandler({ error, res });
  }
};

export const deleteCommentBlog = async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const blogInDB = await prisma.blog_comment.findUnique({
      where: { id: id as string },
    });

    if (!blogInDB) {
      return errorHandler({
        res,
        customMessage: `comment with ID ${id} not found`,
        customStatus: 404,
      });
    }

    await prisma.blog_comment
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

export const likeBlogComment = async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const blogCommentInDB = await prisma.blog_comment.findUnique({
      where: { id: id as string },
    });

    if (!blogCommentInDB) {
      return errorHandler({
        res,
        customMessage: `blog comment with ID ${id} not found`,
        customStatus: 404,
      });
    }

    await prisma.blog_comment
      .update({
        where: { id: id as string },
        data: { likes: { increment: 1 } },
      })
      .then((data) => {
        return successHandler({
          res,
          message: `Success Increment Comment Like with ID ${id}`,
        });
      });
  } catch (error) {}
};

export const dislikeBlogComment = async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const blogCommentInDB = await prisma.blog_comment.findUnique({
      where: { id: id as string },
    });

    if (!blogCommentInDB) {
      return errorHandler({
        res,
        customMessage: `blog comment with ID ${id} not found`,
        customStatus: 404,
      });
    }

    await prisma.blog_comment
      .update({
        where: { id: id as string },
        data: { dislike: { increment: 1 } },
      })
      .then((data) => {
        return successHandler({
          res,
          message: `Success Increment Comment Dislike with ID ${id}`,
        });
      });
  } catch (error) {}
};
