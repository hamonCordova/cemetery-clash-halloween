<template>
  <TresMesh receive-shadow>
    <TresPlaneGeometry :args="[50, 50, 50]" :rotate-x="Math.PI / 2" />
    <TresMeshStandardMaterial
        :side="DoubleSide"
        :alpha-map="alphaMap"
        :transparent="true"
    />
  </TresMesh>
</template>

<script setup lang="ts">
import {useTexture} from "@tresjs/core";
import {DoubleSide, SRGBColorSpace} from "three";

const { alphaMap } = await useTexture({
    alphaMap: '../static/textures/floor/alpha.webp',
  });

</script>