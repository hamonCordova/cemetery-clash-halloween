<template>
  <GameLoader v-if="isLoading" @loaded="showIntro()" />
  <template v-if="resources.isLoaded.value">
    <TresCanvas window-size v-bind="rendererProps">
      <StatsGl v-if="!isProductionGameMode" />
      <Stars />
      <Suspense>
        <BattleScene ref="battleSceneRef" @start="startBattle()" />
      </Suspense>
      <TresPerspectiveCamera :args="[50, 1, 0.1, 10000]" :position="[0, 10, 10]" />
      <OrbitControls v-if="isDevScenarioMode" />
      <TresAmbientLight :intensity="0.5" />
      <BattleManager v-if="!isDevScenarioMode" ref="battleManagerRef" />
      <Suspense>
        <BattleFloor />
      </Suspense>
    </TresCanvas>
    <GameControls />
  </template>
</template>

<script lang="ts" setup>
  import {TresCanvas, vLightHelper} from '@tresjs/core'
  import {ACESFilmicToneMapping, NoToneMapping, PCFSoftShadowMap, SRGBColorSpace} from "three";
  import BattleFloor from "@/components/BattleFloor.vue";
  import {StatsGl, Stars, OrbitControls, Smoke} from "@tresjs/cientos";
  import BattleScene from "@/components/BattleScene.vue";
  import BattleManager from "@/components/BattleManager.vue";
  import {computed, onMounted, ref} from "vue";
  import {useResources} from "@/composable/useResources";
  import router from "@/router";
  import GameLoader from "@/components/game/GameLoader.vue";
  import {useGameState} from "@/composable/useGameState";
  import {GameStateModeEnum} from "../../enum/game-mode.enum";
  import GameControls from "@/components/game/GameControls.vue";
  import {DocumentUtils} from "@/utils/document-utils";

  const gameState = useGameState();
  const resources = useResources();
  const isLoading = ref(true);
  const battleSceneRef = ref();
  const battleManagerRef = ref();
  const isMobile = DocumentUtils.isMobile();

  const rendererProps = {
    shadows: true,
    alpha: false,
    antialias: !isMobile,
    shadowMapType: PCFSoftShadowMap,
    outputColorSpace: SRGBColorSpace,
    toneMapping: ACESFilmicToneMapping,
    powerPreference: 'high-performance',
  }

  const isProductionGameMode = computed(() => {
    return gameState.mode.value === GameStateModeEnum.PRODUCTION
  })

  const isDevScenarioMode = computed(() => {
    return gameState.mode.value === GameStateModeEnum.DEV_SCENARIO
  })

  const startBattle = () => {
    battleManagerRef.value.startRound();
  }

  const showIntro = () => {
    isLoading.value = false;

    if (isProductionGameMode.value) {
      battleSceneRef.value.startIntro();
      return;
    }

    gameState.isPlaying.value = true;
    startBattle();
  }

</script>