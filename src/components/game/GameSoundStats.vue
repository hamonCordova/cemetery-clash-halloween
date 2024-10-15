<template>
  <div class="container" @click="$event.stopPropagation(); gameState.toggleSoundState()">
    <img :src="gameState.isSoundsEnabled.value ? '../../../static/img/audioOn.png' : '../../../static/img/audioOff.png'" alt="Mute icon" width="35" height="35">
  </div>
</template>

<script setup lang="ts">
  import {useGameState} from "@/composable/useGameState";

  const gameState = useGameState();
</script>

<style scoped>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 5px;
    border: 1px solid #fff;
    background: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    padding: 5px;
    box-shadow: 0 0 2px 5px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    position: fixed;
    right: 10px;
    top: 10px;
    user-select: none;
  }
</style>