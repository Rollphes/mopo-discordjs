/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  APIModalInteractionResponseCallbackData,
  ApplicationCommandType,
  Client,
  Interaction,
  JSONEncodable,
  ModalBuilder,
  ModalComponentData,
  Snowflake,
} from 'discord.js'
import fs from 'fs'
import path from 'path'

import { BaseModule } from '@/BaseModule'
import { ApplicationCommandData, ComponentData, ComponentType } from '@/types'

type ModuleNodeModule = {
  default?: new (client: Client) => BaseModule
}

type CommandNodeModule = {
  default?: ApplicationCommandData<BaseModule | undefined>
}

type ComponentNodeModule = {
  default?: ComponentData<BaseModule | undefined>
}

export class ModuleManager {
  private static customIdParentIdSeparator: string = '-ParentId:'
  private isInitialized: boolean = false
  private components: Map<string, ComponentData<BaseModule | undefined>> =
    new Map()
  private componentModuleNames: Map<string, string | undefined> = new Map()
  private commands: Map<
    string,
    ApplicationCommandData<BaseModule | undefined>
  > = new Map()
  private commandModuleNames: Map<string, string | undefined> = new Map()
  private modules: Map<string, BaseModule> = new Map()
  private parentInteractionMap: Map<string, Interaction> = new Map()

  constructor(
    private client: Client,
    private importLinter: (fileUrl: string) => Promise<any>,
  ) {}

  public async init(appPath: string, guildId?: string): Promise<void> {
    if (this.isInitialized)
      throw new Error('ModuleManager is already initialized')

    const sourceFileUrls = fs
      .readdirSync(appPath, {
        recursive: true,
        encoding: 'utf8',
        withFileTypes: true,
      })
      .filter((file) => file.isFile() && path.extname(file.name) === '.ts')
      .map((file) => path.join(file.parentPath, file.name))
    console.log('-- Initializing modules --')
    await this.initModules(sourceFileUrls)
    console.log('-- Initializing commands --')
    await this.initCommands(sourceFileUrls, guildId)
    console.log('-- Initializing components --')
    await this.initComponents(sourceFileUrls)
    this.isInitialized = true
  }

