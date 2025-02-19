// lek 355
import express, { Request, Response } from "express";

// lek 378
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from "@next-ticket/common";
import { Ticket } from "../models/ticket";

const router = express.Router();

// router.delete("/api/orders/:orderId", async (req: Request, res: Response) => {
//   res.send({});
// });

// lek 378
router.delete(
  "/api/tickets/:ticketId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { ticketId } = req.params;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    await ticket.save();

    res.status(204).send({});
  }
);

export { router as deleteOrderRouter };
