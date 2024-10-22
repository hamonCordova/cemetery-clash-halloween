<template>
  <TresGroup  :scale="[1, 1, 1]" :rotation="[0, 2.5, 0]" :position="[0, 0.7, 0]">
    <TresPointLight v-if="props.renderLight"  :args="['#ffdc07', 10, 8, 0.6]" :power="100" :position="[0.2, 0.2, -0.3]"  cast-shadow :mapSize="[256, 256]"></TresPointLight>
    <TresMesh :position="[-0.03, 0, 0]">
      <TresMeshToonMaterial color="#ffdc07"  />
      <TresBoxGeometry :args="[1.15, 0.9, 1]" />
    </TresMesh>
    <primitive :object="resources.get('pumpkin').scene"></primitive>
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