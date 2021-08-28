import { CommandDataOption, CommandOptionType, Name } from "./interfaces.ts";

export type ParsedCommandDataOption = {
  name: Name;
  type: CommandOptionType;
  value?: CommandDataOption["value"];
  options?: ParsedCommandDataOptions;
};

export type ParsedCommandDataOptions = Record<Name, ParsedCommandDataOption>;

export default function parseOptions(
  options: [CommandDataOption],
): ParsedCommandDataOptions {
  const parsedOptions: ParsedCommandDataOptions = {};
  options.forEach((option) => {
    parsedOptions[option.name] = {
      ...option,
      options: option.options ? parseOptions(option.options) : undefined,
    };
  });
  return parsedOptions;
}
