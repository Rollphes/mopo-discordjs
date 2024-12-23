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

type ConditionalArray<C extends Omit<MessageComponentData, 'execute'>> =
  C extends Omit<SelectMenuComponentData, 'execute'> ? [C] : [C, C?, C?, C?, C?]

export function createMessageComponents<
  R1 extends MessageComponentData,
  R2 extends MessageComponentData,
  R3 extends MessageComponentData,
  R4 extends MessageComponentData,
  R5 extends MessageComponentData,
>(
  components: [
    ConditionalArray<Omit<R1, 'execute'>>,
    ConditionalArray<Omit<R2, 'execute'>>?,
    ConditionalArray<Omit<R3, 'execute'>>?,
    ConditionalArray<Omit<R4, 'execute'>>?,
    ConditionalArray<Omit<R5, 'execute'>>?,
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
        components.filter(
          (c): c is Exclude<typeof c, undefined> => c !== undefined,
        ) as unknown as MessageComponentData[],
      )
    })
    .filter((c): c is Exclude<typeof c, undefined> => !!c)
}

function createActionRow<R extends MessageComponentData>(
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

function createBuilder<R extends MessageComponentData>(
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
    default:
      throw new Error('Invalid component type')
  }
}

export function createModalBuilder<R extends ModalComponentData>(
  component: Omit<R, 'execute'>,
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
