export const AddressingMode = {
    Implied: 'Implied', // 隐含模式
    Accumulator: 'Accumulator', // 累加器 A
    Immediate: 'Immediate', // 快速模式 #Operand
    ZeroPage: 'ZeroPage', // Operand
    ZeroPageX: 'ZeroPageX', // Operand,X
    ZeroPageY: 'ZeroPageY', // Operand,Y
    Absolute: 'Absolute', // Operand
    AbsoluteX: 'AbsoluteX', // Operand,X
    AbsoluteY: 'AbsoluteY', // Operand,Y
    Indirect: 'Indirect', // 间接模式 (Operand)
    IndexedIndirectX: 'IndexedIndirectX', // 预索引间接模式 (Operand,X)
    Relative: 'Relative', // Operand
    IndirectIndexedY: 'IndirectIndexedY', // (Operand),Y
}

export const opcodes = [
    // BRK(BReaKpoint)
    {
        code: 0x00,
        name: 'BRK',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 7,
    },
    // ORA (Operand, X)
    {
        code: 0x01,
        name: 'ORA',
        addressingMode: AddressingMode.IndexedIndirectX,
        bytes: 2,
        cycle: 6,
    },
    // STP
    {
        code: 0x02,
        name: 'STP',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 0,
    },
    // SLO
    {
        code: 0x03,
        name: 'SLO',
        addressingMode: AddressingMode.IndexedIndirectX,
        bytes: 1,
        cycle: 0,
    },
    // NOP
    {
        code: 0x04,
        name: 'NOP',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 1,
        cycle: 2,
    },
    // ORA, ORA Operand
    {
        code: 0x05,
        name: 'ORA',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 2,
        cycle: 3,
    },
    // ASL(Arithmetic Shift Left), ASL Operand
    {
        code: 0x06,
        name: 'ASL',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 2,
        cycle: 5,
    },
    // SLO
    {
        code: 0x07,
        name: 'SLO',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 1,
        cycle: 0,
    },
    // PHP
    {
        code: 0x08,
        name: 'PHP',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 3,
    },
    // ORA #Operand
    {
        code: 0x09,
        name: 'ORA',
        addressingMode: AddressingMode.Immediate,
        bytes: 2,
        cycle: 2,
    },
    // ASL, ASL A
    {
        code: 0x0A,
        name: 'ASL',
        addressingMode: AddressingMode.Accumulator,
        bytes: 1,
        cycle: 2,
    },
    // ANC
    {
        code: 0x0B,
        name: 'ANC',
        addressingMode: AddressingMode.Immediate,
        bytes: 1,
        cycle: 0,
    },
    // NOP
    {
        code: 0x0C,
        name: 'NOP',
        addressingMode: AddressingMode.Absolute,
        bytes: 1,
        cycle: 2,
    },
    // ORA, ORA Operand
    {
        code: 0x0D,
        name: 'ORA',
        addressingMode: AddressingMode.Absolute,
        bytes: 3,
        cycle: 4,
    },
    // ASL, ASL Operand
    {
        code: 0x0E,
        name: 'ASL',
        addressingMode: AddressingMode.Absolute,
        bytes: 3,
        cycle: 6,
    },
    // SLO
    {
        code: 0x0F,
        name: 'SLO',
        addressingMode: AddressingMode.Absolute,
        bytes: 1,
        cycle: 0,
    },
    // BPL(Branch if PLus), BPL Operand
    {
        code: 0x10,
        name: 'BPL',
        addressingMode: AddressingMode.Relative,
        bytes: 2,
        cycle: 2,
    },
    // ORA, ORA (Operand),Y
    {
        code: 0x11,
        name: 'ORA',
        addressingMode: AddressingMode.IndirectIndexedY,
        bytes: 2,
        cycle: 5,
    },
    // STP
    {
        code: 0x12,
        name: 'STP',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 0,
    },
    // SLO
    {
        code: 0x13,
        name: 'SLO',
        addressingMode: AddressingMode.IndirectIndexedY,
        bytes: 1,
        cycle: 0,
    },
    // NOP
    {
        code: 0x14,
        name: 'NOP',
        addressingMode: AddressingMode.ZeroPageX,
        bytes: 1,
        cycle: 2,
    },
    // ORA, ORA Operand,X
    {
        code: 0x15,
        name: 'ORA',
        addressingMode: AddressingMode.ZeroPageX,
        bytes: 2,
        cycle: 4,
    },
    // ASL, ASL Operand,X
    {
        code: 0x16,
        name: 'ASL',
        addressingMode: AddressingMode.ZeroPageX,
        bytes: 2,
        cycle: 6,
    },
    // SLO
    {
        code: 0x17,
        name: 'SLO',
        addressingMode: AddressingMode.ZeroPageX,
        bytes: 1,
        cycle: 0,
    },
    // CLC
    {
        code: 0x18,
        name: 'CLC',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 2,
    },
    // ORA, ORA Operand,Y
    {
        code: 0x19,
        name: 'ORA',
        addressingMode: AddressingMode.AbsoluteY,
        bytes: 3,
        cycle: 4,
    },
    // NOP
    {
        code: 0x1A,
        name: 'NOP',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 2,
    },
    // SLO
    {
        code: 0x1B,
        name: 'SLO',
        addressingMode: AddressingMode.AbsoluteY,
        bytes: 1,
        cycle: 0,
    },
    // NOP
    {
        code: 0x1C,
        name: 'NOP',
        addressingMode: AddressingMode.AbsoluteX,
        bytes: 1,
        cycle: 2,
    },
    // ORA, ORA Operand,X
    {
        code: 0x1D,
        name: 'ORA',
        addressingMode: AddressingMode.AbsoluteX,
        bytes: 3,
        cycle: 4,
    },
    // ASL, ASL Operand,X
    {
        code: 0x1E,
        name: 'ASL',
        addressingMode: AddressingMode.AbsoluteX,
        bytes: 3,
        cycle: 7,
    },
    // SLO
    {
        code: 0x1F,
        name: 'SLO',
        addressingMode: AddressingMode.AbsoluteX,
        bytes: 1,
        cycle: 0,
    },
    // JSR(Jump to Subroutine), JSR Operand
    {
        code: 0x20,
        name: 'JSR',
        addressingMode: AddressingMode.Absolute,
        bytes: 3,
        cycle: 6,
    },
    // AND(Logic AND), AND (Operand,X)
    {
        code: 0x21,
        name: 'AND',
        addressingMode: AddressingMode.IndexedIndirectX,
        bytes: 2,
        cycle: 6,
    },
    // STP
    {
        code: 0x22,
        name: 'STP',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 0,
    },
    // RLA
    {
        code: 0x23,
        name: 'RLA',
        addressingMode: AddressingMode.IndexedIndirectX,
        bytes: 1,
        cycle: 0,
    },
    // BIT(BIT test), BIT Operand
    {
        code: 0x24,
        name: 'BIT',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 2,
        cycle: 3,
    },
    // AND, AND Operand
    {
        code: 0x25,
        name: 'AND',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 2,
        cycle: 3,
    },
    // ROL(ROtate Left), ROL Operand
    {
        code: 0x26,
        name: 'ROL',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 2,
        cycle: 5,
    },
    // RLA
    {
        code: 0x27,
        name: 'RLA',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 1,
        cycle: 0,
    },
    // PLP(Pull Processor status)
    {
        code: 0x28,
        name: 'PLP',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 4,
    },
    // AND, AND #Operand
    {
        code: 0x29,
        name: 'AND',
        addressingMode: AddressingMode.Immediate,
        bytes: 2,
        cycle: 2,
    },
    // ROL, ROL A
    {
        code: 0x2A,
        name: 'ROL',
        addressingMode: AddressingMode.Accumulator,
        bytes: 1,
        cycle: 2,
    },
    // ANC
    {
        code: 0x2B,
        name: 'ANC',
        addressingMode: AddressingMode.Immediate,
        bytes: 1,
        cycle: 0,
    },
    // BIT, BIT Operand
    {
        code: 0x2C,
        name: 'BIT',
        addressingMode: AddressingMode.Absolute,
        bytes: 3,
        cycle: 4,
    },
    // AND, AND Operand
    {
        code: 0x2D,
        name: 'AND',
        addressingMode: AddressingMode.Absolute,
        bytes: 3,
        cycle: 4,
    },
    // ROL, ROL Operand
    {
        code: 0x2E,
        name: 'ROL',
        addressingMode: AddressingMode.Absolute,
        bytes: 3,
        cycle: 6,
    },
    // RLA
    {
        code: 0x2F,
        name: 'RLA',
        addressingMode: AddressingMode.Absolute,
        bytes: 1,
        cycle: 0,
    },
    // BMI(Branch on MInus), BMI Operand
    {
        code: 0x30,
        name: 'BMI',
        addressingMode: AddressingMode.Relative,
        bytes: 2,
        cycle: 2,
    },
    // AND, AND (Operand),Y
    {
        code: 0x31,
        name: 'AND',
        addressingMode: AddressingMode.IndirectIndexedY,
        bytes: 2,
        cycle: 5,
    },
    // STP
    {
        code: 0x32,
        name: 'STP',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 0,
    },
    // RLA
    {
        code: 0x33,
        name: 'RLA',
        addressingMode: AddressingMode.Absolute,
        bytes: 1,
        cycle: 0,
    },
    // NOP
    {
        code: 0x34,
        name: 'NOP',
        addressingMode: AddressingMode.ZeroPageX,
        bytes: 1,
        cycle: 2,
    },
    // AND, AND Operand,X
    {
        code: 0x35,
        name: 'AND',
        addressingMode: AddressingMode.ZeroPageX,
        bytes: 2,
        cycle: 4,
    },
    // ROL, ROL Operand,X
    {
        code: 0x36,
        name: 'ROL',
        addressingMode: AddressingMode.ZeroPageX,
        bytes: 2,
        cycle: 6,
    },
    // RLA
    {
        code: 0x37,
        name: 'RLA',
        addressingMode: AddressingMode.ZeroPageX,
        bytes: 1,
        cycle: 0,
    },
    // SEC(SEt Carry)
    {
        code: 0x38,
        name: 'SEC',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 2,
    },
    // AND, AND Operand,Y
    {
        code: 0x39,
        name: 'AND',
        addressingMode: AddressingMode.AbsoluteY,
        bytes: 3,
        cycle: 4,
    },
    // NOP
    {
        code: 0x3A,
        name: 'NOP',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 2,
    },
    // RLA
    {
        code: 0x3B,
        name: 'RLA',
        addressingMode: AddressingMode.AbsoluteY,
        bytes: 1,
        cycle: 0,
    },
    // NOP
    {
        code: 0x3C,
        name: 'NOP',
        addressingMode: AddressingMode.AbsoluteX,
        bytes: 1,
        cycle: 2,
    },
    // AND, AND Operand,X
    {
        code: 0x3D,
        name: 'AND',
        addressingMode: AddressingMode.AbsoluteX,
        bytes: 3,
        cycle: 4,
    },
    // ROL, ROL Operand,X
    {
        code: 0x3E,
        name: 'ROL',
        addressingMode: AddressingMode.AbsoluteX,
        bytes: 3,
        cycle: 7,
    },
    // RLA
    {
        code: 0x3F,
        name: 'RLA',
        addressingMode: AddressingMode.AbsoluteX,
        bytes: 1,
        cycle: 0,
    },
    // RTI(ReTurn from Interrupt)
    {
        code: 0x40,
        name: 'RTI',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 6,
    },
    // EOR(Exclusive OR), EOR (Operand,X)
    {
        code: 0x41,
        name: 'EOR',
        addressingMode: AddressingMode.IndexedIndirectX,
        bytes: 2,
        cycle: 6,
    },
    // STP
    {
        code: 0x42,
        name: 'STP',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 0,
    },
    // SRE
    {
        code: 0x43,
        name: 'SRE',
        addressingMode: AddressingMode.IndexedIndirectX,
        bytes: 2,
        cycle: 8,
    },
    // NOP
    {
        code: 0x44,
        name: 'NOP',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 1,
        cycle: 2,
    },
    // EOR, EOR Operand
    {
        code: 0x45,
        name: 'EOR',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 2,
        cycle: 3,
    },
    // LSR(Logic Shift Right), LSR Operand
    {
        code: 0x46,
        name: 'LSR',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 2,
        cycle: 5,
    },
    // SRE
    {
        code: 0x47,
        name: 'SRE',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 2,
        cycle: 5,
    },
    // PHA(PusH Accumulator)
    {
        code: 0x48,
        name: 'PHA',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 3,
    },
    // EOR, EOR #Operand
    {
        code: 0x49,
        name: 'EOR',
        addressingMode: AddressingMode.Immediate,
        bytes: 2,
        cycle: 2,
    },
    // LSR, LSR A
    {
        code: 0x4A,
        name: 'LSR',
        addressingMode: AddressingMode.Accumulator,
        bytes: 1,
        cycle: 2,
    },
    // ALR(AND then Logical shift Right)
    {
        code: 0x4B,
        name: 'ALR',
        addressingMode: AddressingMode.Immediate,
        bytes: 1,
        cycle: 0,
    },
    // JMP(JuMP), JMP Operand
    {
        code: 0x4C,
        name: 'JMP',
        addressingMode: AddressingMode.Absolute,
        bytes: 3,
        cycle: 3,
    },
    // EOR, EOR Operand
    {
        code: 0x4D,
        name: 'EOR',
        addressingMode: AddressingMode.Absolute,
        bytes: 3,
        cycle: 4,
    },
    // LSR, LSR Operand
    {
        code: 0x4E,
        name: 'LSR',
        addressingMode: AddressingMode.Absolute,
        bytes: 3,
        cycle: 6,
    },
    // SRE
    {
        code: 0x4F,
        name: 'SRE',
        addressingMode: AddressingMode.Absolute,
        bytes: 3,
        cycle: 6,
    },
    // BVC(Branch if oVerflow Clear), BVC Operand
    {
        code: 0x50,
        name: 'BVC',
        addressingMode: AddressingMode.Relative,
        bytes: 2,
        cycle: 2,
    },
    // EOR
    {
        code: 0x51,
        name: 'EOR',
        addressingMode: AddressingMode.IndirectIndexedY,
        bytes: 2,
        cycle: 5,
    },
    // STP
    {
        code: 0x52,
        name: 'STP',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 0,
    },
    // SRE
    {
        code: 0x53,
        name: 'SRE',
        addressingMode: AddressingMode.IndirectIndexedY,
        bytes: 2,
        cycle: 0,
    },
    // NOP
    {
        code: 0x54,
        name: 'NOP',
        addressingMode: AddressingMode.ZeroPageX,
        bytes: 2,
        cycle: 0,
    },
    // EOR, EOR Operand,X
    {
        code: 0x55,
        name: 'EOR',
        addressingMode: AddressingMode.ZeroPageX,
        bytes: 2,
        cycle: 4,
    },
    // LSR, LSR Operand,X
    {
        code: 0x56,
        name: 'LSR',
        addressingMode: AddressingMode.ZeroPageX,
        bytes: 2,
        cycle: 6,
    },
    // SRE
    {
        code: 0x57,
        name: 'SRE',
        addressingMode: AddressingMode.ZeroPageX,
        bytes: 2,
        cycle: 0,
    },
    // CLI(CLear Interrupt flag)
    {
        code: 0x58,
        name: 'CLI',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 2,
    },
    // EOR, EOR Operand,Y
    {
        code: 0x59,
        name: 'EOR',
        addressingMode: AddressingMode.AbsoluteY,
        bytes: 3,
        cycle: 4,
    },
    // NOP
    {
        code: 0x5A,
        name: 'NOP',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 0,
    },
    // SRE
    {
        code: 0x5B,
        name: 'SRE',
        addressingMode: AddressingMode.AbsoluteY,
        bytes: 3,
        cycle: 0,
    },
    // NOP
    {
        code: 0x5C,
        name: 'NOP',
        addressingMode: AddressingMode.AbsoluteX,
        bytes: 3,
        cycle: 0,
    },
    // EOR, EOR Operand,X
    {
        code: 0x5D,
        name: 'EOR',
        addressingMode: AddressingMode.AbsoluteX,
        bytes: 3,
        cycle: 4,
    },
    // LSR, LSR Operand,X
    {
        code: 0x5E,
        name: 'LSR',
        addressingMode: AddressingMode.AbsoluteX,
        bytes: 3,
        cycle: 7,
    },
    // SRE
    {
        code: 0x5F,
        name: 'SRE',
        addressingMode: AddressingMode.AbsoluteX,
        bytes: 3,
        cycle: 0,
    },
    // RTS(ReTurn from Subroutine)
    {
        code: 0x60,
        name: 'RTS',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 6,
    },
    // ADC(ADd with Carry), ADC (Operand,X)
    {
        code: 0x61,
        name: 'ADC',
        addressingMode: AddressingMode.IndexedIndirectX,
        bytes: 2,
        cycle: 6,
    },
    // STP
    {
        code: 0x62,
        name: 'STP',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 0,
    },
    // RRA
    {
        code: 0x63,
        name: 'RRA',
        addressingMode: AddressingMode.IndexedIndirectX,
        bytes: 2,
        cycle: 0,
    },
    // NOP
    {
        code: 0x64,
        name: 'NOP',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 1,
        cycle: 0,
    },
    // ADC, ADC Operand
    {
        code: 0x65,
        name: 'ADC',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 2,
        cycle: 3,
    },
    // ROR(ROtate Right), ROR Operand
    {
        code: 0x66,
        name: 'ROR',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 2,
        cycle: 5,
    },
    // RRA
    {
        code: 0x67,
        name: 'RRA',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 2,
        cycle: 0,
    },
    // PLA(PulL Accumulator)
    {
        code: 0x68,
        name: 'PLA',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 4,
    },
    // ADC, ADC #Operand
    {
        code: 0x69,
        name: 'ADC',
        addressingMode: AddressingMode.Immediate,
        bytes: 2,
        cycle: 2,
    },
    // ROR, ROR A
    {
        code: 0x6A,
        name: 'ROR',
        addressingMode: AddressingMode.Accumulator,
        bytes: 1,
        cycle: 2,
    },
    // ARR
    {
        code: 0x6B,
        name: 'ARR',
        addressingMode: AddressingMode.Immediate,
        bytes: 2,
        cycle: 0,
    },
    // JMP, JMP (Operand)
    {
        code: 0x6C,
        name: 'JMP',
        addressingMode: AddressingMode.Indirect,
        bytes: 3,
        cycle: 5,
    },
    // ADC, ADC Operand
    {
        code: 0x6D,
        name: 'ADC',
        addressingMode: AddressingMode.Absolute,
        bytes: 3,
        cycle: 4,
    },
    // ROR, ROR Operand
    {
        code: 0x6E,
        name: 'ROR',
        addressingMode: AddressingMode.Absolute,
        bytes: 3,
        cycle: 6,
    },
    // RRA
    {
        code: 0x6F,
        name: 'RRA',
        addressingMode: AddressingMode.Absolute,
        bytes: 3,
        cycle: 0,
    },
    // BVS(Branch if oVerflow Set), BVS Operand
    {
        code: 0x70,
        name: 'BVS',
        addressingMode: AddressingMode.Relative,
        bytes: 2,
        cycle: 2,
    },
    // ADC, ADC (Operand),Y
    {
        code: 0x71,
        name: 'ADC',
        addressingMode: AddressingMode.IndirectIndexedY,
        bytes: 2,
        cycle: 5,
    },
    // STP
    {
        code: 0x72,
        name: 'STP',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 0,
    },
    // RRA
    {
        code: 0x73,
        name: 'RRA',
        addressingMode: AddressingMode.IndirectIndexedY,
        bytes: 2,
        cycle: 0,
    },
    // NOP
    {
        code: 0x74,
        name: 'NOP',
        addressingMode: AddressingMode.ZeroPageX,
        bytes: 2,
        cycle: 0,
    },
    // ADC, ADC Operand,X
    {
        code: 0x75,
        name: 'ADC',
        addressingMode: AddressingMode.ZeroPageX,
        bytes: 2,
        cycle: 4,
    },
    // ROR, ROR Operand,X
    {
        code: 0x76,
        name: 'ROR',
        addressingMode: AddressingMode.ZeroPageX,
        bytes: 2,
        cycle: 6,
    },
    // RRA
    {
        code: 0x77,
        name: 'RRA',
        addressingMode: AddressingMode.ZeroPageX,
        bytes: 2,
        cycle: 0,
    },
    // SEI
    {
        code: 0x78,
        name: 'SEI',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 2,
    },
    // ADC, ADC Operand,Y
    {
        code: 0x79,
        name: 'ADC',
        addressingMode: AddressingMode.AbsoluteY,
        bytes: 3,
        cycle: 4,
    },
    // NOP
    {
        code: 0x7A,
        name: 'NOP',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 0,
    },
    // RRA
    {
        code: 0x7B,
        name: 'RRA',
        addressingMode: AddressingMode.AbsoluteY,
        bytes: 3,
        cycle: 0,
    },
    // NOP
    {
        code: 0x7C,
        name: 'NOP',
        addressingMode: AddressingMode.AbsoluteX,
        bytes: 3,
        cycle: 0,
    },
    // ADC, ADC Operand,X
    {
        code: 0x7D,
        name: 'ADC',
        addressingMode: AddressingMode.AbsoluteX,
        bytes: 3,
        cycle: 4,
    },
    // ROR, ROR Operand,X
    {
        code: 0x7E,
        name: 'ROR',
        addressingMode: AddressingMode.AbsoluteX,
        bytes: 3,
        cycle: 7,
    },
    // RRA
    {
        code: 0x7F,
        name: 'RRA',
        addressingMode: AddressingMode.AbsoluteX,
        bytes: 3,
        cycle: 0,
    },
    // NOP
    {
        code: 0x80,
        name: 'NOP',
        addressingMode: AddressingMode.Immediate,
        bytes: 2,
        cycle: 0,
    },
    // STA(STore Accumulator), STA (Operand,X)
    {
        code: 0x81,
        name: 'STA',
        addressingMode: AddressingMode.IndexedIndirectX,
        bytes: 2,
        cycle: 6,
    },
    // NOP
    {
        code: 0x82,
        name: 'NOP',
        addressingMode: AddressingMode.Immediate,
        bytes: 2,
        cycle: 0,
    },
    // SAX
    {
        code: 0x83,
        name: 'SAX',
        addressingMode: AddressingMode.IndexedIndirectX,
        bytes: 2,
        cycle: 0,
    },
    // STY(STore Y), STY Operand
    {
        code: 0x84,
        name: 'STY',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 2,
        cycle: 3,
    },
    // STA, STA Operand
    {
        code: 0x85,
        name: 'STA',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 2,
        cycle: 3,
    },
    // STX, STX Operand
    {
        code: 0x86,
        name: 'STX',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 2,
        cycle: 3,
    },
    // SAX
    {
        code: 0x87,
        name: 'SAX',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 2,
        cycle: 0,
    },
    // DEY(DEcrease Y)
    {
        code: 0x88,
        name: 'DEY',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 2,
    },
    // NOP
    {
        code: 0x89,
        name: 'NOP',
        addressingMode: AddressingMode.Immediate,
        bytes: 2,
        cycle: 0,
    },
    // TXA(Transfer X to Accumulator)
    {
        code: 0x8A,
        name: 'TXA',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 2,
    },
    // XAA
    {
        code: 0x8B,
        name: 'XAA',
        addressingMode: AddressingMode.Immediate,
        bytes: 2,
        cycle: 0,
    },
    // STY, STY Operand
    {
        code: 0x8C,
        name: 'STY',
        addressingMode: AddressingMode.Absolute,
        bytes: 3,
        cycle: 4,
    },
    // STA, STA Operand
    {
        code: 0x8D,
        name: 'STA',
        addressingMode: AddressingMode.Absolute,
        bytes: 3,
        cycle: 4,
    },
    // STX, STX Operand
    {
        code: 0x8E,
        name: 'STX',
        addressingMode: AddressingMode.Absolute,
        bytes: 3,
        cycle: 4,
    },
    // SAX
    {
        code: 0x8F,
        name: 'SAX',
        addressingMode: AddressingMode.Absolute,
        bytes: 3,
        cycle: 0,
    },
    // BCC(Branch if Carry is Clear), BCC Operand
    {
        code: 0x90,
        name: 'BCC',
        addressingMode: AddressingMode.Relative,
        bytes: 2,
        cycle: 2,
    },
    // STA, STA (Operand),Y
    {
        code: 0x91,
        name: 'STA',
        addressingMode: AddressingMode.IndirectIndexedY,
        bytes: 2,
        cycle: 6,
    },
    // STP
    {
        code: 0x92,
        name: 'STP',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 0,
    },
    // AHX
    {
        code: 0x93,
        name: 'AHX',
        addressingMode: AddressingMode.IndirectIndexedY,
        bytes: 2,
        cycle: 0,
    },
    // STY, STY Operand,X
    {
        code: 0x94,
        name: 'STY',
        addressingMode: AddressingMode.ZeroPageX,
        bytes: 2,
        cycle: 4,
    },
    // STA, STA Operand,X
    {
        code: 0x95,
        name: 'STA',
        addressingMode: AddressingMode.ZeroPageX,
        bytes: 2,
        cycle: 4,
    },
    // STX, STX Operand,Y
    {
        code: 0x96,
        name: 'STX',
        addressingMode: AddressingMode.ZeroPageY,
        bytes: 2,
        cycle: 4,
    },
    // SAX
    {
        code: 0x97,
        name: 'SAX',
        addressingMode: AddressingMode.ZeroPageY,
        bytes: 2,
        cycle: 0,
    },
    // TYA(Transfer Y to Accumulator)
    {
        code: 0x98,
        name: 'TYA',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 2,
    },
    // STA, STA Operand, Y
    {
        code: 0x99,
        name: 'STA',
        addressingMode: AddressingMode.AbsoluteY,
        bytes: 3,
        cycle: 5,
    },
    // TXS(Transfer X to Stack pointer)
    {
        code: 0x9A,
        name: 'TXS',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 2,
    },
    // TAS
    {
        code: 0x9B,
        name: 'TAS',
        addressingMode: AddressingMode.AbsoluteY,
        bytes: 3,
        cycle: 0,
    },
    // SHY
    {
        code: 0x9C,
        name: 'SHY',
        addressingMode: AddressingMode.AbsoluteX,
        bytes: 3,
        cycle: 0,
    },
    // STA, STA Operand,X
    {
        code: 0x9D,
        name: 'STA',
        addressingMode: AddressingMode.AbsoluteX,
        bytes: 3,
        cycle: 5,
    },
    // SHX
    {
        code: 0x9E,
        name: 'SHX',
        addressingMode: AddressingMode.AbsoluteY,
        bytes: 3,
        cycle: 0,
    },
    // AHX
    {
        code: 0x9F,
        name: 'AHX',
        addressingMode: AddressingMode.AbsoluteY,
        bytes: 3,
        cycle: 0,
    },
    // LDY(LoaD Y), LDY #Operand
    {
        code: 0xA0,
        name: 'LDY',
        addressingMode: AddressingMode.Immediate,
        bytes: 2,
        cycle: 2,
    },
    // LDA, LDA (Operand,X)
    {
        code: 0xA1,
        name: 'LDA',
        addressingMode: AddressingMode.IndexedIndirectX,
        bytes: 2,
        cycle: 6,
    },
    // LDX, LDX #Operand
    {
        code: 0xA2,
        name: 'LDX',
        addressingMode: AddressingMode.Immediate,
        bytes: 2,
        cycle: 2,
    },
    // LAX
    {
        code: 0xA3,
        name: 'LAX',
        addressingMode: AddressingMode.IndexedIndirectX,
        bytes: 2,
        cycle: 0,
    },
    // LDY, LDY Operand
    {
        code: 0xA4,
        name: 'LDY',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 2,
        cycle: 3,
    },
    // LDA, LDA Operand
    {
        code: 0xA5,
        name: 'LDA',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 2,
        cycle: 3,
    },
    // LDX, LDX Operand
    {
        code: 0xA6,
        name: 'LDX',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 2,
        cycle: 3,
    },
    // LAX
    {
        code: 0xA7,
        name: 'LAX',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 2,
        cycle: 0,
    },
    // TAY
    {
        code: 0xA8,
        name: 'TAY',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 2,
    },
    // LDA, LDA #Operand
    {
        code: 0xA9,
        name: 'LDA',
        addressingMode: AddressingMode.Immediate,
        bytes: 2,
        cycle: 2,
    },
    // TAX
    {
        code: 0xAA,
        name: 'TAX',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 2,
    },
    // LAX
    {
        code: 0xAB,
        name: 'LAX',
        addressingMode: AddressingMode.Immediate,
        bytes: 2,
        cycle: 0,
    },
    // LDY, LDY Operand
    {
        code: 0xAC,
        name: 'LDY',
        addressingMode: AddressingMode.Absolute,
        bytes: 3,
        cycle: 4,
    },
    // LDA, LDA Operand
    {
        code: 0xAD,
        name: 'LDA',
        addressingMode: AddressingMode.Absolute,
        bytes: 3,
        cycle: 4,
    },
    // LDX, LDX Operand
    {
        code: 0xAE,
        name: 'LDX',
        addressingMode: AddressingMode.Absolute,
        bytes: 3,
        cycle: 4,
    },
    // LAX
    {
        code: 0xAB,
        name: 'LAX',
        addressingMode: AddressingMode.Absolute,
        bytes: 3,
        cycle: 0,
    },
    // BCS(Branch if Carry is Set), BCS Operand
    {
        code: 0xB0,
        name: 'BCS',
        addressingMode: AddressingMode.Relative,
        bytes: 2,
        cycle: 2,
    },
    // LDA, LDA (Operand),Y
    {
        code: 0xB1,
        name: 'LDA',
        addressingMode: AddressingMode.IndirectIndexedY,
        bytes: 2,
        cycle: 5,
    },
    // STP
    {
        code: 0xB2,
        name: 'STP',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 0,
    },
    // LAX
    {
        code: 0xB3,
        name: 'LAX',
        addressingMode: AddressingMode.IndirectIndexedY,
        bytes: 2,
        cycle: 0,
    },
    // LDY, LDY Operand,X
    {
        code: 0xB4,
        name: 'LDY',
        addressingMode: AddressingMode.ZeroPageX,
        bytes: 2,
        cycle: 4,
    },
    // LDA, LDA Operand,X
    {
        code: 0xB5,
        name: 'LDA',
        addressingMode: AddressingMode.ZeroPageX,
        bytes: 2,
        cycle: 4,
    },
    // LDX, LDX Operand,Y
    {
        code: 0xB6,
        name: 'LDX',
        addressingMode: AddressingMode.ZeroPageY,
        bytes: 2,
        cycle: 4,
    },
    // LAX
    {
        code: 0xB7,
        name: 'LAX',
        addressingMode: AddressingMode.ZeroPageY,
        bytes: 2,
        cycle: 0,
    },
    // CLV(CLear oVerflow)
    {
        code: 0xB8,
        name: 'CLV',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 2,
    },
    // LDA, LDA Operand,Y
    {
        code: 0xB9,
        name: 'LDA',
        addressingMode: AddressingMode.AbsoluteY,
        bytes: 3,
        cycle: 4,
    },
    // TSX,
    {
        code: 0xBA,
        name: 'TSX',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 2,
    },
    // LAS
    {
        code: 0xBB,
        name: 'LAS',
        addressingMode: AddressingMode.AbsoluteY,
        bytes: 3,
        cycle: 0,
    },
    // LDY, LDY Operand,X
    {
        code: 0xBC,
        name: 'LDY',
        addressingMode: AddressingMode.AbsoluteX,
        bytes: 3,
        cycle: 4,
    },
    // LDA, LDA Operand,X
    {
        code: 0xBD,
        name: 'LDA',
        addressingMode: AddressingMode.AbsoluteX,
        bytes: 3,
        cycle: 4,
    },
    // LDX, LDX Operand,Y
    {
        code: 0xBE,
        name: 'LDX',
        addressingMode: AddressingMode.AbsoluteY,
        bytes: 3,
        cycle: 4,
    },
    // LAX
    {
        code: 0xBF,
        name: 'LAX',
        addressingMode: AddressingMode.AbsoluteY,
        bytes: 3,
        cycle: 0,
    },
    // CPY(ComPare Y), CPY *Operand
    {
        code: 0xC0,
        name: 'CPY',
        addressingMode: AddressingMode.Immediate,
        bytes: 2,
        cycle: 2,
    },
    // CMP(CoMPare), CMP (Operand,X)
    {
        code: 0xC1,
        name: 'CMP',
        addressingMode: AddressingMode.IndexedIndirectX,
        bytes: 2,
        cycle: 6,
    },
    // NOP
    {
        code: 0xC2,
        name: 'NOP',
        addressingMode: AddressingMode.Immediate,
        bytes: 2,
        cycle: 0,
    },
    // DCP
    {
        code: 0xC3,
        name: 'DCP',
        addressingMode: AddressingMode.IndexedIndirectX,
        bytes: 2,
        cycle: 0,
    },
    // CPY, CPY Operand
    {
        code: 0xC4,
        name: 'CPY',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 2,
        cycle: 3,
    },
    // CMP, CMP Operand
    {
        code: 0xC5,
        name: 'CMP',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 2,
        cycle: 3,
    },
    // DEC(DECrease), DEC Operand
    {
        code: 0xC6,
        name: 'DEC',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 2,
        cycle: 5,
    },
    // DCP
    {
        code: 0xC7,
        name: 'DCP',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 2,
        cycle: 0,
    },
    // INY(INcrease Y)
    {
        code: 0xC8,
        name: 'INY',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 2,
    },
    // CMP, CMP #Operand
    {
        code: 0xC9,
        name: 'CMP',
        addressingMode: AddressingMode.Immediate,
        bytes: 2,
        cycle: 2,
    },
    // DEX
    {
        code: 0xCA,
        name: 'DEX',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 2,
    },
    // AXS
    {
        code: 0xCB,
        name: 'AXS',
        addressingMode: AddressingMode.Immediate,
        bytes: 2,
        cycle: 0,
    },
    // CPY, CPY Operand
    {
        code: 0xCC,
        name: 'CPY',
        addressingMode: AddressingMode.Absolute,
        bytes: 3,
        cycle: 4,
    },
    // CMP, CMP Operand
    {
        code: 0xCD,
        name: 'CMP',
        addressingMode: AddressingMode.Absolute,
        bytes: 3,
        cycle: 4,
    },
    // DEC, DEC Operand
    {
        code: 0xCE,
        name: 'DEC',
        addressingMode: AddressingMode.Absolute,
        bytes: 2,
        cycle: 6,
    },
    // DCP
    {
        code: 0xCF,
        name: 'DCP',
        addressingMode: AddressingMode.Absolute,
        bytes: 2,
        cycle: 0,
    },
    // BNE(Branch if Not Equal), BNE Operand
    {
        code: 0xD0,
        name: 'BNE',
        addressingMode: AddressingMode.Relative,
        bytes: 2,
        cycle: 2,
    },
    // CMP, CMP (Operand),Y
    {
        code: 0xD1,
        name: 'CMP',
        addressingMode: AddressingMode.IndirectIndexedY,
        bytes: 2,
        cycle: 5,
    },
    // STP
    {
        code: 0xD2,
        name: 'STP',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 0,
    },
    // DCP
    {
        code: 0xD3,
        name: 'DCP',
        addressingMode: AddressingMode.IndirectIndexedY,
        bytes: 2,
        cycle: 0,
    },
    // NOP
    {
        code: 0xD4,
        name: 'NOP',
        addressingMode: AddressingMode.ZeroPageX,
        bytes: 2,
        cycle: 0,
    },
    // CMP, CMP Operand,X
    {
        code: 0xD5,
        name: 'CMP',
        addressingMode: AddressingMode.ZeroPageX,
        bytes: 2,
        cycle: 4,
    },
    // DEC, DEC Operand,X
    {
        code: 0xD6,
        name: 'DEC',
        addressingMode: AddressingMode.ZeroPageX,
        bytes: 2,
        cycle: 6,
    },
    // DCP
    {
        code: 0xD7,
        name: 'DCP',
        addressingMode: AddressingMode.ZeroPageX,
        bytes: 2,
        cycle: 0,
    },
    // CLD(CLear Decimal flag)
    {
        code: 0xD8,
        name: 'CLD',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 2,
    },
    // CMP, CMP Operand,Y
    {
        code: 0xD9,
        name: 'CMP',
        addressingMode: AddressingMode.AbsoluteY,
        bytes: 3,
        cycle: 4,
    },
    // NOP
    {
        code: 0xDA,
        name: 'NOP',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 0,
    },
    // DCP
    {
        code: 0xDB,
        name: 'DCP',
        addressingMode: AddressingMode.AbsoluteY,
        bytes: 3,
        cycle: 0,
    },
    // NOP
    {
        code: 0xDC,
        name: 'NOP',
        addressingMode: AddressingMode.AbsoluteX,
        bytes: 3,
        cycle: 0,
    },
    // CMP, CMP Operand,X
    {
        code: 0xDD,
        name: 'CMP',
        addressingMode: AddressingMode.AbsoluteX,
        bytes: 3,
        cycle: 4,
    },
    // DEC, DEC Operand,X
    {
        code: 0xDE,
        name: 'DEC',
        addressingMode: AddressingMode.AbsoluteX,
        bytes: 3,
        cycle: 7,
    },
    // DCP
    {
        code: 0xDF,
        name: 'DCP',
        addressingMode: AddressingMode.AbsoluteX,
        bytes: 3,
        cycle: 0,
    },
    // CPX(ComPare X), CPX *Operand
    {
        code: 0xE0,
        name: 'CPX',
        addressingMode: AddressingMode.Immediate,
        bytes: 2,
        cycle: 2,
    },
    // SBC, SBC (Operand,X)
    {
        code: 0xE1,
        name: 'SBC',
        addressingMode: AddressingMode.IndexedIndirectX,
        bytes: 2,
        cycle: 6,
    },
    // NOP
    {
        code: 0xE2,
        name: 'NOP',
        addressingMode: AddressingMode.Immediate,
        bytes: 2,
        cycle: 0,
    },
    // ISC
    {
        code: 0xE3,
        name: 'ISC',
        addressingMode: AddressingMode.IndexedIndirectX,
        bytes: 2,
        cycle: 0,
    },
    // CPX, CPX Operand
    {
        code: 0xE4,
        name: 'CPX',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 2,
        cycle: 3,
    },
    // SBC, SBC Operand
    {
        code: 0xE5,
        name: 'SBC',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 2,
        cycle: 3,
    },
    // INC(INCrease), INC Operand
    {
        code: 0xE6,
        name: 'INC',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 2,
        cycle: 5,
    },
    // ISC
    {
        code: 0xE7,
        name: 'ISC',
        addressingMode: AddressingMode.ZeroPage,
        bytes: 2,
        cycle: 0,
    },
    // INX
    {
        code: 0xE8,
        name: 'INX',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 2,
    },
    // SBC, SBC #Operand
    {
        code: 0xE9,
        name: 'SBC',
        addressingMode: AddressingMode.Immediate,
        bytes: 2,
        cycle: 2,
    },
    // NOP
    {
        code: 0xEA,
        name: 'NOP',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 0,
    },
    // SBC
    {
        code: 0xEB,
        name: 'SBC', // Future Expansion
        addressingMode: AddressingMode.Immediate,
        bytes: 2,
        cycle: 2,
    },
    // CPX, CPX Operand
    {
        code: 0xEC,
        name: 'CPX',
        addressingMode: AddressingMode.Absolute,
        bytes: 3,
        cycle: 4,
    },
    // SBC, SBC Operand
    {
        code: 0xED,
        name: 'SBC',
        addressingMode: AddressingMode.Absolute,
        bytes: 3,
        cycle: 4,
    },
    // INC, INC Operand
    {
        code: 0xEE,
        name: 'INC',
        addressingMode: AddressingMode.Absolute,
        bytes: 3,
        cycle: 6,
    },
    // ISC
    {
        code: 0xEF,
        name: 'ISC',
        addressingMode: AddressingMode.Absolute,
        bytes: 3,
        cycle: 0,
    },
    // BEQ, BEQ Operand
    {
        code: 0xF0,
        name: 'BEQ',
        addressingMode: AddressingMode.Relative,
        bytes: 2,
        cycle: 2,
    },
    // SBC, SBC (Operand),Y
    {
        code: 0xF1,
        name: 'SBC',
        addressingMode: AddressingMode.IndirectIndexedY,
        bytes: 2,
        cycle: 5,
    },
    // STP
    {
        code: 0xF2,
        name: 'STP',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 0,
    },
    // ISC
    {
        code: 0xF3,
        name: 'ISC',
        addressingMode: AddressingMode.IndirectIndexedY,
        bytes: 2,
        cycle: 0,
    },
    // NOP
    {
        code: 0xF4,
        name: 'NOP',
        addressingMode: AddressingMode.ZeroPageX,
        bytes: 2,
        cycle: 0,
    },
    // SBC, SBC Operand,X
    {
        code: 0xF5,
        name: 'SBC',
        addressingMode: AddressingMode.ZeroPageX,
        bytes: 2,
        cycle: 4,
    },
    // INC, INC Operand,X
    {
        code: 0xF6,
        name: 'INC',
        addressingMode: AddressingMode.ZeroPageX,
        bytes: 2,
        cycle: 6,
    },
    // ISC
    {
        code: 0xF7,
        name: 'ISC',
        addressingMode: AddressingMode.ZeroPageX,
        bytes: 2,
        cycle: 0,
    },
    // SED
    {
        code: 0xF8,
        name: 'SED',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 2,
    },
    // SBC, SBC Operand,Y
    {
        code: 0xF9,
        name: 'SBC',
        addressingMode: AddressingMode.AbsoluteY,
        bytes: 3,
        cycle: 4,
    },
    // NOP
    {
        code: 0xFA,
        name: 'NOP',
        addressingMode: AddressingMode.Implied,
        bytes: 1,
        cycle: 0,
    },
    // ISC
    {
        code: 0xFB,
        name: 'ISC',
        addressingMode: AddressingMode.AbsoluteY,
        bytes: 3,
        cycle: 0,
    },
    // NOP
    {
        code: 0xFC,
        name: 'NOP',
        addressingMode: AddressingMode.AbsoluteX,
        bytes: 3,
        cycle: 0,
    },
    // SBC, SBC Operand,X
    {
        code: 0xFD,
        name: 'SBC',
        addressingMode: AddressingMode.AbsoluteX,
        bytes: 3,
        cycle: 4,
    },
    // INC, INC Operand,X
    {
        code: 0xFE,
        name: 'INC',
        addressingMode: AddressingMode.AbsoluteX,
        bytes: 3,
        cycle: 7,
    },
    // ISC
    {
        code: 0xFF,
        name: 'ISC',
        addressingMode: AddressingMode.AbsoluteX,
        bytes: 3,
        cycle: 0,
    },
]
