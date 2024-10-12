<template>
  <TresGroup :scale="[1, 1, 1]" :rotation="[0, 2.5, 0]" :position="[0, 0.2, 0]">
    <TresPointLight v-if="props.renderLight" :args="['#d67a26', 20, 20, 0.3]" :power="200" :position="[0, 0.5, 0]" cast-shadow :mapSize="[256, 256]"></TresPointLight>
    <TresPointLight v-if="props.renderLight" :args="['#6f0eff', 1, 10, 0.9]" :power="80" :position="[0, 0.3, 0]" :mapSize="[256, 256]"></TresPointLight>
    <primitive :object="resources.get('candles').scene"></primitive>
  </TresGroup>
</template>

<script setup lang="ts">
import {useResources} from "@/composable/useResources";

const props = defineProps({
  renderLight: {
    type: Boolean,
    default: true
  }
})

const resources = useResources();

</script>