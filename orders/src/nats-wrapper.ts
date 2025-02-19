// lek 336
import nats, { Stan } from "node-nats-streaming";

// class NatsWrapper {}

// lek 337
class NatsWrapper {
  private _client?: Stan;

  // lek 339
  get client() {
    if (!this._client) {
      throw new Error("Cannot access NATS client before connecting");
    }

    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    // return new Promise<void>((resolve, reject) => {
    //   this._client!.on("connect", () => {
    //     console.log("Connected to NATS");
    //     resolve();
    //   });
    //   this._client!.on("error", (err) => {
    //     reject(err);
    //   });
    // });

    // // lek 340 example not do this
    // this._client.on('close', () => {
    //     console.log('NATS connection closed!');
    //     process.exit();
    //   });
    //   process.on('SIGINT', () => this.client.close());
    //   process.on('SIGTERM', () => this.client.close());

    // lek 339
    return new Promise<void>((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("orders Connected to NATS");
        resolve();
      });
      this.client.on("error", (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
