/* eslint-disable @typescript-eslint/no-explicit-any */
// lek 493
// const OrderShow = () => {
//   return <div>OrderShow</div>;
// };

// export default OrderShow;

// lek 494
// npm audit fix
import { useEffect, useState } from "react";
import Router from "next/router";
import StripeCheckout from "react-stripe-checkout"; // lek 498
import useRequest from "../../hooks/use-request"; // lek 500
import { AppContext, AppProps, AppInitialProps } from "next/app";
// import {
//   loadStripe,
//   // Stripe,
//   // StripeElements,
//   Appearance,
// } from "@stripe/stripe-js";
// import {
//   EmbeddedCheckoutProvider,
//   EmbeddedCheckout,
// } from "@stripe/react-stripe-js";
type CurrentUserProps = {
  id: string;
  email: string;
  password: string;
};

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

interface PaymentProps {
  orderId: string;
  stripeId: string;
}

const OrderShow = ({
  order,
  currentUser,
}: {
  order: OrderProps;
  currentUser: CurrentUserProps;
}) => {
  const [timeLeft, setTimeLeft] = useState<string | number | any>("");

  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (payment: PaymentProps | any) => {
      console.log("payment: ", payment);
      Router.push("/orders");
    },
    // onSuccess: () => Router.push("/orders"),
  });

  // if (errors) {
  //   console.log("[orderId].js errors: ", errors);
  // }
  // console.log("orderId].js NO errors");
  // const options = { doRequest };
  // const stripePromise = loadStripe(
  //   "pk_test_51QtwmuGC1v79jN0Pn3spiMvMj4VAPnbVDjZYSI0cOwnb0mYQSW4cUPrwTWOhLQQChEBW5O0TIZBDCoVfIY4Lz60800xTbMSrTl"
  // );

  useEffect(() => {
    const findTimeLeft = () => {
      // const msLeft = new Date(order.expiresAt) - new Date();
      const msLeft: number =
        new Date(order.expiresAt).getTime() - new Date().getTime();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return (
      <div
        style={{
          width: "60%",
          minWidth: "400px",
          position: "relative",
          margin: "20px auto 20px auto",
        }}
      >
        <p style={{ fontSize: "18px", color: "red", fontWeight: "bold" }}>
          Order Expired
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          width: "60%",
          minWidth: "400px",
          position: "relative",
          margin: "20px auto 20px auto",
        }}
      >
        <p style={{ fontSize: "18px" }}>Time left to pay: {timeLeft} seconds</p>
        <p>test card number: 4242 4242 4242 4242</p>
        <p>date: future date, cvc: three rundom numbers </p>
        <br />
        <StripeCheckout
          // token={(token) => console.log("token: ", token)}
          token={({ id }) => doRequest({ token: id })}
          stripeKey="pk_test_51QtwmuGC1v79jN0Pn3spiMvMj4VAPnbVDjZYSI0cOwnb0mYQSW4cUPrwTWOhLQQChEBW5O0TIZBDCoVfIY4Lz60800xTbMSrTl"
          amount={order.ticket.price * 100}
          email={currentUser.email}
          name="ticket"
          description={`${order.ticket.title}`}
          allowRememberMe={true}
        />
        {errors}
      </div>
      {/* <div>
        <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
          <EmbeddedCheckout className="bg-muted/80 text-black dark:text-white" />
        </EmbeddedCheckoutProvider>
      </div> */}
    </>
  );
};

OrderShow.getInitialProps = async (context: any, client: any) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
