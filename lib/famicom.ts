import { injectable, inject } from 'inversify'
import { EventBus } from './event-bus'
import { Inspector } from './inspector'

@injectable()
export class Famicom {
    constructor(
        @inject(Inspector) private inspector: Inspector,
        @inject(EventBus) private eventBus: EventBus
    ) {
        this.eventBus.once('destroy', () => {
            this.destroy()
        })
    }
    private paused: boolean = false
    private actions: Record<any, any> = {}
    private keydown: Record<any, any> = {}
    public registerAction(key: any, callback: any) {
        this.actions[key] = callback
    }
    private interval: ReturnType<typeof setInterval> | null = null

    public update() {}

    public render() {}

    public runLoop() {
        this.update()
        this.render()
    }
    private destroy() {
        if (this.interval) {
            clearInterval(this.interval)
        }
    }

    public run() {
        let actions = Object.keys(this.actions)
        for (let i = 0; i < actions.length; i++) {
            let key = actions[i]
            if (this.keydown[key]) {
                this.inspector.log(this.keydown[key], key)
                // 如果按键被按下, 调用注册的 action
                this.actions[key]()
            }
        }

        this.interval = setInterval(() => {
            if (!this.paused) {
                this.runLoop()
            }
        }, 1000 / 1000)
    }
}
