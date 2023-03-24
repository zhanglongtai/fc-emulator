import { CPU, createIOC } from './index'

class NES {
    #ioc = createIOC()
    constructor() {}
    public getCPU() {
        return this.#ioc.get(CPU)
    }
}

export const createNES = () => {
    return new NES()
}
