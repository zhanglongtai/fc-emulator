import { expect } from 'chai'
import { CPU, createIOC } from '../lib'

describe('cpu instruction', () => {
    it('test', () => {
        const ioc = createIOC()
        const cpu = ioc.get(CPU)
        expect(cpu).not.eq(undefined)
    })
})
