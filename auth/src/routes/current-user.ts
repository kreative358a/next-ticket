// lek 130
// tworzymy równoważną procedurę obsługi trasy dla bieżącego użytkownika.
import express from "express";
// import express, { Request, Response } from "express";

// lek 188
// import jwt from "jsonwebtoken";

// lek 191
// import { currentUser } from "../middlewares/current-user";

// lek 263
import { currentUser } from "@next-ticket/common";

// 192
// import { requireAuth } from "../middlewares/require-auth";

// router, który jest obiektem, z którym możemy powiązać trasy.
const router = express.Router();

// router.get('/api/users/currentuser', () => {});

// // lek 131
// router.get("/api/users/currentuser", (req, res) => {
//   res.send("Hi there currentuser!");
// });

// export { router as currentUserRouter };

// // lek 188
// // router.get('/api/users/currentuser', (req: Request, res: Response | JSON) => {
// router.get("/api/users/currentuser", (req: Request, res: Response | any) => {
//   // jeśli nie ma obiektu sesji, lub jeśli nie ma właściwości JWT.
//   if (!req.session?.jwt) {
//     return res.send({ currentUser: null });
//   }

//   try {
//     const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
//     res.send({ currentUser: payload });
//   } catch (err) {
//     res.send({ currentUser: null });
//   }
// });

// lek 191
// router.get("/api/users/currentuser", currentUser, requireAuth, (req, res) => {
router.get("/api/users/currentuser", currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
