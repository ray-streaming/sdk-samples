import { useRef, useEffect } from 'react'
import { MobileLauncher } from 'live-dragon'
import { Options } from './interface'

interface Props {
  url: string
  iceConfig: RTCIceServer[]
  options?: Partial<
    Options & {
      enableNavigation: boolean
    }
  >
}

function MBLauncher(props: Props) {
  const { url, iceConfig, options } = props

  const hostRef = useRef<HTMLDivElement>(null!)
  const mobileLauncher = useRef<MobileLauncher>()

  useEffect(() => {
    mobileLauncher.current = new MobileLauncher(
      url,
      iceConfig,
      hostRef.current,
      options
    )

    return () => {
      /**
       * SDK Warning: WebSocket is closed before the connectin is established
       * because of the Strict mode in development mode of react18. In React18,
       * you can remove Strict mode to test it.
       */
      mobileLauncher.current?.destory()
    }
  }, [])

  return (
    <div
      ref={hostRef}
      style={{ width: '100%', height: '100%', position: 'relative' }}
    ></div>
  )
}

export default MBLauncher
