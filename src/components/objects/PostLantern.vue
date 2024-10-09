<template>
  <TresGroup  :scale="[1, 1, 1]">
    <TresPointLight :args="['#d67a26', 30, 30, 0.3]" :power="300" :position="[0.2, 2, 1.2]" cast-shadow></TresPointLight>
    <primitive :object="resources.get('postLantern').scene"></primitive>
  </TresGroup>
</template>

<script setup lang="ts">
import {vLightHelper} from '@tresjs/core';
import {useResources} from "@/composable/useResources";

const resources = useResources();

</script>