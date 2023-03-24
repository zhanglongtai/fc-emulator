import { FC, ReactNode } from 'react'
import { createNES } from '../../lib/nes-sdk'
import { NESSDKProvider } from '../business-hooks/useNES'
import { useConst } from '../pure-hooks/useConst'

export const NESProvider: FC<{
    children?: ReactNode
}> = (props) => (
    <NESSDKProvider.Provider value={useConst(() => createNES())}>
        {props.children}
    </NESSDKProvider.Provider>
)
