import axios from "axios";
import { useState } from "react";

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  // lek 500
  const doRequest = async (props = {}) => {
    // const doRequest = async () => {
    try {
      setErrors(null);
      // const response = await axios[method](url, body);

      // lek 500
      const response = await axios[method](url, { ...body, ...props });

      if (onSuccess) {
        onSuccess(response.data);
      }
      console.log("use-request response.data: ", response.data);
      return response.data;
    } catch (err) {
      console.log("use-request use-request err: ", err);
      console.log(
        "use-request err.response.data.errors: ",
        err.response.data.errors
      );
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            {err.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
