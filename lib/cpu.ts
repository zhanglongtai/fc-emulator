import { injectable } from 'inversify'
import { DataBus } from './dataBus'
import { RegisterCPU } from './const'
import {
    binaryStringFromNumber,
    byteTrimmed,
    hexStringFromNumber,
    positiveByteFromMinus,
    signedNumberFromByte,
    stringFixedLength,
} from './utils'
import { Inspector } from './inspector'
import { AddressingMode, opcodes } from './opcodes'
// const RegisterCPU = {
//     PC: 'PC',
//     SP: 'SP',
//     P: 'P',
//     A: 'A',
//     X: 'X',
//     Y: 'Y',
// }

const Flag = {
    C: 'C',
    Z: 'Z',
    I: 'I',
    D: 'D',
    B: 'B',
    V: 'V',
    N: 'N',
}
const flagBit = {
    [Flag.C]: 0,
    [Flag.Z]: 1,
    [Flag.I]: 2,
    [Flag.D]: 3,
    [Flag.B]: 4,
    [Flag.V]: 6,
    [Flag.N]: 7,
}

@injectable()
export class CPU {
    /**
     * @param { DataBus } dataBus - DataBus实例
     */
    constructor(dataBus: DataBus) {
        this.dataBus = dataBus
        this.init()
    }

    init() {
        // 内存大小
        this.memory = []
        this.memory = new Array(1024 * 64) // 64KB

        // 内存分配
        this.indexOfInternalRAM = 0x0000 // size $0800, 2KB internal RAM $0000-$07FF
        this.indexStackHigh = 0x01ff // stack 0x0100 - 0x01FF
        this.indexStackLow = 0x0100
        // Mirrors of $0000-$07FF
        this.indexOfMirror1 = 0x0800 // $0800-$0FFF, size $0800
        this.indexOfMirror2 = 0x1000 // $1000-$17FF, size $0800
        this.indexOfMirror3 = 0x1800 // $1800-$1FFF, size $0800
        this.indexOfPPURegisters = 0x2000 // $2000-$2007, size $0008
        this.indexOfMirror4 = 0x2008 // Mirrors of $2000-2007 (repeats every 8 bytes)
        this.indexOfAPUReigsters = 0x4000 // $4000-$4017	$0018	NES APU and I/O registers
        this.indexOfAPUFunctionality = 0x4018 // $4018-$401F	$0008	APU and I/O functionality that is normally disabled. See CPU Test Mode.
        // Cartridge space: PRG ROM, PRG RAM, and mapper registers (See Note)
        this.indexCartridge = 0x4020 // $4020-$FFFF, size $BFE0
        this.indexPRGROM = 0x8000
        // 存放初始PC的地址
        this.indexStartAddress = 0xfffc

        // 寄存器
        this.register = {
            [RegisterCPU.PC]: this.indexPRGROM, // PC寄存器(Program Counter)
            [RegisterCPU.SP]: 0xff, // SP寄存器(Stack Pointer)
            [RegisterCPU.P]: 0x00, // P寄存器(Processor Status)
            [RegisterCPU.A]: 0x00, // A寄存器
            [RegisterCPU.X]: 0x00, // X寄存器
            [RegisterCPU.Y]: 0x00, // Y寄存器
        }
    }

    setMemoryBlock(index, data) {
        // let l = data.length
        // let m1 = this.memory.slice(0, index)
        // let m2 = this.memory.slice(index + l)
        // this.memory = m1.concat(data, m2)

        this.dataBus.setMemoryBlockCPU(index, data)
    }

    loadROM(rom) {
        this.setMemoryBlock(this.indexPRGROM, rom)
    }

    getScreen() {
        let data = this.dataBus.getMemoryBlockCPU(0x0200, 0x0600)
        return data
    }

    getRegister(register) {
        let r = this.register[register]
        return r
    }
    setRegister(register: RegisterCPU, value: any) {
        let v = value
        if (register === RegisterCPU.PC) {
            v = value
        } else {
            v = byteTrimmed(value)
        }
        this.register[register] = v
    }

    // position: 0 ~ 7
    getBit(value, bitPosition) {
        let bit = (value >> bitPosition) & 1
        return bit
    }
    setBit(value, bit, bitPosition) {
        let str = binaryStringFromNumber(value)
        let r = ''
        for (let i = 0; i < str.length; i++) {
            let s = str[i]
            if (i === str.length - bitPosition - 1) {
                r += String(bit)
            } else {
                r += s
            }
        }
        return parseInt(r, 2)
    }

