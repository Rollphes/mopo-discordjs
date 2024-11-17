import {
  ApplicationCommandType,
  Client,
  ComponentType,
  Interaction,
  Snowflake,
} from 'discord.js'

import { ApplicationCommandData, InteractionExecuteData } from '@/types'

export class InteractionManager {
  private cache: Map<string, InteractionExecuteData> = new Map()
  private commands: Map<string, ApplicationCommandData> = new Map()

  constructor(private client: Client) {}

  public async execute(interaction: Interaction): Promise<void> {
    await Promise.all([
      this.messageComponentExecute(interaction),
      this.autoCompleteExecute(interaction),
      this.commandExecute(interaction),
    ])
  }

  public set(customId: string, data: InteractionExecuteData): void {
    const cachedExecute = this.cache.get(customId)
    if (
      cachedExecute &&
      cachedExecute.execute.toString() !== data.execute.toString()
    ) {
      throw new Error(
        `The customId ${customId} is already in use with a different execute function.`,
      )
    }
    this.cache.set(customId, data)
  }

  public async setCommands(
    data: ApplicationCommandData[],
    guildId?: Snowflake,
  ): Promise<void> {
    data.forEach((command) => {
      const cachedCommand = this.commands.get(command.name)
      if (
        cachedCommand &&
        cachedCommand.execute.toString() !== command.execute.toString()
      ) {
        throw new Error(
          `The commandName ${command.name} is already in use with a different execute function.`,
        )
      }
      this.commands.set(command.name, command)
    })
    if (!this.client.application) return
    if (guildId) await this.client.application.commands.set(data, guildId)
    else await this.client.application.commands.set(data)
  }

  public async clearCommands(guildId?: Snowflake): Promise<void> {
    this.commands.clear()
    const application = this.client.application
    if (!application) return

    if (guildId) {
      const guildCommands = await application.commands.fetch({
        guildId: guildId,
      })
      await Promise.all(
        guildCommands.map(async (c) => {
          await application.commands.delete(c.id, guildId)
        }),
      )
    } else {
      const clientCommands = await application.commands.fetch()
      await Promise.all(
        clientCommands.map(async (c) => {
          await application.commands.delete(c.id)
        }),
      )
    }
  }

  private async messageComponentExecute(
    interaction: Interaction,
  ): Promise<void> {
    if (!interaction.isModalSubmit() && !interaction.isMessageComponent())
      return
    const interactionExecute = this.cache.get(interaction.customId)
    if (!interactionExecute || !interactionExecute.execute) return

    switch (interactionExecute.type) {
      case ComponentType.Button:
        if (interaction.isButton())
          await interactionExecute.execute(interaction)
        break
      case ComponentType.StringSelect:
        if (interaction.isStringSelectMenu())
          await interactionExecute.execute(interaction)
        break
      case ComponentType.UserSelect:
        if (interaction.isUserSelectMenu())
          await interactionExecute.execute(interaction)
        break
      case ComponentType.RoleSelect:
        if (interaction.isRoleSelectMenu())
          await interactionExecute.execute(interaction)
        break
      case ComponentType.ChannelSelect:
        if (interaction.isChannelSelectMenu())
          await interactionExecute.execute(interaction)
        break
      case ComponentType.MentionableSelect:
        if (interaction.isMentionableSelectMenu())
          await interactionExecute.execute(interaction)
        break
      case ComponentType.TextInput:
        if (interaction.isModalSubmit())
          await interactionExecute.execute(interaction)
        break
    }
  }

  private async commandExecute(interaction: Interaction): Promise<void> {
    if (!interaction.isCommand()) return
    const command = this.commands.get(interaction.commandName)
    if (!command || !command.execute) return

    switch (command.type) {
      case ApplicationCommandType.User:
        if (interaction.isUserContextMenuCommand())
          await command.execute(interaction)
        break
      case ApplicationCommandType.Message:
        if (interaction.isMessageContextMenuCommand())
          await command.execute(interaction)
        break
      default:
        if (interaction.isChatInputCommand()) await command.execute(interaction)
        break
    }
  }

  private async autoCompleteExecute(interaction: Interaction): Promise<void> {
    if (!interaction.isAutocomplete()) return
    const command = this.commands.get(interaction.commandName)
    if (
      !command ||
      (command.type !== ApplicationCommandType.ChatInput &&
        command.type !== undefined)
    )
      return
    if (!command || !command.autoComplete) return

    await command.autoComplete(interaction)
  }
}
