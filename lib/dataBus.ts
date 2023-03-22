import { injectable } from 'inversify'
const Hardware = {
    CPU: 'CPU',
    PPU: 'PPU',
    Cartridge: 'Cartridge',
}

@injectable()
export class DataBus {
    private memory = {
        // CPU内存大小
        [Hardware.CPU]: new Array(1024 * 64), // 64KB
        // PPU内存大小
        [Hardware.PPU]: new Array(1024 * 64), // 64KB
        // cartridge大小
        [Hardware.Cartridge]: [],
    }

    /**
     * @param { String } hardware - 存入的硬件
     * @param { number } address - 存入内存的起始位置
     * @param { Array } data - 待存入的数据
     */
    public setMemoryBlock(hardware: any, address: any, data: any) {
        let m = this.memory[hardware]

        let m1 = m.slice(0, address)
        let l = data.length
        let m2 = m.slice(address + l)

        m = m1.concat(data, m2)
        this.memory[hardware] = m
    }
    public setMemoryBlockCPU(address: any, data: any) {
        this.setMemoryBlock(Hardware.CPU, address, data)
    }
    public setMemoryBlockPPU(address: any, data: any) {
        this.setMemoryBlock(Hardware.PPU, address, data)
    }
    /**
     * @param { String } hardware - 存入的硬件
     * @param { number } address - 存入内存的起始位置
     * @param { number } data - 待存入的数据
     */
    public setMemory(hardware: any, address: any, data: any) {
        let v = byteTrimmed(data)
        this.memory[hardware][address] = v
    }
    public getMemory(hardware: any, address: any) {
        let v = this.memory[hardware][address]
        return v
    }
    public getMemoryBlock(hardware: any, addressStart: any, addressEnd: any) {
        let b = this.memory[hardware].slice(addressStart, addressEnd + 1)
        return b
    }
    public getMemoryBlockCPU(addressStart: any, addressEnd: any) {
        let b = this.getMemoryBlock(Hardware.CPU, addressStart, addressEnd)
        return b
    }
    public getMemoryBlockPPU(addressStart: any, addressEnd: any) {
        let b = this.getMemoryBlock(Hardware.PPU, addressStart, addressEnd)
        return b
    }

    public getMemorySizeCPU() {
        let l = this.memory[Hardware.CPU].length
        return l
    }
    /**
     * @param { number } data - 待存入的数据
     * @param { number } address - 存入内存的起始位置
     */
    public writeCPU(address: any, data: any) {
        // 处理PPU Register
        let ppuRegisterAddress = [
            0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007,
            0x4014,
        ]
        if (ppuRegisterAddress.includes(address)) {
            this.writePPU(address, data)
        } else {
            this.setMemory(Hardware.CPU, address, data)
        }
    }
    public readCPU(address: any) {
        let v = this.getMemory(Hardware.CPU, address)
        return v
    }

    public writePPU(...o: any) {
        // TODO
    }
}
