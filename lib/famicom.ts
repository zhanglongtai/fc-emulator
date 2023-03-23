import { injectable } from 'inversify'

@injectable()
export class Famicom {
    private paused: boolean = false
    private actions: Record<any, any> = {}
    private keydown: Record<any, any> = {}
    public registerAction(key: any, callback: any) {
        this.actions[key] = callback
    }

    public update() {}

    public render() {}

    public runLoop() {
        this.update()
        this.render()
    }

    public run() {
        let actions = Object.keys(this.actions)
        for (let i = 0; i < actions.length; i++) {
            let key = actions[i]
            if (this.keydown[key]) {
                log(this.keydown[key], key)
                // 如果按键被按下, 调用注册的 action
                this.actions[key]()
            }
        }

        setInterval(() => {
            if (!this.paused) {
                this.runLoop()
            }
        }, 1000 / 1000)
    }
}
