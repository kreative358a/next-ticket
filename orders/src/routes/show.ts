// lek 355
import express, { Request, Response } from "express";

// lek 375
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from "@next-ticket/common";
import { Order } from "../models/order";

const router = express.Router();

// router.get("/api/orders/:orderId", async (req: Request, res: Response) => {
//   res.send({});
// });

// lek 375
router.get(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    // alternative
    // if( order.userId !== req.currentUser!.id ) {
    //   // TODO: add in logging system
    //   // logging system for admin only
    //   // log user and unauthorized access attempt
    //   // return NotFoundError to client for end user to see
    //   throw new NotFoundError();
    // }

    res.send(order);
  }
);

export { router as showOrderRouter };
