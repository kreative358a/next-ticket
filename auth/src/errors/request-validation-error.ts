// lek 141
import { ValidationError } from "express-validator";

// export class RequestValidationError extends Error {
//   constructor(public errors: ValidationError[]) {
//     super();

//     // constructor(private errors: ValidationError[]) {
//     //   super();

//     // Only because we are extending a built in class
//     Object.setPrototypeOf(this, RequestValidationError.prototype);
//   }
// }

/*
// lek 147 example solution
interface CustomError {
  statusCode: number;
  serializeErrors(): {
    message: string;
    field: string;
  }[]
} */
// export class RequestValidationError extends Error implements CustomError {

/*
// lek 145
export class RequestValidationError extends Error {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super();

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  serializeErrors() {
    return this.errors.map((err) => {
      if (err.type === "field") {
        return { message: err.msg, field: err.path };
      }
    });
  }
} */

// lek 148
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super("Invalid request parameters");

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => {
      if (err.type === "field") {
        return { message: err.msg, field: err.path };
      }
      return { message: err.msg };
    });
  }
}
