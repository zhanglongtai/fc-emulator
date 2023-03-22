import 'reflect-metadata'
import { Container } from 'inversify'
import { Famicom } from './famicom'
import { DataBus } from './dataBus'
import { CPU } from './cpu'

export function createIOC() {
    const container = new Container()
    container.bind(Famicom).toSelf().inSingletonScope()
    container.bind(DataBus).toSelf().inSingletonScope()
    container.bind(CPU).toSelf().inSingletonScope()

    return container
}
