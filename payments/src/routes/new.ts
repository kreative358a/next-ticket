import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from "@next-ticket/common";
import { Order } from "../models/order";
import { stripe } from "../stripe"; // lek 470
import { Payment } from "../models/payment"; // lek 476

import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher"; // lek 479
import { natsWrapper } from "../nats-wrapper"; // lek 479

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    // lek 465
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for an cancelled order");
    }

    // lek 470
    // await stripe.charges.create({
    //   currency: "usd",
    //   amount: order.price * 100,
    //   source: token,
    // });

    // lek 477
    const charge = await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100,
      source: token,
    });
    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });
    await payment.save();

    // lek 479
    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    // res.send({ success: true });
    // res.status(201).send({ success: true }); // lek 473
    res.status(201).send({ id: payment.id }); // lek 479
  }
);

export { router as createChargeRouter };
