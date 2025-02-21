/* eslint-disable @typescript-eslint/no-explicit-any */
// lek 491
// const TicketShow = () => {
//   return <div>TicketShow</div>;
// };

// export default TicketShow;

// lek 492
import useRequest from "../../hooks/use-request";
import Router from "next/router"; // lek 493
import { AppContext, AppProps, AppInitialProps } from "next/app";

interface TicketProps {
  id: string;
  title: string;
  price: number | string | any;
  userId: string;
  version: number; // lek 399
  orderId?: string; // lek 422
}

enum OrderStatus {
  Created = "created",
  Cancelled = "cancelled",
  AwaitingPayment = "awaiting:payment",
  Complete = "complete",
}

interface TicketDoc {
  title: string;
  price: number;
  version: number; // lek 407
  // lek 365
  isReserved(): Promise<boolean>;
}

interface OrderProps {
  id: string;
  userId: string;
  // status: string;

  // lek 360
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
  version: number; // lek 407
}

interface AppComponentProps extends AppProps {
  currentUser: any;
  query: string;
  ticketId: string;
}
const TicketShow = ({ ticket }: { ticket: TicketProps }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order: OrderProps) => {
      console.log("order: ", order);
      Router.push("/orders/[orderId]", `/orders/${order.id}`);
    },
  });

  return (
    <div
      style={{
        width: "60%",
        minWidth: "400px",
        position: "relative",
        margin: "20px auto 20px auto",
      }}
    >
      <h1>{ticket.title}</h1>
      <h4>Price: ${ticket.price}</h4>
      {errors}
      <button
        // onClick={doRequest}
        // lek 500
        onClick={() => doRequest()}
        className="btn btn-primary"
        style={{ fontSize: "16px" }}
      >
        Purchase
      </button>
    </div>
  );
};

TicketShow.getInitialProps = async (context: any, client: any) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketShow;
