import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { Request, Response, NextFunction } from "express";

// lek 263
import { errorHandler, NotFoundError, currentUser } from "@next-ticket/common";

// lek 272
import { createTicketRouter } from "./routes/new";

// lek 283
import { showTicketRouter } from "./routes/show";

// lek 286
import { indexTicketRouter } from "./routes/index";

// lek 289
import { updateTicketRouter } from "./routes/update";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   errorHandler(err, req, res, next);
// });

export { app };

// PASS  src/routes/__test__/new.test.ts (9.145 s)
// √ has a route handler listening to /api/tickets for post requests (104 ms)
// √ can only be accessed if the user is signed in (48 ms)
// √ returns a status other than 401 if the user is signed in (39 ms)
// √ returns an error if an invalid title is provided (40 ms)
// √ returns an error if an invalid price is provided (51 ms)
// √ returns an error if an invalid price is provided (51 ms)
// √ creates a ticket with valid inputs (75 ms)

// Tests:       6 passed, 6 total
// Snapshots:   0 total
// Time:        9.287 s
// Ran all test suites.
// PASS  src/routes/__test__/update.test.ts (9.018 s)
// PASS  src/routes/__test__/new.test.ts
// PASS  src/routes/__test__/show.test.ts
// PASS  src/routes/__test__/index.test.ts

// Test Suites: 4 passed, 4 total
// Tests:       14 passed, 14 total
// Snapshots:   0 total
// Time:        15.114 s
// Ran all test suites.
