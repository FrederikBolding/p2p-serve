import HyperDHT, { keyPair as generateKeyPair } from "hyperdht";
import { createConnection } from "node:net";
import { pipeline } from "node:stream";

export async function handleServer(port: number) {
  const dht = new HyperDHT();
  const keyPair = generateKeyPair();

  console.log(
    `[p2p-serve] Serving site using public key: ${keyPair.publicKey.toString(
      "hex"
    )}`
  );

  const server = dht.createServer();

  process.on("exit", () => {
    server.close();
  });

  server.on("connection", (socket) => {
    console.log(
      `[p2p-serve] Incoming connection from: ${socket.remotePublicKey.toString(
        "hex"
      )}`
    );

    // Establish local TCP connection and pipe together with incoming P2P socket.
    const localConnection = createConnection({ port });
    pipeline(socket, localConnection, socket, (error) => {
      if (error?.code !== "ECONNRESET" && error?.code !== "ETIMEDOUT") {
        console.error(error);
      }
    });
  });

  await server.listen(keyPair);
}
