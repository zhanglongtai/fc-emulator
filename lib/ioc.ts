import 'reflect-metadata'
import { Container } from 'inversify'
import { Famicom } from './famicom'
import { DataBus } from './dataBus'
import { CPU } from './cpu'
import { Inspector } from './inspector'
import { PPU } from './ppu'
import { EventBus } from './event-bus'

export function createIOC() {
    const container = new Container()
    container.bind(Famicom).toSelf().inSingletonScope()
    container.bind(DataBus).toSelf().inSingletonScope()
    container.bind(CPU).toSelf().inSingletonScope()
    container.bind(Inspector).toSelf().inSingletonScope()
    container.bind(PPU).toSelf().inSingletonScope()

    container.bind(EventBus).toSelf().inSingletonScope()

    return container
}