    getFlag(flag) {
        let p = this.getRegister(RegisterCPU.P)
        let bitPosition = flagBit[flag]
        let n = this.getBit(p, bitPosition)
        return n
    }
    setFlag(flag, bit) {
        let p = this.getRegister(RegisterCPU.P)
        let bitPosition = flagBit[flag]
        p = this.setBit(p, bit, bitPosition)
        this.setRegister(RegisterCPU.P, p)
    }

    getFlagC() {
        let s = this.getFlag(Flag.C)
        return s
    }
    setFlagCByValue(value) {
        let c = this.getBit(value, 8)
        this.setFlag(Flag.C, c)
    }

    getFlagZ() {
        let s = this.getFlag(Flag.Z)
        return s
    }
    setFlagZByValue(value) {
        let v = byteTrimmed(value)
        if (v === 0x00) {
            this.setFlag(Flag.Z, 1)
        } else {
            this.setFlag(Flag.Z, 0)
        }
    }

    getFlagI() {
        let s = this.getFlag(Flag.I)
        return s
    }

    getFlagD() {
        let d = this.getFlag(Flag.D)
        return d
    }

    getFlagB() {
        let s = this.getFlag(Flag.B)
        return s
    }

    getFlagV() {
        let s = this.getFlag(Flag.V)
        return s
    }
    setFlagVByValue(value) {}

    getFlagN() {
        let s = this.getFlag(Flag.N)
        return s
    }
    setFlagNByValue(value) {
        let v = byteTrimmed(value)
        let n = this.getBit(v, 7)
        this.setFlag(Flag.N, n)
    }

    getValue(address) {
        let v = this.dataBus.readCPU(address)
        return v
    }
    get2Bytes(address) {
        let low = this.getValue(address)
        let high = this.getValue(address + 1)
        let v = (high << 8) + low
        return v
    }
    setValue(address, value) {
        this.dataBus.writeCPU(address, value)
    }

    getStackPointer() {
        let sp = this.getRegister(RegisterCPU.SP)
        sp = 0x0100 | sp
        return sp
    }
    increaseStackPointer() {
        let sp = this.getRegister(RegisterCPU.SP)
        // 如果超出了最小值，则转到最大值重新开始
        if (sp === 0x00) {
            log('[warning] increase stack overflow.')
            sp = 0xff
        } else {
            sp -= 1
        }

        this.setRegister(RegisterCPU.SP, sp)
    }
    decreaseStackPointer() {
        // 如果超出了最大值，则转到最小值重新开始
        if (sp === 0xff) {
            this.inspector.log('[warning] decrease stack overflow.')
            sp = 0x00
        } else {
            sp += 1
        }

        this.setRegister(RegisterCPU.SP, sp)
    }

    pushStack(value) {
        let address = this.getStackPointer()
        this.setValue(address, value)
        this.increaseStackPointer()
    }
    pullStack() {
        this.decreaseStackPointer()
        let address = this.getStackPointer()
        let v = this.getValue(address)
        return v
    }

