// deno-lint-ignore-file

export type Name = string;

export type Snowflake = string;

export type Token = string;

export enum InteractionType {
  PING = 1,
  APPLICATION_COMMAND,
  MESSAGE_COMPONENT,
}

export enum CommandType {
  CHAT_INPUT = 1,
  USER,
  MESSAGE,
}

export enum CommandOptionType {
  SUB_COMMAND = 1,
  SUB_COMMAND_GROUP,
  STRING,
  INTEGER,
  BOOLEAN,
  USER,
  CHANNEL,
  ROLE,
  MENTIONABLE,
  NUMBER,
}

export type CommandDataOption = {
  name: Name;
  type: CommandOptionType;
  value?: Snowflake | string | number | boolean;
  options?: [CommandDataOption];
};

export type CommandData = {
  id: Snowflake;
  name: Name;
  options: [CommandDataOption];
  type: CommandType;
};

export type CommandDefinitionChoice = {
  name: Name;
  value: string | number;
};

export type CommandDefinitionOption = {
  name: Name;
  description: string;
  type: CommandOptionType;
  required?: boolean;
  choices?: [CommandDefinitionChoice];
  options?: [CommandDefinitionOption];
};

export type CommandDefinition = {
  name: Name;
  type: CommandType;
  description: string;
  options: [CommandDefinitionOption];
};

export type Member = {
  permissions: string;
  roles: [Snowflake];
  user: {
    avatar: string;
    discriminator: string;
    id: Snowflake;
    username: string;
  };
};

export type Interaction = {
  application_id: Snowflake;
  channel_id: Snowflake;
  data: CommandData;
  guild_id: Snowflake;
  id: Snowflake;
  member: Member;
  token: Token;
  type: InteractionType;
  version: number;
};

export enum InteractionCallbackType {
  PONG = 1,
  CHANNEL_MESSAGE_WITH_SOURCE = 4,
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
  DEFERRED_UPDATE_MESSAGE,
  UPDATE_MESSAGE,
}

export type InteractionCallbackData = {
  // tts?: boolean;
  content?: string;
  // embeds?: [unknown];
  // allowed_mentions?: unknown;
  // flags?: number;
  // components?: [unknown];
};

export type InteractionCallback = {
  type: InteractionCallbackType;
  data: InteractionCallbackData;
};
