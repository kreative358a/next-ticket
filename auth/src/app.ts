import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { Request, Response, NextFunction } from "express";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { indexUserRouter } from "./routes/index"; // indexUserRouter
// import { errorHandler } from "./middlewares/error-handler";
// import { NotFoundError } from "./errors/not-found-error";

// lek 263
import { errorHandler, NotFoundError } from "@next-ticket/common";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    // secure: true
    // lek 205
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(indexUserRouter);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

// app.use(errorHandler);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export { app };
