const testSignedNumberFromByte = function() {
    let output = signedNumberFromByte(0xFF)
    let except = -1
    ensure(output === except, JSON.stringify(except), JSON.stringify(output), 'test signedNumberFromByte 1')

    output = signedNumberFromByte(0xFE)
    except = -2
    ensure(output === except, JSON.stringify(except), JSON.stringify(output), 'test signedNumberFromByte 2')

    output = signedNumberFromByte(0x81)
    except = -127
    ensure(output === except, JSON.stringify(except), JSON.stringify(output), 'test signedNumberFromByte 3')

    output = signedNumberFromByte(0x80)
    except = -128
    ensure(output === except, JSON.stringify(except), JSON.stringify(output), 'test signedNumberFromByte 4')

    output = signedNumberFromByte(0x7F)
    except = 127
    ensure(output === except, JSON.stringify(except), JSON.stringify(output), 'test signedNumberFromByte 5')

    output = signedNumberFromByte(0x00)
    except = 0
    ensure(output === except, JSON.stringify(except), JSON.stringify(output), 'test signedNumberFromByte 6')

    output = signedNumberFromByte(0x67)
    except = 103
    ensure(output === except, JSON.stringify(except), JSON.stringify(output), 'test signedNumberFromByte 7')
}

const testPositiveByteFromMinus = function() {
    // 10: 0b00001010
    let output = positiveByteFromMinus(-10)
    let except = 0b11110101 + 1
    ensure(output === except, JSON.stringify(except), JSON.stringify(output), 'test positiveByteFromMinus 1')

    // 0xFE: 0b11111110
    output = positiveByteFromMinus(0xFE * -1)
    except = 0b00000001 + 1
    ensure(output === except, JSON.stringify(except), JSON.stringify(output), 'test positiveByteFromMinus 2')

    // 0xFF: 0b11111111
    output = positiveByteFromMinus(0xFF * -1)
    except = 0b00000000 + 1
    ensure(output === except, JSON.stringify(except), JSON.stringify(output), 'test positiveByteFromMinus 3')

    // 0x80: 0b10000000
    output = positiveByteFromMinus(0x80 * -1)
    except = 0b01111111 + 1
    ensure(output === except, JSON.stringify(except), JSON.stringify(output), 'test positiveByteFromMinus 4')

    // 0x7F: 0b01111111
    output = positiveByteFromMinus(0x7F * -1)
    except = 0b10000000 + 1
    ensure(output === except, JSON.stringify(except), JSON.stringify(output), 'test positiveByteFromMinus 5')

    // 0b00000000
    output = positiveByteFromMinus(0x00)
    except = 0
    ensure(output === except, JSON.stringify(except), JSON.stringify(output), 'test positiveByteFromMinus 6')

    // 0x81: 0b10000001
    output = positiveByteFromMinus(0x81 * -1)
    except = 0b01111110 + 1
    ensure(output === except, JSON.stringify(except), JSON.stringify(output), 'test positiveByteFromMinus 7')

    // 0x67: 0b01100111
    output = positiveByteFromMinus(0x67 * -1)
    except = 0b10011000 + 1
    ensure(output === except, JSON.stringify(except), JSON.stringify(output), 'test positiveByteFromMinus 8')
}

const testUtils = function() {
    testSignedNumberFromByte()
    testPositiveByteFromMinus()
}

testUtils()
