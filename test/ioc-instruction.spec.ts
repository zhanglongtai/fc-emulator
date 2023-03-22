import { expect } from 'chai'
import { CPU, createIOC } from '../lib'
import { RegisterCPU } from '../lib/const'
import { Inspector } from '../lib/inspector'

describe('cpu instruction', () => {
    let ioc: ReturnType<typeof createIOC>
    let cpu: CPU
    beforeEach(() => {
        ioc = createIOC()
        cpu = ioc.get(CPU)
        ioc.get(Inspector).disabledLog() // 测试环境不需要打印 log 信息
    })
    it('BRK Implied', () => {
        let codes = [0x00]
        cpu.loadROM(codes)
        cpu.setRegister(RegisterCPU.P, 0b11111111)
        cpu.setValue(0xffff, 0x56)
        cpu.setValue(0xfffe, 0x78)
        cpu.run()

        let sp = cpu.getStackPointer()
        let output = {
            b: cpu.getFlagB(),
            i: cpu.getFlagI(),
            pc: cpu.getRegister(RegisterCPU.PC),
            p1: cpu.getValue(sp + 3),
            p2: cpu.getValue(sp + 2),
            p3: cpu.getValue(sp + 1),
        }
        let except = {
            b: 1,
            i: 1,
            pc: 0x5678,
            p1: 0x80,
            p2: 0x02,
            p3: 0b11111111,
        }
        expect(output).deep.eq(except, 'test 0x00 BRK Implied 1')
    })

    describe('ORA IndexedIndirectX', () => {
        let codes, v, a, output, except
        it('test 0x01 ORA IndexedIndirectX 1', () => {
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
        it('test 0x01 ORA IndexedIndirectX 2', () => {
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
        it('test 0x01 ORA IndexedIndirectX 3', () => {
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

    describe('ORA ZeroPage', () => {
        let codes, v, a, output, except
        it('test 0x05 ORA ZeroPage 1', () => {
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
        it('test 0x05 ORA ZeroPage 2', () => {
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
        it('test 0x05 ORA ZeroPage 3', () => {
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

    describe('ASL ZeroPage', () => {
        let codes, v, a, output, except
        it('test 0x06 ASL ZeroPage 1', () => {
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
        it('test 0x06 ASL ZeroPage 2', () => {
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
})
