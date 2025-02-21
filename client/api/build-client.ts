// /* eslint-disable @typescript-eslint/no-explicit-any */
// import axios, { AxiosRequestHeaders } from "axios";
// import axios from "axios";

// export default function buildClient({ req }) {
//   if (typeof window === "undefined") {
//     // We are on the server

//     return axios.create({
//       baseURL:
//         "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
//       headers: req.headers,
//     });
//   } else {
//     // We must be on the browser
//     return axios.create({
//       baseUrl: "/",
//     });
//   }
// }

// export default function buildClient({ req }: { req: any }) {
//   if (typeof window === "undefined") {
//     // We are on the server

//     return axios.create({
//       baseURL:
//         "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
//       headers: req.headers,
//     });
//   } else {
//     // We must be on the browser
//     return axios.create({
//       baseURL: "/",
//     });
//   }
// }

import axios, { AxiosInstance } from "axios";

interface BuildClientProps {
  req: {
    headers: Record<string, string>;
  };
}

const buildClient = ({ req }: BuildClientProps): AxiosInstance => {
  if (typeof window === "undefined") {
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    return axios.create({
      baseURL: "/",
    });
  }
};

export default buildClient;
