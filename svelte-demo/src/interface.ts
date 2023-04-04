export type Phase =
  | 'initial'
  | 'signaling-connected'
  | 'node-ready'
  | 'end-candidate'
  | 'peer-connection-connected'
  | 'bandwidth-detect'
  | 'data-channel-open'
  | 'loaded-metadata'

export interface Options {
  isMobile: boolean
  autorunRivatuner: boolean
  minBitrate: number
  maxBitrate: number
  startBitrate: number
  orientationLock: boolean
  enableControlPanel: boolean
  enableClipboard: boolean
  themeColor: string
  enableLogPersistent: boolean
  iceTransportPolicy: RTCIceTransportPolicy
  onError: (reason: string) => void
  onRotate: (result: boolean) => void
  onPhaseChange: (phase: Phase, deltaTime: number) => void
  onNetworkChange: (reason: string) => void
}
