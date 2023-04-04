<script setup lang="ts">
import { Options } from './interface'
const props = defineProps<{
  url: string
  iceConfig: RTCIceServer[]
  options?: Partial<
    Options & {
      enableNavigation: boolean
    }
  >
}>()
import { ref, onMounted, onUnmounted } from 'vue'
import { MobileLauncher } from 'live-dragon'

const hostRef = ref<HTMLDivElement>(null)
let launcher: MobileLauncher | null = null

onMounted(() => {
  launcher = new MobileLauncher(
    props.url,
    props.iceConfig,
    hostRef.value,
    props.options
  )
})

onUnmounted(() => {
  launcher?.destory()
  launcher = null
})
</script>

<template>
  <div ref="hostRef" class="host"></div>
</template>

<style scoped>
.host {
  width: 100%;
  height: 100%;
}
</style>