  public async interactionExecute(interaction: Interaction): Promise<void> {
    this.addParentInteraction(interaction)
    await Promise.all([
      this.componentExecute(interaction),
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

  private async initModules(sourceFileUrls: string[]): Promise<void> {
    const moduleFileUrls = sourceFileUrls.filter((fileUrl) => {
      const content = this.removeComments(fs.readFileSync(fileUrl, 'utf8'))
      return /(?<!\/\/\s*)export\s+default\s+class\s+[\s\S]*?\s+extends\s+BaseModule/g.test(
        content,
      )
    })

    await Promise.all(
      moduleFileUrls.map(async (fileUrl) => {
        try {
          const module = (await this.importLinter(fileUrl)) as ModuleNodeModule
          if (module.default) {
            const moduleName = module.default.name
            this.modules.set(moduleName, new module.default(this.client))
            await this.modules.get(moduleName)?.init()
            console.log('✅️ :', moduleName)
          } else {
            throw new Error(
              `Module in ${fileUrl} does not have a valid default export`,
            )
          }
        } catch (e) {
          console.error('❌ :', fileUrl)
          throw e
        }
      }),
    )
  }

  private async initCommands(
    sourceFileUrls: string[],
    guildId?: string,
  ): Promise<void> {
    const commandFile = sourceFileUrls
      .map((fileUrl) => {
        const content = this.removeComments(fs.readFileSync(fileUrl, 'utf8'))

        const isCorrect =
          /(?<!\/\/\s*)export\s+default\s+\{[\s\S]*?(?<!\/\/\s*)\}\s+as\s+const\s+satisfies\s+(ApplicationCommandData|UserApplicationCommandData|MessageApplicationCommandData|ChatInputApplicationCommandData)/g.test(
            content,
          )
        const moduleName =
          /(?<=(?<!\/\/\s*)}\s+as\s+const\s+satisfies\s+(ApplicationCommandData|UserApplicationCommandData|MessageApplicationCommandData|ChatInputApplicationCommandData)<)[^,>]+/g.exec(
            content,
          )
        return {
          url: isCorrect ? fileUrl : undefined,
          moduleName: moduleName
            ? moduleName[0].replace(/(\s|\n)*/g, '')
            : undefined,
        }
      })
      .filter(
        (file): file is { url: string; moduleName: string | undefined } => {
          return file.url !== undefined
        },
      )

    const commands = await Promise.all(
      commandFile.map(async (file) => {
        try {
          const commandModule = (await this.importLinter(
            file.url,
          )) as CommandNodeModule
          if (commandModule.default) {
            if (!('execute' in commandModule.default)) {
              throw new Error(
                `Command in ${file.url} does not have a valid execute function`,
              )
            }
            console.log('✅️ :', commandModule.default.name)
            this.commandModuleNames.set(
              commandModule.default.name,
              file.moduleName,
            )
            return commandModule.default
          } else {
            throw new Error(
              `Command in ${file.url} does not have a valid default export`,
            )
          }
        } catch (e) {
          console.error('❌ :', file.url)
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

  private async initComponents(sourceFileUrls: string[]): Promise<void> {
    const componentFile = sourceFileUrls
      .map((fileUrl) => {
        const content = this.removeComments(fs.readFileSync(fileUrl, 'utf8'))
        const isCorrect =
          /(?<!\/\/\s*)export\s+default\s+\{[\s\S]*?(?<!\/\/\s*)\}\s+as\s+const\s+satisfies\s+(ComponentData|MessageComponentData|SelectMenuComponentData|ButtonComponentData|ChannelSelectMenuComponentData|MentionableSelectMenuComponentData|ModalComponentData|RoleSelectMenuComponentData|StringSelectMenuComponentData|UserSelectMenuComponentData)/g.test(
            content,
          )
        const moduleName =
          /(?<=(?<!\/\/\s*)}\s+as\s+const\s+satisfies\s+(ComponentData|MessageComponentData|SelectMenuComponentData|ButtonComponentData|ChannelSelectMenuComponentData|MentionableSelectMenuComponentData|ModalComponentData|RoleSelectMenuComponentData|StringSelectMenuComponentData|UserSelectMenuComponentData)<)[^,>]+/g.exec(
            content,
          )
        return {
          url: isCorrect ? fileUrl : undefined,
          moduleName: moduleName
            ? moduleName[0].replace(/(\s|\n)*/g, '')
            : undefined,
        }
      })
      .filter(
        (file): file is { url: string; moduleName: string | undefined } => {
          return file.url !== undefined
        },
      )

    await Promise.all(
      componentFile.map(async (file) => {
        try {
          const componentModule = (await this.importLinter(
            file.url,
          )) as ComponentNodeModule
          if (componentModule.default) {
            if (!('execute' in componentModule.default)) {
              throw new Error(
                `Component in ${file.url} does not have a valid execute function`,
              )
            }
            if (!componentModule.default.execute) return
            console.log('✅️ :', componentModule.default.customId)
            this.components.set(
              componentModule.default.customId,
              componentModule.default,
            )
            this.componentModuleNames.set(
              componentModule.default.customId,
              file.moduleName,
            )
          } else {
            throw new Error(
              `Component in ${file.url} does not have a valid default export`,
            )
          }
        } catch (e) {
          console.error('❌ :', file.url)
          throw e
        }
      }),
    )
  }

  private removeComments(content: string): string {
    return content
      .replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*[\r\n]/gm, '')
  }

  private async componentExecute(interaction: Interaction): Promise<void> {
    if (!interaction.isModalSubmit() && !interaction.isMessageComponent())
      return

    const customId = interaction.customId.split(
      ModuleManager.customIdParentIdSeparator,
    )[0]

    const interactionExecute = this.components.get(customId)
    if (!interactionExecute || !interactionExecute.execute) return
    const moduleName = this.componentModuleNames.get(customId)
    const module = moduleName ? this.modules.get(moduleName) : undefined

    switch (interactionExecute.type) {
      case ComponentType.Button:
        if (interaction.isButton())
          await interactionExecute.execute(interaction, module)
        break
      case ComponentType.StringSelect:
        if (interaction.isStringSelectMenu())
          await interactionExecute.execute(interaction, module)
        break
      case ComponentType.UserSelect:
        if (interaction.isUserSelectMenu())
          await interactionExecute.execute(interaction, module)
        break
      case ComponentType.RoleSelect:
        if (interaction.isRoleSelectMenu())
          await interactionExecute.execute(interaction, module)
        break
      case ComponentType.ChannelSelect:
        if (interaction.isChannelSelectMenu())
          await interactionExecute.execute(interaction, module)
        break
      case ComponentType.MentionableSelect:
        if (interaction.isMentionableSelectMenu())
          await interactionExecute.execute(interaction, module)
        break
      case ComponentType.Modal:
        if (interaction.isModalSubmit()) {
          const parentInteraction = this.parentInteractionMap.get(
            interaction.customId.split(
              ModuleManager.customIdParentIdSeparator,
            )[1],
          )
          await interactionExecute.execute(
            interaction,
            parentInteraction,
            module,
          )
          this.parentInteractionMap.delete(interaction.customId)
        }
        break
    }
  }

  private async commandExecute(interaction: Interaction): Promise<void> {
    if (!interaction.isCommand()) return
    const command = this.commands.get(interaction.commandName)
    if (!command || !command.execute) return
    const moduleName = this.commandModuleNames.get(interaction.commandName)
    const module = moduleName ? this.modules.get(moduleName) : undefined

    switch (command.type) {
      case ApplicationCommandType.User:
        if (interaction.isUserContextMenuCommand())
          await command.execute(interaction, module)
        break
      case ApplicationCommandType.Message:
        if (interaction.isMessageContextMenuCommand())
          await command.execute(interaction, module)
        break
      default:
        if (interaction.isChatInputCommand())
          await command.execute(interaction, module)
        break
    }
  }

  private async autoCompleteExecute(interaction: Interaction): Promise<void> {
    if (!interaction.isAutocomplete()) return
    const command = this.commands.get(interaction.commandName)
    const moduleName = this.commandModuleNames.get(interaction.commandName)
    const module = moduleName ? this.modules.get(moduleName) : undefined

    if (
      !command ||
      (command.type !== ApplicationCommandType.ChatInput &&
        command.type !== undefined)
    )
      return
    if (!command || !command.autoComplete) return

    await command.autoComplete(interaction, module)
  }

  private addParentInteraction(interaction: Interaction): void {
    if (interaction.isModalSubmit() || interaction.isAutocomplete()) return
    const originalShowModal = interaction.showModal
    interaction.showModal = async (
      modal:
        | JSONEncodable<APIModalInteractionResponseCallbackData>
        | ModalComponentData
        | APIModalInteractionResponseCallbackData,
    ): Promise<void> => {
      this.parentInteractionMap.set(interaction.id, interaction)
      if ('custom_id' in modal) {
        return originalShowModal.call(
          interaction,
          Object.assign(modal, {
            customId: `${modal.custom_id}${ModuleManager.customIdParentIdSeparator}${interaction.id}`,
          }),
        )
      }
      if ('customId' in modal) {
        return originalShowModal.call(
          interaction,
          Object.assign(modal, {
            customId: `${modal.customId}${ModuleManager.customIdParentIdSeparator}${interaction.id}`,
          }),
        )
      }
      if (modal instanceof ModalBuilder) {
        modal.setCustomId(
          `${modal.data.custom_id}${ModuleManager.customIdParentIdSeparator}${interaction.id}`,
        )
        return originalShowModal.call(interaction, modal)
      }
    }
  }
}
