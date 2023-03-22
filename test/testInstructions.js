const setIndexedIndirectX = function(codes, cpu) {
    codes.push(0x3E)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x3E + 0x05 = 0x43
    cpu.setValue(0x43, 0x15)
    cpu.setValue(0x44, 0x24)

    let address = 0x2415
    return address
}

const setIndirectIndexedY = function(codes, cpu) {
    let address = 0x4C
    codes.push(address)
    cpu.setValue(address, 0x00)
    cpu.setValue(address + 1, 0x21)
    cpu.setRegister(RegisterCPU.Y, 0x05)
    // 0x2100 + 0x05

    return 0x2105
}

const setZeroPage = function(codes, cpu) {
    let address = 0x3E
    codes.push(address)
    return address
}

const setZeroPageX = function(codes, cpu) {
    codes.push(0x3E)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x3E + 0x05 = 0x43

    return 0x43
}

const setZeroPageY = function(codes, cpu) {
    codes.push(0x3E)
    cpu.setRegister(RegisterCPU.Y, 0x05)
    // 0x3E + 0x05 = 0x43

    return 0x43
}

const setIndirect = function(codes, cpu) {
    codes.push(0x5F, 0x21)
    cpu.setValue(0x215F, 0x76)
    cpu.setValue(0x2160, 0x30)

    return 0x3076
}

const setRelativeBackwards = function(codes, cpu) {
    codes.push(0xA7) // -89
    return -89
}
const setRelativeForwards = function(codes, cpu) {
    codes.push(0x27)
    return 0x27
}

const setAbsolute = function(codes, cpu) {
    codes.push(0x15, 0x24)

    return 0x2415
}

const setAbsoluteY = function(codes, cpu) {
    codes.push(0x15, 0x24)
    cpu.setRegister(RegisterCPU.Y, 0x05)
    // 0x2415 + 0x05 = 0x241A

    return 0x241A
}

const setAbsoluteX = function(codes, cpu) {
    codes.push(0x15, 0x24)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x2415 + 0x05 = 0x241A

    return 0x241A
}

const getCPUInstance = function() {
    let dataBus = DataBus.new()
    let cpu = CPU.new(dataBus)
    return cpu
}

// BRK Implied
const test0x00 = function() {
    const cpu = getCPUInstance()

    let codes = [0x00]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.P, 0b11111111)
    cpu.setValue(0xFFFF, 0x56)
    cpu.setValue(0xFFFE, 0x78)
    cpu.run()

    let sp = cpu.getStackPointer()
    let output = {
        b: cpu.getFlagB(),
        i: cpu.getFlagI(),
        pc: cpu.getRegister(RegisterCPU.PC),
        p1: cpu.getValue(sp + 3),
        p2: cpu.getValue(sp + 2),
        p3: cpu.getValue(sp + 1)
    }
    let except = {
        b: 1,
        i: 1,
        pc: 0x5678,
        p1: 0x80,
        p2: 0x02,
        p3: 0b11111111,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x00 BRK Implied 1')
}

// ORA IndexedIndirectX
const test0x01 = function() {
    const cpu = getCPUInstance()

    let codes = [0x01, 0x3E]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x3E + 0x05 = 0x43
    cpu.setValue(0x43, 0x15)
    cpu.setValue(0x44, 0x24)
    // 最后和A比较的值为0x6E
    let v = 0x6E
    cpu.setValue(0x2415, v)
    // A的初始值
    let a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: a | v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x01 ORA IndexedIndirectX 1')

    cpu.init()
    codes = [0x01, 0x3E]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    cpu.setValue(0x43, 0x15)
    cpu.setValue(0x44, 0x24)
    // 最后和A比较的值为0x6E
    v = 0x6E
    cpu.setValue(0x2415, v)
    // A的初始值
    a = 0xff
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a | v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x01 ORA IndexedIndirectX 2')

    cpu.init()
    codes = [0x01, 0x3E]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    cpu.setValue(0x43, 0x15)
    cpu.setValue(0x44, 0x24)
    // 最后和A比较的值为0x6E
    v = 0x00
    cpu.setValue(0x2415, v)
    // A的初始值
    a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a | v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x01 ORA IndexedIndirectX 3')
}

// ORA ZeroPage
const test0x05 = function() {
    const cpu = getCPUInstance()

    let codes = [0x05, 0x3E]
    cpu.loadROM(codes)
    // 最后和A比较的值为0x6E
    let v = 0x6E
    cpu.setValue(0x3E, v)
    // A的初始值
    let a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: a | v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x05 ORA ZeroPage 1')

    cpu.init()
    codes = [0x01, 0x3E]
    cpu.loadROM(codes)
    // 最后和A比较的值为0x6E
    v = 0x6E
    cpu.setValue(0x3E, v)
    // A的初始值
    a = 0xff
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a | v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x05 ORA ZeroPage 2')

    cpu.init()
    codes = [0x01, 0x3E]
    cpu.loadROM(codes)
    // 最后和A比较的值为0x6E
    v = 0x00
    cpu.setValue(0x3E, v)
    // A的初始值
    a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a | v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x05 ORA ZeroPage 3')
}

