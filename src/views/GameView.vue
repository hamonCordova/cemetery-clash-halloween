<template>
  <GameLoader v-if="isLoading" @loaded="showIntro()" />
  <template v-if="resources.isLoaded.value">
    <TresCanvas window-size v-bind="rendererProps">
      <StatsGl  v-if="!isProductionGameMode" />
      <Stars />
      <Suspense>
        <BattleScene ref="battleSceneRef" />
      </Suspense>
      <TresPerspectiveCamera :args="[isMobile ? 70 : 50, 1, 0.5, 100]" :position="[0, 10, 10]" />
      <OrbitControls v-if="isDevScenarioMode" />
      <TresAmbientLight :intensity="0.5" />
      <BattleManager v-if="!isDevScenarioMode" ref="battleManagerRef" @playerDied="onPlayerDied()" @playerWin="onPlayerWin()" />
      <Suspense>
        <BattleFloor />
      </Suspense>
    </TresCanvas>

    <GamePreferencesStats />
    <GameControls v-show="!showingDeadPlayerScore" />
    <GameRoundsState />

    <transition name="fade" :duration="1000" mode="out-in">
      <GameMenu v-if="isShowingMenu" ref="gameMenuRef" @startGame="startGame()" />
    </transition>

    <transition name="fade" :duration="500" mode="out-in">
      <GamePlayerStats v-if="gameState.isPlaying.value && !showingDeadPlayerScore" />
    </transition>

    <transition name="fade" :duration="1000" mode="out-in">
      <GameControlsInstruction v-if="showingPlayerControlsInstruction" />
    </transition>

    <transition name="fade" :duration="500" mode="out-in">
      <GamePlayerDiedScore v-if="showingDeadPlayerScore" @restart="restart" />
    </transition>

    <transition name="fade" :duration="500" mode="out-in">
      <GamePlayerWinScore v-if="showingWinnerPlayerScore" @restart="restart(true)" />
    </transition>

    <transition name="fade" :duration="100" mode="out-in">
      <MODALCredits v-if="modalCredits.isOpen.value" />
    </transition>

  </template>
</template>

<script lang="ts" setup>
  import {TresCanvas, vLightHelper} from '@tresjs/core'
  import {
    NeutralToneMapping,
    PCFSoftShadowMap,
    SRGBColorSpace
  } from "three";
  import BattleFloor from "@/components/BattleFloor.vue";
  import {StatsGl, Stars, OrbitControls} from "@tresjs/cientos";
  import BattleScene from "@/components/BattleScene.vue";
  import BattleManager from "@/components/BattleManager.vue";
  import {computed, onMounted, ref, watch} from "vue";
  import {useResources} from "@/composable/useResources";
  import GameLoader from "@/components/game/GameLoader.vue";
  import {useGameState} from "@/composable/useGameState";
  import {GameStateModeEnum} from "../../enum/game-mode.enum";
  import GameControls from "@/components/game/GameControls.vue";
  import {DocumentUtils} from "@/utils/document-utils";
  import GameMenu from "@/components/game/GameMenu.vue";
  import GamePlayerStats from "@/components/game/GamePlayerStats.vue";
  import {useSounds} from "@/composable/useSounds";
  import GamePreferencesStats from "@/components/game/GamePreferencesStats.vue";
  import GamePlayerDiedScore from "@/components/game/GamePlayerDiedScore.vue";
  import GameControlsInstruction from "@/components/game/GameControlsInstruction.vue";
  import GameRoundsState from "@/components/game/GameRoundsState.vue";
  import GamePlayerWinScore from "@/components/game/GamePlayerWinScore.vue";
  import MODALCredits from "@/components/modal/MODALCredits.vue";
  import {useModalCredits} from "@/composable/useModalCredits";

  const gameState = useGameState();
  const resources = useResources();
  const modalCredits = useModalCredits();
  const sounds = useSounds();
  const isLoading = ref(true);
  const isShowingMenu = ref(false);
  const battleSceneRef = ref();
  const gameMenuRef = ref();
  const battleManagerRef = ref();
  const showingDeadPlayerScore = ref(false);
  const showingWinnerPlayerScore = ref(false);
  const showingPlayerControlsInstruction = ref(false);
  const isMobile = DocumentUtils.isMobile();
  let themeMusic;

  const rendererProps = {
    shadows: true,
    alpha: false,
    antialias: !isMobile,
    shadowMapType: PCFSoftShadowMap,
    outputColorSpace: SRGBColorSpace,
    toneMapping: NeutralToneMapping,
    powerPreference: 'high-performance',
  }

  const isProductionGameMode = computed(() => {
    return gameState.mode.value === GameStateModeEnum.PRODUCTION
  })

  const isDevScenarioMode = computed(() => {
    return gameState.mode.value === GameStateModeEnum.DEV_SCENARIO
  })

  onMounted(() => {
    document.addEventListener('contextmenu', function(event) {
      event.preventDefault();
    });
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

    themeMusic = sounds.getAudio('themeMusic', true, 0.15);
    if (gameState.isSoundsEnabled.value && isProductionGameMode.value) {
      themeMusic.play();
    }

    isShowingMenu.value = false;

    setTimeout(() => {
      gameState.isPlaying.value = true;
    }, 1000)

    if (isMobile) {
      setTimeout(() => {
        battleManagerRef.value.startRound();
      }, withTimeout ? 7000 : 0)
      return;
    }

    setTimeout(() => {
      showingPlayerControlsInstruction.value = true;

      setTimeout(() => {
        battleManagerRef.value.startRound();
      }, 6000)

      setTimeout(() => {
        showingPlayerControlsInstruction.value = false;
      }, 11000)

    }, 1000)

  }

  const onPlayerDied = () => {
    showingDeadPlayerScore.value = true;
  }

  const onPlayerWin = () => {
    showingWinnerPlayerScore.value = true;
  }

  const restart = (afterWin = false) => {
    showingDeadPlayerScore.value = false;
    showingWinnerPlayerScore.value = false;
    afterWin ? battleManagerRef.value.restartAfterWin() : battleManagerRef.value.restart()
  }

  watch(() => gameState.isSoundsEnabled.value, () => {
    if (!themeMusic) return
    gameState.isSoundsEnabled.value ? themeMusic.play() : themeMusic.stop();
  })

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