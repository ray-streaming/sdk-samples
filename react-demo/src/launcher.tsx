import { useRef, useEffect } from 'react'
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
  const containerRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    launcher.current = new Launcher(
      url,
      iceConfig,
      containerRef.current,
      options
    )
    return () => {
      /**
       * SDK Warning: WebSocket is closed before the connectin is established
       * because of the Strict mode in development mode of react18. In React18,
       * you can remove Strict mode to test it.
       */
      launcher.current?.destory()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', position: 'relative' }}
    ></div>
  )
}

export default LDLauncher