    getAddress(addressMode) {
        let mode = addressMode
        if (mode === AddressingMode.Immediate) {
            return null
        } else if (mode === AddressingMode.Accumulator) {
            return null
        } else if (mode === AddressingMode.Absolute) {
            let low = this.readCode()
            let high = this.readCode()
            let address = (high << 8) + low
            return address
        } else if (mode === AddressingMode.AbsoluteX) {
            let low = this.readCode()
            let high = this.readCode()
            let a = (high << 8) + low

            let x = this.getRegister(RegisterCPU.X)
            let address = a + x
            return address
        } else if (mode === AddressingMode.AbsoluteY) {
            let low = this.readCode()
            let high = this.readCode()
            let a = (high << 8) + low

            let y = this.getRegister(RegisterCPU.Y)
            let address = a + y
            return address
        } else if (mode === AddressingMode.ZeroPage) {
            let address = this.readCode()
            return address
        } else if (mode === AddressingMode.ZeroPageX) {
            let operand = this.readCode()
            let x = this.getRegister(RegisterCPU.X)
            let address = (operand + x) & 0xff
            return address
        } else if (mode === AddressingMode.ZeroPageY) {
            let operand = this.readCode()
            let y = this.getRegister(RegisterCPU.Y)
            let address = (operand + y) & 0xff
            return address
        } else if (mode === AddressingMode.Relative) {
            let operand = this.readCode()
            // let n = this.getBit(operand, 7)
            // let offset = operand & 0b1111111
            // if (n === 1) {
            //     offset *= -1
            // }
            let offset = signedNumberFromByte(operand)

            let address = this.getRegister(RegisterCPU.PC)
            address += offset
            return address
        } else if (mode === AddressingMode.Indirect) {
            let low = this.readCode()
            let high = this.readCode()
            let a = (high << 8) + low

            let address = this.get2Bytes(a)
            return address
        } else if (mode === AddressingMode.IndexedIndirectX) {
            let operand = this.readCode()
            let x = this.getRegister(RegisterCPU.X)
            let addressTarget = x + operand
            let address = this.get2Bytes(addressTarget)
            return address
        } else if (mode === AddressingMode.IndirectIndexedY) {
            let a1 = this.readCode()
            let low = this.getValue(a1)

            let a2 = a1 + 1
            let high = this.getValue(a2)

            let a = (high << 8) + low
            let y = this.getRegister(RegisterCPU.Y)
            let address = a + y
            return address
        }
    }

    getAddressAndValueByAddressMode(mode) {
        let value = null
        let address = null
        if (mode === AddressingMode.Accumulator) {
            value = this.getRegister(RegisterCPU.A)
        } else if (mode === AddressingMode.Immediate) {
            value = this.readCode()
        } else {
            address = this.getAddress(mode)
            value = this.getValue(address)
        }

        let r = {
            address: address,
            value: value,
        }
        return r
    }

    readCode() {
        let pc = this.getRegister(RegisterCPU.PC)
        let c = this.getValue(pc)

        pc += 1
        this.setRegister(RegisterCPU.PC, pc)

        return c
    }

    // ===== Memory Operations =====
    // LoaD Accumulator
    LDA(opcodeInfo) {
        let mode = opcodeInfo.addressingMode
        let r = this.getAddressAndValueByAddressMode(mode)
        let value = r.value

        this.setRegister(RegisterCPU.A, value)
        this.setFlagNByValue(value)
        this.setFlagZByValue(value)
    }

    // LoaD X
    LDX(opcodeInfo) {
        let mode = opcodeInfo.addressingMode
        let r = this.getAddressAndValueByAddressMode(mode)
        let value = r.value

        this.setRegister(RegisterCPU.X, value)
        this.setFlagNByValue(value)
        this.setFlagZByValue(value)
    }

    // LoaD Y
    LDY(opcodeInfo) {
        let mode = opcodeInfo.addressingMode
        let r = this.getAddressAndValueByAddressMode(mode)
        let value = r.value

        this.setRegister(RegisterCPU.Y, value)
        this.setFlagNByValue(value)
        this.setFlagZByValue(value)
    }

    // STore Accumulator
    STA(opcodeInfo) {
        let address = this.getAddress(opcodeInfo.addressingMode)
        let a = this.getRegister(RegisterCPU.A)
        this.setValue(address, a)
    }

    // STore X
    STX(opcodeInfo) {
        let address = this.getAddress(opcodeInfo.addressingMode)
        let x = this.getRegister(RegisterCPU.X)
        this.setValue(address, x)
    }

    // STore Y
    STY(opcodeInfo) {
        let address = this.getAddress(opcodeInfo.addressingMode)
        let y = this.getRegister(RegisterCPU.Y)
        this.setValue(address, y)
    }
    // ===== Memory Operations =====

    // ===== Register Transfer Operations =====
    // Transfer Accumulator to X
    TAX() {
        let a = this.getRegister(RegisterCPU.A)
        this.setRegister(RegisterCPU.X, a)
        this.setFlagNByValue(a)
        this.setFlagZByValue(a)
    }

    // Transfer X to Accumulator
    TXA() {
        let x = this.getRegister(RegisterCPU.X)
        this.setRegister(RegisterCPU.A, x)
        this.setFlagNByValue(x)
        this.setFlagZByValue(x)
    }

    // Transfer Accumulator to Y
    TAY() {
        let a = this.getRegister(RegisterCPU.A)
        this.setRegister(RegisterCPU.Y, a)
        this.setFlagNByValue(a)
        this.setFlagZByValue(a)
    }

