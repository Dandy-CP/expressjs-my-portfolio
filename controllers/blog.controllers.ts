import { Request, Response } from "express";
import prisma from "@/prisma/prisma";
import uploadHandler from "@/middleware/uploadHandler";
import { successHandler, errorHandler } from "@/middleware/responseHandler";
import { blogBodyType } from "@/types/blog.types";

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
    });
  } catch (error) {
    return errorHandler({ error, res });
  }
};

export const getBlogByID = async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    await prisma.blog
      .findUnique({
        where: { id: id as string },
        include: {
          comment: true,
          author: { select: { id: true, name: true, avatar: true } },
        },
      })
      .then((data) => {
        if (!data) {
          return errorHandler({
            res,
            customMessage: `blog with id ${id} not found`,
            customStatus: 404,
          });
        }

        return successHandler({
          res,
          data,
        });
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
        include: {
          comment: true,
          author: { select: { id: true, name: true, avatar: true } },
        },
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
        });
      });
  } catch (error) {
    return errorHandler({ error, res });
  }
};

export const createBlog = async (req: Request, res: Response) => {
  let bodyValue = req.body as blogBodyType;
  const logedUser = req.user;
  const file = req.file;

  const { dataPath, errorMsg } = await uploadHandler({
    bucketName: "coverimage",
    bufferFiles: file,
  });

  if (errorMsg) {
    return errorHandler({ res, customMessage: errorMsg, customStatus: 500 });
  } else {
    bodyValue.thumbnail = dataPath;
    bodyValue.author = logedUser.name;
    bodyValue.tag = JSON.parse(bodyValue.tag as any);
  }

  try {
    await prisma.blog
      .create({
        data: {
          ...bodyValue,
          author: {
            connect: { id: logedUser.id },
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

export const updateBlog = async (req: Request, res: Response) => {
  let bodyValue = req.body as blogBodyType;
  const { id } = req.query;
  const logedUser = req.user;
  const file = req.file;

  if (file) {
    const { dataPath, errorMsg } = await uploadHandler({
      bucketName: "coverimage",
      bufferFiles: file,
    });

    if (errorMsg) {
      return errorHandler({ res, customMessage: errorMsg, customStatus: 500 });
    } else {
      bodyValue.thumbnail = dataPath;
    }
  }

  bodyValue.tag = JSON.parse(bodyValue.tag as any);
  bodyValue.author = logedUser.name;

  try {
    const blogInDB = await prisma.blog.findUnique({
      where: { id: id as string },
    });

    if (!blogInDB) {
      return errorHandler({
        res,
        customMessage: `blog with ID ${id} not found`,
        customStatus: 404,
      });
    }

    await prisma.blog
      .update({
        where: { id: id as string },
        data: {
          ...bodyValue,
          author: {
            connect: { id: logedUser.id },
          },
        },
      })
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
    const blogInDB = await prisma.blog.findUnique({
      where: { id: id as string },
    });

    if (!blogInDB) {
      return errorHandler({
        res,
        customMessage: `blog with ID ${id} not found`,
        customStatus: 404,
      });
    }

    await prisma.blog_comment
      .deleteMany({
        where: { blogId: id as string },
      })
      .then(async (data) => {
        await prisma.blog
          .delete({
            where: { id: id as string },
          })
          .then((data) => {
            return successHandler({
              res,
              message: `Success Delete Blog with ID ${id}`,
            });
          });
      });
  } catch (error) {
    return errorHandler({ error, res });
  }
};

export const incrementViewBlog = async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const blogInDB = await prisma.blog.findUnique({
      where: { id: id as string },
    });

    if (!blogInDB) {
      return errorHandler({
        res,
        customMessage: `blog with ID ${id} not found`,
        customStatus: 404,
      });
    }

    await prisma.blog
      .update({
        where: { id: id as string },
        data: { blogViews: { increment: 1 } },
      })
      .then((data) => {
        return successHandler({
          res,
          message: `Success Increment View Blog with ID ${id}`,
        });
      });
  } catch (error) {
    return errorHandler({ error, res });
  }
};

export const likeBlog = async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const blogInDB = await prisma.blog.findUnique({
      where: { id: id as string },
    });

    if (!blogInDB) {
      return errorHandler({
        res,
        customMessage: `blog with ID ${id} not found`,
        customStatus: 404,
      });
    }

    await prisma.blog
      .update({
        where: { id: id as string },
        data: { likes: { increment: 1 } },
      })
      .then((data) => {
        return successHandler({
          res,
          message: `Success Increment Like with ID ${id}`,
        });
      });
  } catch (error) {
    return errorHandler({ error, res });
  }
};

export const dislikeBlog = async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const blogInDB = await prisma.blog.findUnique({
      where: { id: id as string },
    });

    if (!blogInDB) {
      return errorHandler({
        res,
        customMessage: `blog with ID ${id} not found`,
        customStatus: 404,
      });
    }

    await prisma.blog
      .update({
        where: { id: id as string },
        data: { dislike: { increment: 1 } },
      })
      .then((data) => {
        return successHandler({
          res,
          message: `Success Increment Dislike with ID ${id}`,
        });
      });
  } catch (error) {
    return errorHandler({ error, res });
  }
};
