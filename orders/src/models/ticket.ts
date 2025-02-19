// lek 362
import mongoose from "mongoose";

// lek 365
import { Order, OrderStatus } from "./order";

// lek 407
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
  id: string; // lek 391
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number; // lek 407
  // lek 365
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;

  // lek 409
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// lek 407
ticketSchema.set("versionKey", "version");

// lek 410
ticketSchema.plugin(updateIfCurrentPlugin);
// ticketSchema.pre("save", function (done) {
//   // ts-ignore
//   this.$where = {
//     version: this.get("version") - 1,
//   };
//   done();
// });

// lek 409
ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  // return new Ticket(attrs);
  // lek 391
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};

// lek 365
ticketSchema.methods.isReserved = async function () {
  // this === the ticket document that we just called 'isReserved' on
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
