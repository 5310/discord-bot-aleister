import { ServerRequest } from "https://deno.land/std@0.106.0/http/server.ts";
import { readAll } from "https://deno.land/std@0.106.0/io/util.ts";
import nacl from "https://cdn.skypack.dev/tweetnacl@v1.0.3?dts";
import hexToUint8Array from "../util/hexToUint8Array.ts";
import jsonResponse from "../util/jsonResponse.ts";

const PUBLIC_KEY = <string> Deno.env.get("DISCORD_PUBLIC_KEY");

export default async (req: ServerRequest) => {
  // Human-readable message for strangers
  if (req.method === "GET") {
    req.respond({
      body: "This is a POST-only endpoint",
    });
    return;
  }

  // Verify and validate Discord's request
  const signature = req.headers.get("X-Signature-Ed25519") ?? "";
  const timestamp = req.headers.get("X-Signature-Timestamp") ?? "";
  const body = new TextDecoder().decode(await readAll(req.body));
  const isReqValid = req.method === "POST" && !!signature && !!timestamp;
  if (!isReqValid) {
    req.respond({
      status: 400,
    });
    return;
  }
  const isSigValid = nacl.sign.detached.verify(
    new TextEncoder().encode(timestamp + body),
    hexToUint8Array(signature),
    hexToUint8Array(PUBLIC_KEY),
  );
  if (!isSigValid) {
    req.respond({
      status: 401,
    });
    return;
  }

  // Extract the Interaction
  const interaction = JSON.parse(body);
  console.debug(interaction);

  // Ping
  if (interaction.type === 1) {
    req.respond(jsonResponse({
      type: 1,
    }));
    return;
  }

  // Chat input
  if (interaction.type === 2) {
    req.respond(jsonResponse({
      type: 4,
      data: {
        content: `Hello, ${interaction.data.options[0].value}!`,
      },
    }));
    return;
  }

  // Catch-all
  req.respond({
    status: 400,
  });
};
