const log = console.log.bind(console)

const isEven = function(number) {
    let even = (number % 2) === 0
    return even
}

// 固定长度字符串，不足补空格
const stringFixedLength = function(str, length) {
    let s = new String(str)
    if (str.length < length) {
        for (let i = 0; i < (length - str.length); i++) {
            s += ' '
        }
    }

    return s
}

const stringFromBinaryArray = function(array) {
    let s = ''
    for (let i of array) {
        if (i === 26) {
            s += '<EOF>'
        } else {
            s += String.fromCharCode(i)
        }
    }

    return s
}

const flagsFormatted = function(num) {
    // '1010'
    let binaryStr = Number(num).toString(2)
    // 空位补0
    // [0,0,0,0,1,0,1,0]的逆序
    let f = []
    let start = 8 - binaryStr.length - 1
    let j = 0
    for (let i = 0; i < 8; i++) {
        if (i === start) {
            f[i] = Number(binaryStr[j])
            j++
        } else {
            f[i] = 0
        }
    }

    f = f.reverse()
    return f
}

const getBitFromByte = function(byte, bitPosition) {
    let bit = byte >> (bitPosition) & 1
    return bit
}

const binaryStringFromNumber = function(num) {
    let numStr = Number(num).toString(2)
    let l = 8 - numStr.length
    for (let i = 0; i < l; i++) {
        numStr = '0' + numStr
    }

    return numStr
}

const hexStringFromNumber = function(num) {
    let numStr = Number(num).toString(16)
    if (isEven(numStr.length)) {
        numStr = '0x' + numStr
    } else {
        numStr = '0x0' + numStr
    }

    return numStr
}

// 保留最低的byte
const byteTrimmed = function(value) {
    if (value <= 0xFF) {
        return value
    } else {
        let v = value & 0xFF
        return v
    }
}

const signedNumberFromByte = function(byte) {
    if (byte > 127) {
        // 处理负数
        let v = 0x100 - byte
        v = -v
        return v
    } else {
        return  byte
    }
}

// 把负数(10进制)变成binary对应的正数
// positive = ~negative + 1
const positiveByteFromMinus = function(value) {
    if (value === 0) {
        return 0
    }
    let v = Math.abs(value)
    let vString = binaryStringFromNumber(v)

    // 取反
    let s = ''
    for (let i of vString) {
        if (i === '0') {
            s += '1'
        } else {
            s += '0'
        }
    }

    // 加1
    let r = ''
    let c = '0'
    // s的末位开始
    for (let i = 0; i < s.length; i++) {
        let n = s[s.length - 1 - i]
        if (i === 0) {
            // 末位加1
            if (n === '0') {
                r = '1' + r
                c = '0'
            } else {
                r = '0' + r
                // 进位
                c = '1'
            }
        } else {
            if (n === '1') {
                if (c === '1') {
                    r = '0' + r
                    c = '1'
                } else {
                    r = '1' + r
                    c = '0'
                }
            } else {
                if (c === '1') {
                    r = '1' + r
                } else {
                    r = '0' + r
                }
                c = '0'
            }
        }
    }

    // 最后如果还有进位，再加1位
    if (c === '1') {
        r = '1' + r
    }

    let p = parseInt(r, 2)
    return p
}

const ensure = function(condition, except, output, title = '') {
    if (condition) {
        log(`${title} passed.`)
    } else {
        log(`${title} failed, except: ${except}, output: ${output}`)
    }
}
