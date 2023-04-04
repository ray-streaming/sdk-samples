<script setup lang="ts">
import Launcher from './setup-launcher.vue'

const url = 'replace_signaling_url_here'
const iceConfig = [
  {
    urls: 'replace_coturn_url_here',
    username: 'replace_coturn_username_here',
    credential: 'replace_coturn_password_here',
  },
]
</script>

<template>
  <div class="container"><Launcher :url="url" :iceConfig="iceConfig" /></div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
  position: relative;
}
</style>
