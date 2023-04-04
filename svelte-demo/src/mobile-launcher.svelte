<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { MobileLauncher } from 'live-dragon'
  import type { Options } from './interface'

  export let url: string
  export let iceConfig: RTCIceServer[]
  export let options:
    | Partial<Options & { enableNavigation: boolean }>
    | undefined = undefined

  let wrap: HTMLDivElement
  let launcher: MobileLauncher | null = null

  onMount(() => {
    launcher = new MobileLauncher(url, iceConfig, wrap, options)
  })

  onDestroy(() => {
    launcher?.destory()
    launcher = null
  })
</script>

<div class="wrap" bind:this={wrap} />

<style>
  .wrap {
    width: 100%;
    height: 100%;
  }
</style>
