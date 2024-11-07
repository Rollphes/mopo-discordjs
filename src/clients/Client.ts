import { Client as OriginClient } from 'discord.js'

import { InteractionManager } from '@/clients/InteractionManager'

export class Client extends OriginClient {
  public interactions: InteractionManager = new InteractionManager(this)
}
