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
  Cached extends CacheType = CacheType,
> extends Omit<OriginInteractionButtonComponentData, 'type' | 'customId'> {
  readonly type: ComponentType.Button
  readonly customId: string
  readonly execute: ButtonInteractionExecute<Module, Cached>
}
export interface LinkButtonComponentData
  extends Omit<OriginLinkButtonComponentData, 'type' | 'customId'> {
  readonly type: ComponentType.Button
  readonly execute: undefined
}

export type ButtonComponentData<
  Module extends BaseModule | undefined = undefined,
  Cached extends CacheType = CacheType,
> = InteractionButtonComponentData<Module, Cached> | LinkButtonComponentData
export type ButtonInteractionExecute<
  Module extends BaseModule | undefined = undefined,
  Cached extends CacheType = CacheType,
> = (interaction: ButtonInteraction<Cached>, module: Module) => Promise<void>
interface ButtonInteractionExecuteData<
  Module extends BaseModule | undefined = undefined,
> {
  readonly type: ComponentType.Button
  readonly execute: ButtonInteractionExecute<Module>
}

// ChannelSelectMenu
export interface ChannelSelectMenuComponentData<
  Module extends BaseModule | undefined = undefined,
  Cached extends CacheType = CacheType,
> extends Omit<OriginChannelSelectMenuComponentData, 'type' | 'customId'> {
  readonly type: ComponentType.ChannelSelect
  readonly customId: string
  readonly execute: ChannelSelectMenuInteractionExecute<Module, Cached>
}
export type ChannelSelectMenuInteractionExecute<
  Module extends BaseModule | undefined = undefined,
  Cached extends CacheType = CacheType,
> = (
  interaction: ChannelSelectMenuInteraction<Cached>,
  module: Module,
) => Promise<void>
interface ChannelSelectMenuInteractionExecuteData<
  Module extends BaseModule | undefined = undefined,
> {
  readonly type: ComponentType.ChannelSelect
  readonly execute: ChannelSelectMenuInteractionExecute<Module>
}

// MentionableSelectMenu
export interface MentionableSelectMenuComponentData<
  Module extends BaseModule | undefined = undefined,
  Cached extends CacheType = CacheType,
> extends Omit<OriginMentionableSelectMenuComponentData, 'type' | 'customId'> {
  readonly type: ComponentType.MentionableSelect
  readonly customId: string
  readonly execute: MentionableSelectMenuInteractionExecute<Module, Cached>
}
export type MentionableSelectMenuInteractionExecute<
  Module extends BaseModule | undefined = undefined,
  Cached extends CacheType = CacheType,
