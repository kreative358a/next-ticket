import express, { Request, Response, RequestParamHandler } from "express";
import {
  body,
  // validationResult
} from "express-validator";

// lek 141
// import { RequestValidationError } from "../errors/request-validation-error";
// import { DatabaseConnectionError } from "../errors/database-connection-error";

// lek 160
import { User } from "../models/user";

// lek 161
// import { BadRequestError } from "../errors/bad-request-error";

// lek 176
import jwt from "jsonwebtoken";

// lek 185
// import { Password } from "../services/password";
// import { validateRequest } from "../middlewares/validate-request";

// lek 263
import { validateRequest } from "@next-ticket/common";
import { BadRequestError } from "@next-ticket/common";

const router = express.Router();

// lek 131
// router.post('/api/users/signup', (req, res) => {
//   res.send('Hi there signup!');
// });

// // lek 132
// router.post(
//   "/api/users/signup",
//   [
//     body("email").isEmail().withMessage("Email must be valid"),
//     body("password")
//       .trim()
//       .isLength({ min: 8, max: 20 })
//       .withMessage("Password must be between 8 and 20 characters"),
//   ],
//   (req: Request, res: Response) => {
//     const { email, password } = req.body;

//     if (!email || typeof email !== "string") {
//       res.status(400).send("Provide a valid email");
//     }

//     // new User({ email, password })
//   }
// );

// router.post(
//   "/api/users/signup",
//   [
//     body("email").isEmail().withMessage("Email must be valid"),
//     body("password")
//       .trim()
//       .isLength({ min: 4, max: 20 })
//       .withMessage("Password must be between 4 and 20 characters"),
//   ],
//   // (req: Request, res: Response) => {
//   // (req: Request | any, res: Response | any) => {
//   // lek 150 po zainstalowaniu express-async-errors
//   async (req: Request, res: Response) => {
//     const errors = validationResult(req);

//     /*
//     if (!errors.isEmpty()) {
//       // return res.status(400).send(errors.array());
//       // res.status(400).send(errors.array());
//       // return

//     //   // lek 138
//     //   throw new Error("Invalid email or password");

//     // lek 139
//     const error = new Error("Invalid email or password");
//     // error.message = errors.array();
//     // error.reasons = errors.array();
//     throw error;
//     }
//     const { email, password } = req.body;

//     console.log("Creating a user...");

//     // throw new Error("Error connecting to database");
//     */

//     // lek 141
//     if (!errors.isEmpty()) {
//       throw new RequestValidationError(errors.array());
//     }
//     console.log("Creating a user...");
//     throw new DatabaseConnectionError();

//     res.send({});

//     // new User({ email, password })
//   }
// );

// export { router as signupRouter };

/*
// lek 160
router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  // async (req: Request, res: Response) => {
  async (req: Request | any, res: Response | any) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      //   console.log("Email in use");
      //   return res.send({});
      throw new BadRequestError("Email in use");
    }

    const user = User.build({ email, password });
    // zapisanie w MongoDB.
    await user.save();

    // lek 180 example
    // if (!process.env.JWT_KEY) {
    // throw new Error("not valid JWT_KEY error")
    // }

    // lek 176
    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      // "asdf"
      // lek 180
      process.env.JWT_KEY!
    );

    // lek 176
    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    //  status ratunkowy 201, który wskazuje, że rekord został utworzony,
    res.status(201).send(user);
  }
);
*/
//  .matches(/\d/).withMessage('must contain a number')

/*
// lek 185
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
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existingUser);
  }
);
*/

// lek 186
router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 6, max: 20 })
      .withMessage("Password must be between 6 and 20 characters")
      .matches(/\d/)
      .withMessage("must contain a number"),
    // .matches(/[A-Z]/).withMessage('must contain a uppercase letter')
    // .matches(/[0-9]/).withMessage('must contain a lowercase letter')
    // (?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]
    // .matches(/[!@#%&?]/).withMessage('must contain a special sign !@#%&?'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
        // message: 'you are signed up'
      },
      process.env.JWT_KEY!
      //  { expiresIn: 15 * 60 }
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
    // res.status(201).send({user, message: "you are signed up"});
  }
);

export { router as signupRouter };
