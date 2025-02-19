// lek 491
// const TicketShow = () => {
//   return <div>TicketShow</div>;
// };

// export default TicketShow;

// lek 492
import useRequest from "../../hooks/use-request";
import Router from "next/router"; // lek 493

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => {
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

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketShow;
