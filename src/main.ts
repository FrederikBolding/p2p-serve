import process from "node:process";
import { handleClient } from "./client";
import { handleServer } from "./server";

async function main() {
  const input = process.argv.slice(2);
  const mode = input[0];
  const portOrPublicKey = input[1];

  if (mode === "client") {
    return handleClient(portOrPublicKey);
  }

  return handleServer(parseInt(portOrPublicKey, 10));
}

main().catch(console.error);
