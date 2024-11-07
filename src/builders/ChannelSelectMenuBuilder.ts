import {
  ChannelSelectMenuBuilder as OriginChannelSelectMenuBuilder,
  ComponentType,
} from 'discord.js'

import { InteractionManager } from '@/clients/InteractionManager'
import {
  ChannelSelectMenuComponentData,
  ChannelSelectMenuInteractionExecute,
} from '@/types'

export class ChannelSelectMenuBuilder extends OriginChannelSelectMenuBuilder {
  private _customId?: string

  constructor(
    private interactionManager: InteractionManager,
    data?: ChannelSelectMenuComponentData,
  ) {
    super(Object.assign({ type: ComponentType.ChannelSelect }, data))
    if (!data) return
    this._customId = data.customId
    if (!data.execute) return
    this._execute = data.execute
    this.setCache()
  }

  public override setCustomId(customId: string): this {
    this._customId = customId
    super.setCustomId(this._customId)
    this.setCache()
    return this
  }

  public setExecute(execute: ChannelSelectMenuInteractionExecute): this {
    this._execute = execute
    this.setCache()
    return this
  }

  private _execute: ChannelSelectMenuInteractionExecute = async () => {}

  private setCache(): void {
    if (!this._customId) return
    this.interactionManager.set(this._customId, {
      type: ComponentType.ChannelSelect,
      customId: this._customId,
      execute: this._execute,
    })
  }
}
