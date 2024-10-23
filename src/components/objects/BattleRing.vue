<template>
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

  <!-- Fences on the top (+Z), spaced by 6 units -->
  <primitive :ref="(ref) => topFencesRefs.push(ref)" :object="resources.get('fence', 1).scene" :scale="[1.5, 1.5, 1.5]" :position="[-9, 0, 12.5]"></primitive>
  <primitive :ref="(ref) => topFencesRefs.push(ref)" :object="resources.get('fenceBroken', 1).scene" :scale="[1.5, 1.5, 1.5]" :position="[3, 0, 12.5]"></primitive>
  <primitive :ref="(ref) => topFencesRefs.push(ref)" :object="resources.get('fence', 1).scene" :scale="[1.5, 1.5, 1.5]" :position="[-3, 0, 12.5]"></primitive>
  <primitive :ref="(ref) => topFencesRefs.push(ref)" :object="resources.get('fence', 1).scene" :scale="[1.5, 1.5, 1.5]" :position="[9, 0, 12.5]"></primitive>

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
  import { useResources } from "@/composable/useResources";
  import { onMounted, ref } from "vue";
  import { useRenderLoop, useTresContext } from "@tresjs/core";
  import { MathUtils, Vector3 } from "three";

  const resources = useResources();
  const topFencesRefs = ref<any[]>([]);
  const topFencesMaterials = ref<any[]>([]);
  const { onLoop } = useRenderLoop();
  const { camera } = useTresContext();

  let lastOpacity = 1;
  const opacityChangeThreshold = 0.05;

  onMounted(() => {
    topFencesRefs.value.forEach(fence => {
      fence.traverse(obj => {
        if (obj.isMesh) {
          obj.material = obj.material.clone();
          obj.material.transparent = true;
          topFencesMaterials.value.push(obj.material);
        }
      });
    });
    lastOpacity = 0.09;
    changeTopFencesOpacity(0.09);
  });

  onLoop(() => {
    const distance = camera.value?.position.distanceTo(new Vector3(0, 0, 12.5));

    if (distance > 6) {
      const opacity = MathUtils.clamp(6 / distance, 0.06, 1);
      changeTopFencesOpacity(opacity);
    }
  });

  const changeTopFencesOpacity = (opacity = 1) => {

    if (Math.abs(opacity - lastOpacity) < opacityChangeThreshold) {
      return;
    }

    lastOpacity = opacity;
    topFencesMaterials.value.forEach(material => {
      material.opacity = opacity;
    });

  };
</script>
