import { Client } from 'discord.js'

import { ModuleManager } from '@/ModuleManager'

export abstract class BaseModule {
  protected constructor(
    public client: Client,
    moduleManager: ModuleManager,
  ) {
    if (moduleManager.has(this.constructor.name))
      throw new Error(`Module ${this.constructor.name} is already initialized`)
  }

  public abstract init(): Promise<void> | void
}
