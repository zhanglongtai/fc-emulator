import { expect } from 'chai'
import { positiveByteFromMinus, signedNumberFromByte } from '../lib/utils'

describe('testSignedNumberFromByte', () => {
    it('test signedNumberFromByte 1', () => {
        let output = signedNumberFromByte(0xff)
        let except = -1
        expect(output).eq(except)
    })
    it('test signedNumberFromByte 2', () => {
        let output = signedNumberFromByte(0xfe)
        let except = -2
        expect(output).eq(except)
    })
    it('test signedNumberFromByte 3', () => {
        let output = signedNumberFromByte(0x81)
        let except = -127
        expect(output).eq(except)
    })
    it('test signedNumberFromByte 4', () => {
        let output = signedNumberFromByte(0x80)
        let except = -128
        expect(output).eq(except)
    })

    it('test signedNumberFromByte 5', () => {
        let output = signedNumberFromByte(0x7f)
        let except = 127
        expect(output).eq(except)
    })
    it('test signedNumberFromByte 6', () => {
        let output = signedNumberFromByte(0x00)
        let except = 0 
        expect(output).eq(except)
    })
    it('test signedNumberFromByte 7', () => {
        let output = signedNumberFromByte(0x67)
        let except = 103
        expect(output).eq(except)
    })
})

describe('testPositiveByteFromMinus', () => {
    it('test positiveByteFromMinus 1', () => {
        let output = positiveByteFromMinus(-10)
        let except = 0b11110101 + 1
        expect(output).eq(except)
    })

    it('test positiveByteFromMinus 2', () => {
        let output = positiveByteFromMinus(0xfe * -1)
        let except = 0b00000001 + 1
        expect(output).eq(except)
    })

    it('test positiveByteFromMinus 3', () => {
        let output = positiveByteFromMinus(0xff * -1)
        let except = 0b00000000 + 1
        expect(output).eq(except)
    })

    it('test positiveByteFromMinus 4', () => {
        let output = positiveByteFromMinus(0x80 * -1)
        let except = 0b01111111 + 1
        expect(output).eq(except)
    })
    it('test positiveByteFromMinus 5', () => {
        let output = positiveByteFromMinus(0x7f * -1)
        let except = 0b10000000 + 1
        expect(output).eq(except)
    })
    it('test positiveByteFromMinus 6', () => {
        let output = positiveByteFromMinus(0x00)
        let except = 0
        expect(output).eq(except)
    })
    it('test positiveByteFromMinus 7', () => {
        let output = positiveByteFromMinus(0x81 * -1)
        let except = 0b01111110 + 1
        expect(output).eq(except)
    })
    it('test positiveByteFromMinus 8', () => {
        let output = positiveByteFromMinus(0x67 * -1)
        let except = 0b10011000 + 1
        expect(output).eq(except)
    })
})
