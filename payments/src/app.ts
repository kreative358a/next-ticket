// lek 454
import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
// import { Request, Response, NextFunction } from "express";
import { errorHandler, NotFoundError, currentUser } from "@next-ticket/common";
import { createChargeRouter } from "./routes/new"; // lek 464

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser); // lek 464

app.use(createChargeRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   errorHandler(err, req, res, next);
// });

export { app };
