import {
  ButtonBuilder as OriginButtonBuilder,
  ButtonStyle,
  ComponentType,
} from 'discord.js'

import { InteractionManager } from '@/clients/InteractionManager'
import { ButtonComponentData, ButtonInteractionExecute } from '@/types'

export class ButtonBuilder extends OriginButtonBuilder {
  private _customId?: string

  constructor(
    private interactionManager: InteractionManager,
    data?: ButtonComponentData,
  ) {
    super(Object.assign({ type: ComponentType.Button }, data))
    if (!data) return
    if (data.style === ButtonStyle.Link) return
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

  public setExecute(execute: ButtonInteractionExecute): this {
    this._execute = execute
    this.setCache()
    return this
  }

  private _execute: ButtonInteractionExecute = async () => {}

  private setCache(): void {
    if (
      (this.data.style as ButtonStyle) === ButtonStyle.Link ||
      !this._customId
    )
      return
    this.interactionManager.set(this._customId, {
      type: ComponentType.Button,
      customId: this._customId,
      execute: this._execute,
    })
  }
}
