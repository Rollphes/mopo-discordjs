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
  ButtonComponentData,
  ChannelSelectMenuComponentData,
  ComponentData,
  ComponentType,
  MentionableSelectMenuComponentData,
  MessageComponentData,
  ModalComponentData,
  RoleSelectMenuComponentData,
  SelectMenuComponentData,
  StringSelectMenuComponentData,
  UserSelectMenuComponentData,
} from '@/types'

type BuilderType<ComponentType> = ComponentType extends ButtonComponentData
  ? ButtonBuilder
  : ComponentType extends ChannelSelectMenuComponentData
    ? ChannelSelectMenuBuilder
    : ComponentType extends MentionableSelectMenuComponentData
      ? MentionableSelectMenuBuilder
      : ComponentType extends RoleSelectMenuComponentData
        ? RoleSelectMenuBuilder
        : ComponentType extends StringSelectMenuComponentData
          ? StringSelectMenuBuilder
          : ComponentType extends UserSelectMenuComponentData
            ? UserSelectMenuBuilder
            : ComponentType extends ModalComponentData
              ? ModalBuilder
              : never

type ConditionalArray<C extends MessageComponentData> =
  C extends SelectMenuComponentData ? [C] : [C, C?, C?, C?, C?]

export function createMessageComponents<
  R1 extends MessageComponentData,
  R2 extends MessageComponentData,
  R3 extends MessageComponentData,
  R4 extends MessageComponentData,
  R5 extends MessageComponentData,
>(
  components: [
    ConditionalArray<R1>,
    ConditionalArray<R2>?,
    ConditionalArray<R3>?,
    ConditionalArray<R4>?,
    ConditionalArray<R5>?,
  ],
): readonly (
  | JSONEncodable<APIActionRowComponent<APIMessageActionRowComponent>>
  | ActionRowData<
      MessageActionRowComponentData | MessageActionRowComponentBuilder
    >
  | APIActionRowComponent<APIMessageActionRowComponent>
)[] {
  return components
    .map((components) => {
      if (components === undefined) return
      return createActionRow(
        components.filter((c): c is MessageComponentData => !!c),
      )
    })
    .filter((c): c is Exclude<typeof c, undefined> => !!c)
}

export function createActionRow<R extends MessageComponentData>(
  components: R[],
):
  | JSONEncodable<APIActionRowComponent<APIMessageActionRowComponent>>
  | ActionRowData<
      MessageActionRowComponentData | MessageActionRowComponentBuilder
    >
  | APIActionRowComponent<APIMessageActionRowComponent> {
  const actionRow = new OriginActionRowBuilder<BuilderType<R>>()
  components.forEach((c) => {
    if (!c) return
    actionRow.addComponents(createBuilder(c))
  })
  return actionRow
}

export function createBuilder<R extends ComponentData>(
  component: R,
): BuilderType<R> {
  switch (component.type) {
    case ComponentType.Button:
      return new ButtonBuilder(
        Object.assign(component, { type: OriginComponentType.Button }),
      ) as BuilderType<R>
    case ComponentType.StringSelect:
      return new StringSelectMenuBuilder(
        Object.assign(component, {
          type: OriginComponentType.StringSelect,
        }),
      ) as BuilderType<R>
    case ComponentType.UserSelect:
      return new UserSelectMenuBuilder(
        Object.assign(component, { type: OriginComponentType.UserSelect }),
      ) as BuilderType<R>
    case ComponentType.RoleSelect:
      return new RoleSelectMenuBuilder(
        Object.assign(component, { type: OriginComponentType.RoleSelect }),
      ) as BuilderType<R>
    case ComponentType.MentionableSelect:
      return new MentionableSelectMenuBuilder(
        Object.assign(component, {
          type: OriginComponentType.MentionableSelect,
        }),
      ) as BuilderType<R>
    case ComponentType.ChannelSelect:
      return new ChannelSelectMenuBuilder(
        Object.assign(component, {
          type: OriginComponentType.ChannelSelect,
        }),
      ) as BuilderType<R>
    case ComponentType.Modal:
      return new ModalBuilder(
        component
          ? {
              customId: component.customId,
              title: component.title,
              components: component.components.map((component) => {
                return {
                  type: OriginComponentType.ActionRow,
                  components: [
                    Object.assign({ type: ComponentType.TextInput }, component),
                  ],
                }
              }),
            }
          : undefined,
      ) as BuilderType<R>
    default:
      throw new Error('Invalid component type')
  }
}

export function createModalBuilder<R extends ModalComponentData>(
  component: R,
  initFields?: { [K in R['components'][number]['customId']]?: string },
): BuilderType<R> {
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
  ) as BuilderType<R>
}
