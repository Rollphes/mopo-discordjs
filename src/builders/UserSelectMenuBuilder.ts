import {
  ComponentType,
  UserSelectMenuBuilder as OriginUserSelectMenuBuilder,
} from 'discord.js'

import { InteractionManager } from '@/clients/InteractionManager'
import {
  UserSelectMenuComponentData,
  UserSelectMenuInteractionExecute,
} from '@/types'

export class UserSelectMenuBuilder extends OriginUserSelectMenuBuilder {
  private _customId?: string

  constructor(
    private interactionManager: InteractionManager,
    data?: UserSelectMenuComponentData,
  ) {
    super(Object.assign({ type: ComponentType.UserSelect }, data))
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

  public setExecute(execute: UserSelectMenuInteractionExecute): this {
    this._execute = execute
    this.setCache()
    return this
  }

  private _execute: UserSelectMenuInteractionExecute = async () => {}

  private setCache(): void {
    if (!this._customId) return
    this.interactionManager.set(this._customId, {
      type: ComponentType.UserSelect,
      customId: this._customId,
      execute: this._execute,
    })
  }
}