    // Transfer Y to Accumulator
    TYA() {
        let y = this.getRegister(RegisterCPU.Y)
        this.setRegister(RegisterCPU.A, y)
        this.setFlagNByValue(y)
        this.setFlagZByValue(y)
    }

    // Transfer Stack pointer to X
    TSX() {
        let sp = this.getRegister(RegisterCPU.SP)
        this.setRegister(RegisterCPU.X, sp)
    }

    // Transfer X to Stack pointer
    TXS() {
        let x = this.getRegister(RegisterCPU.X)
        this.setRegister(RegisterCPU.SP, x)
    }
    // ===== Register Transfer Operations =====

    // ===== Stack Operations =====
    // PusH Accumulator
    PHA() {
        let a = this.getRegister(RegisterCPU.A)
        this.pushStack(a)
    }

    // PusH Processor flags
    PHP() {
        let v = this.getRegister(RegisterCPU.P)
        this.pushStack(v)
    }

    // PulL Accumulator
    PLA() {
        let value = this.pullStack()
        this.setRegister(RegisterCPU.A, value)

        this.setFlagNByValue(value)
        this.setFlagZByValue(value)
    }

    // PulL Processor flags
    PLP() {
        let value = this.pullStack()
        this.setRegister(RegisterCPU.P, value)
    }
    // ===== Stack Operations =====

    // ===== Logical Operations =====
    // Logic AND
    AND(opcodeInfo) {
        let mode = opcodeInfo.addressingMode
        let r = this.getAddressAndValueByAddressMode(mode)
        let value = r.value

        let a = this.getRegister(RegisterCPU.A)
        let v = a & value
        this.setRegister(RegisterCPU.A, v)
        this.setFlagNByValue(v)
        this.setFlagZByValue(v)
    }

    // Exclusive OR
    EOR(opcodeInfo) {
        let mode = opcodeInfo.addressingMode
        let r = this.getAddressAndValueByAddressMode(mode)
        let value = r.value

        let a = this.getRegister(RegisterCPU.A)
        let v = a ^ value
        this.setRegister(RegisterCPU.A, v)
        this.setFlagNByValue(v)
        this.setFlagZByValue(v)
    }

    // Logical OR on Accumulator
    ORA(opcodeInfo) {
        let mode = opcodeInfo.addressingMode
        let r = this.getAddressAndValueByAddressMode(mode)
        let value = r.value

        let a = this.getRegister(RegisterCPU.A)
        let v = a | value
        this.setRegister(RegisterCPU.A, v)
        this.setFlagNByValue(v)
        this.setFlagZByValue(v)
    }
    // ===== Logical Operations =====

    // ===== Arithmetic Operations =====
    // ADd with Carry
    ADC(opcodeInfo) {
        let mode = opcodeInfo.addressingMode
        let result = this.getAddressAndValueByAddressMode(mode)
        let value = result.value

        // Carry indicates unsigned overflow
        // Overflow indicates signed overflow
        // When adding two unsigned numbers results in > $FF, C is set
        // When adding two signed numbers results in > 127 ($7F) or < -128 ($80), V is set

        let a = this.getRegister(RegisterCPU.A)
        let c = this.getFlagC()
        let v = a + c + value
        this.setRegister(RegisterCPU.A, v)
        this.setFlagNByValue(v)
        this.setFlagZByValue(v)
        this.setFlagCByValue(v)

        let signedNumber1 = signedNumberFromByte(a)
        let signedNumber2 = byteTrimmed(c + value)
        signedNumber2 = signedNumberFromByte(signedNumber2)
        let r = signedNumber1 + signedNumber2
        if (r > 127 || r < -128) {
            this.setFlag(Flag.V, 1)
        } else {
            this.setFlag(Flag.V, 0)
        }
    }

    // DECrease
    DEC(opcodeInfo) {
        let mode = opcodeInfo.addressingMode
        let result = this.getAddressAndValueByAddressMode(mode)
        let value = result.value
        let address = result.address

        if (value === 0) {
            value = 0xff
        } else {
            value -= 1
        }

        this.setValue(address, value)
        this.setFlagNByValue(value)
        this.setFlagZByValue(value)
    }

