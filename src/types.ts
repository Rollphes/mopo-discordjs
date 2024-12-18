/* eslint-disable @typescript-eslint/naming-convention */
import {
  AutocompleteInteraction,
  ButtonInteraction,
  CacheType,
  ChannelSelectMenuComponentData as OriginChannelSelectMenuComponentData,
  ChannelSelectMenuInteraction,
  ChatInputApplicationCommandData as OriginChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  ComponentType as OriginComponentType,
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
export enum ComponentType {
  Button = OriginComponentType.Button,
  StringSelect = OriginComponentType.StringSelect,
  TextInput = OriginComponentType.TextInput,
  UserSelect = OriginComponentType.UserSelect,
  RoleSelect = OriginComponentType.RoleSelect,
  MentionableSelect = OriginComponentType.MentionableSelect,
  ChannelSelect = OriginComponentType.ChannelSelect,
  Modal = -100,
}

// Button
export interface InteractionButtonComponentData
  extends Omit<OriginInteractionButtonComponentData, 'type' | 'customId'> {
  readonly type: ComponentType.Button
  readonly customId: string
  readonly execute: ButtonInteractionExecute
}
export interface LinkButtonComponentData
  extends Omit<OriginLinkButtonComponentData, 'type' | 'customId'> {
  readonly type: ComponentType.Button
  readonly execute: undefined
}

export type ButtonComponentData =
  | InteractionButtonComponentData
  | LinkButtonComponentData
export type ButtonInteractionExecute = (
  interaction: ButtonInteraction,
) => Promise<void>
interface ButtonInteractionExecuteData {
  readonly type: ComponentType.Button
  readonly execute: ButtonInteractionExecute
}

// ChannelSelectMenu
export interface ChannelSelectMenuComponentData
  extends Omit<OriginChannelSelectMenuComponentData, 'type' | 'customId'> {
  readonly type: ComponentType.ChannelSelect
  readonly customId: string
  readonly execute: ChannelSelectMenuInteractionExecute
}
export type ChannelSelectMenuInteractionExecute = (
  interaction: ChannelSelectMenuInteraction,
) => Promise<void>
interface ChannelSelectMenuInteractionExecuteData {
  readonly type: ComponentType.ChannelSelect
  readonly execute: ChannelSelectMenuInteractionExecute
}

// MentionableSelectMenu
export interface MentionableSelectMenuComponentData
  extends Omit<OriginMentionableSelectMenuComponentData, 'type' | 'customId'> {
  readonly type: ComponentType.MentionableSelect
  readonly customId: string
  readonly execute: MentionableSelectMenuInteractionExecute
}
export type MentionableSelectMenuInteractionExecute = (
  interaction: MentionableSelectMenuInteraction,
) => Promise<void>
interface MentionableSelectMenuInteractionExecuteData {
  readonly type: ComponentType.MentionableSelect
  readonly execute: MentionableSelectMenuInteractionExecute
}

// Modal
export interface TextInputComponentData
  extends Omit<OriginTextInputComponentData, 'type'> {
  type?: OriginComponentType.TextInput
}
export interface ModalComponentData
  extends Omit<OriginModalComponentData, 'components' | 'customId'> {
  readonly type: ComponentType.Modal
  readonly customId: string
  execute: ModalSubmitInteractionExecute
  components: TextInputComponentData[]
}
export type ModalSubmitInteractionExecute = (
  interaction: ModalSubmitInteraction,
) => Promise<void>
export interface ModalSubmitInteractionExecuteData {
  readonly type: ComponentType.Modal
  readonly execute: ModalSubmitInteractionExecute
}

// RoleSelectMenu
export interface RoleSelectMenuComponentData
  extends Omit<OriginRoleSelectMenuComponentData, 'type' | 'customId'> {
  readonly type: ComponentType.RoleSelect
  readonly customId: string
  readonly execute: RoleSelectMenuInteractionExecute
}
export type RoleSelectMenuInteractionExecute = (
  interaction: RoleSelectMenuInteraction,
) => Promise<void>
interface RoleSelectMenuInteractionExecuteData {
  readonly type: ComponentType.RoleSelect
  readonly execute: RoleSelectMenuInteractionExecute
}

// StringSelectMenu
export interface StringSelectMenuComponentData
  extends Omit<OriginStringSelectMenuComponentData, 'type' | 'customId'> {
  readonly type: ComponentType.StringSelect
  readonly customId: string
  readonly execute: StringSelectMenuInteractionExecute
}
export type StringSelectMenuInteractionExecute = (
  interaction: StringSelectMenuInteraction,
) => Promise<void>
interface StringSelectMenuInteractionExecuteData {
  readonly type: ComponentType.StringSelect
  readonly execute: StringSelectMenuInteractionExecute
}

// UserSelectMenu
export interface UserSelectMenuComponentData
  extends Omit<OriginUserSelectMenuComponentData, 'type' | 'customId'> {
  readonly type: ComponentType.UserSelect
  readonly customId: string
  readonly execute: UserSelectMenuInteractionExecute
}
export type UserSelectMenuInteractionExecute = (
  interaction: UserSelectMenuInteraction,
) => Promise<void>
interface UserSelectMenuInteractionExecuteData {
  readonly type: ComponentType.UserSelect
  readonly execute: UserSelectMenuInteractionExecute
}

export type InteractionExecuteData =
  | ButtonInteractionExecuteData
  | ChannelSelectMenuInteractionExecuteData
  | MentionableSelectMenuInteractionExecuteData
  | ModalSubmitInteractionExecuteData
  | RoleSelectMenuInteractionExecuteData
  | StringSelectMenuInteractionExecuteData
  | UserSelectMenuInteractionExecuteData

export type ComponentData =
  | ButtonComponentData
  | ChannelSelectMenuComponentData
  | MentionableSelectMenuComponentData
  | ModalComponentData
  | RoleSelectMenuComponentData
  | StringSelectMenuComponentData
  | UserSelectMenuComponentData

export type MessageComponentData =
  | ButtonComponentData
  | ChannelSelectMenuComponentData
  | MentionableSelectMenuComponentData
  | RoleSelectMenuComponentData
  | StringSelectMenuComponentData
  | UserSelectMenuComponentData

export type SelectMenuComponentData =
  | ChannelSelectMenuComponentData
  | MentionableSelectMenuComponentData
  | RoleSelectMenuComponentData
  | StringSelectMenuComponentData
  | UserSelectMenuComponentData

export type ApplicationCommandData =
  | UserApplicationCommandData
  | MessageApplicationCommandData
  | ChatInputApplicationCommandData

export interface UserApplicationCommandData
  extends OriginUserApplicationCommandData {
  readonly execute: (
    interaction: UserContextMenuCommandInteraction<CacheType>,
  ) => Promise<void>
}
export interface MessageApplicationCommandData
  extends OriginMessageApplicationCommandData {
  readonly execute: (
    interaction: MessageContextMenuCommandInteraction<CacheType>,
  ) => Promise<void>
}
export interface ChatInputApplicationCommandData
  extends OriginChatInputApplicationCommandData {
  readonly execute: (
    interaction: ChatInputCommandInteraction<CacheType>,
  ) => Promise<void>
  autoComplete?: (
    interaction: AutocompleteInteraction<CacheType>,
  ) => Promise<void>
}
