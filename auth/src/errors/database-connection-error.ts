// lek 141

// export class DatabaseConnectionError extends Error {
//   reason = "Error connecting to database";

//   constructor() {
//     super();

//     Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
//   }
// }

/*
// lek 145
export class DatabaseConnectionError extends Error {
  statusCode = 500;
  reason = "Error connecting to database";

  constructor() {
    super();

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
  serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
} 
*/

// lek 148

import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  reason = "Error connecting to database";

  constructor() {
    super("Error connecting to db");

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
