/* eslint-disable @typescript-eslint/naming-convention */
import {
  AutocompleteInteraction,
  ButtonInteraction,
  ChannelSelectMenuComponentData as OriginChannelSelectMenuComponentData,
  ChannelSelectMenuInteraction,
  ChatInputApplicationCommandData as OriginChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  ComponentType as OriginComponentType,
  Interaction,
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

import { BaseModule } from '@/BaseModule'
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
export interface InteractionButtonComponentData<
  Module extends BaseModule | undefined = undefined,
> extends Omit<OriginInteractionButtonComponentData, 'type' | 'customId'> {
  readonly type: ComponentType.Button
  readonly customId: string
  readonly execute: ButtonInteractionExecute<Module>
}
export interface LinkButtonComponentData
  extends Omit<OriginLinkButtonComponentData, 'type' | 'customId'> {
  readonly type: ComponentType.Button
  readonly execute: undefined
}

export type ButtonComponentData<
  Module extends BaseModule | undefined = undefined,
> = InteractionButtonComponentData<Module> | LinkButtonComponentData
export type ButtonInteractionExecute<
  Module extends BaseModule | undefined = undefined,
> = (interaction: ButtonInteraction, module: Module) => Promise<void>
interface ButtonInteractionExecuteData<
  Module extends BaseModule | undefined = undefined,
> {
  readonly type: ComponentType.Button
  readonly execute: ButtonInteractionExecute<Module>
}

// ChannelSelectMenu
export interface ChannelSelectMenuComponentData<
  Module extends BaseModule | undefined = undefined,
> extends Omit<OriginChannelSelectMenuComponentData, 'type' | 'customId'> {
  readonly type: ComponentType.ChannelSelect
  readonly customId: string
  readonly execute: ChannelSelectMenuInteractionExecute<Module>
}
export type ChannelSelectMenuInteractionExecute<
  Module extends BaseModule | undefined = undefined,
> = (interaction: ChannelSelectMenuInteraction, module: Module) => Promise<void>
interface ChannelSelectMenuInteractionExecuteData<
  Module extends BaseModule | undefined = undefined,
> {
  readonly type: ComponentType.ChannelSelect
  readonly execute: ChannelSelectMenuInteractionExecute<Module>
}

// MentionableSelectMenu
export interface MentionableSelectMenuComponentData<
  Module extends BaseModule | undefined = undefined,
> extends Omit<OriginMentionableSelectMenuComponentData, 'type' | 'customId'> {
  readonly type: ComponentType.MentionableSelect
  readonly customId: string
  readonly execute: MentionableSelectMenuInteractionExecute<Module>
}
export type MentionableSelectMenuInteractionExecute<
  Module extends BaseModule | undefined = undefined,
> = (
  interaction: MentionableSelectMenuInteraction,
  module: Module,
) => Promise<void>
interface MentionableSelectMenuInteractionExecuteData<
  Module extends BaseModule | undefined = undefined,
> {
  readonly type: ComponentType.MentionableSelect
  readonly execute: MentionableSelectMenuInteractionExecute<Module>
}

// Modal
export interface TextInputComponentData
  extends Omit<OriginTextInputComponentData, 'type'> {
  type?: OriginComponentType.TextInput
}
export interface ModalComponentData<
  Module extends BaseModule | undefined = undefined,
> extends Omit<OriginModalComponentData, 'components' | 'customId'> {
  readonly type: ComponentType.Modal
  readonly customId: string
  execute: ModalSubmitInteractionExecute<Module>
  components: TextInputComponentData[]
}
export type ModalSubmitInteractionExecute<
  Module extends BaseModule | undefined = undefined,
> = (
  interaction: ModalSubmitInteraction,
  parentInteraction: Interaction | undefined,
  module: Module,
) => Promise<void>
export interface ModalSubmitInteractionExecuteData<
  Module extends BaseModule | undefined = undefined,
> {
  readonly type: ComponentType.Modal
  readonly execute: ModalSubmitInteractionExecute<Module>
}

// RoleSelectMenu
export interface RoleSelectMenuComponentData<
  Module extends BaseModule | undefined = undefined,
> extends Omit<OriginRoleSelectMenuComponentData, 'type' | 'customId'> {
  readonly type: ComponentType.RoleSelect
  readonly customId: string
  readonly execute: RoleSelectMenuInteractionExecute<Module>
}
export type RoleSelectMenuInteractionExecute<
  Module extends BaseModule | undefined = undefined,
> = (interaction: RoleSelectMenuInteraction, module: Module) => Promise<void>
interface RoleSelectMenuInteractionExecuteData<
  Module extends BaseModule | undefined = undefined,
> {
  readonly type: ComponentType.RoleSelect
  readonly execute: RoleSelectMenuInteractionExecute<Module>
}

// StringSelectMenu
export interface StringSelectMenuComponentData<
  Module extends BaseModule | undefined = undefined,
> extends Omit<OriginStringSelectMenuComponentData, 'type' | 'customId'> {
  readonly type: ComponentType.StringSelect
  readonly customId: string
  readonly execute: StringSelectMenuInteractionExecute<Module>
}
export type StringSelectMenuInteractionExecute<
  Module extends BaseModule | undefined = undefined,
> = (interaction: StringSelectMenuInteraction, module: Module) => Promise<void>
interface StringSelectMenuInteractionExecuteData<
  Module extends BaseModule | undefined = undefined,
> {
  readonly type: ComponentType.StringSelect
  readonly execute: StringSelectMenuInteractionExecute<Module>
}

// UserSelectMenu
export interface UserSelectMenuComponentData<
  Module extends BaseModule | undefined = undefined,
> extends Omit<OriginUserSelectMenuComponentData, 'type' | 'customId'> {
  readonly type: ComponentType.UserSelect
  readonly customId: string
  readonly execute: UserSelectMenuInteractionExecute<Module>
}
export type UserSelectMenuInteractionExecute<
  Module extends BaseModule | undefined = undefined,
> = (interaction: UserSelectMenuInteraction, module: Module) => Promise<void>
interface UserSelectMenuInteractionExecuteData<
  Module extends BaseModule | undefined = undefined,
> {
  readonly type: ComponentType.UserSelect
  readonly execute: UserSelectMenuInteractionExecute<Module>
}

export type InteractionExecuteData<
  Module extends BaseModule | undefined = undefined,
> =
  | ButtonInteractionExecuteData<Module>
  | ChannelSelectMenuInteractionExecuteData<Module>
  | MentionableSelectMenuInteractionExecuteData<Module>
  | ModalSubmitInteractionExecuteData<Module>
  | RoleSelectMenuInteractionExecuteData<Module>
  | StringSelectMenuInteractionExecuteData<Module>
  | UserSelectMenuInteractionExecuteData<Module>

export type ComponentData<Module extends BaseModule | undefined = undefined> =
  | MessageComponentData<Module>
  | ModalComponentData<Module>

export type MessageComponentData<
  Module extends BaseModule | undefined = undefined,
> = ButtonComponentData<Module> | SelectMenuComponentData<Module>

export type SelectMenuComponentData<
  Module extends BaseModule | undefined = undefined,
> =
  | ChannelSelectMenuComponentData<Module>
  | MentionableSelectMenuComponentData<Module>
  | RoleSelectMenuComponentData<Module>
  | StringSelectMenuComponentData<Module>
  | UserSelectMenuComponentData<Module>

export type ApplicationCommandData<
  Module extends BaseModule | undefined = undefined,
> =
  | UserApplicationCommandData<Module>
  | MessageApplicationCommandData<Module>
  | ChatInputApplicationCommandData<Module>

export interface UserApplicationCommandData<
  Module extends BaseModule | undefined = undefined,
> extends OriginUserApplicationCommandData {
  readonly execute: (
    interaction: UserContextMenuCommandInteraction,
    module: Module,
  ) => Promise<void>
}
export interface MessageApplicationCommandData<
  Module extends BaseModule | undefined = undefined,
> extends OriginMessageApplicationCommandData {
  readonly execute: (
    interaction: MessageContextMenuCommandInteraction,
    module: Module,
  ) => Promise<void>
}
export interface ChatInputApplicationCommandData<
  Module extends BaseModule | undefined = undefined,
> extends OriginChatInputApplicationCommandData {
  readonly execute: (
    interaction: ChatInputCommandInteraction,
    module: Module,
  ) => Promise<void>
  autoComplete?: (
    interaction: AutocompleteInteraction,
    module: Module,
  ) => Promise<void>
}
