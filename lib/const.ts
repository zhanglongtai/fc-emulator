export const enum RegisterCPU {

    // PC：Program Counter，是通用寄存器，但是有特殊用途，用来指向当前运行指令的下一条指令。
    // PC不是指向正在执行的指令，而是始终指向下一个取指的指令。对于ARM7三级流水先结构和指令的三个过程，所以PC = 当前程序执行位置  + 8。
    PC = 'PC',

    // SP：Stack Pointer，堆栈指针，也是通用寄存器，用于入栈和出栈操作。
    SP = 'SP',
    P = 'P',
    A = 'A',
    X = 'X',
    Y = 'Y',
}

export const enum Flag {
    C = 'C',
    Z = 'Z',
    I = 'I',
    D = 'D',
    B = 'B',
    V = 'V',
    N = 'N',
}
export const flagBit = {
    [Flag.C]: 0,
    [Flag.Z]: 1,
    [Flag.I]: 2,
    [Flag.D]: 3,
    [Flag.B]: 4,
    [Flag.V]: 6,
    [Flag.N]: 7,
}
