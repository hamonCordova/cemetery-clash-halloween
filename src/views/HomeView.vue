<template>
  <TresCanvas window-size v-bind="rendererProps">
    <TresPerspectiveCamera :args="[85, 1, 0.1, 10000]" :position="[0, 10, 10]" />
    <BattleBase />
    <TresAmbientLight :intensity="1" />
    <TresPointLight
        :args="['#fff', 40, 20, 1]"
        cast-shadow
        :position="[0, 12, 9]"
        v-light-helper
    />
    <Suspense>
      <SkeletonModel cast-shadow />
    </Suspense>
    <Suspense>
      <EnemyModel cast-shadow />
    </Suspense>
    <Suspense>
      <EnemyModel cast-shadow />
    </Suspense>
    <Suspense>
      <BattleFloor />
    </Suspense>
  </TresCanvas>
</template>

<script lang="ts" setup>
  import {TresCanvas, useTresContext, vLightHelper} from '@tresjs/core'
  import {OrbitControls, Sky, Smoke} from "@tresjs/cientos";
  import SkeletonModel from "@/components/SkeletonModel.vue";
  import {DoubleSide, FogExp2, NoToneMapping, PCFShadowMap, PCFSoftShadowMap, SRGBColorSpace} from "three";
  import BattleFloor from "@/components/BattleFloor.vue";
  import {computed, onMounted, shallowRef} from "vue";
  import BattleBase from "@/components/BattleBase.vue";
  import EnemyModel from "@/components/EnemyModel.vue";


  const rendererProps = {
    shadows: true,
    alpha: false,
    shadowMapType: PCFSoftShadowMap,
    outputColorSpace: SRGBColorSpace,
    toneMapping: NoToneMapping,
  }


</script>