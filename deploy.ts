import "https://deno.land/x/dotenv@v3.0.0/load.ts";

const CLIENT_ID = Deno.env.get("DISCORD_CLIENT_ID");
const CLIENT_SECRET = Deno.env.get("DISCORD_CLIENT_SECRET");

const commands = {
  name: "hello",
  description: "Greet a person",
  options: [{
    name: "name",
    description: "The name of the person",
    type: 3,
    required: true,
  }],
};

try {
  const accessTokenResponse = await fetch(
    "https://discord.com/api/oauth2/token",
    {
      method: "POST",
      headers: {
        "Authorization": `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(
        {
          grant_type: "client_credentials",
          scope: "applications.commands applications.commands.update",
        },
      ),
    },
  );

  if (accessTokenResponse.status !== 200) {
    throw new Error("Failed to get Access Token");
  }

  const { access_token: ACCESS_TOKEN } = await accessTokenResponse.json();

  const bulkOverwriteCommandsResponse = await fetch(
    `https://discord.com/api/v8/applications/${CLIENT_ID}/commands`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commands),
    },
  );

  if (bulkOverwriteCommandsResponse.status !== 200) {
    throw new Error("Failed to set Commands");
  }
} catch (error) {
  console.error(error);
}
