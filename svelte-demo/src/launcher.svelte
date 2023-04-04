<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { Launcher } from 'live-dragon'
  import type { Options } from './interface'

  export let url: string
  export let iceConfig: RTCIceServer[]
  export let options: Partial<Options> | undefined = undefined

  let wrap: HTMLDivElement
  let launcher: Launcher | null = null

  onMount(() => {
    launcher = new Launcher(url, iceConfig, wrap, options)
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
