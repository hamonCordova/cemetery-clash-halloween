<template>
  <GameLoader v-if="isLoading" @loaded="showIntro()" />
  <template v-if="resources.isLoaded.value">
    <TresCanvas window-size v-bind="rendererProps">
      <StatsGl  v-if="!isProductionGameMode" />
      <Stars />
      <Suspense>
        <BattleScene ref="battleSceneRef" />
      </Suspense>
      <TresPerspectiveCamera :args="[50, 1, 0.1, 10000]" :position="[0, 10, 10]" />
      <OrbitControls v-if="isDevScenarioMode" />
      <TresAmbientLight :intensity="0.5" />
      <BattleManager v-if="!isDevScenarioMode" ref="battleManagerRef" />
      <Suspense>
        <BattleFloor />
      </Suspense>
    </TresCanvas>
    <transition name="fade" :duration="1000" mode="out-in">
      <GameMenu v-if="isShowingMenu" ref="gameMenuRef" @startGame="startGame()" />
    </transition>
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
  import GameMenu from "@/components/game/GameMenu.vue";

  const gameState = useGameState();
  const resources = useResources();
  const isLoading = ref(true);
  const isShowingMenu = ref(false);
  const battleSceneRef = ref();
  const gameMenuRef = ref();
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

  const showIntro = () => {
    isLoading.value = false;

    if (isProductionGameMode.value) {
      const introDuration = 3000;
      battleSceneRef.value.startIntro(introDuration);

      setTimeout(() => {
        isShowingMenu.value = true;
      }, isMobile ? introDuration / 1.2 : introDuration / 1.7)

      return;
    }

    startGame(false);
  }

  const startGame = (withTimeout = true) => {

    isShowingMenu.value = false;
    setTimeout(() => {
      gameState.isPlaying.value = true;
    }, 1000)

    setTimeout(() => {
      battleManagerRef.value.startRound();
    }, withTimeout ? 3000 : 0)
  }

</script>
<style>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>