// ASL ZeroPage
const test0x06 = function() {
    const cpu = getCPUInstance()

    let codes = [0x06, 0x3E]
    cpu.loadROM(codes)
    let v = 0x1
    cpu.setValue(0x3E, v)
    cpu.run()

    let output = {
        value: cpu.getValue(0x3E),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        value: 0x2,
        c: 0,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x06 ASL ZeroPage 1')

    cpu.init()
    codes = [0x06, 0x3E]
    cpu.loadROM(codes)
    // 最后和A比较的值为0x6E
    v = 0x89 // 1000 1001
    cpu.setValue(0x3E, v)
    cpu.run()

    output = {
        value: cpu.getValue(0x3E),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        value: 0x12,
        c: 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x06 ASL ZeroPage 2')
}

// PHP Implied
const test0x08 = function() {
    const cpu = getCPUInstance()

    let codes = [0x08]
    cpu.loadROM(codes)
    let v = 0x1
    cpu.setRegister(RegisterCPU.P, v)
    cpu.run()

    let output = {
        sp: cpu.getRegister(RegisterCPU.SP),
        v: cpu.getValue(cpu.getStackPointer() + 1),
    }
    let except = {
        sp: 0xFF - 1,
        v: v,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x08 PHP Implied 1')
}

// ORA Immediate
const test0x09 = function() {
    const cpu = getCPUInstance()

    // 最后和A比较的值为0x6E
    let v = 0x6E
    let codes = [0x09, v]
    cpu.loadROM(codes)
    // A的初始值
    let a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: a | v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x09 ORA Immediate 1')

    cpu.init()
    // 最后和A比较的值为0x6E
    v = 0x6E
    codes = [0x09, v]
    cpu.loadROM(codes)
    // A的初始值
    a = 0xff
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a | v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x09 ORA Immediate 2')

    cpu.init()
    // 最后和A比较的值为0x6E
    v = 0x00
    codes = [0x09, v]
    cpu.loadROM(codes)
    // A的初始值
    a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a | v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x09 ORA Immediate 3')
}

// ASL Accumulator
const test0x0A = function() {
    const cpu = getCPUInstance()

    let codes = [0x0A]
    cpu.loadROM(codes)
    let v = 0x1
    cpu.setRegister(RegisterCPU.A, v)
    cpu.run()

    let output = {
        value: cpu.getRegister(RegisterCPU.A),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        value: 0x2,
        c: 0,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x0A ASL Accumulator 1')

    cpu.init()
    codes = [0x0A]
    cpu.loadROM(codes)
    // 最后和A比较的值为0x6E
    v = 0x89 // 1000 1001
    cpu.setRegister(RegisterCPU.A, v)
    cpu.run()

    output = {
        value: cpu.getRegister(RegisterCPU.A),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        value: 0x12,
        c: 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x0A ASL Accumulator 2')
}

// ORA Absolute
const test0x0D = function() {
    const cpu = getCPUInstance()

    let codes = [0x0D, 0x15, 0x24]
    cpu.loadROM(codes)
    // 最后和A比较的值为0x6E
    let v = 0x6E
    cpu.setValue(0x2415, v)
    // A的初始值
    let a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: a | v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x0D ORA Absolute 1')

    cpu.init()
    codes = [0x0D, 0x15, 0x24]
    cpu.loadROM(codes)
    // 最后和A比较的值为0x6E
    v = 0x6E
    cpu.setValue(0x2415, v)
    // A的初始值
    a = 0xff
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a | v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x0D ORA Absolute 2')

    cpu.init()
    codes = [0x01, 0x15, 0x24]
    cpu.loadROM(codes)
    // 最后和A比较的值为0x6E
    v = 0x00
    cpu.setValue(0x2415, v)
    // A的初始值
    a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a | v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x0D ORA Absolute 3')
}

// ASL Absolute
const test0x0E = function() {
    const cpu = getCPUInstance()

    let codes = [0x0E, 0x15, 0x24]
    cpu.loadROM(codes)
    let v = 0x1
    cpu.setValue(0x2415, v)
    cpu.run()

    let output = {
        value: cpu.getValue(0x2415),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        value: 0x2,
        c: 0,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x0E ASL Absolute 1')

    cpu.init()
    codes = [0x0E, 0x15, 0x24]
    cpu.loadROM(codes)
    // 最后和A比较的值为0x6E
    v = 0x89 // 1000 1001
    cpu.setValue(0x2415, v)
    cpu.run()

    output = {
        value: cpu.getValue(0x2415),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        value: 0x12,
        c: 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x0E ASL Absolute 2')
}

// BPL Relative
const test0x10 = function() {
    const cpu = getCPUInstance()
    let opcode = 0x10

    // 不跳转
    let codes = [opcode]
    let offset = setRelativeBackwards(codes, cpu)
    cpu.setFlag(Flag.N, 1)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        pc: cpu.getRegister(RegisterCPU.PC),
    }
    let except = {
        pc: cpu.indexPRGROM + 2,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x10 BPL Relative 1')

    // 跳转
    cpu.init()
    codes = [opcode]
    offset = setRelativeBackwards(codes, cpu)
    cpu.setFlag(Flag.N, 0)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        pc: cpu.getRegister(RegisterCPU.PC),
    }
    except = {
        pc: cpu.indexPRGROM + 2 + offset,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x10 BPL Relative 2')

    // 跳转
    cpu.init()
    codes = [opcode]
    offset = setRelativeForwards(codes, cpu)
    cpu.loadROM(codes)
    cpu.setFlag(Flag.N, 0)
    cpu.run()

    output = {
        pc: cpu.getRegister(RegisterCPU.PC),
    }
    except = {
        pc: cpu.indexPRGROM + 2 + offset,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x10 BPL Relative 3')
}

// ORA IndirectIndexedY
const test0x11 = function() {
    const cpu = getCPUInstance()

    let address = 0x4C
    let codes = [0x11, address]
    cpu.loadROM(codes)
    cpu.setValue(address, 0x00)
    cpu.setValue(address + 1, 0x21)
    cpu.setRegister(RegisterCPU.Y, 0x05)
    // 0x2100 + 0x05
    // 最后和A比较的值为0x6E
    let v = 0x6E
    cpu.setValue(0x2105, v)
    // A的初始值
    let a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: a | v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x11 ORA IndirectIndexedY 1')

    cpu.init()
    address = 0x4C
    codes = [0x11, address]
    cpu.loadROM(codes)
    cpu.setValue(address, 0x00)
    cpu.setValue(address + 1, 0x21)
    cpu.setRegister(RegisterCPU.Y, 0x05)
    // 0x2100 + 0x05
    // 最后和A比较的值为0x6E
    v = 0x6E
    cpu.setValue(0x2105, v)
    // A的初始值
    a = 0xff
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a | v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x11 ORA IndirectIndexedY 2')

    cpu.init()
    address = 0x4C
    codes = [0x11, address]
    cpu.loadROM(codes)
    cpu.setValue(address, 0x00)
    cpu.setValue(address + 1, 0x21)
    cpu.setRegister(RegisterCPU.Y, 0x05)
    // 0x2100 + 0x05
    // 最后和A比较的值为0x00
    v = 0x00
    cpu.setValue(0x2105, v)
    // A的初始值
    a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a | v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x11 ORA IndirectIndexedY 3')
}

// ORA ZeroPageX
const test0x15 = function() {
    const cpu = getCPUInstance()

    let codes = [0x15, 0x3E]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x3E + 0x05 = 0x43
    // 最后和A比较的值为0x6E
    let v = 0x6E
    cpu.setValue(0x43, v)
    // A的初始值
    let a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: a | v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x15 ORA ZeroPageX 1')

    cpu.init()
    codes = [0x15, 0x3E]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 最后和A比较的值为0x6E
    v = 0x6E
    cpu.setValue(0x43, v)
    // A的初始值
    a = 0xff
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a | v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x15 ORA ZeroPageX 2')

    cpu.init()
    codes = [0x15, 0x3E]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 最后和A比较的值为0x6E
    v = 0x00
    cpu.setValue(0x43, v)
    // A的初始值
    a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a | v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x15 ORA ZeroPageX 3')
}

// ASL ZeroPageX
const test0x16 = function() {
    const cpu = getCPUInstance()

    let codes = [0x16, 0x3E]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x3E + 0x05 = 0x43
    let v = 0x1
    cpu.setValue(0x43, v)
    cpu.run()

    let output = {
        value: cpu.getValue(0x43),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        value: 0x2,
        c: 0,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x16 ASL ZeroPageX 1')

    cpu.init()
    codes = [0x16, 0x3E]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x3E + 0x05 = 0x43
    v = 0x89 // 1000 1001
    cpu.setValue(0x43, v)
    cpu.run()

    output = {
        value: cpu.getValue(0x43),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        value: 0x12,
        c: 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x16 ASL ZeroPageX 2')
}

// CLC Implied
const test0x18 = function() {
    const cpu = getCPUInstance()

    let codes = [0x18]
    cpu.loadROM(codes)
    cpu.setFlag(Flag.C, 1)
    cpu.run()

    let output = {
        c: cpu.getFlagC(),
    }
    let except = {
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x18 CLC Implied 1')

    cpu.init()
    codes = [0x18]
    cpu.loadROM(codes)
    cpu.setFlag(Flag.C, 0)
    cpu.run()

    output = {
        c: cpu.getFlagC(),
    }
    except = {
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x18 CLC Implied 2')
}

// ORA AbsoluteY
const test0x19 = function() {
    const cpu = getCPUInstance()

    let codes = [0x19, 0x15, 0x24]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.Y, 0x05)
    // 0x2415 + 0x05 = 0x241A
    // 最后和A比较的值为0x6E
    let v = 0x6E
    cpu.setValue(0x241A, v)
    // A的初始值
    let a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: a | v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x19 ORA AbsoluteY 1')

    cpu.init()
    codes = [0x19, 0x15, 0x24]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.Y, 0x05)
    // 0x2415 + 0x05 = 0x241A
    // 最后和A比较的值为0x6E
    v = 0x6E
    cpu.setValue(0x241A, v)
    // A的初始值
    a = 0xff
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a | v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x19 ORA AbsoluteY 2')

    cpu.init()
    codes = [0x19, 0x15, 0x24]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.Y, 0x05)
    // 0x2415 + 0x05 = 0x241A
    // 最后和A比较的值为0x6E
    v = 0x00
    cpu.setValue(0x241A, v)
    // A的初始值
    a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a | v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x19 ORA AbsoluteY 3')
}

// ORA AbsoluteX
const test0x1D = function() {
    const cpu = getCPUInstance()

    let codes = [0x1D, 0x15, 0x24]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x2415 + 0x05 = 0x241A
    // 最后和A比较的值为0x6E
    let v = 0x6E
    cpu.setValue(0x241A, v)
    // A的初始值
    let a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: a | v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x1D ORA AbsoluteX 1')

    cpu.init()
    codes = [0x1D, 0x15, 0x24]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x2415 + 0x05 = 0x241A
    // 最后和A比较的值为0x6E
    v = 0x6E
    cpu.setValue(0x241A, v)
    // A的初始值
    a = 0xff
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a | v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x1D ORA AbsoluteX 2')

    cpu.init()
    codes = [0x1D, 0x15, 0x24]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x2415 + 0x05 = 0x241A
    // 最后和A比较的值为0x6E
    v = 0x00
    cpu.setValue(0x241A, v)
    // A的初始值
    a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a | v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x1D ORA AbsoluteX 3')
}

// ASL AbsoluteX
const test0x1E = function() {
    const cpu = getCPUInstance()

    let codes = [0x1E, 0x15, 0x24]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x2415 + 0x05 = 0x241A
    let v = 0x1
    cpu.setValue(0x241A, v)
    cpu.run()

    let output = {
        value: cpu.getValue(0x241A),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        value: 0x2,
        c: 0,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x1E ASL AbsoluteX 1')

    cpu.init()
    codes = [0x1E, 0x15, 0x24]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x2415 + 0x05 = 0x241A
    v = 0x89 // 1000 1001
    cpu.setValue(0x241A, v)
    cpu.run()

    output = {
        value: cpu.getValue(0x241A),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        value: 0x12,
        c: 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x1E ASL AbsoluteX 2')
}

// JSR Absolute
const test0x20 = function() {
    const cpu = getCPUInstance()

    let codes = [0x20, 0x15, 0x24]
    cpu.loadROM(codes)
    cpu.run()

    let sp = cpu.getStackPointer()
    let output = {
        pc: cpu.getRegister(RegisterCPU.PC),
        sp1: cpu.getValue(sp + 2),
        sp2: cpu.getValue(sp + 1),
    }
    let except = {
        pc: 0x2415,
        sp1: 0x80,
        sp2: 0x02,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x20 JSR Absolute 1')
}

// AND IndexedIndirectX
const test0x21 = function() {
    const cpu = getCPUInstance()

    let codes = [0x21, 0x3E]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x3E + 0x05 = 0x43
    cpu.setValue(0x43, 0x15)
    cpu.setValue(0x44, 0x24)
    // 最后和A比较的值为0x6E
    let v = 0x6E
    cpu.setValue(0x2415, v)
    // A的初始值
    let a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: a & v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x21 AND IndexedIndirectX 1')

    cpu.init()
    codes = [0x21, 0x3E]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    cpu.setValue(0x43, 0x15)
    cpu.setValue(0x44, 0x24)
    // 最后和A比较的值为0x6E
    v = 0x6E
    cpu.setValue(0x2415, v)
    // A的初始值
    a = 0xff
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a & v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x21 AND IndexedIndirectX 2')

    cpu.init()
    codes = [0x21, 0x3E]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    cpu.setValue(0x43, 0x15)
    cpu.setValue(0x44, 0x24)
    // 最后和A比较的值为0x6E
    v = 0xFF
    cpu.setValue(0x2415, v)
    // A的初始值
    a = 0xFF
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a & v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x21 AND IndexedIndirectX 3')
}

// BIT ZeroPage
const test0x24 = function() {
    const cpu = getCPUInstance()

    let codes = [0x24, 0x3E]
    cpu.loadROM(codes)
    // 最后和A比较的值为0x6E
    let v = 0x6E
    cpu.setValue(0x3E, v)
    // A的初始值
    let a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    let output = {
        v: cpu.getFlagV(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        v: 1,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x24 BIT ZeroPage 1')

    cpu.init()
    codes = [0x24, 0x3E]
    cpu.loadROM(codes)
    // 最后和A比较的值为0x0B
    v = 0x0B
    cpu.setValue(0x3E, v)
    // A的初始值
    a = 0xFF
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        v: cpu.getFlagV(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        v: 0,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x24 BIT ZeroPage 2')

    cpu.init()
    codes = [0x24, 0x3E]
    cpu.loadROM(codes)
    // 最后和A比较的值为0x8C
    v = 0x8C
    cpu.setValue(0x3E, v)
    // A的初始值
    a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        v: cpu.getFlagV(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        v: 0,
        n: 1,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x24 BIT ZeroPage 3')
}

// AND ZeroPage
const test0x25 = function() {
    const cpu = getCPUInstance()

    let codes = [0x25, 0x3E]
    cpu.loadROM(codes)
    // 最后和A比较的值为0x6E
    let v = 0x6E
    cpu.setValue(0x3E, v)
    // A的初始值
    let a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: a & v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x25 AND ZeroPage 1')

    cpu.init()
    codes = [0x25, 0x3E]
    cpu.loadROM(codes)
    // 最后和A比较的值为0x6E
    v = 0x6E
    cpu.setValue(0x3E, v)
    // A的初始值
    a = 0xff
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a & v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x25 AND ZeroPage 2')

    cpu.init()
    codes = [0x25, 0x3E]
    cpu.loadROM(codes)
    // 最后和A比较的值为0x6E
    v = 0xFF
    cpu.setValue(0x3E, v)
    // A的初始值
    a = 0xFF
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a & v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x25 AND ZeroPage 3')
}

// ROL ZeroPage
const test0x26 = function() {
    const cpu = getCPUInstance()

    let codes = [0x26, 0x3E]
    cpu.loadROM(codes)
    cpu.setFlag(Flag.C, 1)
    let v = 0x6E
    cpu.setValue(0x3E, v)
    cpu.run()

    let output = {
        value: cpu.getValue(0x3E),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        value: 0xDC + 1,
        c: 0,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x26 ROL ZeroPage 1')

    cpu.init()
    codes = [0x26, 0x3E]
    cpu.loadROM(codes)
    cpu.setFlag(Flag.C, 0)
    v = 0x9B
    cpu.setValue(0x3E, v)
    cpu.run()

    output = {
        value: cpu.getValue(0x3E),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        value: 0x36,
        c: 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x26 ROL ZeroPage 2')

    cpu.init()
    codes = [0x26, 0x3E]
    cpu.loadROM(codes)
    cpu.setFlag(Flag.C, 0)
    v = 0x00
    cpu.setValue(0x3E, v)
    cpu.run()

    output = {
        value: cpu.getValue(0x3E),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        value: 0x00,
        c: 0,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x26 ROL ZeroPage 3')
}

// PLP Implied
const test0x28 = function() {
    const cpu = getCPUInstance()

    let codes = [0x28]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.SP, 0xFF - 1)
    let v = 0b11001100
    cpu.setValue(0x1FF, v)
    cpu.run()

    let output = {
        p: cpu.getRegister(RegisterCPU.P),
    }
    let except = {
        p: v,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x28 PLP Implied 1')
}

// AND Immediate
const test0x29 = function() {
    const cpu = getCPUInstance()

    // 最后和A比较的值为0x6E
    let v = 0x6E
    let codes = [0x29, v]
    cpu.loadROM(codes)
    // A的初始值
    let a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: a & v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x29 AND Immediate 1')

    cpu.init()
    // 最后和A比较的值为0x6E
    v = 0x6E
    codes = [0x29, v]
    cpu.loadROM(codes)
    // A的初始值
    a = 0xFF
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a & v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x29 AND Immediate 2')

    cpu.init()
    // 最后和A比较的值为0x6E
    v = 0xFF
    codes = [0x29, v]
    cpu.loadROM(codes)
    // A的初始值
    a = 0xFF
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a & v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x29 AND Immediate 3')
}

// ROL Accumulator
const test0x2A = function() {
    const cpu = getCPUInstance()

    let codes = [0x2A]
    cpu.loadROM(codes)
    cpu.setFlag(Flag.C, 1)
    let v = 0x6E
    cpu.setRegister(RegisterCPU.A, v)
    cpu.run()

    let output = {
        value: cpu.getRegister(RegisterCPU.A),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        value: 0xDC + 1,
        c: 0,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x2A ROL Accumulator 1')

    cpu.init()
    codes = [0x2A]
    cpu.loadROM(codes)
    cpu.setFlag(Flag.C, 0)
    v = 0x9B
    cpu.setRegister(RegisterCPU.A, v)
    cpu.run()

    output = {
        value: cpu.getRegister(RegisterCPU.A),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        value: 0x36,
        c: 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x2A ROL Accumulator 2')

    cpu.init()
    codes = [0x2A]
    cpu.loadROM(codes)
    cpu.setFlag(Flag.C, 0)
    v = 0x00
    cpu.setRegister(RegisterCPU.A, v)
    cpu.run()

    output = {
        value: cpu.getRegister(RegisterCPU.A),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        value: 0x00,
        c: 0,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x2A ROL Accumulator 3')
}

// BIT Absolute
const test0x2C = function() {
    const cpu = getCPUInstance()

    let codes = [0x2C, 0x15, 0x24]
    cpu.loadROM(codes)
    // 最后和A比较的值为0x6E
    let v = 0x6E
    cpu.setValue(0x2415, v)
    // A的初始值
    let a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    let output = {
        v: cpu.getFlagV(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        v: 1,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x2C BIT Absolute 1')

    cpu.init()
    codes = [0x2C, 0x15, 0x24]
    cpu.loadROM(codes)
    // 最后和A比较的值为0x0B
    v = 0x0B
    cpu.setValue(0x2415, v)
    // A的初始值
    a = 0xFF
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        v: cpu.getFlagV(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        v: 0,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x2C BIT Absolute 2')

    cpu.init()
    codes = [0x2C, 0x15, 0x24]
    cpu.loadROM(codes)
    // 最后和A比较的值为0x8C
    v = 0x8C
    cpu.setValue(0x2415, v)
    // A的初始值
    a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        v: cpu.getFlagV(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        v: 0,
        n: 1,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x2C BIT Absolute 3')
}

// AND Absolute
const test0x2D = function() {
    const cpu = getCPUInstance()

    let codes = [0x2D, 0x15, 0x24]
    cpu.loadROM(codes)
    // 最后和A比较的值为0x6E
    let v = 0x6E
    cpu.setValue(0x2415, v)
    // A的初始值
    let a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: a & v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x2D AND Absolute 1')

    cpu.init()
    codes = [0x2D, 0x15, 0x24]
    cpu.loadROM(codes)
    // 最后和A比较的值为0x6E
    v = 0x6E
    cpu.setValue(0x2415, v)
    // A的初始值
    a = 0xFF
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a & v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x2D AND Absolute 2')

    cpu.init()
    codes = [0x2D, 0x15, 0x24]
    cpu.loadROM(codes)
    // 最后和A比较的值为0x6E
    v = 0xFF
    cpu.setValue(0x2415, v)
    // A的初始值
    a = 0xFF
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a & v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x2D AND Absolute 3')
}

// ROL Absolute
const test0x2E = function() {
    const cpu = getCPUInstance()

    let codes = [0x2E, 0x15, 0x24]
    cpu.loadROM(codes)
    cpu.setFlag(Flag.C, 1)
    let v = 0x6E
    cpu.setValue(0x2415, v)
    cpu.run()

    let output = {
        value: cpu.getValue(0x2415),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        value: 0xDC + 1,
        c: 0,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x2E ROL Absolute 1')

    cpu.init()
    codes = [0x2E, 0x15, 0x24]
    cpu.loadROM(codes)
    cpu.setFlag(Flag.C, 0)
    v = 0x9B
    cpu.setValue(0x2415, v)
    cpu.run()

    output = {
        value: cpu.getValue(0x2415),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        value: 0x36,
        c: 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x2E ROL Absolute 2')

    cpu.init()
    codes = [0x2E, 0x15, 0x24]
    cpu.loadROM(codes)
    cpu.setFlag(Flag.C, 0)
    v = 0x00
    cpu.setValue(0x2415, v)
    cpu.run()

    output = {
        value: cpu.getValue(0x2415),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        value: 0x00,
        c: 0,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x2E ROL Absolute 3')
}

// BMI Relative
const test0x30 = function() {
    const cpu = getCPUInstance()
    let opcode = 0x30

    // 不跳转
    let codes = [opcode]
    let offset = setRelativeBackwards(codes, cpu)
    cpu.loadROM(codes)
    cpu.setFlag(Flag.N, 0)
    cpu.run()

    let output = {
        pc: cpu.getRegister(RegisterCPU.PC),
    }
    let except = {
        pc: cpu.indexPRGROM + 2,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x30 BMI Relative 1')

    // 跳转
    cpu.init()
    codes = [opcode]
    offset = setRelativeBackwards(codes, cpu)
    cpu.loadROM(codes)
    cpu.setFlag(Flag.N, 1)
    cpu.run()

    output = {
        pc: cpu.getRegister(RegisterCPU.PC),
    }
    except = {
        pc: cpu.indexPRGROM + 2 + offset,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x30 BMI Relative 2')

    // 跳转
    cpu.init()
    codes = [opcode]
    offset = setRelativeForwards(codes, cpu)
    cpu.loadROM(codes)
    cpu.setFlag(Flag.N, 1)
    cpu.run()

    output = {
        pc: cpu.getRegister(RegisterCPU.PC),
    }
    except = {
        pc: cpu.indexPRGROM + 2 + offset,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x30 BMI Relative 3')
}

// AND IndirectIndexedY
const test0x31 = function() {
    const cpu = getCPUInstance()

    let address = 0x4C
    let codes = [0x31, address]
    cpu.loadROM(codes)
    cpu.setValue(address, 0x00)
    cpu.setValue(address + 1, 0x21)
    cpu.setRegister(RegisterCPU.Y, 0x05)
    // 0x2100 + 0x05
    // 最后和A比较的值为0x6E
    let v = 0x6E
    cpu.setValue(0x2105, v)
    // A的初始值
    let a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: a & v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x31 AND IndirectIndexedY 1')

    cpu.init()
    address = 0x4C
    codes = [0x31, address]
    cpu.loadROM(codes)
    cpu.setValue(address, 0x00)
    cpu.setValue(address + 1, 0x21)
    cpu.setRegister(RegisterCPU.Y, 0x05)
    // 0x2100 + 0x05
    // 最后和A比较的值为0x6E
    v = 0x6E
    cpu.setValue(0x2105, v)
    // A的初始值
    a = 0xFF
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a & v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x31 AND IndirectIndexedY 2')

    cpu.init()
    address = 0x4C
    codes = [0x31, address]
    cpu.loadROM(codes)
    cpu.setValue(address, 0x00)
    cpu.setValue(address + 1, 0x21)
    cpu.setRegister(RegisterCPU.Y, 0x05)
    // 0x2100 + 0x05
    // 最后和A比较的值为0xFF
    v = 0xFF
    cpu.setValue(0x2105, v)
    // A的初始值
    a = 0xFF
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a & v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x31 AND IndirectIndexedY 3')
}

// AND ZeroPageX
const test0x35 = function() {
    const cpu = getCPUInstance()

    let codes = [0x35, 0x3E]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x3E + 0x05 = 0x43
    // 最后和A比较的值为0x6E
    let v = 0x6E
    cpu.setValue(0x43, v)
    // A的初始值
    let a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: a & v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x35 AND ZeroPageX 1')

    cpu.init()
    codes = [0x35, 0x3E]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x3E + 0x05 = 0x43
    // 最后和A比较的值为0x6E
    v = 0x6E
    cpu.setValue(0x43, v)
    // A的初始值
    a = 0xFF
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a & v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x35 AND ZeroPageX 2')

    cpu.init()
    codes = [0x35, 0x3E]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x3E + 0x05 = 0x43
    // 最后和A比较的值为0xFF
    v = 0xFF
    cpu.setValue(0x43, v)
    // A的初始值
    a = 0xFF
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a & v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x35 AND ZeroPageX 3')
}

// ROL ZeroPageX
const test0x36 = function() {
    const cpu = getCPUInstance()

    let codes = [0x36, 0x3E]
    cpu.loadROM(codes)
    cpu.setFlag(Flag.C, 1)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x3E + 0x05 = 0x43
    let v = 0x6E
    cpu.setValue(0x43, v)
    cpu.run()

    let output = {
        value: cpu.getValue(0x43),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        value: 0xDC + 1,
        c: 0,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x36 ROL ZeroPageX 1')

    cpu.init()
    codes = [0x36, 0x3E]
    cpu.loadROM(codes)
    cpu.setFlag(Flag.C, 0)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x3E + 0x05 = 0x43
    v = 0x9B
    cpu.setValue(0x43, v)
    cpu.run()

    output = {
        value: cpu.getValue(0x43),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        value: 0x36,
        c: 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x36 ROL ZeroPageX 2')

    cpu.init()
    codes = [0x36, 0x3E]
    cpu.loadROM(codes)
    cpu.setFlag(Flag.C, 0)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x3E + 0x05 = 0x43
    v = 0x00
    cpu.setValue(0x43, v)
    cpu.run()

    output = {
        value: cpu.getValue(0x43),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        value: 0x00,
        c: 0,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x36 ROL ZeroPageX 3')
}

// SEC Implied
const test0x38 = function() {
    const cpu = getCPUInstance()

    let codes = [0x38]
    cpu.loadROM(codes)
    cpu.setFlag(Flag.C, 0)
    cpu.run()

    let output = {
        c: cpu.getFlagC(),
    }
    let except = {
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x38 SEC Implied 1')

    cpu.init()
    codes = [0x38]
    cpu.loadROM(codes)
    cpu.setFlag(Flag.C, 1)
    cpu.run()

    output = {
        c: cpu.getFlagC(),
    }
    except = {
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x38 SEC Implied 2')
}

// AND AbsoluteY
const test0x39 = function() {
    const cpu = getCPUInstance()

    let codes = [0x39, 0x15, 0x24]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.Y, 0x05)
    // 0x2415 + 0x05 = 0x241A
    // 最后和A比较的值为0x6E
    let v = 0x6E
    cpu.setValue(0x241A, v)
    // A的初始值
    let a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: a & v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x39 AND AbsoluteY 1')

    cpu.init()
    codes = [0x39, 0x15, 0x24]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.Y, 0x05)
    // 0x2415 + 0x05 = 0x241A
    // 最后和A比较的值为0x6E
    v = 0x6E
    cpu.setValue(0x241A, v)
    // A的初始值
    a = 0xFF
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a & v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x39 AND AbsoluteY 2')

    cpu.init()
    codes = [0x39, 0x15, 0x24]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.Y, 0x05)
    // 0x2415 + 0x05 = 0x241A
    // 最后和A比较的值为0xFF
    v = 0xFF
    cpu.setValue(0x241A, v)
    // A的初始值
    a = 0xFF
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a & v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x39 AND AbsoluteY 3')
}

// AND AbsoluteX
const test0x3D = function() {
    const cpu = getCPUInstance()

    let codes = [0x3D, 0x15, 0x24]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x2415 + 0x05 = 0x241A
    // 最后和A比较的值为0x6E
    let v = 0x6E
    cpu.setValue(0x241A, v)
    // A的初始值
    let a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: a & v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x3D AND AbsoluteX 1')

    cpu.init()
    codes = [0x3D, 0x15, 0x24]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x2415 + 0x05 = 0x241A
    // 最后和A比较的值为0x6E
    v = 0x6E
    cpu.setValue(0x241A, v)
    // A的初始值
    a = 0xFF
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a & v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x3D AND AbsoluteX 2')

    cpu.init()
    codes = [0x3D, 0x15, 0x24]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x2415 + 0x05 = 0x241A
    // 最后和A比较的值为0xFF
    v = 0xFF
    cpu.setValue(0x241A, v)
    // A的初始值
    a = 0xFF
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a & v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x3D AND AbsoluteX 3')
}

// ROL AbsoluteX
const test0x3E = function() {
    const cpu = getCPUInstance()

    let codes = [0x3E, 0x15, 0x24]
    cpu.loadROM(codes)
    cpu.setFlag(Flag.C, 1)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x2415 + 0x05 = 0x241A
    let v = 0x6E
    cpu.setValue(0x241A, v)
    cpu.run()

    let output = {
        value: cpu.getValue(0x241A),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        value: 0xDC + 1,
        c: 0,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x3E ROL AbsoluteX 1')

    cpu.init()
    codes = [0x3E, 0x15, 0x24]
    cpu.loadROM(codes)
    cpu.setFlag(Flag.C, 0)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x2415 + 0x05 = 0x241A
    v = 0x9B
    cpu.setValue(0x241A, v)
    cpu.run()

    output = {
        value: cpu.getValue(0x241A),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        value: 0x36,
        c: 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x3E ROL AbsoluteX 2')

    cpu.init()
    codes = [0x3E, 0x15, 0x24]
    cpu.loadROM(codes)
    cpu.setFlag(Flag.C, 0)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x2415 + 0x05 = 0x241A
    v = 0x00
    cpu.setValue(0x241A, v)
    cpu.run()

    output = {
        value: cpu.getValue(0x241A),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        value: 0x00,
        c: 0,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x3E ROL AbsoluteX 3')
}

// RTI Implied
const test0x40 = function() {
    const cpu = getCPUInstance()

    let codes = [0x40]
    cpu.loadROM(codes)
    cpu.setValue(cpu.indexStackHigh - 2, 0b11111111)
    cpu.setValue(cpu.indexStackHigh - 1, 0x12)
    cpu.setValue(cpu.indexStackHigh, 0x34)
    cpu.setRegister(RegisterCPU.SP, cpu.indexStackHigh - 3)
    cpu.run()

    let output = {
        p: cpu.getRegister(RegisterCPU.P),
        pc: cpu.getRegister(RegisterCPU.PC),
    }
    let except = {
        p: 0b11111111,
        pc: 0x3412,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x40 RTI Implied 1')
}

// EOR IndexedIndirectX
const test0x41 = function() {
    const cpu = getCPUInstance()

    let codes = [0x41, 0x3E]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x3E + 0x05 = 0x43
    cpu.setValue(0x43, 0x15)
    cpu.setValue(0x44, 0x24)
    // 最后和A比较的值为0x6E
    let v = 0x6E
    cpu.setValue(0x2415, v)
    // A的初始值
    let a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: a ^ v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x41 EOR IndexedIndirectX 1')

    cpu.init()
    codes = [0x41, 0x3E]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    cpu.setValue(0x43, 0x15)
    cpu.setValue(0x44, 0x24)
    // 最后和A比较的值为0x6E
    v = 0x6E
    cpu.setValue(0x2415, v)
    // A的初始值
    a = 0xFF
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a ^ v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x41 EOR IndexedIndirectX 2')

    cpu.init()
    codes = [0x41, 0x3E]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    cpu.setValue(0x43, 0x15)
    cpu.setValue(0x44, 0x24)
    // 最后和A比较的值为0x6E
    v = 0x00
    cpu.setValue(0x2415, v)
    // A的初始值
    a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a ^ v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x41 EOR IndexedIndirectX 3')
}

// EOR ZeroPage
const test0x45 = function() {
    const cpu = getCPUInstance()

    let codes = [0x45, 0x3E]
    cpu.loadROM(codes)
    // 最后和A比较的值为0x6E
    let v = 0x6E
    cpu.setValue(0x3E, v)
    // A的初始值
    let a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: a ^ v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x45 EOR ZeroPage 1')

    cpu.init()
    codes = [0x45, 0x3E]
    cpu.loadROM(codes)
    // 最后和A比较的值为0x6E
    v = 0x6E
    cpu.setValue(0x3E, v)
    // A的初始值
    a = 0xFF
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a ^ v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x45 EOR ZeroPage 2')

    cpu.init()
    codes = [0x45, 0x3E]
    cpu.loadROM(codes)
    // 最后和A比较的值为0x6E
    v = 0x00
    cpu.setValue(0x3E, v)
    // A的初始值
    a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a ^ v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x45 EOR ZeroPage 3')
}

// LSR ZeroPage
const test0x46 = function() {
    const cpu = getCPUInstance()

    let codes = [0x46, 0x3E]
    cpu.loadROM(codes)
    let v = 0xFF // 0b11111111
    cpu.setValue(0x3E, v)
    cpu.run()

    let output = {
        value: cpu.getValue(0x3E),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        value: 0x7F,
        c: 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x46 LSR ZeroPage 1')

    cpu.init()
    codes = [0x46, 0x3E]
    cpu.loadROM(codes)
    v = 0x00
    cpu.setValue(0x3E, v)
    cpu.run()

    output = {
        value: cpu.getValue(0x3E),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        value: 0x00,
        c: 0,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x46 LSR ZeroPage 2')
}

// PHA Implied
const test0x48 = function() {
    const cpu = getCPUInstance()

    let codes = [0x48]
    cpu.loadROM(codes)
    let v = 0x34
    cpu.setRegister(RegisterCPU.A, v)
    cpu.run()

    let output = {
        stack: cpu.getValue(cpu.getStackPointer() + 1),
    }
    let except = {
        stack: 0x34,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x48 PHA Implied 1')
}

// EOR Immediate
const test0x49 = function() {
    const cpu = getCPUInstance()

    // 最后和A比较的值为0x3E
    let v = 0x6E
    let codes = [0x49, v]
    cpu.loadROM(codes)
    // A的初始值
    let a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: a ^ v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x49 EOR Immediate 1')

    cpu.init()
    // 最后和A比较的值为0x6E
    codes = [0x49, v]
    cpu.loadROM(codes)
    // A的初始值
    a = 0xFF
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a ^ v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x49 EOR Immediate 2')

    cpu.init()
    // 最后和A比较的值为0x00
    v = 0x00
    codes = [0x49, v]
    cpu.loadROM(codes)
    // A的初始值
    a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a ^ v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x49 EOR Immediate 3')
}

// LSR Accumulator
const test0x4A = function() {
    const cpu = getCPUInstance()

    let codes = [0x4A]
    cpu.loadROM(codes)
    let v = 0xFF // 0b11111111
    cpu.setRegister(RegisterCPU.A, v)
    cpu.run()

    let output = {
        value: cpu.getRegister(RegisterCPU.A),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        value: 0x7F,
        c: 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x4A LSR Accumulator 1')

    cpu.init()
    codes = [0x4A]
    cpu.loadROM(codes)
    v = 0x00
    cpu.setRegister(RegisterCPU.A, v)
    cpu.run()

    output = {
        value: cpu.getRegister(RegisterCPU.A),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        value: 0x00,
        c: 0,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x4A LSR Accumulator 2')
}

// JMP Absolute
const test0x4C = function() {
    const cpu = getCPUInstance()

    let codes = [0x4C, 0x15, 0x24]
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        pc: cpu.getRegister(RegisterCPU.PC),
    }
    let except = {
        pc: 0x2415,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x4C JMP Absolute 1')
}

// EOR Absolute
const test0x4D = function() {
    const cpu = getCPUInstance()

    let codes = [0x4D, 0x15, 0x24]
    cpu.loadROM(codes)
    // 最后和A比较的值为0x6E
    let v = 0x6E
    cpu.setValue(0x2415, v)
    // A的初始值
    let a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: a ^ v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x4D EOR Absolute 1')

    cpu.init()
    codes = [0x4D, 0x15, 0x24]
    cpu.loadROM(codes)
    // 最后和A比较的值为0x6E
    v = 0x6E
    cpu.setValue(0x2415, v)
    // A的初始值
    a = 0xFF
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a ^ v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x4D EOR Absolute 2')

    cpu.init()
    codes = [0x4D, 0x15, 0x24]
    cpu.loadROM(codes)
    // 最后和A比较的值为0x6E
    v = 0x00
    cpu.setValue(0x2415, v)
    // A的初始值
    a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a ^ v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x4D EOR Absolute 3')
}

// LSR Absolute
const test0x4E = function() {
    const cpu = getCPUInstance()

    let codes = [0x4E, 0x15, 0x24]
    cpu.loadROM(codes)
    let v = 0xFF // 0b11111111
    cpu.setValue(0x2415, v)
    cpu.run()

    let output = {
        value: cpu.getValue(0x2415),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        value: 0x7F,
        c: 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x4E LSR Absolute 1')

    cpu.init()
    codes = [0x4E, 0x15, 0x24]
    cpu.loadROM(codes)
    v = 0x00
    cpu.setValue(0x2415, v)
    cpu.run()

    output = {
        value: cpu.getValue(0x2415),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        value: 0x00,
        c: 0,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x4E LSR Absolute 2')
}

// BVC Relative
const test0x50 = function() {
    const cpu = getCPUInstance()
    let opcode = 0x50

    // 不跳转
    let codes = [opcode]
    let offset = setRelativeBackwards(codes, cpu)
    cpu.loadROM(codes)
    cpu.setFlag(Flag.V, 1)
    cpu.run()

    let output = {
        pc: cpu.getRegister(RegisterCPU.PC),
    }
    let except = {
        pc: cpu.indexPRGROM + 2,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x50 BVC Relative 1')

    // 跳转
    cpu.init()
    codes = [opcode]
    offset = setRelativeBackwards(codes, cpu)
    cpu.loadROM(codes)
    cpu.setFlag(Flag.V, 0)
    cpu.run()

    output = {
        pc: cpu.getRegister(RegisterCPU.PC),
    }
    except = {
        pc: cpu.indexPRGROM + 2 + offset,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x50 BVC Relative 2')

    // 跳转
    cpu.init()
    codes = [opcode]
    offset = setRelativeForwards(codes, cpu)
    cpu.loadROM(codes)
    cpu.setFlag(Flag.V, 0)
    cpu.run()

    output = {
        pc: cpu.getRegister(RegisterCPU.PC),
    }
    except = {
        pc: cpu.indexPRGROM + 2 + offset,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x50 BVC Relative 3')
}

// EOR IndirectIndexedY
const test0x51 = function() {
    const cpu = getCPUInstance()

    let address = 0x4C
    let codes = [0x51, address]
    cpu.loadROM(codes)
    cpu.setValue(address, 0x00)
    cpu.setValue(address + 1, 0x21)
    cpu.setRegister(RegisterCPU.Y, 0x05)
    // 0x2100 + 0x05
    // 最后和A比较的值为0x6E
    let v = 0x6E
    cpu.setValue(0x2105, v)
    // A的初始值
    let a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: a ^ v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x51 EOR IndirectIndexedY 1')

    cpu.init()
    address = 0x4C
    codes = [0x51, address]
    cpu.loadROM(codes)
    cpu.setValue(address, 0x00)
    cpu.setValue(address + 1, 0x21)
    cpu.setRegister(RegisterCPU.Y, 0x05)
    // 0x2100 + 0x05
    // 最后和A比较的值为0x6E
    v = 0x6E
    cpu.setValue(0x2105, v)
    // A的初始值
    a = 0xFF
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a ^ v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x51 EOR IndirectIndexedY 2')

    cpu.init()
    address = 0x4C
    codes = [0x51, address]
    cpu.loadROM(codes)
    cpu.setValue(address, 0x00)
    cpu.setValue(address + 1, 0x21)
    cpu.setRegister(RegisterCPU.Y, 0x05)
    // 0x2100 + 0x05
    // 最后和A比较的值为0x6E
    v = 0x00
    cpu.setValue(0x2105, v)
    // A的初始值
    a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a ^ v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x51 EOR IndirectIndexedY 3')
}

// EOR ZeroPageX
const test0x55 = function() {
    const cpu = getCPUInstance()

    let codes = [0x55, 0x3E]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x3E + 0x05 = 0x43
    // 最后和A比较的值为0x6E
    let v = 0x6E
    cpu.setValue(0x43, v)
    // A的初始值
    let a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: a ^ v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x55 EOR ZeroPageX 1')

    cpu.init()
    codes = [0x55, 0x3E]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x3E + 0x05 = 0x43
    // 最后和A比较的值为0x6E
    v = 0x6E
    cpu.setValue(0x43, v)
    // A的初始值
    a = 0xFF
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a ^ v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x55 EOR ZeroPageX 2')

    cpu.init()
    codes = [0x55, 0x3E]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x3E + 0x05 = 0x43
    // 最后和A比较的值为0x6E
    v = 0x00
    cpu.setValue(0x43, v)
    // A的初始值
    a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a ^ v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x55 EOR ZeroPageX 3')
}

// LSR ZeroPageX
const test0x56 = function() {
    const cpu = getCPUInstance()

    let codes = [0x56, 0x3E]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x3E + 0x05 = 0x43
    let v = 0xFF // 0b11111111
    cpu.setValue(0x43, v)
    cpu.run()

    let output = {
        value: cpu.getValue(0x43),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        value: 0x7F,
        c: 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x56 LSR ZeroPageX 1')

    cpu.init()
    codes = [0x56, 0x3E]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x3E + 0x05 = 0x43
    v = 0x00
    cpu.setValue(0x43, v)
    cpu.run()

    output = {
        value: cpu.getValue(0x43),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        value: 0x00,
        c: 0,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x56 LSR ZeroPageX 2')
}

// CLI Implied
const test0x58 = function() {
    const cpu = getCPUInstance()

    let codes = [0x58]
    cpu.loadROM(codes)
    cpu.setFlag(Flag.I, 1)
    cpu.run()

    let output = {
        i: cpu.getFlagI(),
    }
    let except = {
        i: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x58 CLI Implied 1')
}

// EOR AbsoluteY
const test0x59 = function() {
    const cpu = getCPUInstance()

    let codes = [0x59, 0x15, 0x24]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.Y, 0x05)
    // 0x2415 + 0x05 = 0x241A
    // 最后和A比较的值为0x6E
    let v = 0x6E
    cpu.setValue(0x241A, v)
    // A的初始值
    let a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: a ^ v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x59 EOR AbsoluteY 1')

    cpu.init()
    codes = [0x59, 0x15, 0x24]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.Y, 0x05)
    // 0x2415 + 0x05 = 0x241A
    // 最后和A比较的值为0x6E
    v = 0x6E
    cpu.setValue(0x241A, v)
    // A的初始值
    a = 0xFF
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a ^ v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x59 EOR AbsoluteY 2')

    cpu.init()
    codes = [0x59, 0x15, 0x24]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.Y, 0x05)
    // 0x2415 + 0x05 = 0x241A
    // 最后和A比较的值为0x6E
    v = 0x00
    cpu.setValue(0x241A, v)
    // A的初始值
    a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a ^ v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x59 EOR AbsoluteY 3')
}

// EOR AbsoluteX
const test0x5D = function() {
    const cpu = getCPUInstance()

    let codes = [0x5D, 0x15, 0x24]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x2415 + 0x05 = 0x241A
    // 最后和A比较的值为0x6E
    let v = 0x6E
    cpu.setValue(0x241A, v)
    // A的初始值
    let a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: a ^ v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x5D EOR AbsoluteX 1')

    cpu.init()
    codes = [0x5D, 0x15, 0x24]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x2415 + 0x05 = 0x241A
    // 最后和A比较的值为0x6E
    v = 0x6E
    cpu.setValue(0x241A, v)
    // A的初始值
    a = 0xFF
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a ^ v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x5D EOR AbsoluteX 2')

    cpu.init()
    codes = [0x5D, 0x15, 0x24]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x2415 + 0x05 = 0x241A
    // 最后和A比较的值为0x6E
    v = 0x00
    cpu.setValue(0x241A, v)
    // A的初始值
    a = 0x00
    cpu.setRegister(RegisterCPU.A, a)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: a ^ v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x5D EOR AbsoluteX 3')
}

// LSR AbsoluteX
const test0x5E = function() {
    const cpu = getCPUInstance()

    let codes = [0x5E, 0x15, 0x24]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x2415 + 0x05 = 0x241A
    let v = 0xFF // 0b11111111
    cpu.setValue(0x241A, v)
    cpu.run()

    let output = {
        value: cpu.getValue(0x241A),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        value: 0x7F,
        c: 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x5E LSR AbsoluteX 1')

    cpu.init()
    codes = [0x5E, 0x15, 0x24]
    cpu.loadROM(codes)
    cpu.setRegister(RegisterCPU.X, 0x05)
    // 0x2415 + 0x05 = 0x241A
    v = 0x00
    cpu.setValue(0x241A, v)
    cpu.run()

    output = {
        value: cpu.getValue(0x241A),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        value: 0x00,
        c: 0,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x5E LSR AbsoluteX 2')
}

// RTS Implied
const test0x60 = function() {
    const cpu = getCPUInstance()

    let codes = [0x60]
    cpu.loadROM(codes)
    cpu.pushStack(0x12)
    cpu.pushStack(0x34)
    cpu.run()

    let output = {
        pc: cpu.getRegister(RegisterCPU.PC),
    }
    let except = {
        pc: 0x1235,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x60 RTS Implied 1')
}

// ADC IndexedIndirectX
const test0x61 = function() {
    const cpu = getCPUInstance()

    let codes = [0x61]
    let address = setIndexedIndirectX(codes, cpu)
    // 最后和A相加的值为0x40
    // 63(A) + 64(M) + 1(C)
    let v = 0x40
    cpu.setValue(address, v)
    // A的初始值
    let a = 0x3F
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    let except = {
        a: 128,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x61 ADC IndexedIndirectX 1')


    cpu.init()
    codes = [0x61]
    address = setIndexedIndirectX(codes, cpu)
    // 最后和A相加的值为0x50
    // 0x10(A) + 0x50(M) + 0(C)
    v = 0x50
    cpu.setValue(address, v)
    // A的初始值
    a = 0x10
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x60,
        n: 0,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x61 ADC IndexedIndirectX 2')


    cpu.init()
    codes = [0x61]
    address = setIndexedIndirectX(codes, cpu)
    // 最后和A相加的值为0x50
    // 0x50(A) + 0x50(M) + 0(C)
    v = 0x50
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x61 ADC IndexedIndirectX 3')

    cpu.init()
    codes = [0x61]
    address = setIndexedIndirectX(codes, cpu)
    // 最后和A相加的值为0x90
    // 0x50(A) + 0x90(M) + 0(C)
    v = 0x90
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x61 ADC IndexedIndirectX 4')


    cpu.init()
    codes = [0x61]
    address = setIndexedIndirectX(codes, cpu)
    // 最后和A相加的值为0xD0
    // 0x50(A) + 0xD0(M) + 0(C)
    v = 0xD0
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x61 ADC IndexedIndirectX 5')


    cpu.init()
    codes = [0x61]
    address = setIndexedIndirectX(codes, cpu)
    // 最后和A相加的值为0x10
    // 0xD0(A) + 0x10(M) + 0(C)
    v = 0x10
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x61 ADC IndexedIndirectX 6')


    cpu.init()
    codes = [0x61]
    address = setIndexedIndirectX(codes, cpu)
    // 最后和A相加的值为0x50
    // 0xD0(A) + 0x50(M) + 0(C)
    v = 0x50
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x61 ADC IndexedIndirectX 7')


    cpu.init()
    codes = [0x61]
    address = setIndexedIndirectX(codes, cpu)
    // 最后和A相加的值为0x40
    // 0xD0(A) + 0x90(M) + 0(C)
    v = 0x90
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 0)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 96,
        n: 0,
        z: 0,
        v: 1,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x61 ADC IndexedIndirectX 8')

    cpu.init()
    codes = [0x61]
    address = setIndexedIndirectX(codes, cpu)
    // 最后和A相加的值为0xD0
    // 0xD0(A) + 0xD0(M) + 0(C)
    v = 0xD0
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x61 ADC IndexedIndirectX 9')
}

// ADC ZeroPage
const test0x65 = function() {
    const cpu = getCPUInstance()

    let codes = [0x65]
    let address = setZeroPage(codes, cpu)
    // 最后和A相加的值为0x40
    // 63(A) + 64(M) + 1(C)
    let v = 0x40
    cpu.setValue(address, v)
    // A的初始值
    let a = 0x3F
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    let except = {
        a: 128,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x65 ADC ZeroPage 1')


    cpu.init()
    codes = [0x65]
    address = setZeroPage(codes, cpu)
    // 最后和A相加的值为0x50
    // 0x10(A) + 0x50(M) + 0(C)
    v = 0x50
    cpu.setValue(address, v)
    // A的初始值
    a = 0x10
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x60,
        n: 0,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x65 ADC ZeroPage 2')


    cpu.init()
    codes = [0x65]
    address = setZeroPage(codes, cpu)
    // 最后和A相加的值为0x50
    // 0x50(A) + 0x50(M) + 0(C)
    v = 0x50
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x65 ADC ZeroPage 3')

    cpu.init()
    codes = [0x65]
    address = setZeroPage(codes, cpu)
    // 最后和A相加的值为0x90
    // 0x50(A) + 0x90(M) + 0(C)
    v = 0x90
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x65 ADC ZeroPage 4')


    cpu.init()
    codes = [0x65]
    address = setZeroPage(codes, cpu)
    // 最后和A相加的值为0xD0
    // 0x50(A) + 0xD0(M) + 0(C)
    v = 0xD0
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x65 ADC ZeroPage 5')


    cpu.init()
    codes = [0x65]
    address = setZeroPage(codes, cpu)
    // 最后和A相加的值为0x10
    // 0xD0(A) + 0x10(M) + 0(C)
    v = 0x10
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x65 ADC ZeroPage 6')


    cpu.init()
    codes = [0x65]
    address = setZeroPage(codes, cpu)
    // 最后和A相加的值为0x50
    // 0xD0(A) + 0x50(M) + 0(C)
    v = 0x50
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x65 ADC ZeroPage 7')


    cpu.init()
    codes = [0x65]
    address = setZeroPage(codes, cpu)
    // 最后和A相加的值为0x40
    // 0xD0(A) + 0x90(M) + 0(C)
    v = 0x90
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 0)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 96,
        n: 0,
        z: 0,
        v: 1,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x65 ADC ZeroPage 8')

    cpu.init()
    codes = [0x65]
    address = setZeroPage(codes, cpu)
    // 最后和A相加的值为0xD0
    // 0xD0(A) + 0xD0(M) + 0(C)
    v = 0xD0
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x65 ADC ZeroPage 9')
}

// ROR ZeroPage
const test0x66 = function() {
    const cpu = getCPUInstance()
    let opcode = 0x66
    let codes = [opcode]
    let address = setZeroPage(codes, cpu)

    cpu.setFlag(Flag.C, 1)
    let v = 0x6E
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        value: cpu.getValue(address),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        value: 0x37 + 0b10000000,
        c: 0,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x66 ROR ZeroPage 1')

    cpu.init()
    address = setZeroPage(codes, cpu)
    cpu.setFlag(Flag.C, 0)
    v = 0x9B
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        value: cpu.getValue(address),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        value: 0x4D,
        c: 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x66 ROR ZeroPage 2')

    cpu.init()
    address = setZeroPage(codes, cpu)
    cpu.setFlag(Flag.C, 0)
    v = 0x00
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        value: cpu.getValue(address),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        value: 0x00,
        c: 0,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x66 ROR ZeroPage 3')
}

// PLA Implied
const test0x68 = function() {
    const cpu = getCPUInstance()
    let opcode = 0x68

    let codes = [opcode]
    cpu.setRegister(RegisterCPU.SP, 0xFF - 1)
    let v = 0b11001100
    cpu.setValue(0x1FF, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x68 PLA Implied 1')

    cpu.init()
    cpu.setRegister(RegisterCPU.SP, 0xFF - 1)
    v = 0x00
    cpu.setValue(0x1FF, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x68 PLA Implied 1')
}

// ADC Immediate
const test0x69 = function() {
    const cpu = getCPUInstance()
    let opcode = 0x69

    let codes = [opcode]
    // 最后和A相加的值为0x40
    // 63(A) + 64(M) + 1(C)
    let v = 0x40
    codes.push(v)
    // A的初始值
    let a = 0x3F
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    let except = {
        a: 128,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x69 ADC Immediate 1')


    cpu.init()
    codes = [opcode]
    // 最后和A相加的值为0x50
    // 0x10(A) + 0x50(M) + 0(C)
    v = 0x50
    codes.push(v)
    // A的初始值
    a = 0x10
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x60,
        n: 0,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x69 ADC Immediate 2')


    cpu.init()
    codes = [opcode]
    // 最后和A相加的值为0x50
    // 0x50(A) + 0x50(M) + 0(C)
    v = 0x50
    codes.push(v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x69 ADC Immediate 3')

    cpu.init()
    codes = [opcode]
    // 最后和A相加的值为0x90
    // 0x50(A) + 0x90(M) + 0(C)
    v = 0x90
    codes.push(v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x69 ADC Immediate 4')


    cpu.init()
    codes = [opcode]
    // 最后和A相加的值为0xD0
    // 0x50(A) + 0xD0(M) + 0(C)
    v = 0xD0
    codes.push(v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x69 ADC Immediate 5')


    cpu.init()
    codes = [opcode]
    // 最后和A相加的值为0x10
    // 0xD0(A) + 0x10(M) + 0(C)
    v = 0x10
    codes.push(v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x69 ADC Immediate 6')


    cpu.init()
    codes = [opcode]
    // 最后和A相加的值为0x50
    // 0xD0(A) + 0x50(M) + 0(C)
    v = 0x50
    codes.push(v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x69 ADC Immediate 7')


    cpu.init()
    codes = [opcode]
    // 最后和A相加的值为0x40
    // 0xD0(A) + 0x90(M) + 0(C)
    v = 0x90
    codes.push(v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 0)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 96,
        n: 0,
        z: 0,
        v: 1,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x69 ADC Immediate 8')

    cpu.init()
    codes = [opcode]
    // 最后和A相加的值为0xD0
    // 0xD0(A) + 0xD0(M) + 0(C)
    v = 0xD0
    codes.push(v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x69 ADC Immediate 9')
}

// ROR Accumulator
const test0x6A = function() {
    const cpu = getCPUInstance()
    let opcode = 0x6A
    let codes = [opcode]

    cpu.setFlag(Flag.C, 1)
    let v = 0x6E
    cpu.setRegister(RegisterCPU.A, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        value: cpu.getRegister(RegisterCPU.A),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        value: 0x37 + 0b10000000,
        c: 0,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x6A ROR Accumulator 1')

    cpu.init()
    cpu.setFlag(Flag.C, 0)
    v = 0x9B
    cpu.setRegister(RegisterCPU.A, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        value: cpu.getRegister(RegisterCPU.A),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        value: 0x4D,
        c: 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x6A ROR Accumulator 2')

    cpu.init()
    cpu.setFlag(Flag.C, 0)
    v = 0x00
    cpu.setRegister(RegisterCPU.A, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        value: cpu.getRegister(RegisterCPU.A),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        value: 0x00,
        c: 0,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x6A ROR Accumulator 3')
}

// JMP Indirect
const test0x6C = function() {
    const cpu = getCPUInstance()
    let opcode = 0x6C

    let codes = [opcode]
    let address = setIndirect(codes, cpu)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        pc: cpu.getRegister(RegisterCPU.PC),
    }
    let except = {
        pc: address,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x6C JMP Indirect 1')
}

// ADC Absolute
const test0x6D = function() {
    const cpu = getCPUInstance()
    let opcode = 0x6D

    let codes = [opcode]
    let address = setAbsolute(codes, cpu)
    // 最后和A相加的值为0x40
    // 63(A) + 64(M) + 1(C)
    let v = 0x40
    cpu.setValue(address, v)
    // A的初始值
    let a = 0x3F
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    let except = {
        a: 128,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x6D ADC Absolute 1')


    cpu.init()
    codes = [opcode]
    address = setAbsolute(codes, cpu)
    // 最后和A相加的值为0x50
    // 0x10(A) + 0x50(M) + 0(C)
    v = 0x50
    cpu.setValue(address, v)
    // A的初始值
    a = 0x10
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x60,
        n: 0,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x6D ADC Absolute 2')


    cpu.init()
    codes = [opcode]
    address = setAbsolute(codes, cpu)
    // 最后和A相加的值为0x50
    // 0x50(A) + 0x50(M) + 0(C)
    v = 0x50
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x6D ADC Absolute 3')

    cpu.init()
    codes = [opcode]
    address = setAbsolute(codes, cpu)
    // 最后和A相加的值为0x90
    // 0x50(A) + 0x90(M) + 0(C)
    v = 0x90
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x6D ADC Absolute 4')


    cpu.init()
    codes = [opcode]
    address = setAbsolute(codes, cpu)
    // 最后和A相加的值为0xD0
    // 0x50(A) + 0xD0(M) + 0(C)
    v = 0xD0
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x6D ADC Absolute 5')


    cpu.init()
    codes = [opcode]
    address = setAbsolute(codes, cpu)
    // 最后和A相加的值为0x10
    // 0xD0(A) + 0x10(M) + 0(C)
    v = 0x10
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x6D ADC Absolute 6')


    cpu.init()
    codes = [opcode]
    address = setAbsolute(codes, cpu)
    // 最后和A相加的值为0x50
    // 0xD0(A) + 0x50(M) + 0(C)
    v = 0x50
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x6D ADC Absolute 7')


    cpu.init()
    codes = [opcode]
    address = setAbsolute(codes, cpu)
    // 最后和A相加的值为0x40
    // 0xD0(A) + 0x90(M) + 0(C)
    v = 0x90
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 0)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 96,
        n: 0,
        z: 0,
        v: 1,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x6D ADC Absolute 8')

    cpu.init()
    codes = [opcode]
    address = setAbsolute(codes, cpu)
    // 最后和A相加的值为0xD0
    // 0xD0(A) + 0xD0(M) + 0(C)
    v = 0xD0
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x6D ADC Absolute 9')
}

// ROR Absolute
const test0x6E = function() {
    const cpu = getCPUInstance()
    let opcode = 0x6E

    let codes = [opcode]
    let address = setAbsolute(codes, cpu)
    cpu.setFlag(Flag.C, 1)
    let v = 0x6E
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        value: cpu.getValue(address),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        value: 0x37 + 0b10000000,
        c: 0,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x6E ROR Absolute 1')

    cpu.init()
    address = setAbsolute(codes, cpu)
    cpu.setFlag(Flag.C, 0)
    v = 0x9B
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        value: cpu.getValue(address),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        value: 0x4D,
        c: 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x6E ROR Absolute 2')

    cpu.init()
    address = setAbsolute(codes, cpu)
    cpu.setFlag(Flag.C, 0)
    v = 0x00
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        value: cpu.getValue(address),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        value: 0x00,
        c: 0,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x6E ROR Absolute 3')
}

// BVS Relative
const test0x70 = function() {
    const cpu = getCPUInstance()
    let opcode = 0x70

    // 不跳转
    let codes = [opcode]
    let offset = setRelativeBackwards(codes, cpu)
    cpu.loadROM(codes)
    cpu.setFlag(Flag.V, 0)
    cpu.run()

    let output = {
        pc: cpu.getRegister(RegisterCPU.PC),
    }
    let except = {
        pc: cpu.indexPRGROM + 2,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x70 BVS Relative 1')

    // 跳转
    cpu.init()
    codes = [opcode]
    offset = setRelativeBackwards(codes, cpu)
    cpu.loadROM(codes)
    cpu.setFlag(Flag.V, 1)
    cpu.run()

    output = {
        pc: cpu.getRegister(RegisterCPU.PC),
    }
    except = {
        pc: cpu.indexPRGROM + 2 + offset,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x70 BVS Relative 2')

    // 跳转
    cpu.init()
    codes = [opcode]
    offset = setRelativeForwards(codes, cpu)
    cpu.loadROM(codes)
    cpu.setFlag(Flag.V, 1)
    cpu.run()

    output = {
        pc: cpu.getRegister(RegisterCPU.PC),
    }
    except = {
        pc: cpu.indexPRGROM + 2 + offset,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x70 BVS Relative 3')
}

// ADC IndirectIndexedY
const test0x71 = function() {
    const cpu = getCPUInstance()
    let opcode = 0x71

    let codes = [opcode]
    let address = setIndirectIndexedY(codes, cpu)
    // 最后和A相加的值为0x40
    // 63(A) + 64(M) + 1(C)
    let v = 0x40
    cpu.setValue(address, v)
    // A的初始值
    let a = 0x3F
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    let except = {
        a: 128,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x71 ADC IndirectIndexedY 1')


    cpu.init()
    codes = [opcode]
    address = setIndirectIndexedY(codes, cpu)
    // 最后和A相加的值为0x50
    // 0x10(A) + 0x50(M) + 0(C)
    v = 0x50
    cpu.setValue(address, v)
    // A的初始值
    a = 0x10
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x60,
        n: 0,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x71 ADC IndirectIndexedY 2')


    cpu.init()
    codes = [opcode]
    address = setIndirectIndexedY(codes, cpu)
    // 最后和A相加的值为0x50
    // 0x50(A) + 0x50(M) + 0(C)
    v = 0x50
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x71 ADC IndirectIndexedY 3')

    cpu.init()
    codes = [opcode]
    address = setIndirectIndexedY(codes, cpu)
    // 最后和A相加的值为0x90
    // 0x50(A) + 0x90(M) + 0(C)
    v = 0x90
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x71 ADC IndirectIndexedY 4')


    cpu.init()
    codes = [opcode]
    address = setIndirectIndexedY(codes, cpu)
    // 最后和A相加的值为0xD0
    // 0x50(A) + 0xD0(M) + 0(C)
    v = 0xD0
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x71 ADC IndirectIndexedY 5')


    cpu.init()
    codes = [opcode]
    address = setIndirectIndexedY(codes, cpu)
    // 最后和A相加的值为0x10
    // 0xD0(A) + 0x10(M) + 0(C)
    v = 0x10
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x71 ADC IndirectIndexedY 6')


    cpu.init()
    codes = [opcode]
    address = setIndirectIndexedY(codes, cpu)
    // 最后和A相加的值为0x50
    // 0xD0(A) + 0x50(M) + 0(C)
    v = 0x50
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x71 ADC IndirectIndexedY 7')


    cpu.init()
    codes = [opcode]
    address = setIndirectIndexedY(codes, cpu)
    // 最后和A相加的值为0x40
    // 0xD0(A) + 0x90(M) + 0(C)
    v = 0x90
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 0)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 96,
        n: 0,
        z: 0,
        v: 1,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x71 ADC IndirectIndexedY 8')

    cpu.init()
    codes = [opcode]
    address = setIndirectIndexedY(codes, cpu)
    // 最后和A相加的值为0xD0
    // 0xD0(A) + 0xD0(M) + 0(C)
    v = 0xD0
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x71 ADC IndirectIndexedY 9')
}

// ADC ZeroPageX
const test0x75 = function() {
    const cpu = getCPUInstance()
    let opcode = 0x75

    let codes = [opcode]
    let address = setZeroPageX(codes, cpu)
    // 最后和A相加的值为0x40
    // 63(A) + 64(M) + 1(C)
    let v = 0x40
    cpu.setValue(address, v)
    // A的初始值
    let a = 0x3F
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    let except = {
        a: 128,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x75 ADC ZeroPageX 1')


    cpu.init()
    codes = [opcode]
    address = setZeroPageX(codes, cpu)
    // 最后和A相加的值为0x50
    // 0x10(A) + 0x50(M) + 0(C)
    v = 0x50
    cpu.setValue(address, v)
    // A的初始值
    a = 0x10
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x60,
        n: 0,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x75 ADC ZeroPageX 2')


    cpu.init()
    codes = [opcode]
    address = setZeroPageX(codes, cpu)
    // 最后和A相加的值为0x50
    // 0x50(A) + 0x50(M) + 0(C)
    v = 0x50
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x75 ADC ZeroPageX 3')

    cpu.init()
    codes = [opcode]
    address = setZeroPageX(codes, cpu)
    // 最后和A相加的值为0x90
    // 0x50(A) + 0x90(M) + 0(C)
    v = 0x90
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x75 ADC ZeroPageX 4')


    cpu.init()
    codes = [opcode]
    address = setZeroPageX(codes, cpu)
    // 最后和A相加的值为0xD0
    // 0x50(A) + 0xD0(M) + 0(C)
    v = 0xD0
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x75 ADC ZeroPageX 5')


    cpu.init()
    codes = [opcode]
    address = setZeroPageX(codes, cpu)
    // 最后和A相加的值为0x10
    // 0xD0(A) + 0x10(M) + 0(C)
    v = 0x10
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x75 ADC ZeroPageX 6')


    cpu.init()
    codes = [opcode]
    address = setZeroPageX(codes, cpu)
    // 最后和A相加的值为0x50
    // 0xD0(A) + 0x50(M) + 0(C)
    v = 0x50
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x75 ADC ZeroPageX 7')


    cpu.init()
    codes = [opcode]
    address = setZeroPageX(codes, cpu)
    // 最后和A相加的值为0x40
    // 0xD0(A) + 0x90(M) + 0(C)
    v = 0x90
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 0)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 96,
        n: 0,
        z: 0,
        v: 1,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x75 ADC ZeroPageX 8')

    cpu.init()
    codes = [opcode]
    address = setZeroPageX(codes, cpu)
    // 最后和A相加的值为0xD0
    // 0xD0(A) + 0xD0(M) + 0(C)
    v = 0xD0
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x75 ADC ZeroPageX 9')
}

// ROR ZeroPageX
const test0x76 = function() {
    const cpu = getCPUInstance()
    let opcode = 0x76

    let codes = [opcode]
    let address = setZeroPageX(codes, cpu)
    cpu.setFlag(Flag.C, 1)
    let v = 0x6E
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        value: cpu.getValue(address),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        value: 0x37 + 0b10000000,
        c: 0,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x76 ROR ZeroPageX 1')

    cpu.init()
    codes = [opcode]
    address = setZeroPageX(codes, cpu)
    cpu.setFlag(Flag.C, 0)
    v = 0x9B
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        value: cpu.getValue(address),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        value: 0x4D,
        c: 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x76 ROR ZeroPageX 2')

    cpu.init()
    codes = [opcode]
    address = setZeroPageX(codes, cpu)
    cpu.setFlag(Flag.C, 0)
    v = 0x00
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        value: cpu.getValue(address),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        value: 0x00,
        c: 0,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x76 ROR ZeroPageX 3')
}

// SEI Implied
const test0x78 = function() {
    const cpu = getCPUInstance()

    let codes = [0x78]
    cpu.loadROM(codes)
    cpu.setFlag(Flag.I, 0)
    cpu.run()

    let output = {
        i: cpu.getFlagI(),
    }
    let except = {
        i: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x78 SEI Implied 1')
}

// ADC AbsoluteY
const test0x79 = function() {
    const cpu = getCPUInstance()
    let opcode = 0x79
    const addressFunc =  setAbsoluteY

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    // 最后和A相加的值为0x40
    // 63(A) + 64(M) + 1(C)
    let v = 0x40
    cpu.setValue(address, v)
    // A的初始值
    let a = 0x3F
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    let except = {
        a: 128,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x79 ADC AbsoluteY 1')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 最后和A相加的值为0x50
    // 0x10(A) + 0x50(M) + 0(C)
    v = 0x50
    cpu.setValue(address, v)
    // A的初始值
    a = 0x10
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x60,
        n: 0,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x79 ADC AbsoluteY 2')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 最后和A相加的值为0x50
    // 0x50(A) + 0x50(M) + 0(C)
    v = 0x50
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x79 ADC AbsoluteY 3')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 最后和A相加的值为0x90
    // 0x50(A) + 0x90(M) + 0(C)
    v = 0x90
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x79 ADC AbsoluteY 4')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 最后和A相加的值为0xD0
    // 0x50(A) + 0xD0(M) + 0(C)
    v = 0xD0
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x79 ADC AbsoluteY 5')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 最后和A相加的值为0x10
    // 0xD0(A) + 0x10(M) + 0(C)
    v = 0x10
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x79 ADC AbsoluteY 6')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 最后和A相加的值为0x50
    // 0xD0(A) + 0x50(M) + 0(C)
    v = 0x50
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x79 ADC AbsoluteY 7')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 最后和A相加的值为0x40
    // 0xD0(A) + 0x90(M) + 0(C)
    v = 0x90
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 0)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 96,
        n: 0,
        z: 0,
        v: 1,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x79 ADC AbsoluteY 8')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 最后和A相加的值为0xD0
    // 0xD0(A) + 0xD0(M) + 0(C)
    v = 0xD0
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x79 ADC AbsoluteY 9')
}

// ADC AbsoluteX
const test0x7D = function() {
    const cpu = getCPUInstance()
    let opcode = 0x7D
    const addressFunc =  setAbsoluteX

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    // 最后和A相加的值为0x40
    // 63(A) + 64(M) + 1(C)
    let v = 0x40
    cpu.setValue(address, v)
    // A的初始值
    let a = 0x3F
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    let except = {
        a: 128,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x7D ADC AbsoluteX 1')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 最后和A相加的值为0x50
    // 0x10(A) + 0x50(M) + 0(C)
    v = 0x50
    cpu.setValue(address, v)
    // A的初始值
    a = 0x10
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x60,
        n: 0,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x7D ADC AbsoluteX 2')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 最后和A相加的值为0x50
    // 0x50(A) + 0x50(M) + 0(C)
    v = 0x50
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x7D ADC AbsoluteX 3')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 最后和A相加的值为0x90
    // 0x50(A) + 0x90(M) + 0(C)
    v = 0x90
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x7D ADC AbsoluteX 4')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 最后和A相加的值为0xD0
    // 0x50(A) + 0xD0(M) + 0(C)
    v = 0xD0
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x7D ADC AbsoluteX 5')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 最后和A相加的值为0x10
    // 0xD0(A) + 0x10(M) + 0(C)
    v = 0x10
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x7D ADC AbsoluteX 6')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 最后和A相加的值为0x50
    // 0xD0(A) + 0x50(M) + 0(C)
    v = 0x50
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x7D ADC AbsoluteX 7')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 最后和A相加的值为0x40
    // 0xD0(A) + 0x90(M) + 0(C)
    v = 0x90
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 0)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 96,
        n: 0,
        z: 0,
        v: 1,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x7D ADC AbsoluteX 8')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 最后和A相加的值为0xD0
    // 0xD0(A) + 0xD0(M) + 0(C)
    v = 0xD0
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x7D ADC AbsoluteX 9')
}

// ROR AbsoluteX
const test0x7E = function() {
    const cpu = getCPUInstance()
    let opcode = 0x7E
    let addressFunc = setAbsoluteX

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    cpu.setFlag(Flag.C, 1)
    let v = 0x6E
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        value: cpu.getValue(address),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        value: 0x37 + 0b10000000,
        c: 0,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x7E ROR AbsoluteX 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    cpu.setFlag(Flag.C, 0)
    v = 0x9B
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        value: cpu.getValue(address),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        value: 0x4D,
        c: 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x7E ROR AbsoluteX 2')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    cpu.setFlag(Flag.C, 0)
    v = 0x00
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        value: cpu.getValue(address),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        value: 0x00,
        c: 0,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x7E ROR AbsoluteX 3')
}

// STA IndexedIndirectX
const test0x81 = function() {
    const cpu = getCPUInstance()
    let opcode = 0x81
    let addressFunc = setIndexedIndirectX

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x6E
    cpu.setRegister(RegisterCPU.A, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        value: cpu.getValue(address),
    }
    let except = {
        value: v,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x81 STA IndexedIndirectX 1')
}

// STY ZeroPage
const test0x84 = function() {
    const cpu = getCPUInstance()
    let opcode = 0x84
    let addressFunc = setZeroPage

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x6E
    cpu.setRegister(RegisterCPU.Y, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        value: cpu.getValue(address),
    }
    let except = {
        value: v,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x84 STY ZeroPage 1')
}

// STA ZeroPage
const test0x85 = function() {
    const cpu = getCPUInstance()
    let opcode = 0x85
    let addressFunc = setZeroPage

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x6E
    cpu.setRegister(RegisterCPU.A, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        value: cpu.getValue(address),
    }
    let except = {
        value: v,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x85 STA ZeroPage 1')
}

// STX ZeroPage
const test0x86 = function() {
    const cpu = getCPUInstance()
    let opcode = 0x86
    let addressFunc = setZeroPage

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x6E
    cpu.setRegister(RegisterCPU.X, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        value: cpu.getValue(address),
    }
    let except = {
        value: v,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x86 STX ZeroPage 1')
}

// DEY Implied
const test0x88 = function() {
    const cpu = getCPUInstance()
    let opcode = 0x88

    let codes = [opcode]
    let v = 0x6E
    cpu.setRegister(RegisterCPU.Y, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        y: cpu.getRegister(RegisterCPU.Y),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        y: v - 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x88 DEY Implied 1')

    cpu.init()
    codes = [opcode]
    v = 0x00
    cpu.setRegister(RegisterCPU.Y, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        y: cpu.getRegister(RegisterCPU.Y),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        y: 0xFF,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x88 DEY Implied 2')
}

// TXA Implied
const test0x8A = function() {
    const cpu = getCPUInstance()
    let opcode = 0x8A

    let codes = [opcode]
    let v = 0x6E
    cpu.setRegister(RegisterCPU.X, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x8A TXA Implied 1')
}

// STY Absolute
const test0x8C = function() {
    const cpu = getCPUInstance()
    let opcode = 0x8C
    let addressFunc = setAbsolute

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x6E
    cpu.setRegister(RegisterCPU.Y, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        value: cpu.getValue(address),
    }
    let except = {
        value: v,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x8C STY Absolute 1')
}

// STA Absolute
const test0x8D = function() {
    const cpu = getCPUInstance()
    let opcode = 0x8D
    let addressFunc = setAbsolute

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x6E
    cpu.setRegister(RegisterCPU.A, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        value: cpu.getValue(address),
    }
    let except = {
        value: v,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x8D STA Absolute 1')
}

// STX Absolute
const test0x8E = function() {
    const cpu = getCPUInstance()
    let opcode = 0x8E
    let addressFunc = setAbsolute

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x6E
    cpu.setRegister(RegisterCPU.X, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        value: cpu.getValue(address),
    }
    let except = {
        value: v,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x8E STX Absolute 1')
}

// BCC Relative
const test0x90 = function() {
    const cpu = getCPUInstance()
    let opcode = 0x90
    let addressFunc = setRelativeBackwards

    // 不跳转
    let codes = [opcode]
    let offset = addressFunc(codes, cpu)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        pc: cpu.getRegister(RegisterCPU.PC),
    }
    let except = {
        pc: cpu.indexPRGROM + 2,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x90 BCC Relative 1')

    // 跳转
    cpu.init()
    codes = [opcode]
    offset = addressFunc(codes, cpu)
    cpu.setFlag(Flag.C, 0)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        pc: cpu.getRegister(RegisterCPU.PC),
    }
    except = {
        pc: cpu.indexPRGROM + 2 + offset,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x90 BCC Relative 2')

    // 跳转
    cpu.init()
    codes = [opcode]
    offset = addressFunc(codes, cpu)
    cpu.loadROM(codes)
    cpu.setFlag(Flag.C, 0)
    cpu.run()

    output = {
        pc: cpu.getRegister(RegisterCPU.PC),
    }
    except = {
        pc: cpu.indexPRGROM + 2 + offset,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x90 BCC Relative 3')
}

// STA IndirectIndexedY
const test0x91 = function() {
    const cpu = getCPUInstance()
    let opcode = 0x91
    let addressFunc = setIndirectIndexedY

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x6E
    cpu.setRegister(RegisterCPU.A, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        value: cpu.getValue(address),
    }
    let except = {
        value: v,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x91 STA IndirectIndexedY 1')
}

// STY ZeroPageX
const test0x94 = function() {
    const cpu = getCPUInstance()
    let opcode = 0x94
    let addressFunc = setZeroPageX

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x6E
    cpu.setRegister(RegisterCPU.Y, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        value: cpu.getValue(address),
    }
    let except = {
        value: v,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x94 STY ZeroPageX 1')
}

// STA ZeroPageX
const test0x95 = function() {
    const cpu = getCPUInstance()
    let opcode = 0x95
    let addressFunc = setZeroPageX

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x6E
    cpu.setRegister(RegisterCPU.A, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        value: cpu.getValue(address),
    }
    let except = {
        value: v,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x95 STA ZeroPageX 1')
}

// STX ZeroPageY
const test0x96 = function() {
    const cpu = getCPUInstance()
    let opcode = 0x96
    let addressFunc = setZeroPageY

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x6E
    cpu.setRegister(RegisterCPU.X, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        value: cpu.getValue(address),
    }
    let except = {
        value: v,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x96 STX ZeroPageY 1')
}

// TYA Implied
const test0x98 = function() {
    const cpu = getCPUInstance()
    let opcode = 0x98

    let codes = [opcode]
    let v = 0x6E
    cpu.setRegister(RegisterCPU.Y, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x98 TYA Implied 1')
}

// STA AbsoluteY
const test0x99 = function() {
    const cpu = getCPUInstance()
    let opcode = 0x99
    let addressFunc = setAbsoluteY

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x6E
    cpu.setRegister(RegisterCPU.A, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        value: cpu.getValue(address),
    }
    let except = {
        value: v,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x99 STA AbsoluteY 1')
}

// TXS Implied
const test0x9A = function() {
    const cpu = getCPUInstance()
    let opcode = 0x9A

    let codes = [opcode]
    let v = 0x6E
    cpu.setRegister(RegisterCPU.X, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        sp: cpu.getRegister(RegisterCPU.SP),
    }
    let except = {
        sp: v,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x9A TXS Implied 1')
}

// STA AbsoluteX
const test0x9D = function() {
    const cpu = getCPUInstance()
    let opcode = 0x9D
    let addressFunc = setAbsoluteX

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x6E
    cpu.setRegister(RegisterCPU.A, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        value: cpu.getValue(address),
    }
    let except = {
        value: v,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0x9D STA AbsoluteX 1')
}

// LDY Immediate
const test0xA0 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xA0

    let codes = [opcode]
    let v = 0x96
    codes.push(v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        y: cpu.getRegister(RegisterCPU.Y),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        y: v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xA0 LDY Immediate 1')

    cpu.init()
    codes = [opcode]
    v = 0x00
    codes.push(v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        y: cpu.getRegister(RegisterCPU.Y),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        y: v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xA0 LDY Immediate 2')

    cpu.init()
    codes = [opcode]
    v = 0x55
    codes.push(v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        y: cpu.getRegister(RegisterCPU.Y),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        y: v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xA0 LDY Immediate 3')
}

// LDA IndexedIndirectX
const test0xA1 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xA1
    const addressFunc = setIndexedIndirectX

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x96
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xA1 LDA IndexedIndirectX 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x00
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xA1 LDA IndexedIndirectX 2')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x55
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xA1 LDA IndexedIndirectX 3')
}

// LDX Immediate
const test0xA2 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xA2

    let codes = [opcode]
    let v = 0x96
    codes.push(v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        x: cpu.getRegister(RegisterCPU.X),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        x: v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xA2 LDX Immediate 1')

    cpu.init()
    codes = [opcode]
    v = 0x00
    codes.push(v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        x: cpu.getRegister(RegisterCPU.X),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        x: v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xA2 LDX Immediate 2')

    cpu.init()
    codes = [opcode]
    v = 0x55
    codes.push(v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        x: cpu.getRegister(RegisterCPU.X),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        x: v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xA2 LDX Immediate 3')
}

// LDY ZeroPage
const test0xA4 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xA4
    const addressFunc = setZeroPage

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x96
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        y: cpu.getRegister(RegisterCPU.Y),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        y: v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xA4 LDY ZeroPage 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x00
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        y: cpu.getRegister(RegisterCPU.Y),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        y: v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xA4 LDY ZeroPage 2')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x55
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        y: cpu.getRegister(RegisterCPU.Y),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        y: v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xA4 LDY ZeroPage 3')
}

// LDA ZeroPage
const test0xA5 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xA5
    const addressFunc = setZeroPage

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x96
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xA5 LDA ZeroPage 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x00
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xA5 LDA ZeroPage 2')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x55
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xA5 LDA ZeroPage 3')
}

// LDX ZeroPage
const test0xA6 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xA6
    const addressFunc = setZeroPage

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x96
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        x: cpu.getRegister(RegisterCPU.X),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        x: v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xA6 LDX ZeroPage 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x00
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        x: cpu.getRegister(RegisterCPU.X),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        x: v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xA6 LDX ZeroPage 2')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x55
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        x: cpu.getRegister(RegisterCPU.X),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        x: v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xA6 LDX ZeroPage 3')
}

// TAY Implied
const test0xA8 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xA8

    let codes = [opcode]
    let v = 0x6E
    cpu.setRegister(RegisterCPU.A, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        y: cpu.getRegister(RegisterCPU.Y),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        y: v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xA8 TAY Implied 1')
}

// LDA Immediate
const test0xA9 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xA9

    let codes = [opcode]
    let v = 0x96
    codes.push(v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xA9 LDA Immediate 1')

    cpu.init()
    codes = [opcode]
    v = 0x00
    codes.push(v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xA9 LDA Immediate 2')

    cpu.init()
    codes = [opcode]
    v = 0x55
    codes.push(v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xA9 LDA Immediate 3')
}

// TAX Implied
const test0xAA = function() {
    const cpu = getCPUInstance()
    let opcode = 0xAA

    let codes = [opcode]
    let v = 0x6E
    cpu.setRegister(RegisterCPU.A, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        x: cpu.getRegister(RegisterCPU.X),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        x: v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xAA TAX Implied 1')
}

// LDY Absolute
const test0xAC = function() {
    const cpu = getCPUInstance()
    let opcode = 0xAC
    const addressFunc = setAbsolute

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x96
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        y: cpu.getRegister(RegisterCPU.Y),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        y: v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xAC LDY Absolute 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x00
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        y: cpu.getRegister(RegisterCPU.Y),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        y: v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xAC LDY Absolute 2')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x55
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        y: cpu.getRegister(RegisterCPU.Y),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        y: v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xAC LDY Absolute 3')
}

// LDA Absolute
const test0xAD = function() {
    const cpu = getCPUInstance()
    let opcode = 0xAD
    const addressFunc = setAbsolute

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x96
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xAD LDA Absolute 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x00
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xAD LDA Absolute 2')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x55
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xAD LDA Absolute 3')
}

// LDX Absolute
const test0xAE = function() {
    const cpu = getCPUInstance()
    let opcode = 0xAE
    const addressFunc = setAbsolute

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x96
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        x: cpu.getRegister(RegisterCPU.X),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        x: v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xAE LDX Absolute 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x00
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        x: cpu.getRegister(RegisterCPU.X),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        x: v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xAE LDX Absolute 2')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x55
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        x: cpu.getRegister(RegisterCPU.X),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        x: v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xAE LDX Absolute 3')
}

// BCS Relative
const test0xB0 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xB0
    let addressFunc = setRelativeBackwards

    // 不跳转
    let codes = [opcode]
    let offset = addressFunc(codes, cpu)
    cpu.setFlag(Flag.C, 0)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        pc: cpu.getRegister(RegisterCPU.PC),
    }
    let except = {
        pc: cpu.indexPRGROM + 2,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xB0 BCS Relative 1')

    // 跳转
    cpu.init()
    codes = [opcode]
    offset = addressFunc(codes, cpu)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        pc: cpu.getRegister(RegisterCPU.PC),
    }
    except = {
        pc: cpu.indexPRGROM + 2 + offset,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xB0 BCS Relative 2')

    // 跳转
    cpu.init()
    codes = [opcode]
    offset = addressFunc(codes, cpu)
    cpu.loadROM(codes)
    cpu.setFlag(Flag.C, 1)
    cpu.run()

    output = {
        pc: cpu.getRegister(RegisterCPU.PC),
    }
    except = {
        pc: cpu.indexPRGROM + 2 + offset,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xB0 BCS Relative 3')
}

// LDA IndirectIndexedY
const test0xB1 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xB1
    const addressFunc = setIndirectIndexedY

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x96
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xB1 LDA IndirectIndexedY 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x00
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xB1 LDA IndirectIndexedY 2')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x55
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xB1 LDA IndirectIndexedY 3')
}

// LDY ZeroPageX
const test0xB4 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xB4
    const addressFunc = setZeroPageX

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x96
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        y: cpu.getRegister(RegisterCPU.Y),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        y: v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xB4 LDY ZeroPageX 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x00
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        y: cpu.getRegister(RegisterCPU.Y),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        y: v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xB4 LDY ZeroPageX 2')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x55
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        y: cpu.getRegister(RegisterCPU.Y),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        y: v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xB4 LDY ZeroPageX 3')
}

// LDA ZeroPageX
const test0xB5 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xB5
    const addressFunc = setZeroPageX

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x96
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xB5 LDA ZeroPageX 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x00
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xB5 LDA ZeroPageX 2')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x55
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xB5 LDA ZeroPageX 3')
}

// LDX ZeroPageY
const test0xB6 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xB6
    const addressFunc = setZeroPageY

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x96
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        x: cpu.getRegister(RegisterCPU.X),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        x: v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xB6 LDX ZeroPageY 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x00
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        x: cpu.getRegister(RegisterCPU.X),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        x: v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xB6 LDX ZeroPageY 2')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x55
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        x: cpu.getRegister(RegisterCPU.X),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        x: v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xB6 LDX ZeroPageY 3')
}

// CLV Implied
const test0xB8 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xB8

    let codes = [opcode]
    cpu.loadROM(codes)
    cpu.setFlag(Flag.V, 1)
    cpu.run()

    let output = {
        v: cpu.getFlagI(),
    }
    let except = {
        v: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xB8 CLV Implied 1')
}

// LDA AbsoluteY
const test0xB9 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xB9
    const addressFunc = setAbsoluteY

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x96
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xB9 LDA AbsoluteY 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x00
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xB9 LDA AbsoluteY 2')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x55
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xB9 LDA AbsoluteY 3')
}

// TSX Implied
const test0xBA = function() {
    const cpu = getCPUInstance()
    let opcode = 0xBA

    let codes = [opcode]
    let v = 0x6E
    cpu.setRegister(RegisterCPU.SP, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        x: cpu.getRegister(RegisterCPU.X),
    }
    let except = {
        x: v,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xBA TSX Implied 1')
}

// LDY AbsoluteX
const test0xBC = function() {
    const cpu = getCPUInstance()
    let opcode = 0xBC
    const addressFunc = setAbsoluteX

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x96
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        y: cpu.getRegister(RegisterCPU.Y),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        y: v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xBC LDY AbsoluteX 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x00
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        y: cpu.getRegister(RegisterCPU.Y),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        y: v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xBC LDY AbsoluteX 2')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x55
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        y: cpu.getRegister(RegisterCPU.Y),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        y: v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xBC LDY AbsoluteX 3')
}

// LDA AbsoluteX
const test0xBD = function() {
    const cpu = getCPUInstance()
    let opcode = 0xBD
    const addressFunc = setAbsoluteX

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x96
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        a: v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xBD LDA AbsoluteX 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x00
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xBD LDA AbsoluteX 2')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x55
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        a: v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xBD LDA AbsoluteX 3')
}

// LDX AbsoluteY
const test0xBE = function() {
    const cpu = getCPUInstance()
    let opcode = 0xBE
    const addressFunc = setAbsoluteY

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x96
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        x: cpu.getRegister(RegisterCPU.X),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        x: v,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xBE LDX AbsoluteY 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x00
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        x: cpu.getRegister(RegisterCPU.X),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        x: v,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xBE LDX AbsoluteY 2')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x55
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        x: cpu.getRegister(RegisterCPU.X),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        x: v,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xBE LDX AbsoluteY 3')
}

// CPY Immediate
const test0xC0 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xC0

    let codes = [opcode]
    let v = 0x96
    codes.push(v)
    cpu.setRegister(RegisterCPU.Y, 0x32)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    let except = {
        n: 1,
        z: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xC0 CPY Immediate 1')

    cpu.init()
    codes = [opcode]
    v = 0x35
    codes.push(v)
    cpu.setRegister(RegisterCPU.Y, 0x35)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    except = {
        n: 0,
        z: 1,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xC0 CPY Immediate 2')

    cpu.init()
    codes = [opcode]
    v = 0x35
    codes.push(v)
    cpu.setRegister(RegisterCPU.Y, 0x45)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    except = {
        n: 0,
        z: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xC0 CPY Immediate 3')
}

// CMP IndexedIndirectX
const test0xC1 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xC1
    const addressFunc = setIndexedIndirectX

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x96
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.A, 0x32)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    let except = {
        n: 1,
        z: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xC1 CMP IndexedIndirectX 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x35
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.A, 0x35)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    except = {
        n: 0,
        z: 1,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xC1 CMP IndexedIndirectX 2')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x35
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.A, 0x45)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    except = {
        n: 0,
        z: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xC1 CMP IndexedIndirectX 3')
}

// CPY ZeroPage
const test0xC4 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xC4
    const addressFunc = setZeroPage

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x96
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.Y, 0x32)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    let except = {
        n: 1,
        z: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xC4 CPY ZeroPage 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x35
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.Y, 0x35)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    except = {
        n: 0,
        z: 1,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xC4 CPY ZeroPage 2')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x35
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.Y, 0x45)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    except = {
        n: 0,
        z: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xC4 CPY ZeroPage 3')
}

// CMP ZeroPage
const test0xC5 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xC5
    const addressFunc = setZeroPage

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x96
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.A, 0x32)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    let except = {
        n: 1,
        z: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xC5 CMP ZeroPage 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x35
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.A, 0x35)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    except = {
        n: 0,
        z: 1,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xC5 CMP ZeroPage 2')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x35
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.A, 0x45)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    except = {
        n: 0,
        z: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xC5 CMP ZeroPage 3')
}

// DEC ZeroPage
const test0xC6 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xC6
    const addressFunc = setZeroPage

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x6E
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        v: cpu.getValue(address),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        v: v - 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xC6 DEC ZeroPage 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x00
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        v: cpu.getValue(address),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        v: 0xFF,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xC6 DEC ZeroPage 2')
}

// INY Implied
const test0xC8 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xC8

    let codes = [opcode]
    let v = 0x6E
    cpu.setRegister(RegisterCPU.Y, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        y: cpu.getRegister(RegisterCPU.Y),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        y: v + 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xC8 INY Implied 1')

    cpu.init()
    codes = [opcode]
    v = 0xFF
    cpu.setRegister(RegisterCPU.Y, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        y: cpu.getRegister(RegisterCPU.Y),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        y: 0,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xC8 INY Implied 2')
}

// CMP Immediate
const test0xC9 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xC9

    let codes = [opcode]
    let v = 0x96
    codes.push(v)
    cpu.setRegister(RegisterCPU.A, 0x32)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    let except = {
        n: 1,
        z: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xC9 CMP Immediate 1')

    cpu.init()
    codes = [opcode]
    v = 0x35
    codes.push(v)
    cpu.setRegister(RegisterCPU.A, 0x35)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    except = {
        n: 0,
        z: 1,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xC9 CMP Immediate 2')

    cpu.init()
    codes = [opcode]
    v = 0x35
    codes.push(v)
    cpu.setRegister(RegisterCPU.A, 0x45)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    except = {
        n: 0,
        z: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xC9 CMP Immediate 3')
}

// DEX Implied
const test0xCA = function() {
    const cpu = getCPUInstance()
    let opcode = 0xCA

    let codes = [opcode]
    let v = 0x6E
    cpu.setRegister(RegisterCPU.X, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        x: cpu.getRegister(RegisterCPU.X),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        x: v - 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xCA DEX Implied 1')

    cpu.init()
    codes = [opcode]
    v = 0x00
    cpu.setRegister(RegisterCPU.X, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        x: cpu.getRegister(RegisterCPU.X),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        x: 0xFF,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xCA DEX Implied 2')
}

// CPY Absolute
const test0xCC = function() {
    const cpu = getCPUInstance()
    let opcode = 0xCC
    const addressFunc = setAbsolute

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x96
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.Y, 0x32)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    let except = {
        n: 1,
        z: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xCC CPY Absolute 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x35
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.Y, 0x35)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    except = {
        n: 0,
        z: 1,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xCC CPY Absolute 2')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x35
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.Y, 0x45)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    except = {
        n: 0,
        z: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xCC CPY Absolute 3')
}

// CMP Absolute
const test0xCD = function() {
    const cpu = getCPUInstance()
    let opcode = 0xCD
    const addressFunc = setAbsolute

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x96
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.A, 0x32)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    let except = {
        n: 1,
        z: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xCD CMP Absolute 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x35
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.A, 0x35)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    except = {
        n: 0,
        z: 1,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xCD CMP Absolute 2')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x35
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.A, 0x45)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    except = {
        n: 0,
        z: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xCD CMP Absolute 3')
}

// DEC Absolute
const test0xCE = function() {
    const cpu = getCPUInstance()
    let opcode = 0xCE
    const addressFunc = setAbsolute

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x6E
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        v: cpu.getValue(address),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        v: v - 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xCE DEC Absolute 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x00
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        v: cpu.getValue(address),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        v: 0xFF,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xCE DEC Absolute 2')
}

// BNE Relative
const test0xD0 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xD0

    // 不跳转
    let codes = [opcode]
    let offset = setRelativeBackwards(codes, cpu)
    cpu.loadROM(codes)
    cpu.setFlag(Flag.Z, 1)
    cpu.run()

    let output = {
        pc: cpu.getRegister(RegisterCPU.PC),
    }
    let except = {
        pc: cpu.indexPRGROM + 2,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xD0 BNE Relative 1')

    // 跳转
    cpu.init()
    codes = [opcode]
    offset = setRelativeBackwards(codes, cpu)
    cpu.loadROM(codes)
    cpu.setFlag(Flag.Z, 0)
    cpu.run()

    output = {
        pc: cpu.getRegister(RegisterCPU.PC),
    }
    except = {
        pc: cpu.indexPRGROM + 2 + offset,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xD0 BNE Relative 2')

    // 跳转
    cpu.init()
    codes = [opcode]
    offset = setRelativeForwards(codes, cpu)
    cpu.loadROM(codes)
    cpu.setFlag(Flag.Z, 0)
    cpu.run()

    output = {
        pc: cpu.getRegister(RegisterCPU.PC),
    }
    except = {
        pc: cpu.indexPRGROM + 2 + offset,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xD0 BNE Relative 3')
}

// CMP IndirectIndexedY
const test0xD1 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xD1
    const addressFunc = setIndirectIndexedY

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x96
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.A, 0x32)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    let except = {
        n: 1,
        z: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xD1 CMP IndirectIndexedY 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x35
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.A, 0x35)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    except = {
        n: 0,
        z: 1,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xD1 CMP IndirectIndexedY 2')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x35
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.A, 0x45)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    except = {
        n: 0,
        z: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xD1 CMP IndirectIndexedY 3')
}

// CMP ZeroPageX
const test0xD5 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xD5
    const addressFunc = setZeroPageX

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x96
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.A, 0x32)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    let except = {
        n: 1,
        z: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xD5 CMP ZeroPageX 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x35
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.A, 0x35)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    except = {
        n: 0,
        z: 1,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xD5 CMP ZeroPageX 2')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x35
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.A, 0x45)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    except = {
        n: 0,
        z: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xD5 CMP ZeroPageX 3')
}

// DEC ZeroPageX
const test0xD6 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xD6
    const addressFunc = setZeroPageX

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x6E
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        v: cpu.getValue(address),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        v: v - 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xD6 DEC ZeroPageX 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x00
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        v: cpu.getValue(address),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        v: 0xFF,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xD6 DEC ZeroPageX 2')
}

// CLD Implied
const test0xD8 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xD8

    let codes = [opcode]
    cpu.loadROM(codes)
    cpu.setFlag(Flag.D, 1)
    cpu.run()

    let output = {
        d: cpu.getFlagD(),
    }
    let except = {
        d: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xD8 CLD Implied 1')

    cpu.init()
    codes = [opcode]
    cpu.loadROM(codes)
    cpu.setFlag(Flag.D, 0)
    cpu.run()

    output = {
        d: cpu.getFlagD(),
    }
    except = {
        d: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xD8 CLD Implied 2')
}

// CMP AbsoluteY
const test0xD9 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xD9
    const addressFunc = setAbsoluteY

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x96
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.A, 0x32)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    let except = {
        n: 1,
        z: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xD9 CMP AbsoluteY 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x35
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.A, 0x35)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    except = {
        n: 0,
        z: 1,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xD9 CMP AbsoluteY 2')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x35
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.A, 0x45)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    except = {
        n: 0,
        z: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xD9 CMP AbsoluteY 3')
}

// CMP AbsoluteX
const test0xDD = function() {
    const cpu = getCPUInstance()
    let opcode = 0xDD
    const addressFunc = setAbsoluteX

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x96
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.A, 0x32)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    let except = {
        n: 1,
        z: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xDD CMP AbsoluteX 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x35
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.A, 0x35)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    except = {
        n: 0,
        z: 1,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xDD CMP AbsoluteX 2')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x35
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.A, 0x45)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    except = {
        n: 0,
        z: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xDD CMP AbsoluteX 3')
}

// DEC AbsoluteX
const test0xDE = function() {
    const cpu = getCPUInstance()
    let opcode = 0xDE
    const addressFunc = setAbsoluteX

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x6E
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        v: cpu.getValue(address),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        v: v - 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xDE DEC AbsoluteX 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x00
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        v: cpu.getValue(address),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        v: 0xFF,
        n: 1,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xDE DEC AbsoluteX 2')
}

// CPX Immediate
const test0xE0 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xE0

    let codes = [opcode]
    let v = 0x96
    codes.push(v)
    cpu.setRegister(RegisterCPU.X, 0x32)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    let except = {
        n: 1,
        z: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE0 CPX Immediate 1')

    cpu.init()
    codes = [opcode]
    v = 0x35
    codes.push(v)
    cpu.setRegister(RegisterCPU.X, 0x35)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    except = {
        n: 0,
        z: 1,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE0 CPX Immediate 2')

    cpu.init()
    codes = [opcode]
    v = 0x35
    codes.push(v)
    cpu.setRegister(RegisterCPU.X, 0x45)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    except = {
        n: 0,
        z: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE0 CPX Immediate 3')
}

// SBC IndexedIndirectX
const test0xE1 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xE1
    const addressFunc =  setIndexedIndirectX

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    // 0x50(A) - 0xF0(M) + 0(C)
    let v = 0xF0
    cpu.setValue(address, v)
    // A的初始值
    let a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    let except = {
        a: 0x60,
        n: 0,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE1 SBC IndexedIndirectX 1')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0x50(A) - 0xB0(M) + 0(C)
    v = 0xB0
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE1 SBC IndexedIndirectX 2')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0x50(A) - 0x70(M) + 0(C)
    v = 0x70
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE1 SBC IndexedIndirectX 3')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0x50(A) - 0x30(M) + 0(C)
    v = 0x30
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE1 SBC IndexedIndirectX 4')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0xD0(A) - 0xF0(M) + 0(C)
    v = 0xF0
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE1 SBC IndexedIndirectX 5')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0xD0(A) - 0xB0(M) + 0(C)
    v = 0xB0
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE1 SBC IndexedIndirectX 6')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0xD0(A) - 0x70(M) + 0(C)
    v = 0x70
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x60,
        n: 0,
        z: 0,
        v: 1,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE1 SBC IndexedIndirectX 7')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0xD0(A) - 0x30(M) + 0(C)
    v = 0x30
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE1 SBC IndexedIndirectX 8')
}

// CPX ZeroPage
const test0xE4 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xE4
    const addressFunc = setZeroPage

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x96
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.X, 0x32)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    let except = {
        n: 1,
        z: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE4 CPX ZeroPage 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x35
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.X, 0x35)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    except = {
        n: 0,
        z: 1,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE4 CPX ZeroPage 2')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x35
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.X, 0x45)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    except = {
        n: 0,
        z: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE4 CPX ZeroPage 3')
}

// SBC ZeroPage
const test0xE5 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xE5
    const addressFunc =  setZeroPage

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    // 0x50(A) - 0xF0(M) + 0(C)
    let v = 0xF0
    cpu.setValue(address, v)
    // A的初始值
    let a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    let except = {
        a: 0x60,
        n: 0,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE5 SBC ZeroPage 1')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0x50(A) - 0xB0(M) + 0(C)
    v = 0xB0
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE5 SBC ZeroPage 2')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0x50(A) - 0x70(M) + 0(C)
    v = 0x70
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE5 SBC ZeroPage 3')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0x50(A) - 0x30(M) + 0(C)
    v = 0x30
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE5 SBC ZeroPage 4')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0xD0(A) - 0xF0(M) + 0(C)
    v = 0xF0
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE5 SBC ZeroPage 5')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0xD0(A) - 0xB0(M) + 0(C)
    v = 0xB0
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE5 SBC ZeroPage 6')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0xD0(A) - 0x70(M) + 0(C)
    v = 0x70
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x60,
        n: 0,
        z: 0,
        v: 1,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE5 SBC ZeroPage 7')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0xD0(A) - 0x30(M) + 0(C)
    v = 0x30
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE5 SBC ZeroPage 8')
}

// INC ZeroPage
const test0xE6 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xE6
    const addressFunc = setZeroPage

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x6E
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        v: cpu.getValue(address),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        v: v + 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE6 INC ZeroPage 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0xFF
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        v: cpu.getValue(address),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        v: 0,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE6 INC ZeroPage 2')
}

// INX Implied
const test0xE8 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xE8

    let codes = [opcode]
    let v = 0x6E
    cpu.setRegister(RegisterCPU.X, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        x: cpu.getRegister(RegisterCPU.X),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        x: v + 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE8 INX Implied 1')

    cpu.init()
    codes = [opcode]
    v = 0xFF
    cpu.setRegister(RegisterCPU.X, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        x: cpu.getRegister(RegisterCPU.X),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        x: 0,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE8 INX Implied 2')
}

// SBC Immediate
const test0xE9 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xE9

    let codes = [opcode]
    // 0x50(A) - 0xF0(M) + 0(C)
    let v = 0xF0
    codes.push(v)
    // A的初始值
    let a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    let except = {
        a: 0x60,
        n: 0,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE9 SBC Immediate 1')


    cpu.init()
    codes = [opcode]
    // 0x50(A) - 0xB0(M) + 0(C)
    v = 0xB0
    codes.push(v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE9 SBC Immediate 2')


    cpu.init()
    codes = [opcode]
    // 0x50(A) - 0x70(M) + 0(C)
    v = 0x70
    codes.push(v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE9 SBC Immediate 3')

    cpu.init()
    codes = [opcode]
    // 0x50(A) - 0x30(M) + 0(C)
    v = 0x30
    codes.push(v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE9 SBC Immediate 4')


    cpu.init()
    codes = [opcode]
    // 0xD0(A) - 0xF0(M) + 0(C)
    v = 0xF0
    codes.push(v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE9 SBC Immediate 5')


    cpu.init()
    codes = [opcode]
    // 0xD0(A) - 0xB0(M) + 0(C)
    v = 0xB0
    codes.push(v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE9 SBC Immediate 6')


    cpu.init()
    codes = [opcode]
    // 0xD0(A) - 0x70(M) + 0(C)
    v = 0x70
    codes.push(v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x60,
        n: 0,
        z: 0,
        v: 1,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE9 SBC Immediate 7')


    cpu.init()
    codes = [opcode]
    // 0xD0(A) - 0x30(M) + 0(C)
    v = 0x30
    codes.push(v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xE9 SBC Immediate 8')
}

// CPX Absolute
const test0xEC = function() {
    const cpu = getCPUInstance()
    let opcode = 0xEC
    const addressFunc = setAbsolute

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x96
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.X, 0x32)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    let except = {
        n: 1,
        z: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xEC CPX Absolute 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x35
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.X, 0x35)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    except = {
        n: 0,
        z: 1,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xEC CPX Absolute 2')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0x35
    cpu.setValue(address, v)
    cpu.setRegister(RegisterCPU.X, 0x45)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
    }
    except = {
        n: 0,
        z: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xEC CPX Absolute 3')
}

// SBC Absolute
const test0xED = function() {
    const cpu = getCPUInstance()
    let opcode = 0xED
    const addressFunc =  setAbsolute

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    // 0x50(A) - 0xF0(M) + 0(C)
    let v = 0xF0
    cpu.setValue(address, v)
    // A的初始值
    let a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    let except = {
        a: 0x60,
        n: 0,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xED SBC Absolute 1')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0x50(A) - 0xB0(M) + 0(C)
    v = 0xB0
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xED SBC Absolute 2')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0x50(A) - 0x70(M) + 0(C)
    v = 0x70
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xED SBC Absolute 3')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0x50(A) - 0x30(M) + 0(C)
    v = 0x30
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xED SBC Absolute 4')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0xD0(A) - 0xF0(M) + 0(C)
    v = 0xF0
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xED SBC Absolute 5')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0xD0(A) - 0xB0(M) + 0(C)
    v = 0xB0
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xED SBC Absolute 6')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0xD0(A) - 0x70(M) + 0(C)
    v = 0x70
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x60,
        n: 0,
        z: 0,
        v: 1,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xED SBC Absolute 7')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0xD0(A) - 0x30(M) + 0(C)
    v = 0x30
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xED SBC Absolute 8')
}

// INC Absolute
const test0xEE = function() {
    const cpu = getCPUInstance()
    let opcode = 0xEE
    const addressFunc = setAbsolute

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x6E
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        v: cpu.getValue(address),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        v: v + 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xEE INC Absolute 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0xFF
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        v: cpu.getValue(address),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        v: 0,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xEE INC Absolute 2')
}

// BEQ Relative
const test0xF0 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xF0
    let addressFunc = setRelativeBackwards

    // 不跳转
    let codes = [opcode]
    let offset = addressFunc(codes, cpu)
    cpu.setFlag(Flag.Z, 0)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        pc: cpu.getRegister(RegisterCPU.PC),
    }
    let except = {
        pc: cpu.indexPRGROM + 2,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xF0 BEQ Relative 1')

    // 跳转
    cpu.init()
    codes = [opcode]
    offset = addressFunc(codes, cpu)
    cpu.setFlag(Flag.Z, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        pc: cpu.getRegister(RegisterCPU.PC),
    }
    except = {
        pc: cpu.indexPRGROM + 2 + offset,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xF0 BEQ Relative 2')

    // 跳转
    cpu.init()
    codes = [opcode]
    offset = addressFunc(codes, cpu)
    cpu.loadROM(codes)
    cpu.setFlag(Flag.Z, 1)
    cpu.run()

    output = {
        pc: cpu.getRegister(RegisterCPU.PC),
    }
    except = {
        pc: cpu.indexPRGROM + 2 + offset,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xF0 BEQ Relative 3')
}

// SBC IndirectIndexedY
const test0xF1 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xF1
    const addressFunc =  setIndirectIndexedY

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    // 0x50(A) - 0xF0(M) + 0(C)
    let v = 0xF0
    cpu.setValue(address, v)
    // A的初始值
    let a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    let except = {
        a: 0x60,
        n: 0,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xF1 SBC IndirectIndexedY 1')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0x50(A) - 0xB0(M) + 0(C)
    v = 0xB0
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xF1 SBC IndirectIndexedY 2')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0x50(A) - 0x70(M) + 0(C)
    v = 0x70
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xF1 SBC IndirectIndexedY 3')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0x50(A) - 0x30(M) + 0(C)
    v = 0x30
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xF1 SBC IndirectIndexedY 4')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0xD0(A) - 0xF0(M) + 0(C)
    v = 0xF0
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xF1 SBC IndirectIndexedY 5')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0xD0(A) - 0xB0(M) + 0(C)
    v = 0xB0
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xF1 SBC IndirectIndexedY 6')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0xD0(A) - 0x70(M) + 0(C)
    v = 0x70
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x60,
        n: 0,
        z: 0,
        v: 1,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xF1 SBC IndirectIndexedY 7')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0xD0(A) - 0x30(M) + 0(C)
    v = 0x30
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xF1 SBC IndirectIndexedY 8')
}

// SBC ZeroPageX
const test0xF5 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xF5
    const addressFunc =  setZeroPageX

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    // 0x50(A) - 0xF0(M) + 0(C)
    let v = 0xF0
    cpu.setValue(address, v)
    // A的初始值
    let a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    let except = {
        a: 0x60,
        n: 0,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xF5 SBC ZeroPageX 1')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0x50(A) - 0xB0(M) + 0(C)
    v = 0xB0
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xF5 SBC ZeroPageX 2')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0x50(A) - 0x70(M) + 0(C)
    v = 0x70
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xF5 SBC ZeroPageX 3')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0x50(A) - 0x30(M) + 0(C)
    v = 0x30
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xF5 SBC ZeroPageX 4')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0xD0(A) - 0xF0(M) + 0(C)
    v = 0xF0
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xF5 SBC ZeroPageX 5')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0xD0(A) - 0xB0(M) + 0(C)
    v = 0xB0
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xF5 SBC ZeroPageX 6')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0xD0(A) - 0x70(M) + 0(C)
    v = 0x70
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x60,
        n: 0,
        z: 0,
        v: 1,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xF5 SBC ZeroPageX 7')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0xD0(A) - 0x30(M) + 0(C)
    v = 0x30
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xF5 SBC ZeroPageX 8')
}

// INC ZeroPageX
const test0xF6 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xF6
    const addressFunc = setZeroPageX

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x6E
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        v: cpu.getValue(address),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        v: v + 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xF6 INC ZeroPageX 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0xFF
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        v: cpu.getValue(address),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        v: 0,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xF6 INC ZeroPageX 2')
}

// SED Implied
const test0xF8 = function() {
    const cpu = getCPUInstance()

    let codes = [0xF8]
    cpu.loadROM(codes)
    cpu.setFlag(Flag.D, 0)
    cpu.run()

    let output = {
        d: cpu.getFlagD(),
    }
    let except = {
        d: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xF8 SED Implied 1')
}

// SBC AbsoluteY
const test0xF9 = function() {
    const cpu = getCPUInstance()
    let opcode = 0xF9
    const addressFunc =  setAbsoluteY

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    // 0x50(A) - 0xF0(M) + 0(C)
    let v = 0xF0
    cpu.setValue(address, v)
    // A的初始值
    let a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    let except = {
        a: 0x60,
        n: 0,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xF9 SBC AbsoluteY 1')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0x50(A) - 0xB0(M) + 0(C)
    v = 0xB0
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xF9 SBC AbsoluteY 2')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0x50(A) - 0x70(M) + 0(C)
    v = 0x70
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xF9 SBC AbsoluteY 3')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0x50(A) - 0x30(M) + 0(C)
    v = 0x30
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xF9 SBC AbsoluteY 4')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0xD0(A) - 0xF0(M) + 0(C)
    v = 0xF0
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xF9 SBC AbsoluteY 5')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0xD0(A) - 0xB0(M) + 0(C)
    v = 0xB0
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xF9 SBC AbsoluteY 6')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0xD0(A) - 0x70(M) + 0(C)
    v = 0x70
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x60,
        n: 0,
        z: 0,
        v: 1,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xF9 SBC AbsoluteY 7')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0xD0(A) - 0x30(M) + 0(C)
    v = 0x30
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xF9 SBC AbsoluteY 8')
}

// SBC AbsoluteX
const test0xFD = function() {
    const cpu = getCPUInstance()
    let opcode = 0xFD
    const addressFunc =  setAbsoluteX

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    // 0x50(A) - 0xF0(M) + 0(C)
    let v = 0xF0
    cpu.setValue(address, v)
    // A的初始值
    let a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    let except = {
        a: 0x60,
        n: 0,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xFD SBC AbsoluteX 1')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0x50(A) - 0xB0(M) + 0(C)
    v = 0xB0
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xFD SBC AbsoluteX 2')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0x50(A) - 0x70(M) + 0(C)
    v = 0x70
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xFD SBC AbsoluteX 3')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0x50(A) - 0x30(M) + 0(C)
    v = 0x30
    cpu.setValue(address, v)
    // A的初始值
    a = 0x50
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xFD SBC AbsoluteX 4')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0xD0(A) - 0xF0(M) + 0(C)
    v = 0xF0
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xE0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xFD SBC AbsoluteX 5')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0xD0(A) - 0xB0(M) + 0(C)
    v = 0xB0
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x20,
        n: 0,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xFD SBC AbsoluteX 6')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0xD0(A) - 0x70(M) + 0(C)
    v = 0x70
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0x60,
        n: 0,
        z: 0,
        v: 1,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xFD SBC AbsoluteX 7')


    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    // 0xD0(A) - 0x30(M) + 0(C)
    v = 0x30
    cpu.setValue(address, v)
    // A的初始值
    a = 0xD0
    cpu.setRegister(RegisterCPU.A, a)
    cpu.setFlag(Flag.C, 1)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        v: cpu.getFlagV(),
        c: cpu.getFlagC(),
    }
    except = {
        a: 0xA0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xFD SBC AbsoluteX 8')
}

// INC AbsoluteX
const test0xFE = function() {
    const cpu = getCPUInstance()
    let opcode = 0xFE
    const addressFunc = setAbsoluteX

    let codes = [opcode]
    let address = addressFunc(codes, cpu)
    let v = 0x6E
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    let output = {
        v: cpu.getValue(address),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    let except = {
        v: v + 1,
        n: 0,
        z: 0,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xFE INC AbsoluteX 1')

    cpu.init()
    codes = [opcode]
    address = addressFunc(codes, cpu)
    v = 0xFF
    cpu.setValue(address, v)
    cpu.loadROM(codes)
    cpu.run()

    output = {
        v: cpu.getValue(address),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
    }
    except = {
        v: 0,
        n: 0,
        z: 1,
    }
    ensure(JSON.stringify(output) === JSON.stringify(except), JSON.stringify(except), JSON.stringify(output), 'test 0xFE INC AbsoluteX 2')
}

const testInstructions = function() {
    test0x00()
    test0x01()
    test0x05()
    test0x06()
    test0x08()
    test0x09()
    test0x0A()
    test0x0D()
    test0x0E()
    test0x10()
    test0x11()
    test0x15()
    test0x16()
    test0x18()
    test0x19()
    test0x1D()
    test0x1E()
    test0x20()
    test0x21()
    test0x24()
    test0x25()
    test0x26()
    test0x28()
    test0x29()
    test0x2A()
    test0x2C()
    test0x2D()
    test0x2E()
    test0x30()
    test0x31()
    test0x35()
    test0x36()
    test0x38()
    test0x39()
    test0x3D()
    test0x3E()
    test0x40()
    test0x41()
    test0x45()
    test0x46()
    test0x48()
    test0x49()
    test0x4A()
    test0x4C()
    test0x4D()
    test0x4E()
    test0x50()
    test0x51()
    test0x55()
    test0x56()
    test0x58()
    test0x59()
    test0x5D()
    test0x5E()
    test0x60()
    test0x61()
    test0x65()
    test0x66()
    test0x68()
    test0x69()
    test0x6A()
    test0x6C()
    test0x6D()
    test0x6E()
    test0x70()
    test0x71()
    test0x75()
    test0x76()
    test0x78()
    test0x79()
    test0x7D()
    test0x7E()
    test0x81()
    test0x84()
    test0x85()
    test0x86()
    test0x88()
    test0x8A()
    test0x8C()
    test0x8D()
    test0x8E()
    test0x90()
    test0x91()
    test0x94()
    test0x95()
    test0x96()
    test0x98()
    test0x99()
    test0x9A()
    test0x9D()
    test0xA0()
    test0xA1()
    test0xA2()
    test0xA4()
    test0xA5()
    test0xA6()
    test0xA8()
    test0xA9()
    test0xAA()
    test0xAC()
    test0xAD()
    test0xAE()
    test0xB0()
    test0xB1()
    test0xB4()
    test0xB5()
    test0xB6()
    test0xB8()
    test0xB9()
    test0xBA()
    test0xBC()
    test0xBD()
    test0xBE()
    test0xC0()
    test0xC1()
    test0xC4()
    test0xC5()
    test0xC6()
    test0xC8()
    test0xC9()
    test0xCA()
    test0xCC()
    test0xCD()
    test0xD0()
    test0xD1()
    test0xD5()
    test0xD6()
    test0xD8()
    test0xD9()
    test0xDD()
    test0xDE()
    test0xE0()
    test0xE1()
    test0xE4()
    test0xE5()
    test0xE6()
    test0xE8()
    test0xE9()
    test0xEC()
    test0xED()
    test0xEE()
    test0xF0()
    test0xF1()
    test0xF5()
    test0xF6()
    test0xF8()
    test0xF9()
    test0xFD()
    test0xFE()
}

testInstructions()
