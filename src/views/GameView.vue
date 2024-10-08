<template>
  <template v-if="resources.isLoaded.value">
    <TresCanvas window-size v-bind="rendererProps" render-mode="on-demand">
      <StatsGl />
      <Stars />
      <TresFogExp2 color="red" density="900" />
      <Suspense>
        <BattleScene />
      </Suspense>
      <TresPerspectiveCamera :args="[60, 1, 0.1, 10000]" :position="[0, 10, 10]" />
<!--     <OrbitControls />-->
      <TresAmbientLight :intensity="0.5" />
<!--      <TresPointLight
          :args="['#fff', 40, 20, 1]"
          cast-shadow
          :position="[0, 12, 9]"
          v-light-helper
      />-->
      <BattleManager />
      <Suspense>
        <BattleFloor />
      </Suspense>
    </TresCanvas>
  </template>
</template>

<script lang="ts" setup>
  import {TresCanvas, vLightHelper} from '@tresjs/core'
  import {ACESFilmicToneMapping, NoToneMapping, PCFSoftShadowMap, SRGBColorSpace} from "three";
  import BattleFloor from "@/components/BattleFloor.vue";
  import {StatsGl, Stars, OrbitControls, Smoke} from "@tresjs/cientos";
  import BattleScene from "@/components/BattleScene.vue";
  import BattleManager from "@/components/BattleManager.vue";
  import {onMounted} from "vue";
  import {useResources} from "@/composable/useResources";
  import router from "@/router";

  const resources = useResources();

  const rendererProps = {
    shadows: true,
    alpha: false,
    shadowHeight: 64,
    shadowWidth: 64,
    shadowMapType: PCFSoftShadowMap,
    outputColorSpace: SRGBColorSpace,
    toneMapping: ACESFilmicToneMapping,
    powerPreference: 'high-performance'
  }

  onMounted(() => {
    console.warn(resources.isLoaded.value)
    if (!resources.isLoaded.value) {
      router.push('/')
    }
  })


</script>