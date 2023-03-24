import { expect } from "chai"
import { CPU, createIOC } from "../lib"
import { Flag, RegisterCPU } from "../lib/const"
import { Inspector } from "../lib/inspector"

const setIndexedIndirectX = function (codes, cpu) {
  codes.push(0x3e)
  cpu.setRegister(RegisterCPU.X, 0x05)
  // 0x3E + 0x05 = 0x43
  cpu.setValue(0x43, 0x15)
  cpu.setValue(0x44, 0x24)

  let address = 0x2415
  return address
}

const setIndirectIndexedY = function (codes, cpu) {
  let address = 0x4c
  codes.push(address)
  cpu.setValue(address, 0x00)
  cpu.setValue(address + 1, 0x21)
  cpu.setRegister(RegisterCPU.Y, 0x05)
  // 0x2100 + 0x05

  return 0x2105
}

const setZeroPage = function (codes, cpu) {
  let address = 0x3e
  codes.push(address)
  return address
}

const setZeroPageX = function (codes, cpu) {
  codes.push(0x3e)
  cpu.setRegister(RegisterCPU.X, 0x05)
  // 0x3E + 0x05 = 0x43

  return 0x43
}

const setZeroPageY = function (codes, cpu) {
  codes.push(0x3e)
  cpu.setRegister(RegisterCPU.Y, 0x05)
  // 0x3E + 0x05 = 0x43

  return 0x43
}

const setIndirect = function (codes, cpu) {
  codes.push(0x5f, 0x21)
  cpu.setValue(0x215f, 0x76)
  cpu.setValue(0x2160, 0x30)

  return 0x3076
}

const setRelativeBackwards = function (codes, cpu) {
  codes.push(0xa7) // -89
  return -89
}
const setRelativeForwards = function (codes, cpu) {
  codes.push(0x27)
  return 0x27
}

const setAbsolute = function (codes, cpu) {
  codes.push(0x15, 0x24)

  return 0x2415
}

const setAbsoluteY = function (codes, cpu) {
  codes.push(0x15, 0x24)
  cpu.setRegister(RegisterCPU.Y, 0x05)
  // 0x2415 + 0x05 = 0x241A

  return 0x241a
}

const setAbsoluteX = function (codes, cpu) {
  codes.push(0x15, 0x24)
  cpu.setRegister(RegisterCPU.X, 0x05)
  // 0x2415 + 0x05 = 0x241A

  return 0x241a
}

