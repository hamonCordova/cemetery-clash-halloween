<template>
  <TresGroup  :scale="[1, 1, 1]" :rotation="[0, 2.5, 0]" :position="[0, 0.7, 0]">
    <TresPointLight v-if="props.renderLight" :args="['#f65a00', 25, 25, 1]" :power="300" :position="[0.1, 0.7, 0.1]"  cast-shadow :mapSize="[256, 256]"></TresPointLight>
    <primitive :object="resources.get('lantern').scene"></primitive>
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