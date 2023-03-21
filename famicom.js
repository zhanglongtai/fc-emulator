class Famicom {
    constructor() {
        this.init()
    }

    static new() {
        let i = new this()
        return i
    }

    init() {
        this.paused = false
        this.actions = {}
        this.keydown = {}

        // events
        window.addEventListener('keydown', (event) => {
            this.keydown[event.key] = true
        })
        window.addEventListener('keyup', (event) => {
            this.keydown[event.key] = false
        })
        //
        this.registerAction = (key, callback) => {
            this.actions[key] = callback
        }
    }

    update() {}

    render() {}

    runLoop() {
        this.update()
        this.render()
    }

    run() {
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
        }, 1000/1000)
    }
}
