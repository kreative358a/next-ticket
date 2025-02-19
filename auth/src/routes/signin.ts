// import express from "express";
import express, { Request, Response } from "express";
// lek 183
import {
  body,
  // validationResult
} from "express-validator";

// lek 185
import jwt from "jsonwebtoken";
import { Password } from "../services/password";
import { User } from "../models/user";
// import { validateRequest } from "../middlewares/validate-request";
// import { BadRequestError } from "../errors/bad-request-error";

// lek 263
import { validateRequest } from "@next-ticket/common";
import { BadRequestError } from "@next-ticket/common";
// import { currentUser } from "@next-ticket/common";

const router = express.Router();

// router.post("/api/users/signin", (req, res) => {
//   res.send("Hi there signin!");
// });

// lek 183 - 185
router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // async (req: Request | any, res: Response | any) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid Credentials");
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
        // message: existingUser.message,
        // message: 'you are signed in',
      },
      process.env.JWT_KEY!
      //  { expiresIn: 15 * 60 },
      // { message: "you are signed in"}
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existingUser);
    // res.status(200).send({ existingUser, message: "you are signed in" });
  }
);

export { router as signinRouter };