describe("cpu instruction", () => {
  let ioc: ReturnType<typeof createIOC>
  let cpu: CPU
  beforeEach(() => {
    ioc = createIOC()
    cpu = ioc.get(CPU)
    ioc.get(Inspector).disabledLog() // 测试环境不需要打印 log 信息
  })

  describe("BRK Implied", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x00 BRK Implied 1", () => {
      codes = [0x00]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.P, 0b11111111)
      cpu.setValue(0xffff, 0x56)
      cpu.setValue(0xfffe, 0x78)
      cpu.run()
      let sp = cpu.getStackPointer()
      output = {
        b: cpu.getFlagB(),
        i: cpu.getFlagI(),
        pc: cpu.getRegister(RegisterCPU.PC),
        p1: cpu.getValue(sp + 3),
        p2: cpu.getValue(sp + 2),
        p3: cpu.getValue(sp + 1),
      }
      except = {
        b: 1,
        i: 1,
        pc: 0x5678,
        p1: 0x80,
        p2: 0x02,
        p3: 0b11111111,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("ORA IndexedIndirectX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x01 ORA IndexedIndirectX 1", () => {
      codes = [0x01, 0x3e]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.X, 0x05)
      // 0x3E + 0x05 = 0x43
      cpu.setValue(0x43, 0x15)
      cpu.setValue(0x44, 0x24)
      // 最后和A比较的值为0x6E
      v = 0x6e
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
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x01 ORA IndexedIndirectX 2", () => {
      codes = [0x01, 0x3e]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.X, 0x05)
      cpu.setValue(0x43, 0x15)
      cpu.setValue(0x44, 0x24)
      // 最后和A比较的值为0x6E
      v = 0x6e
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

      expect(output).deep.eq(except)
    })

    it("test 0x01 ORA IndexedIndirectX 3", () => {
      codes = [0x01, 0x3e]
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

      expect(output).deep.eq(except)
    })
  })

  describe("ORA ZeroPage", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x05 ORA ZeroPage 1", () => {
      codes = [0x05, 0x3e]
      cpu.loadROM(codes)
      // 最后和A比较的值为0x6E
      v = 0x6e
      cpu.setValue(0x3e, v)
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
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x05 ORA ZeroPage 2", () => {
      codes = [0x01, 0x3e]
      cpu.loadROM(codes)
      // 最后和A比较的值为0x6E
      v = 0x6e
      cpu.setValue(0x3e, v)
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

      expect(output).deep.eq(except)
    })

    it("test 0x05 ORA ZeroPage 3", () => {
      codes = [0x01, 0x3e]
      cpu.loadROM(codes)
      // 最后和A比较的值为0x6E
      v = 0x00
      cpu.setValue(0x3e, v)
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

      expect(output).deep.eq(except)
    })
  })

  describe("ASL ZeroPage", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x06 ASL ZeroPage 1", () => {
      codes = [0x06, 0x3e]
      cpu.loadROM(codes)
      v = 0x1
      cpu.setValue(0x3e, v)
      cpu.run()
      output = {
        value: cpu.getValue(0x3e),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
      }
      except = {
        value: 0x2,
        c: 0,
        n: 0,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x06 ASL ZeroPage 2", () => {
      codes = [0x06, 0x3e]
      cpu.loadROM(codes)
      // 最后和A比较的值为0x6E
      v = 0x89 // 1000 1001
      cpu.setValue(0x3e, v)
      cpu.run()
      output = {
        value: cpu.getValue(0x3e),
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

      expect(output).deep.eq(except)
    })
  })

  describe("PHP Implied", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x08 PHP Implied 1", () => {
      codes = [0x08]
      cpu.loadROM(codes)
      v = 0x1
      cpu.setRegister(RegisterCPU.P, v)
      cpu.run()
      output = {
        sp: cpu.getRegister(RegisterCPU.SP),
        v: cpu.getValue(cpu.getStackPointer() + 1),
      }
      except = {
        sp: 0xff - 1,
        v: v,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("ORA Immediate", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x09 ORA Immediate 1", () => {
      // 最后和A比较的值为0x6E
      v = 0x6e
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
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x09 ORA Immediate 2", () => {
      // 最后和A比较的值为0x6E
      v = 0x6e
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

      expect(output).deep.eq(except)
    })

    it("test 0x09 ORA Immediate 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("ASL Accumulator", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x0A ASL Accumulator 1", () => {
      codes = [0x0a]
      cpu.loadROM(codes)
      v = 0x1
      cpu.setRegister(RegisterCPU.A, v)
      cpu.run()
      output = {
        value: cpu.getRegister(RegisterCPU.A),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
      }
      except = {
        value: 0x2,
        c: 0,
        n: 0,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x0A ASL Accumulator 2", () => {
      codes = [0x0a]
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

      expect(output).deep.eq(except)
    })
  })

  describe("ORA Absolute", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x0D ORA Absolute 1", () => {
      codes = [0x0d, 0x15, 0x24]
      cpu.loadROM(codes)
      // 最后和A比较的值为0x6E
      v = 0x6e
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
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x0D ORA Absolute 2", () => {
      codes = [0x0d, 0x15, 0x24]
      cpu.loadROM(codes)
      // 最后和A比较的值为0x6E
      v = 0x6e
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

      expect(output).deep.eq(except)
    })

    it("test 0x0D ORA Absolute 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("ASL Absolute", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x0E ASL Absolute 1", () => {
      codes = [0x0e, 0x15, 0x24]
      cpu.loadROM(codes)
      v = 0x1
      cpu.setValue(0x2415, v)
      cpu.run()
      output = {
        value: cpu.getValue(0x2415),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
      }
      except = {
        value: 0x2,
        c: 0,
        n: 0,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x0E ASL Absolute 2", () => {
      codes = [0x0e, 0x15, 0x24]
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

      expect(output).deep.eq(except)
    })
  })

  describe("BPL Relative", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x10 BPL Relative 1", () => {
      opcode = 0x10
      // 不跳转
      codes = [opcode]
      offset = setRelativeBackwards(codes, cpu)
      cpu.setFlag(Flag.N, 1)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        pc: cpu.getRegister(RegisterCPU.PC),
      }
      except = {
        pc: cpu.indexPRGROM + 2,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x10 BPL Relative 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0x10 BPL Relative 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("ORA IndirectIndexedY", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x11 ORA IndirectIndexedY 1", () => {
      let address = 0x4c
      codes = [0x11, address]
      cpu.loadROM(codes)
      cpu.setValue(address, 0x00)
      cpu.setValue(address + 1, 0x21)
      cpu.setRegister(RegisterCPU.Y, 0x05)
      // 0x2100 + 0x05
      // 最后和A比较的值为0x6E
      v = 0x6e
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
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x11 ORA IndirectIndexedY 2", () => {
      address = 0x4c
      codes = [0x11, address]
      cpu.loadROM(codes)
      cpu.setValue(address, 0x00)
      cpu.setValue(address + 1, 0x21)
      cpu.setRegister(RegisterCPU.Y, 0x05)
      // 0x2100 + 0x05
      // 最后和A比较的值为0x6E
      v = 0x6e
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

      expect(output).deep.eq(except)
    })

    it("test 0x11 ORA IndirectIndexedY 3", () => {
      address = 0x4c
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

      expect(output).deep.eq(except)
    })
  })

  describe("ORA ZeroPageX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x15 ORA ZeroPageX 1", () => {
      codes = [0x15, 0x3e]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.X, 0x05)
      // 0x3E + 0x05 = 0x43
      // 最后和A比较的值为0x6E
      v = 0x6e
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
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x15 ORA ZeroPageX 2", () => {
      codes = [0x15, 0x3e]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.X, 0x05)
      // 最后和A比较的值为0x6E
      v = 0x6e
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

      expect(output).deep.eq(except)
    })

    it("test 0x15 ORA ZeroPageX 3", () => {
      codes = [0x15, 0x3e]
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

      expect(output).deep.eq(except)
    })
  })

  describe("ASL ZeroPageX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x16 ASL ZeroPageX 1", () => {
      codes = [0x16, 0x3e]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.X, 0x05)
      // 0x3E + 0x05 = 0x43
      v = 0x1
      cpu.setValue(0x43, v)
      cpu.run()
      output = {
        value: cpu.getValue(0x43),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
      }
      except = {
        value: 0x2,
        c: 0,
        n: 0,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x16 ASL ZeroPageX 2", () => {
      codes = [0x16, 0x3e]
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

      expect(output).deep.eq(except)
    })
  })

  describe("CLC Implied", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x18 CLC Implied 1", () => {
      codes = [0x18]
      cpu.loadROM(codes)
      cpu.setFlag(Flag.C, 1)
      cpu.run()
      output = {
        c: cpu.getFlagC(),
      }
      except = {
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x18 CLC Implied 2", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("ORA AbsoluteY", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x19 ORA AbsoluteY 1", () => {
      codes = [0x19, 0x15, 0x24]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.Y, 0x05)
      // 0x2415 + 0x05 = 0x241A
      // 最后和A比较的值为0x6E
      v = 0x6e
      cpu.setValue(0x241a, v)
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
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x19 ORA AbsoluteY 2", () => {
      codes = [0x19, 0x15, 0x24]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.Y, 0x05)
      // 0x2415 + 0x05 = 0x241A
      // 最后和A比较的值为0x6E
      v = 0x6e
      cpu.setValue(0x241a, v)
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

      expect(output).deep.eq(except)
    })

    it("test 0x19 ORA AbsoluteY 3", () => {
      codes = [0x19, 0x15, 0x24]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.Y, 0x05)
      // 0x2415 + 0x05 = 0x241A
      // 最后和A比较的值为0x6E
      v = 0x00
      cpu.setValue(0x241a, v)
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

      expect(output).deep.eq(except)
    })
  })

  describe("ORA AbsoluteX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x1D ORA AbsoluteX 1", () => {
      codes = [0x1d, 0x15, 0x24]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.X, 0x05)
      // 0x2415 + 0x05 = 0x241A
      // 最后和A比较的值为0x6E
      v = 0x6e
      cpu.setValue(0x241a, v)
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
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x1D ORA AbsoluteX 2", () => {
      codes = [0x1d, 0x15, 0x24]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.X, 0x05)
      // 0x2415 + 0x05 = 0x241A
      // 最后和A比较的值为0x6E
      v = 0x6e
      cpu.setValue(0x241a, v)
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

      expect(output).deep.eq(except)
    })

    it("test 0x1D ORA AbsoluteX 3", () => {
      codes = [0x1d, 0x15, 0x24]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.X, 0x05)
      // 0x2415 + 0x05 = 0x241A
      // 最后和A比较的值为0x6E
      v = 0x00
      cpu.setValue(0x241a, v)
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

      expect(output).deep.eq(except)
    })
  })

  describe("ASL AbsoluteX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x1E ASL AbsoluteX 1", () => {
      codes = [0x1e, 0x15, 0x24]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.X, 0x05)
      // 0x2415 + 0x05 = 0x241A
      v = 0x1
      cpu.setValue(0x241a, v)
      cpu.run()
      output = {
        value: cpu.getValue(0x241a),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
      }
      except = {
        value: 0x2,
        c: 0,
        n: 0,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x1E ASL AbsoluteX 2", () => {
      codes = [0x1e, 0x15, 0x24]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.X, 0x05)
      // 0x2415 + 0x05 = 0x241A
      v = 0x89 // 1000 1001
      cpu.setValue(0x241a, v)
      cpu.run()
      output = {
        value: cpu.getValue(0x241a),
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

      expect(output).deep.eq(except)
    })
  })

  describe("JSR Absolute", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x20 JSR Absolute 1", () => {
      codes = [0x20, 0x15, 0x24]
      cpu.loadROM(codes)
      cpu.run()
      let sp = cpu.getStackPointer()
      output = {
        pc: cpu.getRegister(RegisterCPU.PC),
        sp1: cpu.getValue(sp + 2),
        sp2: cpu.getValue(sp + 1),
      }
      except = {
        pc: 0x2415,
        sp1: 0x80,
        sp2: 0x02,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("AND IndexedIndirectX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x21 AND IndexedIndirectX 1", () => {
      codes = [0x21, 0x3e]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.X, 0x05)
      // 0x3E + 0x05 = 0x43
      cpu.setValue(0x43, 0x15)
      cpu.setValue(0x44, 0x24)
      // 最后和A比较的值为0x6E
      v = 0x6e
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
        a: a & v,
        n: 0,
        z: 1,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x21 AND IndexedIndirectX 2", () => {
      codes = [0x21, 0x3e]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.X, 0x05)
      cpu.setValue(0x43, 0x15)
      cpu.setValue(0x44, 0x24)
      // 最后和A比较的值为0x6E
      v = 0x6e
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

      expect(output).deep.eq(except)
    })

    it("test 0x21 AND IndexedIndirectX 3", () => {
      codes = [0x21, 0x3e]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.X, 0x05)
      cpu.setValue(0x43, 0x15)
      cpu.setValue(0x44, 0x24)
      // 最后和A比较的值为0x6E
      v = 0xff
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
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("BIT ZeroPage", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x24 BIT ZeroPage 1", () => {
      codes = [0x24, 0x3e]
      cpu.loadROM(codes)
      // 最后和A比较的值为0x6E
      v = 0x6e
      cpu.setValue(0x3e, v)
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
        v: 1,
        n: 0,
        z: 1,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x24 BIT ZeroPage 2", () => {
      codes = [0x24, 0x3e]
      cpu.loadROM(codes)
      // 最后和A比较的值为0x0B
      v = 0x0b
      cpu.setValue(0x3e, v)
      // A的初始值
      a = 0xff
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

      expect(output).deep.eq(except)
    })

    it("test 0x24 BIT ZeroPage 3", () => {
      codes = [0x24, 0x3e]
      cpu.loadROM(codes)
      // 最后和A比较的值为0x8C
      v = 0x8c
      cpu.setValue(0x3e, v)
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

      expect(output).deep.eq(except)
    })
  })

  describe("AND ZeroPage", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x25 AND ZeroPage 1", () => {
      codes = [0x25, 0x3e]
      cpu.loadROM(codes)
      // 最后和A比较的值为0x6E
      v = 0x6e
      cpu.setValue(0x3e, v)
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
        a: a & v,
        n: 0,
        z: 1,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x25 AND ZeroPage 2", () => {
      codes = [0x25, 0x3e]
      cpu.loadROM(codes)
      // 最后和A比较的值为0x6E
      v = 0x6e
      cpu.setValue(0x3e, v)
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

      expect(output).deep.eq(except)
    })

    it("test 0x25 AND ZeroPage 3", () => {
      codes = [0x25, 0x3e]
      cpu.loadROM(codes)
      // 最后和A比较的值为0x6E
      v = 0xff
      cpu.setValue(0x3e, v)
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
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("ROL ZeroPage", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x26 ROL ZeroPage 1", () => {
      codes = [0x26, 0x3e]
      cpu.loadROM(codes)
      cpu.setFlag(Flag.C, 1)
      v = 0x6e
      cpu.setValue(0x3e, v)
      cpu.run()
      output = {
        value: cpu.getValue(0x3e),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
      }
      except = {
        value: 0xdc + 1,
        c: 0,
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x26 ROL ZeroPage 2", () => {
      codes = [0x26, 0x3e]
      cpu.loadROM(codes)
      cpu.setFlag(Flag.C, 0)
      v = 0x9b
      cpu.setValue(0x3e, v)
      cpu.run()
      output = {
        value: cpu.getValue(0x3e),
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

      expect(output).deep.eq(except)
    })

    it("test 0x26 ROL ZeroPage 3", () => {
      codes = [0x26, 0x3e]
      cpu.loadROM(codes)
      cpu.setFlag(Flag.C, 0)
      v = 0x00
      cpu.setValue(0x3e, v)
      cpu.run()
      output = {
        value: cpu.getValue(0x3e),
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

      expect(output).deep.eq(except)
    })
  })

  describe("PLP Implied", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x28 PLP Implied 1", () => {
      codes = [0x28]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.SP, 0xff - 1)
      v = 0b11001100
      cpu.setValue(0x1ff, v)
      cpu.run()
      output = {
        p: cpu.getRegister(RegisterCPU.P),
      }
      except = {
        p: v,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("AND Immediate", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x29 AND Immediate 1", () => {
      // 最后和A比较的值为0x6E
      v = 0x6e
      codes = [0x29, v]
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
        a: a & v,
        n: 0,
        z: 1,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x29 AND Immediate 2", () => {
      // 最后和A比较的值为0x6E
      v = 0x6e
      codes = [0x29, v]
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
        a: a & v,
        n: 0,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x29 AND Immediate 3", () => {
      // 最后和A比较的值为0x6E
      v = 0xff
      codes = [0x29, v]
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
        a: a & v,
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("ROL Accumulator", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x2A ROL Accumulator 1", () => {
      codes = [0x2a]
      cpu.loadROM(codes)
      cpu.setFlag(Flag.C, 1)
      v = 0x6e
      cpu.setRegister(RegisterCPU.A, v)
      cpu.run()
      output = {
        value: cpu.getRegister(RegisterCPU.A),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
      }
      except = {
        value: 0xdc + 1,
        c: 0,
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x2A ROL Accumulator 2", () => {
      codes = [0x2a]
      cpu.loadROM(codes)
      cpu.setFlag(Flag.C, 0)
      v = 0x9b
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

      expect(output).deep.eq(except)
    })

    it("test 0x2A ROL Accumulator 3", () => {
      codes = [0x2a]
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

      expect(output).deep.eq(except)
    })
  })

  describe("BIT Absolute", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x2C BIT Absolute 1", () => {
      codes = [0x2c, 0x15, 0x24]
      cpu.loadROM(codes)
      // 最后和A比较的值为0x6E
      v = 0x6e
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
        v: 1,
        n: 0,
        z: 1,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x2C BIT Absolute 2", () => {
      codes = [0x2c, 0x15, 0x24]
      cpu.loadROM(codes)
      // 最后和A比较的值为0x0B
      v = 0x0b
      cpu.setValue(0x2415, v)
      // A的初始值
      a = 0xff
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

      expect(output).deep.eq(except)
    })

    it("test 0x2C BIT Absolute 3", () => {
      codes = [0x2c, 0x15, 0x24]
      cpu.loadROM(codes)
      // 最后和A比较的值为0x8C
      v = 0x8c
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

      expect(output).deep.eq(except)
    })
  })

  describe("AND Absolute", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x2D AND Absolute 1", () => {
      codes = [0x2d, 0x15, 0x24]
      cpu.loadROM(codes)
      // 最后和A比较的值为0x6E
      v = 0x6e
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
        a: a & v,
        n: 0,
        z: 1,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x2D AND Absolute 2", () => {
      codes = [0x2d, 0x15, 0x24]
      cpu.loadROM(codes)
      // 最后和A比较的值为0x6E
      v = 0x6e
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

      expect(output).deep.eq(except)
    })

    it("test 0x2D AND Absolute 3", () => {
      codes = [0x2d, 0x15, 0x24]
      cpu.loadROM(codes)
      // 最后和A比较的值为0x6E
      v = 0xff
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
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("ROL Absolute", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x2E ROL Absolute 1", () => {
      codes = [0x2e, 0x15, 0x24]
      cpu.loadROM(codes)
      cpu.setFlag(Flag.C, 1)
      v = 0x6e
      cpu.setValue(0x2415, v)
      cpu.run()
      output = {
        value: cpu.getValue(0x2415),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
      }
      except = {
        value: 0xdc + 1,
        c: 0,
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x2E ROL Absolute 2", () => {
      codes = [0x2e, 0x15, 0x24]
      cpu.loadROM(codes)
      cpu.setFlag(Flag.C, 0)
      v = 0x9b
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

      expect(output).deep.eq(except)
    })

    it("test 0x2E ROL Absolute 3", () => {
      codes = [0x2e, 0x15, 0x24]
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

      expect(output).deep.eq(except)
    })
  })

  describe("BMI Relative", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x30 BMI Relative 1", () => {
      opcode = 0x30
      // 不跳转
      codes = [opcode]
      offset = setRelativeBackwards(codes, cpu)
      cpu.loadROM(codes)
      cpu.setFlag(Flag.N, 0)
      cpu.run()
      output = {
        pc: cpu.getRegister(RegisterCPU.PC),
      }
      except = {
        pc: cpu.indexPRGROM + 2,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x30 BMI Relative 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0x30 BMI Relative 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("AND IndirectIndexedY", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x31 AND IndirectIndexedY 1", () => {
      let address = 0x4c
      codes = [0x31, address]
      cpu.loadROM(codes)
      cpu.setValue(address, 0x00)
      cpu.setValue(address + 1, 0x21)
      cpu.setRegister(RegisterCPU.Y, 0x05)
      // 0x2100 + 0x05
      // 最后和A比较的值为0x6E
      v = 0x6e
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
        a: a & v,
        n: 0,
        z: 1,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x31 AND IndirectIndexedY 2", () => {
      address = 0x4c
      codes = [0x31, address]
      cpu.loadROM(codes)
      cpu.setValue(address, 0x00)
      cpu.setValue(address + 1, 0x21)
      cpu.setRegister(RegisterCPU.Y, 0x05)
      // 0x2100 + 0x05
      // 最后和A比较的值为0x6E
      v = 0x6e
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
        a: a & v,
        n: 0,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x31 AND IndirectIndexedY 3", () => {
      address = 0x4c
      codes = [0x31, address]
      cpu.loadROM(codes)
      cpu.setValue(address, 0x00)
      cpu.setValue(address + 1, 0x21)
      cpu.setRegister(RegisterCPU.Y, 0x05)
      // 0x2100 + 0x05
      // 最后和A比较的值为0xFF
      v = 0xff
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
        a: a & v,
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("AND ZeroPageX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x35 AND ZeroPageX 1", () => {
      codes = [0x35, 0x3e]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.X, 0x05)
      // 0x3E + 0x05 = 0x43
      // 最后和A比较的值为0x6E
      v = 0x6e
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
        a: a & v,
        n: 0,
        z: 1,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x35 AND ZeroPageX 2", () => {
      codes = [0x35, 0x3e]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.X, 0x05)
      // 0x3E + 0x05 = 0x43
      // 最后和A比较的值为0x6E
      v = 0x6e
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
        a: a & v,
        n: 0,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x35 AND ZeroPageX 3", () => {
      codes = [0x35, 0x3e]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.X, 0x05)
      // 0x3E + 0x05 = 0x43
      // 最后和A比较的值为0xFF
      v = 0xff
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
        a: a & v,
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("ROL ZeroPageX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x36 ROL ZeroPageX 1", () => {
      codes = [0x36, 0x3e]
      cpu.loadROM(codes)
      cpu.setFlag(Flag.C, 1)
      cpu.setRegister(RegisterCPU.X, 0x05)
      // 0x3E + 0x05 = 0x43
      v = 0x6e
      cpu.setValue(0x43, v)
      cpu.run()
      output = {
        value: cpu.getValue(0x43),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
      }
      except = {
        value: 0xdc + 1,
        c: 0,
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x36 ROL ZeroPageX 2", () => {
      codes = [0x36, 0x3e]
      cpu.loadROM(codes)
      cpu.setFlag(Flag.C, 0)
      cpu.setRegister(RegisterCPU.X, 0x05)
      // 0x3E + 0x05 = 0x43
      v = 0x9b
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

      expect(output).deep.eq(except)
    })

    it("test 0x36 ROL ZeroPageX 3", () => {
      codes = [0x36, 0x3e]
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

      expect(output).deep.eq(except)
    })
  })

  describe("SEC Implied", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x38 SEC Implied 1", () => {
      codes = [0x38]
      cpu.loadROM(codes)
      cpu.setFlag(Flag.C, 0)
      cpu.run()
      output = {
        c: cpu.getFlagC(),
      }
      except = {
        c: 1,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x38 SEC Implied 2", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("AND AbsoluteY", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x39 AND AbsoluteY 1", () => {
      codes = [0x39, 0x15, 0x24]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.Y, 0x05)
      // 0x2415 + 0x05 = 0x241A
      // 最后和A比较的值为0x6E
      v = 0x6e
      cpu.setValue(0x241a, v)
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
        a: a & v,
        n: 0,
        z: 1,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x39 AND AbsoluteY 2", () => {
      codes = [0x39, 0x15, 0x24]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.Y, 0x05)
      // 0x2415 + 0x05 = 0x241A
      // 最后和A比较的值为0x6E
      v = 0x6e
      cpu.setValue(0x241a, v)
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

      expect(output).deep.eq(except)
    })

    it("test 0x39 AND AbsoluteY 3", () => {
      codes = [0x39, 0x15, 0x24]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.Y, 0x05)
      // 0x2415 + 0x05 = 0x241A
      // 最后和A比较的值为0xFF
      v = 0xff
      cpu.setValue(0x241a, v)
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
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("AND AbsoluteX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x3D AND AbsoluteX 1", () => {
      codes = [0x3d, 0x15, 0x24]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.X, 0x05)
      // 0x2415 + 0x05 = 0x241A
      // 最后和A比较的值为0x6E
      v = 0x6e
      cpu.setValue(0x241a, v)
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
        a: a & v,
        n: 0,
        z: 1,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x3D AND AbsoluteX 2", () => {
      codes = [0x3d, 0x15, 0x24]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.X, 0x05)
      // 0x2415 + 0x05 = 0x241A
      // 最后和A比较的值为0x6E
      v = 0x6e
      cpu.setValue(0x241a, v)
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

      expect(output).deep.eq(except)
    })

    it("test 0x3D AND AbsoluteX 3", () => {
      codes = [0x3d, 0x15, 0x24]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.X, 0x05)
      // 0x2415 + 0x05 = 0x241A
      // 最后和A比较的值为0xFF
      v = 0xff
      cpu.setValue(0x241a, v)
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
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("ROL AbsoluteX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x3E ROL AbsoluteX 1", () => {
      codes = [0x3e, 0x15, 0x24]
      cpu.loadROM(codes)
      cpu.setFlag(Flag.C, 1)
      cpu.setRegister(RegisterCPU.X, 0x05)
      // 0x2415 + 0x05 = 0x241A
      v = 0x6e
      cpu.setValue(0x241a, v)
      cpu.run()
      output = {
        value: cpu.getValue(0x241a),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
      }
      except = {
        value: 0xdc + 1,
        c: 0,
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x3E ROL AbsoluteX 2", () => {
      codes = [0x3e, 0x15, 0x24]
      cpu.loadROM(codes)
      cpu.setFlag(Flag.C, 0)
      cpu.setRegister(RegisterCPU.X, 0x05)
      // 0x2415 + 0x05 = 0x241A
      v = 0x9b
      cpu.setValue(0x241a, v)
      cpu.run()
      output = {
        value: cpu.getValue(0x241a),
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

      expect(output).deep.eq(except)
    })

    it("test 0x3E ROL AbsoluteX 3", () => {
      codes = [0x3e, 0x15, 0x24]
      cpu.loadROM(codes)
      cpu.setFlag(Flag.C, 0)
      cpu.setRegister(RegisterCPU.X, 0x05)
      // 0x2415 + 0x05 = 0x241A
      v = 0x00
      cpu.setValue(0x241a, v)
      cpu.run()
      output = {
        value: cpu.getValue(0x241a),
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

      expect(output).deep.eq(except)
    })
  })

  describe("RTI Implied", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x40 RTI Implied 1", () => {
      codes = [0x40]
      cpu.loadROM(codes)
      cpu.setValue(cpu.indexStackHigh - 2, 0b11111111)
      cpu.setValue(cpu.indexStackHigh - 1, 0x12)
      cpu.setValue(cpu.indexStackHigh, 0x34)
      cpu.setRegister(RegisterCPU.SP, cpu.indexStackHigh - 3)
      cpu.run()
      output = {
        p: cpu.getRegister(RegisterCPU.P),
        pc: cpu.getRegister(RegisterCPU.PC),
      }
      except = {
        p: 0b11111111,
        pc: 0x3412,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("EOR IndexedIndirectX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x41 EOR IndexedIndirectX 1", () => {
      codes = [0x41, 0x3e]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.X, 0x05)
      // 0x3E + 0x05 = 0x43
      cpu.setValue(0x43, 0x15)
      cpu.setValue(0x44, 0x24)
      // 最后和A比较的值为0x6E
      v = 0x6e
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
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x41 EOR IndexedIndirectX 2", () => {
      codes = [0x41, 0x3e]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.X, 0x05)
      cpu.setValue(0x43, 0x15)
      cpu.setValue(0x44, 0x24)
      // 最后和A比较的值为0x6E
      v = 0x6e
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
        a: a ^ v,
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x41 EOR IndexedIndirectX 3", () => {
      codes = [0x41, 0x3e]
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

      expect(output).deep.eq(except)
    })
  })

  describe("EOR ZeroPage", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x45 EOR ZeroPage 1", () => {
      codes = [0x45, 0x3e]
      cpu.loadROM(codes)
      // 最后和A比较的值为0x6E
      v = 0x6e
      cpu.setValue(0x3e, v)
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
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x45 EOR ZeroPage 2", () => {
      codes = [0x45, 0x3e]
      cpu.loadROM(codes)
      // 最后和A比较的值为0x6E
      v = 0x6e
      cpu.setValue(0x3e, v)
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
        a: a ^ v,
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x45 EOR ZeroPage 3", () => {
      codes = [0x45, 0x3e]
      cpu.loadROM(codes)
      // 最后和A比较的值为0x6E
      v = 0x00
      cpu.setValue(0x3e, v)
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

      expect(output).deep.eq(except)
    })
  })

  describe("LSR ZeroPage", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x46 LSR ZeroPage 1", () => {
      codes = [0x46, 0x3e]
      cpu.loadROM(codes)
      v = 0xff // 0b11111111
      cpu.setValue(0x3e, v)
      cpu.run()
      output = {
        value: cpu.getValue(0x3e),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
      }
      except = {
        value: 0x7f,
        c: 1,
        n: 0,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x46 LSR ZeroPage 2", () => {
      codes = [0x46, 0x3e]
      cpu.loadROM(codes)
      v = 0x00
      cpu.setValue(0x3e, v)
      cpu.run()
      output = {
        value: cpu.getValue(0x3e),
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

      expect(output).deep.eq(except)
    })
  })

  describe("PHA Implied", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x48 PHA Implied 1", () => {
      codes = [0x48]
      cpu.loadROM(codes)
      v = 0x34
      cpu.setRegister(RegisterCPU.A, v)
      cpu.run()
      output = {
        stack: cpu.getValue(cpu.getStackPointer() + 1),
      }
      except = {
        stack: 0x34,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("EOR Immediate", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x49 EOR Immediate 1", () => {
      // 最后和A比较的值为0x3E
      v = 0x6e
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
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x49 EOR Immediate 2", () => {
      // 最后和A比较的值为0x6E
      codes = [0x49, v]
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
        a: a ^ v,
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x49 EOR Immediate 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("LSR Accumulator", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x4A LSR Accumulator 1", () => {
      codes = [0x4a]
      cpu.loadROM(codes)
      v = 0xff // 0b11111111
      cpu.setRegister(RegisterCPU.A, v)
      cpu.run()
      output = {
        value: cpu.getRegister(RegisterCPU.A),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
      }
      except = {
        value: 0x7f,
        c: 1,
        n: 0,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x4A LSR Accumulator 2", () => {
      codes = [0x4a]
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

      expect(output).deep.eq(except)
    })
  })

  describe("JMP Absolute", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x4C JMP Absolute 1", () => {
      codes = [0x4c, 0x15, 0x24]
      cpu.loadROM(codes)
      cpu.run()
      output = {
        pc: cpu.getRegister(RegisterCPU.PC),
      }
      except = {
        pc: 0x2415,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("EOR Absolute", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x4D EOR Absolute 1", () => {
      codes = [0x4d, 0x15, 0x24]
      cpu.loadROM(codes)
      // 最后和A比较的值为0x6E
      v = 0x6e
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
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x4D EOR Absolute 2", () => {
      codes = [0x4d, 0x15, 0x24]
      cpu.loadROM(codes)
      // 最后和A比较的值为0x6E
      v = 0x6e
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
        a: a ^ v,
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x4D EOR Absolute 3", () => {
      codes = [0x4d, 0x15, 0x24]
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

      expect(output).deep.eq(except)
    })
  })

  describe("LSR Absolute", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x4E LSR Absolute 1", () => {
      codes = [0x4e, 0x15, 0x24]
      cpu.loadROM(codes)
      v = 0xff // 0b11111111
      cpu.setValue(0x2415, v)
      cpu.run()
      output = {
        value: cpu.getValue(0x2415),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
      }
      except = {
        value: 0x7f,
        c: 1,
        n: 0,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x4E LSR Absolute 2", () => {
      codes = [0x4e, 0x15, 0x24]
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

      expect(output).deep.eq(except)
    })
  })

  describe("BVC Relative", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x50 BVC Relative 1", () => {
      opcode = 0x50
      // 不跳转
      codes = [opcode]
      offset = setRelativeBackwards(codes, cpu)
      cpu.loadROM(codes)
      cpu.setFlag(Flag.V, 1)
      cpu.run()
      output = {
        pc: cpu.getRegister(RegisterCPU.PC),
      }
      except = {
        pc: cpu.indexPRGROM + 2,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x50 BVC Relative 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0x50 BVC Relative 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("EOR IndirectIndexedY", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x51 EOR IndirectIndexedY 1", () => {
      let address = 0x4c
      codes = [0x51, address]
      cpu.loadROM(codes)
      cpu.setValue(address, 0x00)
      cpu.setValue(address + 1, 0x21)
      cpu.setRegister(RegisterCPU.Y, 0x05)
      // 0x2100 + 0x05
      // 最后和A比较的值为0x6E
      v = 0x6e
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
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x51 EOR IndirectIndexedY 2", () => {
      address = 0x4c
      codes = [0x51, address]
      cpu.loadROM(codes)
      cpu.setValue(address, 0x00)
      cpu.setValue(address + 1, 0x21)
      cpu.setRegister(RegisterCPU.Y, 0x05)
      // 0x2100 + 0x05
      // 最后和A比较的值为0x6E
      v = 0x6e
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
        a: a ^ v,
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x51 EOR IndirectIndexedY 3", () => {
      address = 0x4c
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

      expect(output).deep.eq(except)
    })
  })

  describe("EOR ZeroPageX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x55 EOR ZeroPageX 1", () => {
      codes = [0x55, 0x3e]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.X, 0x05)
      // 0x3E + 0x05 = 0x43
      // 最后和A比较的值为0x6E
      v = 0x6e
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
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x55 EOR ZeroPageX 2", () => {
      codes = [0x55, 0x3e]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.X, 0x05)
      // 0x3E + 0x05 = 0x43
      // 最后和A比较的值为0x6E
      v = 0x6e
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
        a: a ^ v,
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x55 EOR ZeroPageX 3", () => {
      codes = [0x55, 0x3e]
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

      expect(output).deep.eq(except)
    })
  })

  describe("LSR ZeroPageX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x56 LSR ZeroPageX 1", () => {
      codes = [0x56, 0x3e]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.X, 0x05)
      // 0x3E + 0x05 = 0x43
      v = 0xff // 0b11111111
      cpu.setValue(0x43, v)
      cpu.run()
      output = {
        value: cpu.getValue(0x43),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
      }
      except = {
        value: 0x7f,
        c: 1,
        n: 0,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x56 LSR ZeroPageX 2", () => {
      codes = [0x56, 0x3e]
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

      expect(output).deep.eq(except)
    })
  })

  describe("CLI Implied", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x58 CLI Implied 1", () => {
      codes = [0x58]
      cpu.loadROM(codes)
      cpu.setFlag(Flag.I, 1)
      cpu.run()
      output = {
        i: cpu.getFlagI(),
      }
      except = {
        i: 0,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("EOR AbsoluteY", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x59 EOR AbsoluteY 1", () => {
      codes = [0x59, 0x15, 0x24]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.Y, 0x05)
      // 0x2415 + 0x05 = 0x241A
      // 最后和A比较的值为0x6E
      v = 0x6e
      cpu.setValue(0x241a, v)
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
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x59 EOR AbsoluteY 2", () => {
      codes = [0x59, 0x15, 0x24]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.Y, 0x05)
      // 0x2415 + 0x05 = 0x241A
      // 最后和A比较的值为0x6E
      v = 0x6e
      cpu.setValue(0x241a, v)
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
        a: a ^ v,
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x59 EOR AbsoluteY 3", () => {
      codes = [0x59, 0x15, 0x24]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.Y, 0x05)
      // 0x2415 + 0x05 = 0x241A
      // 最后和A比较的值为0x6E
      v = 0x00
      cpu.setValue(0x241a, v)
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

      expect(output).deep.eq(except)
    })
  })

  describe("EOR AbsoluteX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x5D EOR AbsoluteX 1", () => {
      codes = [0x5d, 0x15, 0x24]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.X, 0x05)
      // 0x2415 + 0x05 = 0x241A
      // 最后和A比较的值为0x6E
      v = 0x6e
      cpu.setValue(0x241a, v)
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
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x5D EOR AbsoluteX 2", () => {
      codes = [0x5d, 0x15, 0x24]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.X, 0x05)
      // 0x2415 + 0x05 = 0x241A
      // 最后和A比较的值为0x6E
      v = 0x6e
      cpu.setValue(0x241a, v)
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
        a: a ^ v,
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x5D EOR AbsoluteX 3", () => {
      codes = [0x5d, 0x15, 0x24]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.X, 0x05)
      // 0x2415 + 0x05 = 0x241A
      // 最后和A比较的值为0x6E
      v = 0x00
      cpu.setValue(0x241a, v)
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

      expect(output).deep.eq(except)
    })
  })

  describe("LSR AbsoluteX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x5E LSR AbsoluteX 1", () => {
      codes = [0x5e, 0x15, 0x24]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.X, 0x05)
      // 0x2415 + 0x05 = 0x241A
      v = 0xff // 0b11111111
      cpu.setValue(0x241a, v)
      cpu.run()
      output = {
        value: cpu.getValue(0x241a),
        c: cpu.getFlagC(),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
      }
      except = {
        value: 0x7f,
        c: 1,
        n: 0,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x5E LSR AbsoluteX 2", () => {
      codes = [0x5e, 0x15, 0x24]
      cpu.loadROM(codes)
      cpu.setRegister(RegisterCPU.X, 0x05)
      // 0x2415 + 0x05 = 0x241A
      v = 0x00
      cpu.setValue(0x241a, v)
      cpu.run()
      output = {
        value: cpu.getValue(0x241a),
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

      expect(output).deep.eq(except)
    })
  })

  describe("RTS Implied", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x60 RTS Implied 1", () => {
      codes = [0x60]
      cpu.loadROM(codes)
      cpu.pushStack(0x12)
      cpu.pushStack(0x34)
      cpu.run()
      output = {
        pc: cpu.getRegister(RegisterCPU.PC),
      }
      except = {
        pc: 0x1235,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("ADC IndexedIndirectX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x61 ADC IndexedIndirectX 1", () => {
      codes = [0x61]
      let address = setIndexedIndirectX(codes, cpu)
      // 最后和A相加的值为0x40
      // 63(A) + 64(M) + 1(C)
      v = 0x40
      cpu.setValue(address, v)
      // A的初始值
      a = 0x3f
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
        a: 128,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x61 ADC IndexedIndirectX 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0x61 ADC IndexedIndirectX 3", () => {
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x61 ADC IndexedIndirectX 4", () => {
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x61 ADC IndexedIndirectX 5", () => {
      codes = [0x61]
      address = setIndexedIndirectX(codes, cpu)
      // 最后和A相加的值为0xD0
      // 0x50(A) + 0xD0(M) + 0(C)
      v = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0x61 ADC IndexedIndirectX 6", () => {
      codes = [0x61]
      address = setIndexedIndirectX(codes, cpu)
      // 最后和A相加的值为0x10
      // 0xD0(A) + 0x10(M) + 0(C)
      v = 0x10
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x61 ADC IndexedIndirectX 7", () => {
      codes = [0x61]
      address = setIndexedIndirectX(codes, cpu)
      // 最后和A相加的值为0x50
      // 0xD0(A) + 0x50(M) + 0(C)
      v = 0x50
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0x61 ADC IndexedIndirectX 8", () => {
      codes = [0x61]
      address = setIndexedIndirectX(codes, cpu)
      // 最后和A相加的值为0x40
      // 0xD0(A) + 0x90(M) + 0(C)
      v = 0x90
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0x61 ADC IndexedIndirectX 9", () => {
      codes = [0x61]
      address = setIndexedIndirectX(codes, cpu)
      // 最后和A相加的值为0xD0
      // 0xD0(A) + 0xD0(M) + 0(C)
      v = 0xd0
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("ADC ZeroPage", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x65 ADC ZeroPage 1", () => {
      codes = [0x65]
      let address = setZeroPage(codes, cpu)
      // 最后和A相加的值为0x40
      // 63(A) + 64(M) + 1(C)
      v = 0x40
      cpu.setValue(address, v)
      // A的初始值
      a = 0x3f
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
        a: 128,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x65 ADC ZeroPage 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0x65 ADC ZeroPage 3", () => {
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x65 ADC ZeroPage 4", () => {
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x65 ADC ZeroPage 5", () => {
      codes = [0x65]
      address = setZeroPage(codes, cpu)
      // 最后和A相加的值为0xD0
      // 0x50(A) + 0xD0(M) + 0(C)
      v = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0x65 ADC ZeroPage 6", () => {
      codes = [0x65]
      address = setZeroPage(codes, cpu)
      // 最后和A相加的值为0x10
      // 0xD0(A) + 0x10(M) + 0(C)
      v = 0x10
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x65 ADC ZeroPage 7", () => {
      codes = [0x65]
      address = setZeroPage(codes, cpu)
      // 最后和A相加的值为0x50
      // 0xD0(A) + 0x50(M) + 0(C)
      v = 0x50
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0x65 ADC ZeroPage 8", () => {
      codes = [0x65]
      address = setZeroPage(codes, cpu)
      // 最后和A相加的值为0x40
      // 0xD0(A) + 0x90(M) + 0(C)
      v = 0x90
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0x65 ADC ZeroPage 9", () => {
      codes = [0x65]
      address = setZeroPage(codes, cpu)
      // 最后和A相加的值为0xD0
      // 0xD0(A) + 0xD0(M) + 0(C)
      v = 0xd0
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("ROR ZeroPage", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x66 ROR ZeroPage 1", () => {
      opcode = 0x66
      codes = [opcode]
      let address = setZeroPage(codes, cpu)
      cpu.setFlag(Flag.C, 1)
      v = 0x6e
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
        value: 0x37 + 0b10000000,
        c: 0,
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x66 ROR ZeroPage 2", () => {
      address = setZeroPage(codes, cpu)
      cpu.setFlag(Flag.C, 0)
      v = 0x9b
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
        value: 0x4d,
        c: 1,
        n: 0,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x66 ROR ZeroPage 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("PLA Implied", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x68 PLA Implied 1", () => {
      opcode = 0x68
      codes = [opcode]
      cpu.setRegister(RegisterCPU.SP, 0xff - 1)
      v = 0b11001100
      cpu.setValue(0x1ff, v)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        a: cpu.getRegister(RegisterCPU.A),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
      }
      except = {
        a: v,
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x68 PLA Implied 1", () => {
      cpu.setRegister(RegisterCPU.SP, 0xff - 1)
      v = 0x00
      cpu.setValue(0x1ff, v)
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

      expect(output).deep.eq(except)
    })
  })

  describe("ADC Immediate", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x69 ADC Immediate 1", () => {
      opcode = 0x69
      codes = [opcode]
      // 最后和A相加的值为0x40
      // 63(A) + 64(M) + 1(C)
      v = 0x40
      codes.push(v)
      // A的初始值
      a = 0x3f
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
        a: 128,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x69 ADC Immediate 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0x69 ADC Immediate 3", () => {
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x69 ADC Immediate 4", () => {
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x69 ADC Immediate 5", () => {
      codes = [opcode]
      // 最后和A相加的值为0xD0
      // 0x50(A) + 0xD0(M) + 0(C)
      v = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0x69 ADC Immediate 6", () => {
      codes = [opcode]
      // 最后和A相加的值为0x10
      // 0xD0(A) + 0x10(M) + 0(C)
      v = 0x10
      codes.push(v)
      // A的初始值
      a = 0xd0
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x69 ADC Immediate 7", () => {
      codes = [opcode]
      // 最后和A相加的值为0x50
      // 0xD0(A) + 0x50(M) + 0(C)
      v = 0x50
      codes.push(v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0x69 ADC Immediate 8", () => {
      codes = [opcode]
      // 最后和A相加的值为0x40
      // 0xD0(A) + 0x90(M) + 0(C)
      v = 0x90
      codes.push(v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0x69 ADC Immediate 9", () => {
      codes = [opcode]
      // 最后和A相加的值为0xD0
      // 0xD0(A) + 0xD0(M) + 0(C)
      v = 0xd0
      codes.push(v)
      // A的初始值
      a = 0xd0
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("ROR Accumulator", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x6A ROR Accumulator 1", () => {
      opcode = 0x6a
      codes = [opcode]
      cpu.setFlag(Flag.C, 1)
      v = 0x6e
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
        value: 0x37 + 0b10000000,
        c: 0,
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x6A ROR Accumulator 2", () => {
      cpu.setFlag(Flag.C, 0)
      v = 0x9b
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
        value: 0x4d,
        c: 1,
        n: 0,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x6A ROR Accumulator 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("JMP Indirect", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x6C JMP Indirect 1", () => {
      opcode = 0x6c
      codes = [opcode]
      let address = setIndirect(codes, cpu)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        pc: cpu.getRegister(RegisterCPU.PC),
      }
      except = {
        pc: address,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("ADC Absolute", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x6D ADC Absolute 1", () => {
      opcode = 0x6d
      codes = [opcode]
      let address = setAbsolute(codes, cpu)
      // 最后和A相加的值为0x40
      // 63(A) + 64(M) + 1(C)
      v = 0x40
      cpu.setValue(address, v)
      // A的初始值
      a = 0x3f
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
        a: 128,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x6D ADC Absolute 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0x6D ADC Absolute 3", () => {
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x6D ADC Absolute 4", () => {
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x6D ADC Absolute 5", () => {
      codes = [opcode]
      address = setAbsolute(codes, cpu)
      // 最后和A相加的值为0xD0
      // 0x50(A) + 0xD0(M) + 0(C)
      v = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0x6D ADC Absolute 6", () => {
      codes = [opcode]
      address = setAbsolute(codes, cpu)
      // 最后和A相加的值为0x10
      // 0xD0(A) + 0x10(M) + 0(C)
      v = 0x10
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x6D ADC Absolute 7", () => {
      codes = [opcode]
      address = setAbsolute(codes, cpu)
      // 最后和A相加的值为0x50
      // 0xD0(A) + 0x50(M) + 0(C)
      v = 0x50
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0x6D ADC Absolute 8", () => {
      codes = [opcode]
      address = setAbsolute(codes, cpu)
      // 最后和A相加的值为0x40
      // 0xD0(A) + 0x90(M) + 0(C)
      v = 0x90
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0x6D ADC Absolute 9", () => {
      codes = [opcode]
      address = setAbsolute(codes, cpu)
      // 最后和A相加的值为0xD0
      // 0xD0(A) + 0xD0(M) + 0(C)
      v = 0xd0
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("ROR Absolute", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x6E ROR Absolute 1", () => {
      opcode = 0x6e
      codes = [opcode]
      let address = setAbsolute(codes, cpu)
      cpu.setFlag(Flag.C, 1)
      v = 0x6e
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
        value: 0x37 + 0b10000000,
        c: 0,
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x6E ROR Absolute 2", () => {
      address = setAbsolute(codes, cpu)
      cpu.setFlag(Flag.C, 0)
      v = 0x9b
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
        value: 0x4d,
        c: 1,
        n: 0,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x6E ROR Absolute 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("BVS Relative", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x70 BVS Relative 1", () => {
      opcode = 0x70
      // 不跳转
      codes = [opcode]
      offset = setRelativeBackwards(codes, cpu)
      cpu.loadROM(codes)
      cpu.setFlag(Flag.V, 0)
      cpu.run()
      output = {
        pc: cpu.getRegister(RegisterCPU.PC),
      }
      except = {
        pc: cpu.indexPRGROM + 2,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x70 BVS Relative 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0x70 BVS Relative 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("ADC IndirectIndexedY", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x71 ADC IndirectIndexedY 1", () => {
      opcode = 0x71
      codes = [opcode]
      let address = setIndirectIndexedY(codes, cpu)
      // 最后和A相加的值为0x40
      // 63(A) + 64(M) + 1(C)
      v = 0x40
      cpu.setValue(address, v)
      // A的初始值
      a = 0x3f
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
        a: 128,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x71 ADC IndirectIndexedY 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0x71 ADC IndirectIndexedY 3", () => {
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x71 ADC IndirectIndexedY 4", () => {
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x71 ADC IndirectIndexedY 5", () => {
      codes = [opcode]
      address = setIndirectIndexedY(codes, cpu)
      // 最后和A相加的值为0xD0
      // 0x50(A) + 0xD0(M) + 0(C)
      v = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0x71 ADC IndirectIndexedY 6", () => {
      codes = [opcode]
      address = setIndirectIndexedY(codes, cpu)
      // 最后和A相加的值为0x10
      // 0xD0(A) + 0x10(M) + 0(C)
      v = 0x10
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x71 ADC IndirectIndexedY 7", () => {
      codes = [opcode]
      address = setIndirectIndexedY(codes, cpu)
      // 最后和A相加的值为0x50
      // 0xD0(A) + 0x50(M) + 0(C)
      v = 0x50
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0x71 ADC IndirectIndexedY 8", () => {
      codes = [opcode]
      address = setIndirectIndexedY(codes, cpu)
      // 最后和A相加的值为0x40
      // 0xD0(A) + 0x90(M) + 0(C)
      v = 0x90
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0x71 ADC IndirectIndexedY 9", () => {
      codes = [opcode]
      address = setIndirectIndexedY(codes, cpu)
      // 最后和A相加的值为0xD0
      // 0xD0(A) + 0xD0(M) + 0(C)
      v = 0xd0
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("ADC ZeroPageX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x75 ADC ZeroPageX 1", () => {
      opcode = 0x75
      codes = [opcode]
      let address = setZeroPageX(codes, cpu)
      // 最后和A相加的值为0x40
      // 63(A) + 64(M) + 1(C)
      v = 0x40
      cpu.setValue(address, v)
      // A的初始值
      a = 0x3f
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
        a: 128,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x75 ADC ZeroPageX 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0x75 ADC ZeroPageX 3", () => {
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x75 ADC ZeroPageX 4", () => {
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x75 ADC ZeroPageX 5", () => {
      codes = [opcode]
      address = setZeroPageX(codes, cpu)
      // 最后和A相加的值为0xD0
      // 0x50(A) + 0xD0(M) + 0(C)
      v = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0x75 ADC ZeroPageX 6", () => {
      codes = [opcode]
      address = setZeroPageX(codes, cpu)
      // 最后和A相加的值为0x10
      // 0xD0(A) + 0x10(M) + 0(C)
      v = 0x10
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x75 ADC ZeroPageX 7", () => {
      codes = [opcode]
      address = setZeroPageX(codes, cpu)
      // 最后和A相加的值为0x50
      // 0xD0(A) + 0x50(M) + 0(C)
      v = 0x50
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0x75 ADC ZeroPageX 8", () => {
      codes = [opcode]
      address = setZeroPageX(codes, cpu)
      // 最后和A相加的值为0x40
      // 0xD0(A) + 0x90(M) + 0(C)
      v = 0x90
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0x75 ADC ZeroPageX 9", () => {
      codes = [opcode]
      address = setZeroPageX(codes, cpu)
      // 最后和A相加的值为0xD0
      // 0xD0(A) + 0xD0(M) + 0(C)
      v = 0xd0
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("ROR ZeroPageX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x76 ROR ZeroPageX 1", () => {
      opcode = 0x76
      codes = [opcode]
      let address = setZeroPageX(codes, cpu)
      cpu.setFlag(Flag.C, 1)
      v = 0x6e
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
        value: 0x37 + 0b10000000,
        c: 0,
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x76 ROR ZeroPageX 2", () => {
      codes = [opcode]
      address = setZeroPageX(codes, cpu)
      cpu.setFlag(Flag.C, 0)
      v = 0x9b
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
        value: 0x4d,
        c: 1,
        n: 0,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x76 ROR ZeroPageX 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("SEI Implied", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x78 SEI Implied 1", () => {
      codes = [0x78]
      cpu.loadROM(codes)
      cpu.setFlag(Flag.I, 0)
      cpu.run()
      output = {
        i: cpu.getFlagI(),
      }
      except = {
        i: 1,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("ADC AbsoluteY", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x79 ADC AbsoluteY 1", () => {
      opcode = 0x79
      addressFunc = setAbsoluteY
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      // 最后和A相加的值为0x40
      // 63(A) + 64(M) + 1(C)
      v = 0x40
      cpu.setValue(address, v)
      // A的初始值
      a = 0x3f
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
        a: 128,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x79 ADC AbsoluteY 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0x79 ADC AbsoluteY 3", () => {
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x79 ADC AbsoluteY 4", () => {
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x79 ADC AbsoluteY 5", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 最后和A相加的值为0xD0
      // 0x50(A) + 0xD0(M) + 0(C)
      v = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0x79 ADC AbsoluteY 6", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 最后和A相加的值为0x10
      // 0xD0(A) + 0x10(M) + 0(C)
      v = 0x10
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x79 ADC AbsoluteY 7", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 最后和A相加的值为0x50
      // 0xD0(A) + 0x50(M) + 0(C)
      v = 0x50
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0x79 ADC AbsoluteY 8", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 最后和A相加的值为0x40
      // 0xD0(A) + 0x90(M) + 0(C)
      v = 0x90
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0x79 ADC AbsoluteY 9", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 最后和A相加的值为0xD0
      // 0xD0(A) + 0xD0(M) + 0(C)
      v = 0xd0
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("ADC AbsoluteX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x7D ADC AbsoluteX 1", () => {
      opcode = 0x7d
      addressFunc = setAbsoluteX
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      // 最后和A相加的值为0x40
      // 63(A) + 64(M) + 1(C)
      v = 0x40
      cpu.setValue(address, v)
      // A的初始值
      a = 0x3f
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
        a: 128,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x7D ADC AbsoluteX 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0x7D ADC AbsoluteX 3", () => {
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x7D ADC AbsoluteX 4", () => {
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x7D ADC AbsoluteX 5", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 最后和A相加的值为0xD0
      // 0x50(A) + 0xD0(M) + 0(C)
      v = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0x7D ADC AbsoluteX 6", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 最后和A相加的值为0x10
      // 0xD0(A) + 0x10(M) + 0(C)
      v = 0x10
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x7D ADC AbsoluteX 7", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 最后和A相加的值为0x50
      // 0xD0(A) + 0x50(M) + 0(C)
      v = 0x50
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0x7D ADC AbsoluteX 8", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 最后和A相加的值为0x40
      // 0xD0(A) + 0x90(M) + 0(C)
      v = 0x90
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0x7D ADC AbsoluteX 9", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 最后和A相加的值为0xD0
      // 0xD0(A) + 0xD0(M) + 0(C)
      v = 0xd0
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("ROR AbsoluteX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x7E ROR AbsoluteX 1", () => {
      opcode = 0x7e
      addressFunc = setAbsoluteX
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      cpu.setFlag(Flag.C, 1)
      v = 0x6e
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
        value: 0x37 + 0b10000000,
        c: 0,
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x7E ROR AbsoluteX 2", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      cpu.setFlag(Flag.C, 0)
      v = 0x9b
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
        value: 0x4d,
        c: 1,
        n: 0,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x7E ROR AbsoluteX 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("STA IndexedIndirectX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x81 STA IndexedIndirectX 1", () => {
      opcode = 0x81
      addressFunc = setIndexedIndirectX
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x6e
      cpu.setRegister(RegisterCPU.A, v)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        value: cpu.getValue(address),
      }
      except = {
        value: v,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("STY ZeroPage", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x84 STY ZeroPage 1", () => {
      opcode = 0x84
      addressFunc = setZeroPage
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x6e
      cpu.setRegister(RegisterCPU.Y, v)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        value: cpu.getValue(address),
      }
      except = {
        value: v,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("STA ZeroPage", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x85 STA ZeroPage 1", () => {
      opcode = 0x85
      addressFunc = setZeroPage
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x6e
      cpu.setRegister(RegisterCPU.A, v)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        value: cpu.getValue(address),
      }
      except = {
        value: v,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("STX ZeroPage", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x86 STX ZeroPage 1", () => {
      opcode = 0x86
      addressFunc = setZeroPage
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x6e
      cpu.setRegister(RegisterCPU.X, v)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        value: cpu.getValue(address),
      }
      except = {
        value: v,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("DEY Implied", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x88 DEY Implied 1", () => {
      opcode = 0x88
      codes = [opcode]
      v = 0x6e
      cpu.setRegister(RegisterCPU.Y, v)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        y: cpu.getRegister(RegisterCPU.Y),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
      }
      except = {
        y: v - 1,
        n: 0,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x88 DEY Implied 2", () => {
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
        y: 0xff,
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("TXA Implied", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x8A TXA Implied 1", () => {
      opcode = 0x8a
      codes = [opcode]
      v = 0x6e
      cpu.setRegister(RegisterCPU.X, v)
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

      expect(output).deep.eq(except)
    })
  })

  describe("STY Absolute", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x8C STY Absolute 1", () => {
      opcode = 0x8c
      addressFunc = setAbsolute
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x6e
      cpu.setRegister(RegisterCPU.Y, v)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        value: cpu.getValue(address),
      }
      except = {
        value: v,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("STA Absolute", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x8D STA Absolute 1", () => {
      opcode = 0x8d
      addressFunc = setAbsolute
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x6e
      cpu.setRegister(RegisterCPU.A, v)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        value: cpu.getValue(address),
      }
      except = {
        value: v,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("STX Absolute", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x8E STX Absolute 1", () => {
      opcode = 0x8e
      addressFunc = setAbsolute
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x6e
      cpu.setRegister(RegisterCPU.X, v)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        value: cpu.getValue(address),
      }
      except = {
        value: v,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("BCC Relative", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x90 BCC Relative 1", () => {
      opcode = 0x90
      addressFunc = setRelativeBackwards
      // 不跳转
      codes = [opcode]
      offset = addressFunc(codes, cpu)
      cpu.setFlag(Flag.C, 1)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        pc: cpu.getRegister(RegisterCPU.PC),
      }
      except = {
        pc: cpu.indexPRGROM + 2,
      }

      expect(output).deep.eq(except)
    })

    it("test 0x90 BCC Relative 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0x90 BCC Relative 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("STA IndirectIndexedY", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x91 STA IndirectIndexedY 1", () => {
      opcode = 0x91
      addressFunc = setIndirectIndexedY
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x6e
      cpu.setRegister(RegisterCPU.A, v)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        value: cpu.getValue(address),
      }
      except = {
        value: v,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("STY ZeroPageX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x94 STY ZeroPageX 1", () => {
      opcode = 0x94
      addressFunc = setZeroPageX
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x6e
      cpu.setRegister(RegisterCPU.Y, v)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        value: cpu.getValue(address),
      }
      except = {
        value: v,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("STA ZeroPageX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x95 STA ZeroPageX 1", () => {
      opcode = 0x95
      addressFunc = setZeroPageX
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x6e
      cpu.setRegister(RegisterCPU.A, v)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        value: cpu.getValue(address),
      }
      except = {
        value: v,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("STX ZeroPageY", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x96 STX ZeroPageY 1", () => {
      opcode = 0x96
      addressFunc = setZeroPageY
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x6e
      cpu.setRegister(RegisterCPU.X, v)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        value: cpu.getValue(address),
      }
      except = {
        value: v,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("TYA Implied", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x98 TYA Implied 1", () => {
      opcode = 0x98
      codes = [opcode]
      v = 0x6e
      cpu.setRegister(RegisterCPU.Y, v)
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

      expect(output).deep.eq(except)
    })
  })

  describe("STA AbsoluteY", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x99 STA AbsoluteY 1", () => {
      opcode = 0x99
      addressFunc = setAbsoluteY
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x6e
      cpu.setRegister(RegisterCPU.A, v)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        value: cpu.getValue(address),
      }
      except = {
        value: v,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("TXS Implied", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x9A TXS Implied 1", () => {
      opcode = 0x9a
      codes = [opcode]
      v = 0x6e
      cpu.setRegister(RegisterCPU.X, v)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        sp: cpu.getRegister(RegisterCPU.SP),
      }
      except = {
        sp: v,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("STA AbsoluteX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0x9D STA AbsoluteX 1", () => {
      opcode = 0x9d
      addressFunc = setAbsoluteX
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x6e
      cpu.setRegister(RegisterCPU.A, v)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        value: cpu.getValue(address),
      }
      except = {
        value: v,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("LDY Immediate", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xA0 LDY Immediate 1", () => {
      opcode = 0xa0
      codes = [opcode]
      v = 0x96
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
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xA0 LDY Immediate 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xA0 LDY Immediate 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("LDA IndexedIndirectX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xA1 LDA IndexedIndirectX 1", () => {
      opcode = 0xa1
      addressFunc = setIndexedIndirectX
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x96
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
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xA1 LDA IndexedIndirectX 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xA1 LDA IndexedIndirectX 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("LDX Immediate", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xA2 LDX Immediate 1", () => {
      opcode = 0xa2
      codes = [opcode]
      v = 0x96
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
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xA2 LDX Immediate 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xA2 LDX Immediate 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("LDY ZeroPage", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xA4 LDY ZeroPage 1", () => {
      opcode = 0xa4
      addressFunc = setZeroPage
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x96
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
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xA4 LDY ZeroPage 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xA4 LDY ZeroPage 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("LDA ZeroPage", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xA5 LDA ZeroPage 1", () => {
      opcode = 0xa5
      addressFunc = setZeroPage
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x96
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
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xA5 LDA ZeroPage 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xA5 LDA ZeroPage 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("LDX ZeroPage", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xA6 LDX ZeroPage 1", () => {
      opcode = 0xa6
      addressFunc = setZeroPage
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x96
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
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xA6 LDX ZeroPage 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xA6 LDX ZeroPage 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("TAY Implied", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xA8 TAY Implied 1", () => {
      opcode = 0xa8
      codes = [opcode]
      v = 0x6e
      cpu.setRegister(RegisterCPU.A, v)
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

      expect(output).deep.eq(except)
    })
  })

  describe("LDA Immediate", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xA9 LDA Immediate 1", () => {
      opcode = 0xa9
      codes = [opcode]
      v = 0x96
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
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xA9 LDA Immediate 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xA9 LDA Immediate 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("TAX Implied", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xAA TAX Implied 1", () => {
      opcode = 0xaa
      codes = [opcode]
      v = 0x6e
      cpu.setRegister(RegisterCPU.A, v)
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

      expect(output).deep.eq(except)
    })
  })

  describe("LDY Absolute", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xAC LDY Absolute 1", () => {
      opcode = 0xac
      addressFunc = setAbsolute
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x96
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
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xAC LDY Absolute 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xAC LDY Absolute 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("LDA Absolute", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xAD LDA Absolute 1", () => {
      opcode = 0xad
      addressFunc = setAbsolute
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x96
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
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xAD LDA Absolute 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xAD LDA Absolute 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("LDX Absolute", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xAE LDX Absolute 1", () => {
      opcode = 0xae
      addressFunc = setAbsolute
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x96
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
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xAE LDX Absolute 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xAE LDX Absolute 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("BCS Relative", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xB0 BCS Relative 1", () => {
      opcode = 0xb0
      addressFunc = setRelativeBackwards
      // 不跳转
      codes = [opcode]
      offset = addressFunc(codes, cpu)
      cpu.setFlag(Flag.C, 0)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        pc: cpu.getRegister(RegisterCPU.PC),
      }
      except = {
        pc: cpu.indexPRGROM + 2,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xB0 BCS Relative 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xB0 BCS Relative 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("LDA IndirectIndexedY", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xB1 LDA IndirectIndexedY 1", () => {
      opcode = 0xb1
      addressFunc = setIndirectIndexedY
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x96
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
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xB1 LDA IndirectIndexedY 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xB1 LDA IndirectIndexedY 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("LDY ZeroPageX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xB4 LDY ZeroPageX 1", () => {
      opcode = 0xb4
      addressFunc = setZeroPageX
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x96
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
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xB4 LDY ZeroPageX 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xB4 LDY ZeroPageX 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("LDA ZeroPageX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xB5 LDA ZeroPageX 1", () => {
      opcode = 0xb5
      addressFunc = setZeroPageX
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x96
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
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xB5 LDA ZeroPageX 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xB5 LDA ZeroPageX 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("LDX ZeroPageY", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xB6 LDX ZeroPageY 1", () => {
      opcode = 0xb6
      addressFunc = setZeroPageY
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x96
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
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xB6 LDX ZeroPageY 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xB6 LDX ZeroPageY 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("CLV Implied", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xB8 CLV Implied 1", () => {
      opcode = 0xb8
      codes = [opcode]
      cpu.loadROM(codes)
      cpu.setFlag(Flag.V, 1)
      cpu.run()
      output = {
        v: cpu.getFlagI(),
      }
      except = {
        v: 0,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("LDA AbsoluteY", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xB9 LDA AbsoluteY 1", () => {
      opcode = 0xb9
      addressFunc = setAbsoluteY
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x96
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
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xB9 LDA AbsoluteY 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xB9 LDA AbsoluteY 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("TSX Implied", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xBA TSX Implied 1", () => {
      opcode = 0xba
      codes = [opcode]
      v = 0x6e
      cpu.setRegister(RegisterCPU.SP, v)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        x: cpu.getRegister(RegisterCPU.X),
      }
      except = {
        x: v,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("LDY AbsoluteX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xBC LDY AbsoluteX 1", () => {
      opcode = 0xbc
      addressFunc = setAbsoluteX
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x96
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
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xBC LDY AbsoluteX 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xBC LDY AbsoluteX 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("LDA AbsoluteX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xBD LDA AbsoluteX 1", () => {
      opcode = 0xbd
      addressFunc = setAbsoluteX
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x96
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
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xBD LDA AbsoluteX 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xBD LDA AbsoluteX 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("LDX AbsoluteY", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xBE LDX AbsoluteY 1", () => {
      opcode = 0xbe
      addressFunc = setAbsoluteY
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x96
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
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xBE LDX AbsoluteY 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xBE LDX AbsoluteY 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("CPY Immediate", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xC0 CPY Immediate 1", () => {
      opcode = 0xc0
      codes = [opcode]
      v = 0x96
      codes.push(v)
      cpu.setRegister(RegisterCPU.Y, 0x32)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
      }
      except = {
        n: 1,
        z: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xC0 CPY Immediate 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xC0 CPY Immediate 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("CMP IndexedIndirectX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xC1 CMP IndexedIndirectX 1", () => {
      opcode = 0xc1
      addressFunc = setIndexedIndirectX
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x96
      cpu.setValue(address, v)
      cpu.setRegister(RegisterCPU.A, 0x32)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
      }
      except = {
        n: 1,
        z: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xC1 CMP IndexedIndirectX 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xC1 CMP IndexedIndirectX 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("CPY ZeroPage", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xC4 CPY ZeroPage 1", () => {
      opcode = 0xc4
      addressFunc = setZeroPage
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x96
      cpu.setValue(address, v)
      cpu.setRegister(RegisterCPU.Y, 0x32)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
      }
      except = {
        n: 1,
        z: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xC4 CPY ZeroPage 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xC4 CPY ZeroPage 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("CMP ZeroPage", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xC5 CMP ZeroPage 1", () => {
      opcode = 0xc5
      addressFunc = setZeroPage
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x96
      cpu.setValue(address, v)
      cpu.setRegister(RegisterCPU.A, 0x32)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
      }
      except = {
        n: 1,
        z: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xC5 CMP ZeroPage 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xC5 CMP ZeroPage 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("DEC ZeroPage", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xC6 DEC ZeroPage 1", () => {
      opcode = 0xc6
      addressFunc = setZeroPage
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x6e
      cpu.setValue(address, v)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        v: cpu.getValue(address),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
      }
      except = {
        v: v - 1,
        n: 0,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xC6 DEC ZeroPage 2", () => {
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
        v: 0xff,
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("INY Implied", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xC8 INY Implied 1", () => {
      opcode = 0xc8
      codes = [opcode]
      v = 0x6e
      cpu.setRegister(RegisterCPU.Y, v)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        y: cpu.getRegister(RegisterCPU.Y),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
      }
      except = {
        y: v + 1,
        n: 0,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xC8 INY Implied 2", () => {
      codes = [opcode]
      v = 0xff
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

      expect(output).deep.eq(except)
    })
  })

  describe("CMP Immediate", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xC9 CMP Immediate 1", () => {
      opcode = 0xc9
      codes = [opcode]
      v = 0x96
      codes.push(v)
      cpu.setRegister(RegisterCPU.A, 0x32)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
      }
      except = {
        n: 1,
        z: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xC9 CMP Immediate 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xC9 CMP Immediate 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("DEX Implied", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xCA DEX Implied 1", () => {
      opcode = 0xca
      codes = [opcode]
      v = 0x6e
      cpu.setRegister(RegisterCPU.X, v)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        x: cpu.getRegister(RegisterCPU.X),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
      }
      except = {
        x: v - 1,
        n: 0,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xCA DEX Implied 2", () => {
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
        x: 0xff,
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("CPY Absolute", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xCC CPY Absolute 1", () => {
      opcode = 0xcc
      addressFunc = setAbsolute
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x96
      cpu.setValue(address, v)
      cpu.setRegister(RegisterCPU.Y, 0x32)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
      }
      except = {
        n: 1,
        z: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xCC CPY Absolute 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xCC CPY Absolute 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("CMP Absolute", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xCD CMP Absolute 1", () => {
      opcode = 0xcd
      addressFunc = setAbsolute
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x96
      cpu.setValue(address, v)
      cpu.setRegister(RegisterCPU.A, 0x32)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
      }
      except = {
        n: 1,
        z: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xCD CMP Absolute 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xCD CMP Absolute 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("BNE Relative", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xD0 BNE Relative 1", () => {
      opcode = 0xd0
      // 不跳转
      codes = [opcode]
      offset = setRelativeBackwards(codes, cpu)
      cpu.loadROM(codes)
      cpu.setFlag(Flag.Z, 1)
      cpu.run()
      output = {
        pc: cpu.getRegister(RegisterCPU.PC),
      }
      except = {
        pc: cpu.indexPRGROM + 2,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xD0 BNE Relative 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xD0 BNE Relative 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("CMP IndirectIndexedY", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xD1 CMP IndirectIndexedY 1", () => {
      opcode = 0xd1
      addressFunc = setIndirectIndexedY
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x96
      cpu.setValue(address, v)
      cpu.setRegister(RegisterCPU.A, 0x32)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
      }
      except = {
        n: 1,
        z: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xD1 CMP IndirectIndexedY 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xD1 CMP IndirectIndexedY 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("CMP ZeroPageX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xD5 CMP ZeroPageX 1", () => {
      opcode = 0xd5
      addressFunc = setZeroPageX
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x96
      cpu.setValue(address, v)
      cpu.setRegister(RegisterCPU.A, 0x32)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
      }
      except = {
        n: 1,
        z: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xD5 CMP ZeroPageX 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xD5 CMP ZeroPageX 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("DEC ZeroPageX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xD6 DEC ZeroPageX 1", () => {
      opcode = 0xd6
      addressFunc = setZeroPageX
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x6e
      cpu.setValue(address, v)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        v: cpu.getValue(address),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
      }
      except = {
        v: v - 1,
        n: 0,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xD6 DEC ZeroPageX 2", () => {
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
        v: 0xff,
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("CLD Implied", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xD8 CLD Implied 1", () => {
      opcode = 0xd8
      codes = [opcode]
      cpu.loadROM(codes)
      cpu.setFlag(Flag.D, 1)
      cpu.run()
      output = {
        d: cpu.getFlagD(),
      }
      except = {
        d: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xD8 CLD Implied 2", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("CMP AbsoluteY", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xD9 CMP AbsoluteY 1", () => {
      opcode = 0xd9
      addressFunc = setAbsoluteY
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x96
      cpu.setValue(address, v)
      cpu.setRegister(RegisterCPU.A, 0x32)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
      }
      except = {
        n: 1,
        z: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xD9 CMP AbsoluteY 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xD9 CMP AbsoluteY 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("CMP AbsoluteX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xDD CMP AbsoluteX 1", () => {
      opcode = 0xdd
      addressFunc = setAbsoluteX
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x96
      cpu.setValue(address, v)
      cpu.setRegister(RegisterCPU.A, 0x32)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
      }
      except = {
        n: 1,
        z: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xDD CMP AbsoluteX 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xDD CMP AbsoluteX 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("DEC AbsoluteX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xDE DEC AbsoluteX 1", () => {
      opcode = 0xde
      addressFunc = setAbsoluteX
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x6e
      cpu.setValue(address, v)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        v: cpu.getValue(address),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
      }
      except = {
        v: v - 1,
        n: 0,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xDE DEC AbsoluteX 2", () => {
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
        v: 0xff,
        n: 1,
        z: 0,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("CPX Immediate", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xE0 CPX Immediate 1", () => {
      opcode = 0xe0
      codes = [opcode]
      v = 0x96
      codes.push(v)
      cpu.setRegister(RegisterCPU.X, 0x32)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
      }
      except = {
        n: 1,
        z: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xE0 CPX Immediate 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xE0 CPX Immediate 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("SBC IndexedIndirectX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xE1 SBC IndexedIndirectX 1", () => {
      opcode = 0xe1
      addressFunc = setIndexedIndirectX
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      // 0x50(A) - 0xF0(M) + 0(C)
      v = 0xf0
      cpu.setValue(address, v)
      // A的初始值
      a = 0x50
      cpu.setRegister(RegisterCPU.A, a)
      cpu.setFlag(Flag.C, 1)
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
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xE1 SBC IndexedIndirectX 2", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0x50(A) - 0xB0(M) + 0(C)
      v = 0xb0
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xE1 SBC IndexedIndirectX 3", () => {
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xE1 SBC IndexedIndirectX 4", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xE1 SBC IndexedIndirectX 5", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0xD0(A) - 0xF0(M) + 0(C)
      v = 0xf0
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xE1 SBC IndexedIndirectX 6", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0xD0(A) - 0xB0(M) + 0(C)
      v = 0xb0
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0xE1 SBC IndexedIndirectX 7", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0xD0(A) - 0x70(M) + 0(C)
      v = 0x70
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0xE1 SBC IndexedIndirectX 8", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0xD0(A) - 0x30(M) + 0(C)
      v = 0x30
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("CPX ZeroPage", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xE4 CPX ZeroPage 1", () => {
      opcode = 0xe4
      addressFunc = setZeroPage
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x96
      cpu.setValue(address, v)
      cpu.setRegister(RegisterCPU.X, 0x32)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
      }
      except = {
        n: 1,
        z: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xE4 CPX ZeroPage 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xE4 CPX ZeroPage 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("SBC ZeroPage", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xE5 SBC ZeroPage 1", () => {
      opcode = 0xe5
      addressFunc = setZeroPage
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      // 0x50(A) - 0xF0(M) + 0(C)
      v = 0xf0
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
        a: 0x60,
        n: 0,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xE5 SBC ZeroPage 2", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0x50(A) - 0xB0(M) + 0(C)
      v = 0xb0
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xE5 SBC ZeroPage 3", () => {
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xE5 SBC ZeroPage 4", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xE5 SBC ZeroPage 5", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0xD0(A) - 0xF0(M) + 0(C)
      v = 0xf0
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xE5 SBC ZeroPage 6", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0xD0(A) - 0xB0(M) + 0(C)
      v = 0xb0
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0xE5 SBC ZeroPage 7", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0xD0(A) - 0x70(M) + 0(C)
      v = 0x70
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0xE5 SBC ZeroPage 8", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0xD0(A) - 0x30(M) + 0(C)
      v = 0x30
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("INC ZeroPage", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xE6 INC ZeroPage 1", () => {
      opcode = 0xe6
      addressFunc = setZeroPage
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x6e
      cpu.setValue(address, v)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        v: cpu.getValue(address),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
      }
      except = {
        v: v + 1,
        n: 0,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xE6 INC ZeroPage 2", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      v = 0xff
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

      expect(output).deep.eq(except)
    })
  })

  describe("INX Implied", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xE8 INX Implied 1", () => {
      opcode = 0xe8
      codes = [opcode]
      v = 0x6e
      cpu.setRegister(RegisterCPU.X, v)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        x: cpu.getRegister(RegisterCPU.X),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
      }
      except = {
        x: v + 1,
        n: 0,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xE8 INX Implied 2", () => {
      codes = [opcode]
      v = 0xff
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

      expect(output).deep.eq(except)
    })
  })

  describe("SBC Immediate", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xE9 SBC Immediate 1", () => {
      opcode = 0xe9
      codes = [opcode]
      // 0x50(A) - 0xF0(M) + 0(C)
      v = 0xf0
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
        a: 0x60,
        n: 0,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xE9 SBC Immediate 2", () => {
      codes = [opcode]
      // 0x50(A) - 0xB0(M) + 0(C)
      v = 0xb0
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xE9 SBC Immediate 3", () => {
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xE9 SBC Immediate 4", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xE9 SBC Immediate 5", () => {
      codes = [opcode]
      // 0xD0(A) - 0xF0(M) + 0(C)
      v = 0xf0
      codes.push(v)
      // A的初始值
      a = 0xd0
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xE9 SBC Immediate 6", () => {
      codes = [opcode]
      // 0xD0(A) - 0xB0(M) + 0(C)
      v = 0xb0
      codes.push(v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0xE9 SBC Immediate 7", () => {
      codes = [opcode]
      // 0xD0(A) - 0x70(M) + 0(C)
      v = 0x70
      codes.push(v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0xE9 SBC Immediate 8", () => {
      codes = [opcode]
      // 0xD0(A) - 0x30(M) + 0(C)
      v = 0x30
      codes.push(v)
      // A的初始值
      a = 0xd0
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("CPX Absolute", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xEC CPX Absolute 1", () => {
      opcode = 0xec
      addressFunc = setAbsolute
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x96
      cpu.setValue(address, v)
      cpu.setRegister(RegisterCPU.X, 0x32)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
        c: cpu.getFlagC(),
      }
      except = {
        n: 1,
        z: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xEC CPX Absolute 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xEC CPX Absolute 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("SBC Absolute", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xED SBC Absolute 1", () => {
      opcode = 0xed
      addressFunc = setAbsolute
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      // 0x50(A) - 0xF0(M) + 0(C)
      v = 0xf0
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
        a: 0x60,
        n: 0,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xED SBC Absolute 2", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0x50(A) - 0xB0(M) + 0(C)
      v = 0xb0
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xED SBC Absolute 3", () => {
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xED SBC Absolute 4", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xED SBC Absolute 5", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0xD0(A) - 0xF0(M) + 0(C)
      v = 0xf0
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xED SBC Absolute 6", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0xD0(A) - 0xB0(M) + 0(C)
      v = 0xb0
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0xED SBC Absolute 7", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0xD0(A) - 0x70(M) + 0(C)
      v = 0x70
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0xED SBC Absolute 8", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0xD0(A) - 0x30(M) + 0(C)
      v = 0x30
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("INC Absolute", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xEE INC Absolute 1", () => {
      opcode = 0xee
      addressFunc = setAbsolute
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x6e
      cpu.setValue(address, v)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        v: cpu.getValue(address),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
      }
      except = {
        v: v + 1,
        n: 0,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xEE INC Absolute 2", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      v = 0xff
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

      expect(output).deep.eq(except)
    })
  })

  describe("BEQ Relative", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xF0 BEQ Relative 1", () => {
      opcode = 0xf0
      addressFunc = setRelativeBackwards
      // 不跳转
      codes = [opcode]
      offset = addressFunc(codes, cpu)
      cpu.setFlag(Flag.Z, 0)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        pc: cpu.getRegister(RegisterCPU.PC),
      }
      except = {
        pc: cpu.indexPRGROM + 2,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xF0 BEQ Relative 2", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xF0 BEQ Relative 3", () => {
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

      expect(output).deep.eq(except)
    })
  })

  describe("SBC IndirectIndexedY", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xF1 SBC IndirectIndexedY 1", () => {
      opcode = 0xf1
      addressFunc = setIndirectIndexedY
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      // 0x50(A) - 0xF0(M) + 0(C)
      v = 0xf0
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
        a: 0x60,
        n: 0,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xF1 SBC IndirectIndexedY 2", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0x50(A) - 0xB0(M) + 0(C)
      v = 0xb0
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xF1 SBC IndirectIndexedY 3", () => {
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xF1 SBC IndirectIndexedY 4", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xF1 SBC IndirectIndexedY 5", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0xD0(A) - 0xF0(M) + 0(C)
      v = 0xf0
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xF1 SBC IndirectIndexedY 6", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0xD0(A) - 0xB0(M) + 0(C)
      v = 0xb0
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0xF1 SBC IndirectIndexedY 7", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0xD0(A) - 0x70(M) + 0(C)
      v = 0x70
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0xF1 SBC IndirectIndexedY 8", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0xD0(A) - 0x30(M) + 0(C)
      v = 0x30
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("SBC ZeroPageX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xF5 SBC ZeroPageX 1", () => {
      opcode = 0xf5
      addressFunc = setZeroPageX
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      // 0x50(A) - 0xF0(M) + 0(C)
      v = 0xf0
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
        a: 0x60,
        n: 0,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xF5 SBC ZeroPageX 2", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0x50(A) - 0xB0(M) + 0(C)
      v = 0xb0
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xF5 SBC ZeroPageX 3", () => {
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xF5 SBC ZeroPageX 4", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xF5 SBC ZeroPageX 5", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0xD0(A) - 0xF0(M) + 0(C)
      v = 0xf0
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xF5 SBC ZeroPageX 6", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0xD0(A) - 0xB0(M) + 0(C)
      v = 0xb0
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0xF5 SBC ZeroPageX 7", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0xD0(A) - 0x70(M) + 0(C)
      v = 0x70
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0xF5 SBC ZeroPageX 8", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0xD0(A) - 0x30(M) + 0(C)
      v = 0x30
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("INC ZeroPageX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xF6 INC ZeroPageX 1", () => {
      opcode = 0xf6
      addressFunc = setZeroPageX
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x6e
      cpu.setValue(address, v)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        v: cpu.getValue(address),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
      }
      except = {
        v: v + 1,
        n: 0,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xF6 INC ZeroPageX 2", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      v = 0xff
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

      expect(output).deep.eq(except)
    })
  })

  describe("SED Implied", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xF8 SED Implied 1", () => {
      codes = [0xf8]
      cpu.loadROM(codes)
      cpu.setFlag(Flag.D, 0)
      cpu.run()
      output = {
        d: cpu.getFlagD(),
      }
      except = {
        d: 1,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("SBC AbsoluteY", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xF9 SBC AbsoluteY 1", () => {
      opcode = 0xf9
      addressFunc = setAbsoluteY
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      // 0x50(A) - 0xF0(M) + 0(C)
      v = 0xf0
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
        a: 0x60,
        n: 0,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xF9 SBC AbsoluteY 2", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0x50(A) - 0xB0(M) + 0(C)
      v = 0xb0
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xF9 SBC AbsoluteY 3", () => {
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xF9 SBC AbsoluteY 4", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xF9 SBC AbsoluteY 5", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0xD0(A) - 0xF0(M) + 0(C)
      v = 0xf0
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xF9 SBC AbsoluteY 6", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0xD0(A) - 0xB0(M) + 0(C)
      v = 0xb0
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0xF9 SBC AbsoluteY 7", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0xD0(A) - 0x70(M) + 0(C)
      v = 0x70
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0xF9 SBC AbsoluteY 8", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0xD0(A) - 0x30(M) + 0(C)
      v = 0x30
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("SBC AbsoluteX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xFD SBC AbsoluteX 1", () => {
      opcode = 0xfd
      addressFunc = setAbsoluteX
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      // 0x50(A) - 0xF0(M) + 0(C)
      v = 0xf0
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
        a: 0x60,
        n: 0,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xFD SBC AbsoluteX 2", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0x50(A) - 0xB0(M) + 0(C)
      v = 0xb0
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 1,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xFD SBC AbsoluteX 3", () => {
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xFD SBC AbsoluteX 4", () => {
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

      expect(output).deep.eq(except)
    })

    it("test 0xFD SBC AbsoluteX 5", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0xD0(A) - 0xF0(M) + 0(C)
      v = 0xf0
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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
        a: 0xe0,
        n: 1,
        z: 0,
        v: 0,
        c: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xFD SBC AbsoluteX 6", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0xD0(A) - 0xB0(M) + 0(C)
      v = 0xb0
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0xFD SBC AbsoluteX 7", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0xD0(A) - 0x70(M) + 0(C)
      v = 0x70
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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

      expect(output).deep.eq(except)
    })

    it("test 0xFD SBC AbsoluteX 8", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      // 0xD0(A) - 0x30(M) + 0(C)
      v = 0x30
      cpu.setValue(address, v)
      // A的初始值
      a = 0xd0
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
        a: 0xa0,
        n: 1,
        z: 0,
        v: 0,
        c: 1,
      }

      expect(output).deep.eq(except)
    })
  })

  describe("INC AbsoluteX", () => {
    let codes, v, a, output, except, address, opcode, addressFunc, offset

    it("test 0xFE INC AbsoluteX 1", () => {
      opcode = 0xfe
      addressFunc = setAbsoluteX
      codes = [opcode]
      let address = addressFunc(codes, cpu)
      v = 0x6e
      cpu.setValue(address, v)
      cpu.loadROM(codes)
      cpu.run()
      output = {
        v: cpu.getValue(address),
        n: cpu.getFlagN(),
        z: cpu.getFlagZ(),
      }
      except = {
        v: v + 1,
        n: 0,
        z: 0,
      }

      expect(output).deep.eq(except)
    })

    it("test 0xFE INC AbsoluteX 2", () => {
      codes = [opcode]
      address = addressFunc(codes, cpu)
      v = 0xff
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

      expect(output).deep.eq(except)
    })
  })
})
