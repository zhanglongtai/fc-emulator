import { injectable } from 'inversify'
import { TinyEmitter } from 'tiny-emitter'

@injectable()
export class EventBus extends TinyEmitter {}
