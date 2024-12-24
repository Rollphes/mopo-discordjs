import {
  ActionRowBuilder as OriginActionRowBuilder,
  ActionRowData,
  APIActionRowComponent,
  APIMessageActionRowComponent,
  ButtonBuilder,
  ChannelSelectMenuBuilder,
  ComponentType as OriginComponentType,
  JSONEncodable,
  MentionableSelectMenuBuilder,
  MessageActionRowComponentBuilder,
  MessageActionRowComponentData,
  ModalBuilder,
  RoleSelectMenuBuilder,
  StringSelectMenuBuilder,
  UserSelectMenuBuilder,
} from 'discord.js'

import {
  ComponentData,
  ComponentType,
  MessageComponentType,
  ModalComponentData,
} from '@/types'

type BuilderType<T extends ComponentType> = T extends ComponentType.Button
  ? ButtonBuilder
  : T extends ComponentType.ChannelSelect
    ? ChannelSelectMenuBuilder
    : T extends ComponentType.MentionableSelect
      ? MentionableSelectMenuBuilder
      : T extends ComponentType.RoleSelect
        ? RoleSelectMenuBuilder
        : T extends ComponentType.StringSelect
          ? StringSelectMenuBuilder
          : T extends ComponentType.UserSelect
            ? UserSelectMenuBuilder
            : T extends ComponentType.Modal
              ? ModalBuilder
              : never

type ConditionalArray<
  T extends MessageComponentType,
  R,
> = T extends ComponentType.Button ? [R, R?, R?, R?, R?] : [R]

type ComponentDataByType<T extends ComponentType> = Extract<
  ComponentData,
  { type: T }
>

export function createActionRow<T extends MessageComponentType>(
  components: ConditionalArray<T, Omit<ComponentDataByType<T>, 'execute'>>,
):
  | JSONEncodable<APIActionRowComponent<APIMessageActionRowComponent>>
  | ActionRowData<
      MessageActionRowComponentData | MessageActionRowComponentBuilder
    >
  | APIActionRowComponent<APIMessageActionRowComponent> {
  const actionRow = new OriginActionRowBuilder<BuilderType<T>>()
  components.forEach((c) => {
    if (!c) return
    actionRow.addComponents(createBuilder(c))
  })
  return actionRow
}

export function createBuilder<T extends ComponentType>(
  component: Omit<ComponentDataByType<T>, 'execute'>,
): BuilderType<T> {
  switch (component.type) {
    case ComponentType.Button:
      return new ButtonBuilder(
        Object.assign(component, { type: OriginComponentType.Button }),
      ) as BuilderType<T>
    case ComponentType.StringSelect:
      return new StringSelectMenuBuilder(
        Object.assign(component, {
          type: OriginComponentType.StringSelect,
        }),
      ) as BuilderType<T>
    case ComponentType.UserSelect:
      return new UserSelectMenuBuilder(
        Object.assign(component, { type: OriginComponentType.UserSelect }),
      ) as BuilderType<T>
    case ComponentType.RoleSelect:
      return new RoleSelectMenuBuilder(
        Object.assign(component, { type: OriginComponentType.RoleSelect }),
      ) as BuilderType<T>
    case ComponentType.MentionableSelect:
      return new MentionableSelectMenuBuilder(
        Object.assign(component, {
          type: OriginComponentType.MentionableSelect,
        }),
      ) as BuilderType<T>
    case ComponentType.ChannelSelect:
      return new ChannelSelectMenuBuilder(
        Object.assign(component, {
          type: OriginComponentType.ChannelSelect,
        }),
      ) as BuilderType<T>
    case ComponentType.Modal:
      return createModalBuilder(
        component as Omit<ModalComponentData, 'execute'>,
      ) as BuilderType<T>
    default:
      throw new Error('Invalid component type')
  }
}

export function createModalBuilder<
  R extends Omit<ModalComponentData, 'execute'>,
>(
  component: R,
  initFields?: { [K in R['components'][number]['customId']]?: string },
): BuilderType<R['type']> {
  if (component.type !== ComponentType.Modal)
    throw new Error('Invalid component type for modal')
  return new ModalBuilder(
    component
      ? {
          customId: component.customId,
          title: component.title,
          components: component.components.map((component) => {
            return {
              type: OriginComponentType.ActionRow,
              components: [
                Object.assign(component, {
                  type: ComponentType.TextInput,
                  value: initFields
                    ? [component.customId as keyof typeof initFields]
                    : undefined,
                }),
              ],
            }
          }),
        }
      : undefined,
  ) as BuilderType<R['type']>
}
