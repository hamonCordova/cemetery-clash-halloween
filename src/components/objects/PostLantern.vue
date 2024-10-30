<template>
  <TresGroup :scale="[1, 1, 1]">
    <TresPointLight
      v-if="props.renderLight"
      :args="['#d67a26', 30, 30, 0.3]"
      :power="300"
      :position="[0.2, 2, 1.2]"
      cast-shadow
    ></TresPointLight>
    <primitive :object="resources.get('postLantern').scene"></primitive>
  </TresGroup>
</template>

<script setup lang="ts">
  import { useResources } from '@/composable/useResources'

  const props = defineProps({
    renderLight: {
      type: Boolean,
      default: true,
    },
  })

  const resources = useResources()
</script>
