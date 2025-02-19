// lek 286
import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  const tickets = await Ticket.find({
    // lek 501
    orderId: undefined,
  });

  res.send(tickets);
});

export { router as indexTicketRouter };
