import Launcher from './launcher'

function App() {
  const url = 'replace_signaling_url_here'
  const iceConfig = [
    {
      urls: 'replace_coturn_url_here',
      username: 'replace_coturn_username_here',
      credential: 'replace_coturn_password_here',
    },
  ]

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Launcher url={url} iceConfig={iceConfig} />
    </div>
  )
}

export default App
