import { Launcher, MobileLauncher } from 'live-dragon'

let isPC = true

window.onload = () => {
  const container = document.querySelector('.container')
  const signaling = `replace_signaling_url_here`
  let launcher

  const iceConfig = [
    {
      urls: 'replace_coturn_url_here',
      username: 'replace_coturn_username_here',
      credential: 'replace_coturn_password_here',
    },
  ]
  if (isPC) {
    launcher = new Launcher(signaling, iceConfig, container, { enableControlPanel: true, autorunRivatuner: true })
  } else {
    launcher = new MobileLauncher(signaling, iceConfig, container)
  }
}
