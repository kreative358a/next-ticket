// import { Request, Response, NextFunction } from "express";

import express, { Request, Response, NextFunction } from "express";

// lek 142
// import { RequestValidationError } from "../errors/request-validation-error";
// import { DatabaseConnectionError } from "../errors/database-connection-error";

// lek 148
import { CustomError } from "../errors/custom-error";

// export const errorHandler = (
//   err: Error,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   // console.log("Something went wrong", err);

//   if (err instanceof RequestValidationError) {
//     console.log("handling this error as a request validation error");
//   }
//   if (err instanceof DatabaseConnectionError) {
//     console.log("handling this error as a db connection error");
//   }

//   res.status(400).send({
//     // message: "Something went wrong",
//     message: err.message,
//   });
// };

// lek 144
export const errorHandler = (
  err: Error,
  req: Request,
  // res: Response,
  // next: NextFunction,
  // err: Error | any,
  // req: Request | any,
  res: Response | any,
  next: NextFunction | any
) => {
  // if (err instanceof RequestValidationError) {
  //   const formattedErrors = err.errors.map((error) => {
  //     if (error.type === "field") {
  //       return { message: error.msg, field: error.path };
  //     }
  //   });
  //   return res.status(400).send({ errors: formattedErrors });
  //   // res.status(400).send({ errors: formattedErrors });
  //   // return;
  // }
  // if (err instanceof DatabaseConnectionError) {
  //   return res.status(500).send({ errors: [{ message: err.reason }] });
  // }

  // lek 145
  // if (err instanceof RequestValidationError) {
  //   return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  // }
  // if (err instanceof DatabaseConnectionError) {
  //   return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  // }

  // lek 148
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  res.status(400).send({
    errors: [{ message: "Something went wrong" }],
  });
};
