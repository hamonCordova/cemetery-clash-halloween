<template>
  <TresGroup  :scale="[1, 1, 1]" :rotation="[0, 2.5, 0]" :position="[0, 0.7, 0]">
    <TresPointLight :args="['#f65a00', 25, 25, 1]" :power="300" :position="[0.1, 0.7, 0.1]"  cast-shadow :shadow-mapSize-height="512" :shadow-mapSize-width="512"></TresPointLight>
    <primitive :object="resources.get('lantern').scene"></primitive>
  </TresGroup>
</template>

<script setup lang="ts">
import {useResources} from "@/composable/useResources";
import {vLightHelper} from '@tresjs/core'
import {SpotLight as TresSpotLight} from "three";

const resources = useResources();

</script>