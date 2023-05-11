import { useRef, useEffect, useState } from 'react'
import { Launcher } from 'live-dragon'
import { Options } from './interface'

interface Props {
  url: string
  iceConfig: RTCIceServer[]
  options?: Partial<Options>
}

/**
 * Creating application from PaaS. No matter mobile or PC application.
 */
function LDLauncher(props: Props) {
  const { url, iceConfig, options } = props
  const launcher = useRef<Launcher>()
  const [data, setData] = useState<ReturnType<Launcher['report']>>()
  const containerRef = useRef<HTMLDivElement>(null!)
  let timer = useRef<number>(NaN)

  useEffect(() => {
    launcher.current = new Launcher(
      url,
      iceConfig,
      containerRef.current,
      options
    )

    if (timer.current) {
      window.clearInterval(timer.current)
      timer.current = NaN
    }
    timer.current = setInterval(() => {
      // 获取网络信息数据
      const info = launcher.current!.report()
      setData(info)
    }, 1000)

    return () => {
      /**
       * SDK Warning: WebSocket is closed before the connectin is established
       * because of the Strict mode in development mode of react18. In React18,
       * you can remove Strict mode to test it.
       */
      launcher.current?.destory()
      window.clearInterval(timer.current)
    }
  }, [])

  return (
    <>
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%', position: 'relative' }}
      ></div>
    </>
  )
}

export default LDLauncher
