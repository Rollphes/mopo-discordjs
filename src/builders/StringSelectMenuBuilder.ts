import {
  ComponentType,
  StringSelectMenuBuilder as OriginStringSelectMenuBuilder,
} from 'discord.js'

import { InteractionManager } from '@/clients/InteractionManager'
import {
  StringSelectMenuComponentData,
  StringSelectMenuInteractionExecute,
} from '@/types'

export class StringSelectMenuBuilder extends OriginStringSelectMenuBuilder {
  private _customId?: string

  constructor(
    private interactionManager: InteractionManager,
    data?: StringSelectMenuComponentData,
  ) {
    super(Object.assign({ type: ComponentType.StringSelect }, data))
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

  public setExecute(execute: StringSelectMenuInteractionExecute): this {
    this._execute = execute
    this.setCache()
    return this
  }

  private _execute: StringSelectMenuInteractionExecute = async () => {}

  private setCache(): void {
    if (!this._customId) return
    this.interactionManager.set(this._customId, {
      type: ComponentType.StringSelect,
      customId: this._customId,
      execute: this._execute,
    })
  }
}
