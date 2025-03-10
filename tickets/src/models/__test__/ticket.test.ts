// lek 399
import { Ticket } from "../ticket";

// it('implements optimistic concurrency control', async () => {});

// lek 401
// it("implements optimistic concurrency control", async (done) => {
it("implements optimistic concurrency control", async () => {
  // Create an instance of a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 5,
    userId: "123",
  });

  // Save the ticket to the database
  await ticket.save();

  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make two separate changes to the tickets we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  // save the first fetched ticket
  await firstInstance!.save();

  // save the second fetched ticket and expect an error
  // Used to test that a function throws when it is called.
  // expect(async () => { await secondInstance!.save()}).toThrow("version compatibility problem")
  try {
    await secondInstance!.save();
  } catch (err) {
    // return done()
    return;
  }

  throw new Error("Should not reach this point");
});

// lek 402
it("increments the version number on multiple saves", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: "123",
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
