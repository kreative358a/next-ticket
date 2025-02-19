// lek 493
// const OrderShow = () => {
//   return <div>OrderShow</div>;
// };

// export default OrderShow;

// lek 494
// npm audit fix
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout"; // lek 498
import useRequest from "../../hooks/use-request"; // lek 500
import {
  loadStripe,
  // Stripe,
  // StripeElements,
  Appearance,
} from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState("");

  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => console.log(payment),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
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

  const stripePromise = loadStripe(
    "pk_test_51QtwmuGC1v79jN0Pn3spiMvMj4VAPnbVDjZYSI0cOwnb0mYQSW4cUPrwTWOhLQQChEBW5O0TIZBDCoVfIY4Lz60800xTbMSrTl"
  );

  // return (
  //   <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
  //   <EmbeddedCheckout className="bg-muted/80 text-black dark:text-white" />
  // </EmbeddedCheckoutProvider>
  // )

  return (
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
        // name="test card number: 4242 4242 4242 4242"
        // description="date: future date, cvc: three rundom numbers "
        allowRememberMe
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
