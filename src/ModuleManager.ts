import {
  ApplicationCommandType,
  Client,
  Interaction,
  Snowflake,
} from 'discord.js'
import fs from 'fs'
import path from 'path'

import { BaseModule } from '@/BaseModule'
import { ApplicationCommandData, ComponentData, ComponentType } from '@/types'

type ModuleNodeModule = {
  default?: new (client: Client, moduleManager: ModuleManager) => BaseModule
}

type CommandNodeModule = {
  default?: ApplicationCommandData
}

type ComponentNodeModule = {
  default?: ComponentData
}

export class ModuleManager {
  private isInitialized: boolean = false
  private components: Map<string, ComponentData> = new Map()
  private commands: Map<string, ApplicationCommandData> = new Map()
  private modules: Map<string, BaseModule> = new Map()

  constructor(private client: Client) {}

  public async init(appPath: string, guildId?: string): Promise<void> {
    if (this.isInitialized)
      throw new Error('ModuleManager is already initialized')

    const sourceFilePaths = fs
      .readdirSync(appPath, {
        recursive: true,
        encoding: 'utf8',
        withFileTypes: true,
      })
      .filter((file) => file.isFile() && path.extname(file.name) === '.ts')
      .map((file) => path.join(file.parentPath, file.name))
    console.log('-- Initializing modules --')
    await this.initModules(sourceFilePaths)
    console.log('-- Initializing commands --')
    await this.initCommands(sourceFilePaths, guildId)
    console.log('-- Initializing components --')
    await this.initComponents(sourceFilePaths)
    this.isInitialized = true
  }

  public has(name: string): boolean {
    return this.modules.has(name)
  }

  public async interactionExecute(interaction: Interaction): Promise<void> {
    await Promise.all([
      this.messageComponentExecute(interaction),
      this.autoCompleteExecute(interaction),
      this.commandExecute(interaction),
    ])
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

  private async initModules(sourceFilePaths: string[]): Promise<void> {
    const moduleFilePaths = sourceFilePaths.filter((filePath) => {
      const content = fs.readFileSync(filePath, 'utf8')
      return /export\s+default\s+class\s+[\s\S]*?\s+extends\s+BaseModule/g.test(
        content,
      )
    })

    await Promise.all(
      moduleFilePaths.map(async (filePath) => {
        try {
          const module = (await import(filePath)) as ModuleNodeModule
          if (module.default) {
            const moduleName = module.default.name
            this.modules.set(moduleName, new module.default(this.client, this))
            await this.modules.get(moduleName)?.init()
            console.log('✅️ :', moduleName)
          } else {
            throw new Error(
              `Module in ${filePath} does not have a valid default export`,
            )
          }
        } catch (e) {
          console.error('❌ :', filePath)
          throw e
        }
      }),
    )
  }

  private async initCommands(
    sourceFilePaths: string[],
    guildId?: string,
  ): Promise<void> {
    const commandFilePaths = sourceFilePaths.filter((filePath) => {
      const content = fs.readFileSync(filePath, 'utf8')
      return /export\s+default\s+\{[\s\S]*?\}\s+as\s+const\s+satisfies\s+(ApplicationCommandData|UserApplicationCommandData|MessageApplicationCommandData|ChatInputApplicationCommandData)/g.test(
        content,
      )
    })

    const commands = await Promise.all(
      commandFilePaths.map(async (filePath) => {
        try {
          const commandModule = (await import(filePath)) as CommandNodeModule
          if (commandModule.default) {
            if (!('execute' in commandModule.default)) {
              throw new Error(
                `Command in ${filePath} does not have a valid execute function`,
              )
            }
            console.log('✅️ :', commandModule.default.name)
            return commandModule.default
          } else {
            throw new Error(
              `Command in ${filePath} does not have a valid default export`,
            )
          }
        } catch (e) {
          console.error('❌ :', filePath)
          throw e
        }
      }),
    )

    commands.forEach((command) => {
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
    if (guildId) await this.client.application.commands.set(commands, guildId)
    else await this.client.application.commands.set(commands)
  }

  private async initComponents(sourceFilePaths: string[]): Promise<void> {
    const componentFilePaths = sourceFilePaths.filter((filePath) => {
      const content = fs.readFileSync(filePath, 'utf8')
      return /export\s+default\s+\{[\s\S]*?\}\s+as\s+const\s+satisfies\s+(ComponentData|MessageComponentData|SelectMenuComponentData|ButtonComponentData|ChannelSelectMenuComponentData|MentionableSelectMenuComponentData|ModalComponentData|RoleSelectMenuComponentData|StringSelectMenuComponentData|UserSelectMenuComponentData)/g.test(
        content,
      )
    })

    await Promise.all(
      componentFilePaths.map(async (filePath) => {
        try {
          const componentModule = (await import(
            filePath
          )) as ComponentNodeModule
          if (componentModule.default) {
            if (!('execute' in componentModule.default)) {
              throw new Error(
                `Component in ${filePath} does not have a valid execute function`,
              )
            }
            if (!componentModule.default.execute) return
            console.log('✅️ :', componentModule.default.customId)
            this.components.set(
              componentModule.default.customId,
              componentModule.default,
            )
          } else {
            throw new Error(
              `Component in ${filePath} does not have a valid default export`,
            )
          }
        } catch (e) {
          console.error('❌ :', filePath)
          throw e
        }
      }),
    )
  }

  private async messageComponentExecute(
    interaction: Interaction,
  ): Promise<void> {
    if (!interaction.isModalSubmit() && !interaction.isMessageComponent())
      return
    const interactionExecute = this.components.get(interaction.customId)
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
      case ComponentType.Modal:
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
