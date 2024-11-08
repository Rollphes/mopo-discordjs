import { ComponentType, ModalBuilder as OriginModalBuilder } from 'discord.js'

import { InteractionManager } from '@/clients/InteractionManager'
import { ModalComponentData, ModalSubmitInteractionExecute } from '@/types'

export class ModalBuilder extends OriginModalBuilder {
  private _customId?: string

  constructor(
    private interactionManager: InteractionManager,
    data?: ModalComponentData,
  ) {
    const modalData = data
      ? {
          customId: data.customId,
          title: data.title,
          components: data.components.map((component) => {
            return {
              type: ComponentType.ActionRow,
              components: [
                Object.assign({ type: ComponentType.TextInput }, component),
              ],
            }
          }),
        }
      : undefined
    super(modalData)
    if (!data) return
    this._customId = data.customId
    if (!data.execute) return this
    this._execute = data.execute
    this.setCache()
  }

  public override setCustomId(customId: string): this {
    this._customId = customId
    super.setCustomId(this._customId)
    this.setCache()
    return this
  }

  public setExecute(execute: ModalSubmitInteractionExecute): this {
    this._execute = execute
    this.setCache()
    return this
  }

  private _execute: ModalSubmitInteractionExecute = async () => {}

  private setCache(): void {
    if (!this._customId) return
    this.interactionManager.set(this._customId, {
      type: ComponentType.TextInput,
      customId: this._customId,
      execute: this._execute,
    })
  }
}
