import { useRef } from 'react'

export const useConst = <T>(create: () => T) => {
    const ref = useRef<T>()
    if (ref.current === undefined) {
        const instance = create()
        ref.current = instance
    }
    return ref.current
}
