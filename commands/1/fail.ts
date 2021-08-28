import { Interaction, InteractionCallback } from "../../util/interfaces.ts";

export const failedInteractionCallback = {
  type: 4,
  data: {
    content: "Spirit invocation failed!",
  },
};

export function handler(_?: Interaction): InteractionCallback {
  return failedInteractionCallback;
}
