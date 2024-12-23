import { Client } from 'discord.js'

export abstract class BaseModule {
  protected constructor(public client: Client) {}

  public abstract init(): Promise<void> | void
}
