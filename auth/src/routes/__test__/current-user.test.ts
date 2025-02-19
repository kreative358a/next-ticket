// lek 210
import request from "supertest";
import { app } from "../../app";

// it("responds with details about the current user", async () => {
//   await request(app)
//     .post("/api/users/signup")
//     .send({
//       email: "test@test.com",
//       password: "password0",
//     })
//     .expect(201);

//   const response = await request(app)
//     .get("/api/users/currentuser")
//     .send()
//     .expect(200);

//   console.log(response.body);
//   // { currentUser: null }
// });

// lek 212
// it("responds with details about the current user", async () => {
//   const authResponse = await request(app)
//     .post("/api/users/signup")
//     .send({
//       email: "test@test.com",
//       password: "password0",
//     })
//     .expect(201);

//   const cookie = authResponse.get("Set-Cookie");

//   if (!cookie) {
//     throw new Error("Cookie not set after signup");
//   }

//   const response = await request(app)
//     .get("/api/users/currentuser")
//     .set("Cookie", cookie)
//     .send()
//     .expect(200);

//   console.log(response.body);
//   // console.log
//   // {
//   //   currentUser: {
//   //     id: '67ab4f02c8fc3c1b8a0b22cf',
//   //     email: 'test@test.com',
//   //     iat: 1739280130
//   //   }
//   // }

//   expect(response.body.currentUser.email).toEqual("test@test.com");
// });

// lek 213
it("responds with details about the current user", async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
