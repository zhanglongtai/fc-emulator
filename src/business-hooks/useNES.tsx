import { createContext, useContext } from 'react'
import { createNES } from '../../lib/nes-sdk'

// 如何是对外的话，更合理的方法不是提供一个 IOC，而是提供一个带 api 的 SDK
const nes = createNES()

export const NESSDKProvider = createContext(nes)
export const useNES = () => useContext(NESSDKProvider)
