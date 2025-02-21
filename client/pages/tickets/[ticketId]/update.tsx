/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import useRequest from "../../../hooks/use-request"; // lek 488
import Router from "next/router"; // lek 489

interface Ticket {
  id: string;
  title: string;
  price: number | string | any;
  userId: string;
  version: number; // lek 399
  orderId?: string; // lek 422
}

const UpdateTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [ticketId, setTicketId] = useState("");

  // lek 488
  const { doRequest, errors } = useRequest({
    url: `/api/tickets/${ticketId}/update`,
    // url: `/api/tickets/${ticketId}`,
    method: "put",
    body: {
      title,
      price,
    },
    onSuccess: (ticket: Ticket) => {
      console.log(ticket);
      Router.push("/tickets");
    },
  });

  // lek 488
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  return (
    <div
      style={{
        width: "60%",
        minWidth: "400px",
        position: "relative",
        margin: "20px auto 20px auto",
      }}
    >
      <h1>TICKET UPDATED</h1>
    </div>
  );

  //   return (
  //     <div
  //       style={{
  //         width: "60%",
  //         minWidth: "400px",
  //         position: "relative",
  //         margin: "20px auto 20px auto",
  //       }}
  //     >
  //       <h1>Update a Ticket</h1>
  //       <form onSubmit={onSubmit}>
  //         <div className="form-group">
  //           <label style={{ fontSize: "18px" }}>Title</label>
  //           <input
  //             value={title}
  //             onChange={(e) => setTitle(e.target.value)}
  //             className="form-control"
  //             pattern="[A-Za-z0-9& ]{3,}"
  //             title="Min 3 letter title"
  //             required
  //           />
  //         </div>
  //         <div className="form-group">
  //           <label style={{ fontSize: "18px" }}>Price</label>
  //           <input
  //             value={price}
  //             onBlur={onBlur}
  //             onChange={(e) => setPrice(e.target.value)}
  //             className="form-control"
  //             pattern="[0-9]+([\.,][0-9]+)?"
  //             title="Only numbers allowed"
  //             required
  //             // type="number"
  //             // step="0.01"
  //           />
  //         </div>
  //         {errors}
  //         <button className="btn btn-primary" style={{ marginTop: "10px" }}>
  //           Submit
  //         </button>
  //       </form>
  //     </div>
  //   );
};

export default UpdateTicket;
