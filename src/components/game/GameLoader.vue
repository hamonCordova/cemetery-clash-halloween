<template>
  <div class="container">
    <div class="logo-container">
      <img src="../../../static/img/cemetery-clash-halloween-logo.webp" alt="Cemetery Clash: Halloween game logo" class="logo-img" >
    </div>
    <h1 class="font-metal">{{ isWaitingRender ? 'Preparing your game...' : 'Loading...' }}</h1>
    <div class="loading-progress-container">
      <div class="loading-progress__bar" :style="{width: loadingCounter + '%'}"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {useResources} from "@/composable/useResources";
  import {onMounted, ref} from "vue";
  import router from "@/router";
  import {useEventBus} from "@vueuse/core";
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
        loadingCounter.value = total;
      });
  })
</script>

<style scoped>

  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #000;
    width: 100vw;
    max-width: 100%;
    height: 100vh;
    user-select: none;
    position: fixed;
    z-index: 9;
  }

  .logo-container {
    width: 600px;
    max-width: 95vw;
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
    width: 300px;
    height: 20px;
    padding: 3px;
    background-color: #111623;
    border: 1px solid #2c2c2c;
    border-radius: 15px;
    margin-top: 15px;
  }

  .loading-progress__bar {
    width: 0;
    height: 100%;
    transition: width ease-out 60ms;
    background: #fff;
    border-radius: inherit;
  }

</style>