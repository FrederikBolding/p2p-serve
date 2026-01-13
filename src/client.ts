import HyperDHT from "hyperdht";
import http from "node:http";
import { pipeline } from "node:stream";

export async function handleClient(publicKey: string, port = 8000) {
  const dht = new HyperDHT();

  console.log(`[p2p-serve] Visit http://localhost:${port} to connect.`);

  const httpServer = http.createServer();

  httpServer.on("connection", (httpSocket) => {
    // Assuming here that the underlying connection is re-used.
    const socket = dht.connect(publicKey, { reusableSocket: true });
    pipeline(socket, httpSocket, socket, (error) => {
      if (error) {
        // console.error(error);
      }
    });
  });

  httpServer.listen(port);
}
