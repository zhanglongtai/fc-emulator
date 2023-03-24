import { FC, ReactNode, useEffect } from 'react'
import { createNES } from '../../lib/nes-sdk'
import { NESSDKProvider } from '../business-hooks/useNES'
import { useConst } from '../pure-hooks/useConst'

export const NESProvider: FC<{
    children?: ReactNode
}> = (props) => {
    const nes = useConst(() => createNES())
    useEffect(() => {
        return () => {
            nes.destroy()
        }
    }, [nes])
    return (
        <NESSDKProvider.Provider value={nes}>
            {props.children}
        </NESSDKProvider.Provider>
    )
}
