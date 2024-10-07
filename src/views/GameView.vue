<template>
  <template v-if="resources.isLoaded.value">
    <TresCanvas window-size v-bind="rendererProps">
      <StatsGl />
      <Suspense>
        <BattleScene />
      </Suspense>
      <TresPerspectiveCamera :args="[85, 1, 0.1, 10000]" :position="[0, 10, 10]" />
      <BattleBase />
      <TresAmbientLight :intensity="1" />
      <TresPointLight
          :args="['#fff', 40, 20, 1]"
          cast-shadow
          :position="[0, 12, 9]"
          v-light-helper
      />
      <BattleManager />
      <Suspense>
        <BattleFloor />
      </Suspense>
    </TresCanvas>
  </template>
</template>

<script lang="ts" setup>
  import {TresCanvas, vLightHelper} from '@tresjs/core'
  import SkeletonModel from "@/components/SkeletonModel.vue";
  import {NoToneMapping, PCFSoftShadowMap, SRGBColorSpace} from "three";
  import BattleFloor from "@/components/BattleFloor.vue";
  import BattleBase from "@/components/BattleBase.vue";
  import EnemyModel from "@/components/EnemyModel.vue";
  import {StatsGl, Stars, OrbitControls} from "@tresjs/cientos";
  import BattleManager from "@/components/BattleManager.vue";
  import BattleScene from "@/components/BattleScene.vue";
  import {onMounted} from "vue";
  import {useResources} from "@/composable/useResources";
  import router from "@/router";

  const resources = useResources();

  const rendererProps = {
    shadows: true,
    alpha: false,
    shadowMapType: PCFSoftShadowMap,
    outputColorSpace: SRGBColorSpace,
    toneMapping: NoToneMapping,
  }

  onMounted(() => {
    console.warn(resources.isLoaded.value)
    if (!resources.isLoaded.value) {
      router.push('/')
    }
  })


</script>