import nacl from "https://cdn.skypack.dev/tweetnacl@v1.0.3?dts";
import { ServerRequest } from "https://deno.land/std@0.106.0/http/server.ts";
import { readAll } from "https://deno.land/std@0.106.0/io/util.ts";

const PUBLIC_KEY = Deno.env.get("DISCORD_PUBLIC_KEY");

export default async (req: ServerRequest) => {
  const signature = req.headers.get("X-Signature-Ed25519") ?? "";
  const timestamp = req.headers.get("X-Signature-Timestamp") ?? "";
  const body = (await readAll(req.body)).toString();

  console.debug({ signature, timestamp, body });

  const isReqValid = req.method === "POST" && !!signature && !!timestamp;
  if (!isReqValid) {
    const headers = new Headers();
    headers.set("Content-Type", "application/json; charset=utf8");
    req.respond({
      status: 401,
      headers,
      body: JSON.stringify({ error: "invalid request format" }),
    });
  }

  const isSigValid = nacl.sign.detached.verify(
    new TextEncoder().encode(timestamp + body),
    hexToUint8Array(signature ?? ""),
    hexToUint8Array(PUBLIC_KEY ?? ""),
  );
  if (!isSigValid) {
    const headers = new Headers();
    headers.set("Content-Type", "application/json; charset=utf8");
    req.respond({
      status: 401,
      headers,
      body: JSON.stringify({ error: "invalid request signature" }),
    });
  }

  const interaction: { type: number; data: { name: string; options: [] } } =
    JSON.parse(body);
  // Discord performs Ping interactions to test our application.
  // Type 1 in a request implies a Ping interaction.
  if (interaction.type === 1) {
    const headers = new Headers();
    headers.set("Content-Type", "application/json; charset=utf8");
    req.respond({
      status: 200,
      headers,
      body: JSON.stringify({ type: 1 }),
    });
  }
};

// The main logic of the Discord Slash Command is defined in this function.
// async function interactionsHandler(request: Request) {
//   // validateRequest() ensures that a request is of POST method and
//   // has the following headers.
//   const { error } = await validateRequest(request, {
//     POST: {
//       headers: ["X-Signature-Ed25519", "X-Signature-Timestamp"],
//     },
//   });
//   if (error) {
//     return json({ error: error.message }, { status: error.status });
//   }

//   // verifySignature() verifies if the request is coming from Discord.
//   // When the request's signature is not valid, we return a 401 and this is
//   // important as Discord sends invalid requests to test our verification.
//   const { valid, body } = await verifySignature(request);
//   if (!valid) {
//     return json(
//       { error: "Invalid request" },
//       {
//         status: 401,
//       },
//     );
//   }

//   const interaction: { type: number; data: { name: string; options: [] } } =
//     JSON.parse(body);
//   const { type, data } = interaction;
//   // Discord performs Ping interactions to test our application.
//   // Type 1 in a request implies a Ping interaction.
//   if (type === 1) {
//     return json({
//       type: 1, // Type 1 in a response is a Pong interaction response type.
//     });
//   }

//   // Type 2 in a request is an ApplicationCommand interaction.
//   // It implies that a user has issued a command.
//   if (type === 2) {
//     return json({
//       type: 4,
//       data: {
//         content: JSON.stringify(interaction),
//       },
//     });
//     //   const { value } = data.options.find((option: { name: string }) =>
//     //     option.name === "name"
//     //   );
//     //   return json({
//     //     // Type 4 responds with the below message retaining the user's
//     //     // input at the top.
//     //     type: 4,
//     //     data: {
//     //       content: `Hello, ${value}!`,
//     //     },
//     //   });
//   }

//   // We will return a bad request error as a valid Discord request
//   // shouldn't reach here.
//   return json({ error: "bad request" }, { status: 400 });
// }

// /** Verify whether the request is coming from Discord. */
// async function verifySignature(
//   request: Request,
// ): Promise<{ valid: boolean; body: string }> {
//   const PUBLIC_KEY = Deno.env.get("DISCORD_PUBLIC_KEY")!;
//   // Discord sends these headers with every request.
//   const signature = request.headers.get("X-Signature-Ed25519")!;
//   const timestamp = request.headers.get("X-Signature-Timestamp")!;
//   const body = await request.text();
//   const valid = nacl.sign.detached.verify(
//     new TextEncoder().encode(timestamp + body),
//     hexToUint8Array(signature),
//     hexToUint8Array(PUBLIC_KEY),
//   );

//   return { valid, body };
// }

/** Converts a hexadecimal string to Uint8Array. */
function hexToUint8Array(hex: string) {
  return new Uint8Array(hex.match(/.{1,2}/g)!.map((val) => parseInt(val, 16)));
}