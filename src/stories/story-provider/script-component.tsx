import { FC, ReactNode, useLayoutEffect } from 'react'
import { useNES } from '../../business-hooks/useNES'

export const Script: FC<{
    children: ReactNode
    script: (opts: { nes: ReturnType<typeof useNES> }) => void
}> = (props) => {
    const nes = useNES()
  useLayoutEffect(() => { // 需要等待 DOM 渲染到界面上，拿到 canvas
        // script 标签不支持变更，仅在第一次执行
        const { script } = props
        if (typeof script === 'function') {
            script({ nes })
        }
    }, [])

    return <>{props.children}</>
}