    // DEcrement X register
    DEX() {
        let x = this.getRegister(RegisterCPU.X)
        if (x === 0) {
            x = 0xff
        } else {
            x -= 1
        }

        this.setRegister(RegisterCPU.X, x)
        this.setFlagNByValue(x)
        this.setFlagZByValue(x)
    }

    // DEcrease Y
    DEY() {
        let y = this.getRegister(RegisterCPU.Y)
        if (y === 0) {
            y = 0xff
        } else {
            y -= 1
        }

        this.setRegister(RegisterCPU.Y, y)
        this.setFlagNByValue(y)
        this.setFlagZByValue(y)
    }

    // INCrease
    INC(opcodeInfo) {
        let mode = opcodeInfo.addressingMode
        let result = this.getAddressAndValueByAddressMode(mode)
        let value = result.value
        let address = result.address

        if (value === 0xff) {
            value = 0
        } else {
            value += 1
        }

        this.setValue(address, value)
        this.setFlagNByValue(value)
        this.setFlagZByValue(value)
    }

    // INcrease X
    INX(opcodeInfo) {
        let x = this.getRegister(RegisterCPU.X)
        if (x === 0xff) {
            x = 0
        } else {
            x += 1
        }

        this.setRegister(RegisterCPU.X, x)
        this.setFlagNByValue(x)
        this.setFlagZByValue(x)
    }

    // INcrease Y
    INY() {
        let y = this.getRegister(RegisterCPU.Y)
        if (y === 0xff) {
            y = 0
        } else {
            y += 1
        }

        this.setRegister(RegisterCPU.Y, y)
        this.setFlagNByValue(y)
        this.setFlagZByValue(y)
    }

    // SuBtract with Carry
    SBC(opcodeInfo) {
        let mode = opcodeInfo.addressingMode
        let result = this.getAddressAndValueByAddressMode(mode)
        let value = result.value

        let a = this.getRegister(RegisterCPU.A)
        let c = 1 - this.getFlagC()
        let v = a + positiveByteFromMinus(value) - c

        this.setRegister(RegisterCPU.A, v)
        this.setFlagNByValue(v)
        this.setFlagZByValue(v)
        this.setFlagCByValue(v)

        let signedNumber1 = signedNumberFromByte(a)
        let signedNumber2 = byteTrimmed(positiveByteFromMinus(value) - c)
        signedNumber2 = signedNumberFromByte(signedNumber2)
        let r = signedNumber1 + signedNumber2
        if (r > 127 || r < -128) {
            this.setFlag(Flag.V, 1)
        } else {
            this.setFlag(Flag.V, 0)
        }
    }
    // ===== Arithmetic Operations =====

    // ===== Bit Manipulation Operations =====
    // Arithmetic Shift Left
    ASL(opcodeInfo) {
        let mode = opcodeInfo.addressingMode
        let r = this.getAddressAndValueByAddressMode(mode)
        let value = r.value
        let address = r.address

        let v = value << 1
        this.setFlagCByValue(v)
        this.setFlagNByValue(v)
        this.setFlagZByValue(v)

        if (mode === AddressingMode.Accumulator) {
            this.setRegister(RegisterCPU.A, v)
        } else {
            this.setValue(address, v)
        }
    }

    // Logic Shift Right
    LSR(opcodeInfo) {
        let mode = opcodeInfo.addressingMode
        let r = this.getAddressAndValueByAddressMode(mode)
        let value = r.value
        let address = r.address

        let v = value >> 1
        let c = value & 0x01
        this.setFlag(Flag.C, c)
        this.setFlag(Flag.N, 0)
        this.setFlagZByValue(v)

        if (mode === AddressingMode.Accumulator) {
            this.setRegister(RegisterCPU.A, v)
        } else {
            this.setValue(address, v)
        }
    }

    // ROtate Left
    ROL(opcodeInfo) {
        let mode = opcodeInfo.addressingMode
        let r = this.getAddressAndValueByAddressMode(mode)
        let value = r.value
        let address = r.address

        let v = value << 1
        let c = this.getFlagC()
        if (c === 1) {
            v = v | 0x01
        }

        this.setFlagCByValue(v)
        this.setFlagNByValue(v)
        this.setFlagZByValue(v)

        if (mode === AddressingMode.Accumulator) {
            this.setRegister(RegisterCPU.A, v)
        } else {
            this.setValue(address, v)
        }
    }

