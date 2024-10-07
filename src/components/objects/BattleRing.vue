<template>
  <!-- Plano principal de 25x25 -->
<!--
  <TresMesh :rotate-x="Math.PI / 2" :position="[0, 0.01, 0]" receive-shadow>
    <TresPlaneGeometry :args="[25, 25]" />
    <TresMeshStandardMaterial color="#383f35" :side="DoubleSide" />
  </TresMesh>
-->

  <!-- Tree -->
  <primitive :object="resources.get('deadTree').scene" :scale="[0.7, 0.7, 0.7]" :position="[13, 0, -15]"></primitive>
  <primitive :object="resources.get('deadTree').scene" :scale="[0.7, 0.7, 0.7]" :position="[17, 0, -16]"></primitive>
  <!--PumpKin-->
  <Pumpkin :position="[10, 0.7, -14]" />
  <Pumpkin :position="[14, 0.7, 8]" />

  <!-- Fences on the left side (-X), spaced by 6 units -->
  <primitive :object="resources.get('fence').scene" :scale="[1.5, 1.5, 1.5]" :position="[-12.5, 0, 9]" :rotate-y="Math.PI / 2"></primitive>
  <primitive :object="resources.get('fence').scene" :scale="[1.5, 1.5, 1.5]" :position="[-12.5, 0, 3]" :rotate-y="Math.PI / 2"></primitive>
  <primitive :object="resources.get('fence').scene" :scale="[1.5, 1.5, 1.5]" :position="[-12.5, 0, -3]" :rotate-y="Math.PI / 2"></primitive>
  <primitive :object="resources.get('fenceBroken').scene" :scale="[1.5, 1.5, 1.5]" :position="[-12.5, 0, -9]" :rotate-y="Math.PI / 2"></primitive>

  <!-- Fences on the bottom (-Z), spaced by 6 units -->
  <primitive :object="resources.get('fence').scene" :scale="[1.5, 1.5, 1.5]" :position="[-9, 0, -12.5]"></primitive>
  <primitive :object="resources.get('fence').scene" :scale="[1.5, 1.5, 1.5]" :position="[-3, 0, -12.5]"></primitive>
  <primitive :object="resources.get('fenceBroken').scene" :scale="[1.5, 1.5, 1.5]" :position="[3, 0, -12.5]"></primitive>
  <primitive :object="resources.get('fence').scene" :scale="[1.5, 1.5, 1.5]" :position="[9, 0, -12.5]"></primitive>

  <!-- Fences on the right side (+X), spaced by 6 units -->
  <primitive :object="resources.get('fenceBroken').scene" :scale="[1.5, 1.5, 1.5]" :position="[12.5, 0, -9]" :rotate-y="Math.PI / 2"></primitive>
  <primitive :object="resources.get('fence').scene" :scale="[1.5, 1.5, 1.5]" :position="[12.5, 0, -3]" :rotate-y="Math.PI / 2"></primitive>
  <primitive :object="resources.get('fence').scene" :scale="[1.5, 1.5, 1.5]" :position="[12.5, 0, 3]" :rotate-y="Math.PI / 2"></primitive>
  <primitive :object="resources.get('fenceBroken').scene" :scale="[1.5, 1.5, 1.5]" :position="[12.5, 0, 9]" :rotate-y="Math.PI / 2"></primitive>

  <!-- Distributed rocks (rockPathThin and rockPathSmall), much more -->
  <primitive :object="resources.get('rockPathThin').scene" :scale="[1.5, 1.5, 1.5]" :position="[-10, 0, 5]" :rotate-y="Math.PI / 2"></primitive>
  <primitive :object="resources.get('rockPathSmall').scene" :scale="[1.5, 1.5, 1.5]" :position="[-8, 0, 2]" :rotate-y="Math.PI / 2"></primitive>
  <primitive :object="resources.get('rockPathThin').scene" :scale="[1.5, 1.5, 1.5]" :position="[-4, 0, -5]" :rotate-y="Math.PI / 2"></primitive>
  <primitive :object="resources.get('rockPathSmall').scene" :scale="[1.5, 1.5, 1.5]" :position="[0, 0, -6]" :rotate-y="Math.PI / 2"></primitive>
  <primitive :object="resources.get('rockPathThin').scene" :scale="[1.5, 1.5, 1.5]" :position="[4, 0, 7]" :rotate-y="Math.PI / 2"></primitive>
  <primitive :object="resources.get('rockPathSmall').scene" :scale="[1.5, 1.5, 1.5]" :position="[8, 0, -3]" :rotate-y="Math.PI / 2"></primitive>
  <primitive :object="resources.get('rockPathThin').scene" :scale="[1.5, 1.5, 1.5]" :position="[10, 0, 3]" :rotate-y="Math.PI / 2"></primitive>
  <primitive :object="resources.get('rockPathSmall').scene" :scale="[1.5, 1.5, 1.5]" :position="[-5, 0, 8]" :rotate-y="Math.PI / 2"></primitive>
  <primitive :object="resources.get('rockPathThin').scene" :scale="[1.5, 1.5, 1.5]" :position="[2, 0, -9]" :rotate-y="Math.PI / 2"></primitive>
  <primitive :object="resources.get('rockPathSmall').scene" :scale="[1.5, 1.5, 1.5]" :position="[6, 0, -7]" :rotate-y="Math.PI / 2"></primitive>
  <primitive :object="resources.get('rockPathThin').scene" :scale="[1.5, 1.5, 1.5]" :position="[-6, 0, -4]" :rotate-y="Math.PI / 2"></primitive>
  <primitive :object="resources.get('rockPathSmall').scene" :scale="[1.5, 1.5, 1.5]" :position="[-2, 0, 4]" :rotate-y="Math.PI / 2"></primitive>
  <primitive :object="resources.get('rockPathThin').scene" :scale="[1.5, 1.5, 1.5]" :position="[5, 0, 10]" :rotate-y="Math.PI / 2"></primitive>
  <primitive :object="resources.get('rockPathSmall').scene" :scale="[1.5, 1.5, 1.5]" :position="[-3, 0, -10]" :rotate-y="Math.PI / 2"></primitive>
  <primitive :object="resources.get('rockPathThin').scene" :scale="[1.5, 1.5, 1.5]" :position="[0, 0, -12]" :rotate-y="Math.PI / 2"></primitive>
  <primitive :object="resources.get('rockPathSmall').scene" :scale="[1.5, 1.5, 1.5]" :position="[-10, 0, -8]" :rotate-y="Math.PI / 2"></primitive>

  <!-- More rocks to fill in additional spaces -->
  <primitive :object="resources.get('rockPathSmall').scene" :scale="[1.5, 1.5, 1.5]" :position="[12, 0, -5]" :rotate-y="Math.PI / 2"></primitive>
  <primitive :object="resources.get('rockPathThin').scene" :scale="[1.5, 1.5, 1.5]" :position="[-7, 0, -7]" :rotate-y="Math.PI / 2"></primitive>
  <primitive :object="resources.get('rockPathSmall').scene" :scale="[1.5, 1.5, 1.5]" :position="[-9, 0, 9]" :rotate-y="Math.PI / 2"></primitive>
  <primitive :object="resources.get('rockPathThin').scene" :scale="[1.5, 1.5, 1.5]" :position="[7, 0, 0]" :rotate-y="Math.PI / 2"></primitive>
  <primitive :object="resources.get('rockPathSmall').scene" :scale="[1.5, 1.5, 1.5]" :position="[10, 0, -9]" :rotate-y="Math.PI / 2"></primitive>
  <primitive :object="resources.get('rockPathThin').scene" :scale="[1.5, 1.5, 1.5]" :position="[0, 0, 9]" :rotate-y="Math.PI / 2"></primitive>
  <primitive :object="resources.get('rockPathSmall').scene" :scale="[1.5, 1.5, 1.5]" :position="[-11, 0, -5]" :rotate-y="Math.PI / 2"></primitive>
</template>

<script setup lang="ts">
import {useResources} from "@/composable/useResources";
import {DoubleSide, RepeatWrapping, SRGBColorSpace} from "three";
import {useTexture} from "@tresjs/core";
import Pumpkin from "@/components/objects/Pumpkin.vue";

const resources = useResources();
</script>
