import { Interaction, InteractionCallback } from "../../util/interfaces.ts";
import parseOptions from "../../util/parseOptions.ts";
import { handler as fail } from "./fail.ts";

export function handler(interaction: Interaction): InteractionCallback {
  try {
    const parsedOptions = parseOptions(interaction.data.options);
    return {
      type: 4,
      data: {
        content: `Hello, ${parsedOptions.name.value ?? "World"}!`,
      },
    };
  } catch (_) {
    return fail();
  }
}