    // ROtate Right
    ROR(opcodeInfo) {
        let mode = opcodeInfo.addressingMode
        let r = this.getAddressAndValueByAddressMode(mode)
        let value = r.value
        let address = r.address

        let v = value >> 1
        let c = this.getFlagC()
        if (c === 1) {
            v = v | 0b10000000
        }

        c = this.getBit(value, 0)
        this.setFlag(Flag.C, c)
        this.setFlagNByValue(v)
        this.setFlagZByValue(v)

        if (mode === AddressingMode.Accumulator) {
            this.setRegister(RegisterCPU.A, v)
        } else {
            this.setValue(address, v)
        }
    }
    // ===== Bit Manipulation Operations =====

    // ===== Subroutine Operations =====
    // JuMP
    JMP(opcodeInfo) {
        let address = this.getAddress(opcodeInfo.addressingMode)
        this.setRegister(RegisterCPU.PC, address)
    }

    // Jump to SubRoutine
    JSR(opcodeInfo) {
        let mode = opcodeInfo.addressingMode
        let address = this.getAddress(mode)

        let pc = this.getRegister(RegisterCPU.PC)
        pc = pc - 1
        let high = (pc >> 8) & 0xff
        this.pushStack(high)
        let low = pc & 0xff
        this.pushStack(low)

        this.setRegister(RegisterCPU.PC, address)
    }

    // ReTurn from Interrupt
    RTI() {
        let s = this.pullStack()
        this.setRegister(RegisterCPU.P, s)

        let low = this.pullStack()
        let high = this.pullStack()
        let pc = (high << 8) + low
        this.setRegister(RegisterCPU.PC, pc)
    }

    // ReTurn from Subroutine
    RTS() {
        let low = this.pullStack()
        let high = this.pullStack()
        let pc = (high << 8) + low

        pc += 1
        this.setRegister(RegisterCPU.PC, pc)
    }
    // ===== Subroutine Operations =====

    // ===== Comparison Operations =====
    // BIT test
    BIT(opcodeInfo) {
        let mode = opcodeInfo.addressingMode
        let address = this.getAddress(mode)
        let value = this.getValue(address)

        this.setFlagNByValue(value)

        let byte = byteTrimmed(value)
        let n = this.getBit(byte, 6)
        this.setFlag(Flag.V, n)

        let a = this.getRegister(RegisterCPU.A)
        let v = a & value
        this.setFlagZByValue(v)
    }

    // CoMPare
    CMP(opcodeInfo) {
        let mode = opcodeInfo.addressingMode
        let r = this.getAddressAndValueByAddressMode(mode)
        let value = r.value

        let a = this.getRegister(RegisterCPU.A)

        let v = a + positiveByteFromMinus(value)
        this.setFlagNByValue(v)
        this.setFlagZByValue(v)
        this.setFlagCByValue(v)
    }

    // ComPare X
    CPX(opcodeInfo) {
        let mode = opcodeInfo.addressingMode
        let r = this.getAddressAndValueByAddressMode(mode)
        let value = r.value

        let x = this.getRegister(RegisterCPU.X)

        let v = x + positiveByteFromMinus(value)
        this.setFlagNByValue(v)
        this.setFlagZByValue(v)
        this.setFlagCByValue(v)
    }

    // ComPare Y
    CPY(opcodeInfo) {
        let mode = opcodeInfo.addressingMode
        let r = this.getAddressAndValueByAddressMode(mode)
        let value = r.value

        let y = this.getRegister(RegisterCPU.Y)

        let v = y + positiveByteFromMinus(value)
        this.setFlagNByValue(v)
        this.setFlagZByValue(v)
        this.setFlagCByValue(v)
    }
    // ===== Comparison Operations =====

    // ===== Branching Operations =====
    // Branch if Carry is Clear
    BCC(opcodeInfo) {
        let address = this.getAddress(opcodeInfo.addressingMode)

        let c = this.getFlagC()
        if (c === 0) {
            this.setRegister(RegisterCPU.PC, address)
        }
    }

    // Branch if Carry is Set
    BCS(opcodeInfo) {
        let address = this.getAddress(opcodeInfo.addressingMode)

        let c = this.getFlagC()
        if (c === 1) {
            this.setRegister(RegisterCPU.PC, address)
        }
    }

    // Branch if EQual
    BEQ(opcodeInfo) {
        let address = this.getAddress(opcodeInfo.addressingMode)

        let z = this.getFlagZ()
        if (z === 1) {
            this.setRegister(RegisterCPU.PC, address)
        }
    }