> = (
  interaction: MentionableSelectMenuInteraction<Cached>,
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
  Cached extends CacheType = CacheType,
> extends Omit<OriginModalComponentData, 'components' | 'customId'> {
  readonly type: ComponentType.Modal
  readonly customId: string
  execute: ModalSubmitInteractionExecute<Module, Cached>
  components: TextInputComponentData[]
}
export type ModalSubmitInteractionExecute<
  Module extends BaseModule | undefined = undefined,
  Cached extends CacheType = CacheType,
> = (
  interaction: ModalSubmitInteraction<Cached>,
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
  Cached extends CacheType = CacheType,
> extends Omit<OriginRoleSelectMenuComponentData, 'type' | 'customId'> {
  readonly type: ComponentType.RoleSelect
  readonly customId: string
  readonly execute: RoleSelectMenuInteractionExecute<Module, Cached>
}
export type RoleSelectMenuInteractionExecute<
  Module extends BaseModule | undefined = undefined,
  Cached extends CacheType = CacheType,
> = (
  interaction: RoleSelectMenuInteraction<Cached>,
  module: Module,
) => Promise<void>
interface RoleSelectMenuInteractionExecuteData<
  Module extends BaseModule | undefined = undefined,
> {
  readonly type: ComponentType.RoleSelect
  readonly execute: RoleSelectMenuInteractionExecute<Module>
}

// StringSelectMenu
export interface StringSelectMenuComponentData<
  Module extends BaseModule | undefined = undefined,
  Cached extends CacheType = CacheType,
> extends Omit<OriginStringSelectMenuComponentData, 'type' | 'customId'> {
  readonly type: ComponentType.StringSelect
  readonly customId: string
  readonly execute: StringSelectMenuInteractionExecute<Module, Cached>
}
export type StringSelectMenuInteractionExecute<
  Module extends BaseModule | undefined = undefined,
  Cached extends CacheType = CacheType,
> = (
  interaction: StringSelectMenuInteraction<Cached>,
  module: Module,
) => Promise<void>
interface StringSelectMenuInteractionExecuteData<
  Module extends BaseModule | undefined = undefined,
> {
  readonly type: ComponentType.StringSelect
  readonly execute: StringSelectMenuInteractionExecute<Module>
}

// UserSelectMenu
export interface UserSelectMenuComponentData<
  Module extends BaseModule | undefined = undefined,
  Cached extends CacheType = CacheType,
> extends Omit<OriginUserSelectMenuComponentData, 'type' | 'customId'> {
  readonly type: ComponentType.UserSelect
  readonly customId: string
  readonly execute: UserSelectMenuInteractionExecute<Module, Cached>
}
export type UserSelectMenuInteractionExecute<
  Module extends BaseModule | undefined = undefined,
  Cached extends CacheType = CacheType,
> = (
  interaction: UserSelectMenuInteraction<Cached>,
  module: Module,
) => Promise<void>
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

export type ComponentData<
  Module extends BaseModule | undefined = undefined,
  Cached extends CacheType = CacheType,
> = MessageComponentData<Module, Cached> | ModalComponentData<Module, Cached>

export type MessageComponentData<
  Module extends BaseModule | undefined = undefined,
  Cached extends CacheType = CacheType,
> =
  | ButtonComponentData<Module, Cached>
  | SelectMenuComponentData<Module, Cached>

export type SelectMenuComponentData<
  Module extends BaseModule | undefined = undefined,
  Cached extends CacheType = CacheType,
> =
  | ChannelSelectMenuComponentData<Module, Cached>
  | MentionableSelectMenuComponentData<Module, Cached>
  | RoleSelectMenuComponentData<Module, Cached>
  | StringSelectMenuComponentData<Module, Cached>
  | UserSelectMenuComponentData<Module, Cached>

export type ApplicationCommandData<
  Module extends BaseModule | undefined = undefined,
  Cached extends CacheType = CacheType,
> =
  | UserApplicationCommandData<Module, Cached>
  | MessageApplicationCommandData<Module, Cached>
  | ChatInputApplicationCommandData<Module, Cached>

export interface UserApplicationCommandData<
  Module extends BaseModule | undefined = undefined,
  Cached extends CacheType = CacheType,
> extends OriginUserApplicationCommandData {
  readonly execute: (
    interaction: UserContextMenuCommandInteraction<Cached>,
    module: Module,
  ) => Promise<void>
}
export interface MessageApplicationCommandData<
  Module extends BaseModule | undefined = undefined,
  Cached extends CacheType = CacheType,
> extends OriginMessageApplicationCommandData {
  readonly execute: (
    interaction: MessageContextMenuCommandInteraction<Cached>,
    module: Module,
  ) => Promise<void>
}
export interface ChatInputApplicationCommandData<
  Module extends BaseModule | undefined = undefined,
  Cached extends CacheType = CacheType,
> extends OriginChatInputApplicationCommandData {
  readonly execute: (
    interaction: ChatInputCommandInteraction<Cached>,
    module: Module,
  ) => Promise<void>
  autoComplete?: (
    interaction: AutocompleteInteraction<Cached>,
    module: Module,
  ) => Promise<void>
}
