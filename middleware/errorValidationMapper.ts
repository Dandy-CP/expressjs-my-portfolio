import { Response, Request, NextFunction } from "express";
import { validationResult } from "express-validator";

const errorValidationMapper = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const valueErrorArray = errors.array({ onlyFirstError: true });

    const error = valueErrorArray.map((value) => {
      return value.msg;
    });

    res.status(422).json({ errors: error });
    return;
  }

  return next();
};

export default errorValidationMapper;
