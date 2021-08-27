import { ServerRequest } from "https://deno.land/std/http/server.ts";

// deno-lint-ignore require-await
export default async (req: ServerRequest) => {
  req.respond({ body: `Hello, from Deno v${Deno.version.deno}!` });
};
