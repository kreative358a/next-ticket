// lek 355
import express, { Request, Response } from "express";

// lek 378
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from "@next-ticket/common";
import { Order, OrderStatus } from "../models/order";

// lek 383
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

// router.delete("/api/orders/:orderId", async (req: Request, res: Response) => {
//   res.send({});
// });

// lek 378
router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    // const order = await Order.findById(orderId);
    // lek 383
    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    // lek 383
    // publishing an event saying this was cancelled!
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version, // lek 405 or lek 418
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
