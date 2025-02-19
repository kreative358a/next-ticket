// import express from "express";
// lek 189
import express, { Request, Response } from "express";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
  // res.send("Hi there signout!");
  req.session = null;

  // res.send({});
  res.send({ message: "you are logged out" });
});

export { router as signoutRouter };
