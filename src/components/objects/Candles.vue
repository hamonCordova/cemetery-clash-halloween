<template>
  <TresGroup :scale="[1, 1, 1]" :rotation="[0, 2.5, 0]" :position="[0, 0.2, 0]">
    <TresPointLight :args="['#d67a26', 20, 20, 0.3]" :power="200" :position="[0, 0.5, 0]" cast-shadow :shadow-mapSize-height="512" :shadow-mapSize-width="512"></TresPointLight>
    <TresPointLight :args="['#6f0eff', 1, 10, 0.9]" :power="80" :position="[0, 0.3, 0]" :shadow-mapSize-height="512" :shadow-mapSize-width="512"></TresPointLight>
    <primitive :object="resources.get('candles').scene"></primitive>
  </TresGroup>
</template>

<script setup lang="ts">
import {useResources} from "@/composable/useResources";

const resources = useResources();

</script>