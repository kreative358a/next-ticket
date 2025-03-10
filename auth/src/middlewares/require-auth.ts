// lek 192
import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors/not-authorized-error";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    // return rest.status(401).send()
    throw new NotAuthorizedError();
  }

  next();
};