    // Branch if MInus
    BMI(opcodeInfo) {
        let address = this.getAddress(opcodeInfo.addressingMode)

        let n = this.getFlagN()
        if (n === 1) {
            this.setRegister(RegisterCPU.PC, address)
        }
    }

    // Branch if Not Equal
    BNE(opcodeInfo) {
        let address = this.getAddress(opcodeInfo.addressingMode)

        let z = this.getFlagZ()
        if (z === 0) {
            this.setRegister(RegisterCPU.PC, address)
        }
    }

    // Branch if oVerflow Clear
    BVC(opcodeInfo) {
        let address = this.getAddress(opcodeInfo.addressingMode)

        let v = this.getFlagV()
        if (v === 0) {
            this.setRegister(RegisterCPU.PC, address)
        }
    }

    // Branch if oVerflow Set
    BVS(opcodeInfo) {
        let address = this.getAddress(opcodeInfo.addressingMode)

        let v = this.getFlagV()
        if (v === 1) {
            this.setRegister(RegisterCPU.PC, address)
        }
    }

    // Branch if PLus
    BPL(opcodeInfo) {
        let address = this.getAddress(opcodeInfo.addressingMode)

        let n = this.getFlagN()
        if (n === 0) {
            this.setRegister(RegisterCPU.PC, address)
        }
    }

    // ===== Branching Operations =====

    // ===== Status setting and System related operations =====
    // BReaKpoint
    BRK() {
        this.readCode()

        let pc = this.getRegister(RegisterCPU.PC)
        let high = (pc >> 8) & 0xff
        this.pushStack(high)
        let low = pc & 0xff
        this.pushStack(low)

        let p = this.getRegister(RegisterCPU.P)
        this.pushStack(p)

        high = this.getValue(0xffff)
        low = this.getValue(0xfffe)
        let address = (high << 8) | low
        this.setRegister(RegisterCPU.PC, address)

        this.setFlag(Flag.B, 1)
        this.setFlag(Flag.I, 1)
    }

    // CLear Carry
    CLC() {
        this.setFlag(Flag.C, 0)
    }

    // CLear Decimal flag
    CLD() {
        this.setFlag(Flag.D, 0)
    }

    // CLear Interrupt flag
    CLI() {
        this.setFlag(Flag.I, 0)
    }

    // CLear oVerflow
    CLV() {
        this.setFlag(Flag.V, 0)
    }

    // No OPeration
    NOP() {}

    // SEt Carry
    SEC() {
        this.setFlag(Flag.C, 1)
    }

    // SEt Decimal flag
    SED() {
        this.setFlag(Flag.D, 1)
    }

    // SEt Interrupt flag
    SEI() {
        this.setFlag(Flag.I, 1)
    }
    // ===== Status setting and System related operations =====

    // ===== Future Expansion =====
    STP() {}

    RLA() {}

    RRA() {}

    SRE() {}

    // AND then Logical shift Right
    ALR() {}

    ARR() {}

    SAX() {}

    XAA() {}

    AHX() {}

    TAS() {}

    SHY() {}

    SHX() {}

    LAX() {}

    LAS() {}

    DCP() {}

    AXS() {}

    ISC() {}
    // ===== Future Expansion =====

    run() {
        // this.printCPU()
        log('===== start =====')
        let pc = this.getRegister(RegisterCPU.PC)
        let opcode = this.getValue(pc)

        let memorySize = this.dataBus.getMemorySizeCPU()
        if (pc < memorySize && opcode !== undefined) {
            let c = this.readCode()
            this.executeInstruction(c)
            this.printCPU()
        }
        log('===== end =====')
        log('')
    }

