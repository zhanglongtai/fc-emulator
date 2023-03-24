import { CPU, createIOC, Famicom, PPU, EventBus } from './index'
import { Inspector } from './inspector'

export class NES {
    #ioc = createIOC()
    constructor() {}
    // start 内部的细节暴露给外部并不是合理的方案
    public getPPU() {
        return this.#ioc.get(PPU)
    }
    public getCPU() {
        return this.#ioc.get(CPU)
    }
    public getFamicom() {
        return this.#ioc.get(Famicom)
    }
    public destroy() {
        return this.#ioc.get(EventBus).emit('destroy')
    }
    public disableLog() {
        return this.#ioc.get(Inspector).disabledLog()
    }

    // end 这是一个过渡的方案
}

export const createNES = () => {
    return new NES()
}
