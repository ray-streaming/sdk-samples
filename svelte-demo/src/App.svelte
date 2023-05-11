<script lang="ts">
  import Launcher from './launcher.svelte'

  const url = 'replace_signaling_url_here'
  const iceConfig = [
    {
      urls: 'replace_coturn_url_here',
      username: 'replace_coturn_username_here',
      credential: 'replace_coturn_password_here',
    },
  ]
</script>

<main class="container">
  <Launcher {url} {iceConfig} options={{ enableControlPanel: true, autorunRivatuner: true }} />
</main>

<style>
  .container {
    width: 100%;
    height: 100vh;
  }
</style>
