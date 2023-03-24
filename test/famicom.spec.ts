import { expect } from 'chai'
import { createIOC, Famicom } from '../lib'
import { Inspector } from '../lib/inspector'

describe('Famicon', () => {
    let ioc: ReturnType<typeof createIOC>
    let famicom: Famicom
    beforeEach(() => {
        ioc = createIOC()
        famicom = ioc.get(Famicom)
        ioc.get(Inspector).disabledLog() 
    })
    it('can get Famicon instance', () => {
        expect(famicom).not.eq(undefined)
    })
})
