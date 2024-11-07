import {
  ComponentType,
  RoleSelectMenuBuilder as OriginRoleSelectMenuBuilder,
} from 'discord.js'

import { InteractionManager } from '@/clients/InteractionManager'
import {
  RoleSelectMenuComponentData,
  RoleSelectMenuInteractionExecute,
} from '@/types'

export class RoleSelectMenuBuilder extends OriginRoleSelectMenuBuilder {
  private _customId?: string

  constructor(
    private interactionManager: InteractionManager,
    data?: RoleSelectMenuComponentData,
  ) {
    super(Object.assign({ type: ComponentType.RoleSelect }, data))
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

  public setExecute(execute: RoleSelectMenuInteractionExecute): this {
    this._execute = execute
    this.setCache()
    return this
  }

  private _execute: RoleSelectMenuInteractionExecute = async () => {}

  private setCache(): void {
    if (!this._customId) return
    this.interactionManager.set(this._customId, {
      type: ComponentType.RoleSelect,
      customId: this._customId,
      execute: this._execute,
    })
  }
}
