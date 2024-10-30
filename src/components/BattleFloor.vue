<template>
  <TresMesh receive-shadow>
    <TresPlaneGeometry :args="[70, 70, 70]" :rotate-x="Math.PI / 2" />
    <TresMeshStandardMaterial
      color="#282828"
      :alpha-map="alphaMap"
      :transparent="true"
      :side="DoubleSide"
    />
  </TresMesh>
</template>

<script setup lang="ts">
  import { useTexture } from '@tresjs/core'
  import { DoubleSide, SRGBColorSpace } from 'three'

  const { alphaMap } = await useTexture({
    alphaMap: '/textures/floor/alpha.webp',
  })
</script>
