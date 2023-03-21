const Hardware = {
    CPU: 'CPU',
    PPU: 'PPU',
    Cartridge: 'Cartridge',
}

class DataBus {
    constructor() {
        this.init()
    }

    static new() {
        let i = new this()
        return i
    }

    init() {
        this.memory = {
            // CPU内存大小
            [Hardware.CPU]: new Array(1024 * 64), // 64KB
            // PPU内存大小
            [Hardware.PPU]: new Array(1024 * 64), // 64KB
            // cartridge大小
            [Hardware.Cartridge]: [],
        }
    }

    /**
     * @param { String } hardware - 存入的硬件
     * @param { number } address - 存入内存的起始位置
     * @param { Array } data - 待存入的数据
     */
    setMemoryBlock(hardware, address, data) {
        let m = this.memory[hardware]

        let m1 = m.slice(0, address)
        let l = data.length
        let m2 = m.slice(address + l)

        m = m1.concat(data, m2)
        this.memory[hardware] = m
    }
    setMemoryBlockCPU(address, data) {
        this.setMemoryBlock(Hardware.CPU, address, data)
    }
    setMemoryBlockPPU(address, data) {
        this.setMemoryBlock(Hardware.PPU, address, data)
    }
    /**
     * @param { String } hardware - 存入的硬件
     * @param { number } address - 存入内存的起始位置
     * @param { number } data - 待存入的数据
     */
    setMemory(hardware, address, data) {
        let v = byteTrimmed(data)
        this.memory[hardware][address] = v
    }
    getMemory(hardware, address) {
        let v = this.memory[hardware][address]
        return v
    }
    getMemoryBlock(hardware, addressStart, addressEnd) {
        let b = this.memory[hardware].slice(addressStart, addressEnd + 1)
        return b
    }
    getMemoryBlockCPU(addressStart, addressEnd) {
        let b = this.getMemoryBlock(Hardware.CPU, addressStart, addressEnd)
        return b
    }
    getMemoryBlockPPU(addressStart, addressEnd) {
        let b = this.getMemoryBlock(Hardware.PPU, addressStart, addressEnd)
        return b
    }

    getMemorySizeCPU() {
        let l = this.memory[Hardware.CPU].length
        return l
    }
    /**
     * @param { number } data - 待存入的数据
     * @param { number } address - 存入内存的起始位置
     */
    writeCPU(address, data) {
        // 处理PPU Register
        let ppuRegisterAddress = [
            0x2000,
            0x2001,
            0x2002,
            0x2003,
            0x2004,
            0x2005,
            0x2006,
            0x2007,
            0x4014,
        ]
        if (ppuRegisterAddress.includes(address)) {
            this.writePPU(address, data)
        } else {
            this.setMemory(Hardware.CPU, data, address)
        }
    }
    readCPU(address) {
        let v = this.getMemory(Hardware.CPU, address)
        return v
    }

    writePPU() {}
}