    formattedAddressCode(opInfo) {
        let s = ''
        let pc = this.getRegister(RegisterCPU.PC)
        if (opInfo.addressingMode === AddressingMode.Immediate) {
            let code = this.getValue(pc)
            code = hexStringFromNumber(code)
            s = `#${code}`
        } else if (opInfo.addressingMode === AddressingMode.Absolute) {
            let code = this.get2Bytes(pc)
            code = hexStringFromNumber(code)
            s = `${code}`
        } else if (opInfo.addressingMode === AddressingMode.AbsoluteX) {
            let code = this.get2Bytes(pc)
            code = hexStringFromNumber(code)
            s = `${code}, X`
        } else if (opInfo.addressingMode === AddressingMode.AbsoluteY) {
            let code = this.get2Bytes(pc)
            code = hexStringFromNumber(code)
            s = `${code}, Y`
        } else if (opInfo.addressingMode === AddressingMode.ZeroPage) {
            let code = this.getValue(pc)
            code = hexStringFromNumber(code)
            s = `${code}`
        } else if (opInfo.addressingMode === AddressingMode.ZeroPageX) {
            let code = this.getValue(pc)
            code = hexStringFromNumber(code)
            s = `${code}, X`
        } else if (opInfo.addressingMode === AddressingMode.ZeroPageY) {
            let code = this.getValue(pc)
            code = hexStringFromNumber(code)
            s = `${code}, Y`
        } else if (opInfo.addressingMode === AddressingMode.Indirect) {
            let code = this.get2Bytes(pc)
            code = hexStringFromNumber(code)
            s = `(${code})`
        } else if (opInfo.addressingMode === AddressingMode.IndexedIndirectX) {
            let code = this.get2Bytes(pc)
            code = hexStringFromNumber(code)
            s = `(${code}, X)`
        } else if (opInfo.addressingMode === AddressingMode.IndirectIndexedY) {
            let code = this.get2Bytes(pc)
            code = hexStringFromNumber(code)
            s = `(${code}), Y`
        } else if (opInfo.addressingMode === AddressingMode.Relative) {
            let code = this.getValue(pc)
            code = hexStringFromNumber(code)
            s = `${code}`
        }

        return s
    }

    formattedInstruction(opInfo) {
        let params = this.formattedAddressCode(opInfo)
        let s = `${opInfo.name} ${params}`
        return s
    }

    formattedCode(opInfo) {
        let s = ''
        let code = opInfo.code
        code = hexStringFromNumber(code)
        let pc = this.getRegister(RegisterCPU.PC)
        if (opInfo.bytes === 1) {
            s = `${code}`
        } else if (opInfo.bytes === 2) {
            let code1 = this.getValue(pc)
            code1 = hexStringFromNumber(code1)
            s = `${code} ${code1}`
        } else if (opInfo.bytes === 3) {
            let code1 = this.getValue(pc)
            code1 = hexStringFromNumber(code1)
            let code2 = this.getValue(pc + 1)
            code2 = hexStringFromNumber(code2)
            s = `${code} ${code1} ${code2}`
        }

        return s
    }

    printCode(opcodeInfo) {
        let codeString = this.formattedCode(opcodeInfo)
        codeString = stringFixedLength(codeString, 15)
        let asmString = this.formattedInstruction(opcodeInfo)
        asmString = stringFixedLength(asmString, 15)
        log(`Code: ${codeString} | ${asmString}`)
    }

    printCPU() {
        let a = this.getRegister(RegisterCPU.A)
        a = hexStringFromNumber(a)

        let x = this.getRegister(RegisterCPU.X)
        x = hexStringFromNumber(x)

        let y = this.getRegister(RegisterCPU.Y)
        y = hexStringFromNumber(y)

        let pc = this.getRegister(RegisterCPU.PC)
        pc = hexStringFromNumber(pc)

        let sp = this.getRegister(RegisterCPU.SP)
        sp = hexStringFromNumber(sp)

        let p = this.getRegister(RegisterCPU.P)
        p = binaryStringFromNumber(p)

        log(`CPU: A: ${a}, X: ${x}, Y: ${y}, PC: ${pc}, SP: ${sp}, P: ${p}`)

        let stack = this.dataBus.getMemoryBlockCPU(
            this.indexStackLow,
            this.indexStackHigh
        )
        stack = stack.map((item) => {
            let i = hexStringFromNumber(item)
            return i
        })
        log('Stack', stack)
        let zeroPage = this.dataBus.getMemoryBlockCPU(0, 0xff)
        zeroPage = zeroPage.map((item) => {
            let i = hexStringFromNumber(item)
            return i
        })
        log('ZeroPage: ', zeroPage)
    }

    executeInstruction(opcode) {
        let opInfo = opcodes[opcode]
        this.printCode(opInfo)
        // TODO: 这里应该将指令映射到具体执行的函数
        // @ts-ignore next-line
        this[opInfo.name](opInfo)
    }
}
