<template>
  <div class="container">
    <div class="content">
      <div class="logo-container">
        <img src="/img/cemetery-clash-halloween-logo.webp" alt="Cemetery Clash: Halloween game logo" class="logo-img" width="1024" height="828" >
      </div>
      <h1 class="font-metal">{{ isWaitingRender ? 'Preparing your game...' : `Loading... ${Math.floor(loadingCounter)}%` }}</h1>
      <div class="loading-progress-container">
        <div class="loading-progress__bar" :style="{width: loadingCounter + '%'}"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {useResources} from "@/composable/useResources";
  import {onMounted, ref} from "vue";
  import {useGameState} from "@/composable/useGameState";
  import {GameStateModeEnum} from "../../../enum/game-mode.enum";

  const emit = defineEmits(['loaded'])

  const resources = useResources();
  const gameState = useGameState();
  const isWaitingRender = ref(false);
  const loadingCounter = ref(0);

  onMounted(() => {
    resources.load(() => {
      isWaitingRender.value = true;
      setTimeout(() => {
        emit('loaded');
      }, gameState.mode.value === GameStateModeEnum.PRODUCTION ? 5000 : 500)
    }, (total: number) => {
      loadingCounter.value = total > 95 ? 100 : total;
    });
  })
</script>

<style scoped>

  .container {
    width: 100%;
    height: 100%;
    position: fixed;
    background-color: black;
    z-index: 9;
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transform: translateY(25%);
  }

  .logo-container {
    width: 445px;
    max-width: 95vw;
    aspect-ratio: 1024 / 828;
  }

  .logo-img {
    width: 100%;
    height: auto;
    object-fit: contain;
  }

  h1 {
    color: #fff;
    margin-top: 10px;
  }

  .loading-progress-container {
    width: 350px;
    height: 20px;
    padding: 3px;
    background-color: #111623;
    border: 1px solid #2c2c2c;
    border-radius: 15px;
  }

  .loading-progress__bar {
    width: 0;
    height: 100%;
    transition: width ease-out 60ms;
    background: #fff;
    border-radius: inherit;
  }

  @media only screen and (min-width: 1500px) {
    .logo-container {
      width: 500px;
    }

    .content {
      transform: translateY(35%);
    }
  }

</style>