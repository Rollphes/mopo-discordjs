import {
  AutocompleteInteraction,
  ButtonInteraction,
  CacheType,
  ChannelSelectMenuComponentData as OriginChannelSelectMenuComponentData,
  ChannelSelectMenuInteraction,
  ChatInputApplicationCommandData as OriginChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  ComponentType,
  InteractionButtonComponentData as OriginInteractionButtonComponentData,
  LinkButtonComponentData as OriginLinkButtonComponentData,
  MentionableSelectMenuComponentData as OriginMentionableSelectMenuComponentData,
  MentionableSelectMenuInteraction,
  MessageApplicationCommandData as OriginMessageApplicationCommandData,
  MessageContextMenuCommandInteraction,
  ModalComponentData as OriginModalComponentData,
  ModalSubmitInteraction,
  RoleSelectMenuComponentData as OriginRoleSelectMenuComponentData,
  RoleSelectMenuInteraction,
  StringSelectMenuComponentData as OriginStringSelectMenuComponentData,
  StringSelectMenuInteraction,
  TextInputComponentData as OriginTextInputComponentData,
  UserApplicationCommandData as OriginUserApplicationCommandData,
  UserContextMenuCommandInteraction,
  UserSelectMenuComponentData as OriginUserSelectMenuComponentData,
  UserSelectMenuInteraction,
} from 'discord.js'

// Button
export interface InteractionButtonComponentData
  extends Omit<OriginInteractionButtonComponentData, 'type'> {
  execute: ButtonInteractionExecute
  type?: ComponentType.Button
}
export interface LinkButtonComponentData
  extends Omit<OriginLinkButtonComponentData, 'type'> {
  type?: ComponentType.Button
}
export type ButtonComponentData =
  | InteractionButtonComponentData
  | LinkButtonComponentData
export type ButtonInteractionExecute = (
  interaction: ButtonInteraction,
) => Promise<void>
interface ButtonInteractionExecuteData
  extends Pick<OriginInteractionButtonComponentData, 'type' | 'customId'> {
  execute: ButtonInteractionExecute
}

// ChannelSelectMenu
export interface ChannelSelectMenuComponentData
  extends Omit<OriginChannelSelectMenuComponentData, 'type'> {
  execute: ChannelSelectMenuInteractionExecute
  type?: ComponentType.ChannelSelect
}
export type ChannelSelectMenuInteractionExecute = (
  interaction: ChannelSelectMenuInteraction,
) => Promise<void>
interface ChannelSelectMenuInteractionExecuteData
  extends Pick<OriginChannelSelectMenuComponentData, 'type' | 'customId'> {
  execute: ChannelSelectMenuInteractionExecute
}

// MentionableSelectMenu
export interface MentionableSelectMenuComponentData
  extends Omit<OriginMentionableSelectMenuComponentData, 'type'> {
  execute: MentionableSelectMenuInteractionExecute
  type?: ComponentType.MentionableSelect
}
export type MentionableSelectMenuInteractionExecute = (
  interaction: MentionableSelectMenuInteraction,
) => Promise<void>
interface MentionableSelectMenuInteractionExecuteData
  extends Pick<OriginMentionableSelectMenuComponentData, 'type' | 'customId'> {
  execute: MentionableSelectMenuInteractionExecute
}

// Modal
export interface TextInputComponentData
  extends Omit<OriginTextInputComponentData, 'type'> {
  type?: ComponentType.TextInput
}
export interface ModalComponentData
  extends Omit<OriginModalComponentData, 'components'> {
  execute?: ModalSubmitInteractionExecute
  components: TextInputComponentData[]
}
export type ModalSubmitInteractionExecute = (
  interaction: ModalSubmitInteraction,
) => Promise<void>
export interface ModalSubmitInteractionExecuteData
  extends Pick<OriginTextInputComponentData, 'type' | 'customId'> {
  execute: ModalSubmitInteractionExecute
}

// RoleSelectMenu
export interface RoleSelectMenuComponentData
  extends Omit<OriginRoleSelectMenuComponentData, 'type'> {
  execute: RoleSelectMenuInteractionExecute
  type?: ComponentType.RoleSelect
}
export type RoleSelectMenuInteractionExecute = (
  interaction: RoleSelectMenuInteraction,
) => Promise<void>
interface RoleSelectMenuInteractionExecuteData
  extends Pick<OriginRoleSelectMenuComponentData, 'type' | 'customId'> {
  execute: RoleSelectMenuInteractionExecute
}

// StringSelectMenu
export interface StringSelectMenuComponentData
  extends Omit<OriginStringSelectMenuComponentData, 'type'> {
  execute: StringSelectMenuInteractionExecute
  type?: ComponentType.StringSelect
}
export type StringSelectMenuInteractionExecute = (
  interaction: StringSelectMenuInteraction,
) => Promise<void>
interface StringSelectMenuInteractionExecuteData
  extends Pick<OriginStringSelectMenuComponentData, 'type' | 'customId'> {
  execute: StringSelectMenuInteractionExecute
}

// UserSelectMenu
export interface UserSelectMenuComponentData
  extends Omit<OriginUserSelectMenuComponentData, 'type'> {
  execute: UserSelectMenuInteractionExecute
  type?: ComponentType.UserSelect
}
export type UserSelectMenuInteractionExecute = (
  interaction: UserSelectMenuInteraction,
) => Promise<void>
interface UserSelectMenuInteractionExecuteData
  extends Pick<OriginUserSelectMenuComponentData, 'type' | 'customId'> {
  execute: UserSelectMenuInteractionExecute
}

export type InteractionExecuteData =
  | ButtonInteractionExecuteData
  | ChannelSelectMenuInteractionExecuteData
  | MentionableSelectMenuInteractionExecuteData
  | ModalSubmitInteractionExecuteData
  | RoleSelectMenuInteractionExecuteData
  | StringSelectMenuInteractionExecuteData
  | UserSelectMenuInteractionExecuteData

export type ApplicationCommandData =
  | UserApplicationCommandData
  | MessageApplicationCommandData
  | ChatInputApplicationCommandData

export interface UserApplicationCommandData
  extends OriginUserApplicationCommandData {
  execute: (
    interaction: UserContextMenuCommandInteraction<CacheType>,
  ) => Promise<void>
}
export interface MessageApplicationCommandData
  extends OriginMessageApplicationCommandData {
  execute: (
    interaction: MessageContextMenuCommandInteraction<CacheType>,
  ) => Promise<void>
}
export interface ChatInputApplicationCommandData
  extends OriginChatInputApplicationCommandData {
  execute: (
    interaction: ChatInputCommandInteraction<CacheType>,
  ) => Promise<void>
  autoComplete?: (
    interaction: AutocompleteInteraction<CacheType>,
  ) => Promise<void>
}
