import {
  ComponentType,
  MentionableSelectMenuBuilder as OriginMentionableSelectMenuBuilder,
} from 'discord.js'

import { InteractionManager } from '@/clients/InteractionManager'
import {
  MentionableSelectMenuComponentData,
  MentionableSelectMenuInteractionExecute,
} from '@/types'

export class MentionableSelectMenuBuilder extends OriginMentionableSelectMenuBuilder {
  private _customId?: string

  constructor(
    private interactionManager: InteractionManager,
    data?: MentionableSelectMenuComponentData,
  ) {
    super(Object.assign({ type: ComponentType.MentionableSelect }, data))
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

  public setExecute(execute: MentionableSelectMenuInteractionExecute): this {
    this._execute = execute
    this.setCache()
    return this
  }

  private _execute: MentionableSelectMenuInteractionExecute = async () => {}

  private setCache(): void {
    if (!this._customId) return
    this.interactionManager.set(this._customId, {
      type: ComponentType.MentionableSelect,
      customId: this._customId,
      execute: this._execute,
    })
  }
}
