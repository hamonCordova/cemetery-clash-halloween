<template>
  <TresGroup  :scale="[1, 1, 1]" :rotation="[0, 2.5, 0]" :position="[0, 0.7, 0]">
    <TresPointLight :args="['#ffdc07', 20, 40, 0.6]" :power="300" :position="[0, 0, 0]" ></TresPointLight>
    <primitive :object="resources.get('pumpkin').scene"></primitive>
  </TresGroup>
</template>

<script setup lang="ts">
import {useResources} from "@/composable/useResources";
import {vLightHelper} from '@tresjs/core'
import {SpotLight as TresSpotLight} from "three";

const resources = useResources();

</script>