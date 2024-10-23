<template>
  <div class="container">
    <div class="option" @click="$event.stopPropagation(); gameState.toggleSoundState()">
      <img :src="gameState.isSoundsEnabled.value ? '/img/audioOn.png' : '/img/audioOff.png'" alt="Mute icon" width="30" height="30">
    </div>
    <div class="option" @click="$event.stopPropagation(); gameState.toggleFullScreenState()">
      <img :src="gameState.isFullScreen.value ? '/img/fullScreenOffIcon.png' : '/img/fullScreenOnIcon.png'" alt="Full screen icon" width="30" height="30">
    </div>
  </div>
</template>

<script setup lang="ts">
  import {useGameState} from "@/composable/useGameState";
  import {onMounted, ref} from "vue";

  const gameState = useGameState();

  onMounted(() => {
    document.addEventListener('fullscreenchange', () => {
      gameState.isFullScreen.value = document.fullscreenElement != null
    });
  })

</script>

<style scoped>

  .container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: fixed;
    right: 10px;
    top: 10px;
    user-select: none;
    z-index: 999;
  }

  .option {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    border-radius: 5px;
    border: 1px solid #fff;
    background: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    padding: 5px;
    box-shadow: 0 0 2px 5px rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }

  img {
    width: 25px;
    height: 25px;
  }

  @media only screen and (min-width: 768px) {
    .container {
      flex-direction: row;
    }

    .option {
      width: 40px;
      height: 40px;
    }

    img {
      width: 30px;
      height: 30px;
    }
  }
</style>