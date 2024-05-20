import { Request, Response, NextFunction } from "express";

interface IPropsSuccessHandler<T> {
  data?: T;
  meta?: any;
  message?: string;
  res: Response;
  req?: Request;
  next?: NextFunction;
}

export const successHandler = <T>({
  res,
  message,
  data,
  meta,
}: IPropsSuccessHandler<T>) => {
  return res.status(200).json({
    message,
    data,
    meta,
  });
};

interface IPropsErrorHandler {
  error?: any;
  res: Response;
  req?: Request;
  next?: NextFunction;
  customMessage?: string;
  customStatus?: number;
}

export const errorHandler = ({
  error,
  res,
  customMessage,
  customStatus,
}: IPropsErrorHandler) => {
  const message =
    error?.message || customMessage || "An unknown error has occurred";
  const status = error?.code || customStatus || 500;

  return res.status(status).json({
    status: status,
    message: message,
    stack: process.env.NODE_ENV === "development" ? error?.stack : {},
  });
};
