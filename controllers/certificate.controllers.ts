import { Request, Response } from "express";
import prisma from "@/prisma/prisma";
import uploadHandler from "@/middleware/uploadHandler";
import deleteFileHandler from "@/middleware/deleteFileHandler";
import { successHandler, errorHandler } from "@/middleware/responseHandler";
import { bodyCertificateType } from "@/types/certificate.types";

export const getCertificate = async (req: Request, res: Response) => {
  const { page, limit } = req.query;

  try {
    const [data, meta] = await prisma.certificate
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

export const createCertificate = async (req: Request, res: Response) => {
  let bodyValue = req.body as bodyCertificateType;
  const files = req.files;

  const certificateFile = files["certif_file"][0];
  const thumbnailFile = files["thumbnail_file"][0];

  const { dataPath: certifPath, errorMsg: certifError } = await uploadHandler({
    bucketName: "certificate",
    bufferFiles: certificateFile,
  });

  if (certifError) {
    return errorHandler({ res, customMessage: certifError, customStatus: 500 });
  } else {
    bodyValue.file = certifPath;
  }

  const { dataPath: thumbnailPath, errorMsg: thumbnailError } =
    await uploadHandler({
      bucketName: "certificate",
      bufferFiles: thumbnailFile,
    });

  if (thumbnailError) {
    return errorHandler({
      res,
      customMessage: thumbnailError,
      customStatus: 500,
    });
  } else {
    bodyValue.thumbnail = thumbnailPath;
  }

  try {
    await prisma.certificate
      .create({
        data: bodyValue,
      })
      .then((data) => {
        return successHandler({
          res,
          data,
          message: "Success Create Certificate",
        });
      });
  } catch (error) {
    return errorHandler({ error, res });
  }
};

export const updateCertificate = async (req: Request, res: Response) => {
  let bodyValue = req.body as bodyCertificateType;
  const { id } = req.query;
  const files = req.files;

  const certificateFile = files?.["certif_file"]?.[0];
  const thumbnailFile = files?.["thumbnail_file"]?.[0];

  const dataInDB = await prisma.certificate.findUnique({
    where: { id: id as string },
  });

  if (!dataInDB) {
    return errorHandler({
      res,
      customMessage: `certificate with ID ${id} not found`,
      customStatus: 404,
    });
  }

  if (certificateFile) {
    const { dataPath: certifPath, errorMsg: certifError } = await uploadHandler(
      {
        bucketName: "certificate",
        bufferFiles: certificateFile,
      }
    );

    if (certifError) {
      return errorHandler({
        res,
        customMessage: certifError,
        customStatus: 500,
      });
    } else {
      bodyValue.file = certifPath;
    }
  }

  if (thumbnailFile) {
    const { dataPath: thumbnailPath, errorMsg: thumbnailError } =
      await uploadHandler({
        bucketName: "certificate",
        bufferFiles: thumbnailFile,
      });

    if (thumbnailError) {
      return errorHandler({
        res,
        customMessage: thumbnailError,
        customStatus: 500,
      });
    } else {
      bodyValue.thumbnail = thumbnailPath;
    }
  }

  try {
    await prisma.certificate
      .update({
        where: { id: id as string },
        data: bodyValue,
      })
      .then((data) => {
        return successHandler({
          res,
          data,
          message: "Success Update Certificate",
        });
      });
  } catch (error) {
    return errorHandler({ error, res });
  }
};

export const deleteCertificate = async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const dataInDB = await prisma.certificate.findUnique({
      where: { id: id as string },
    });

    if (!dataInDB) {
      return errorHandler({
        res,
        customMessage: `certificate with ID ${id} not found`,
        customStatus: 404,
      });
    }

    const { errorMsg } = await deleteFileHandler({
      bucketName: "certificate",
      fileName: [dataInDB.thumbnail, dataInDB.file],
    });

    if (errorMsg) {
      return errorHandler({
        res,
        customMessage: errorMsg,
        customStatus: 500,
      });
    }

    await prisma.certificate
      .delete({ where: { id: id as string } })
      .then((data) => {
        return successHandler({
          res,
          message: "Success Delete Certificate",
        });
      });
  } catch (error) {
    return errorHandler({ error, res });
  }
};
