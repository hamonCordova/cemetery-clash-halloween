<template>
  <div class="container">
    <div class="avatar-container">
      <img class="avatar-img" src="/img/player-avatar.png" alt="Player avatar">
    </div>
    <div class="stats-container">
      <div class="player-name-container">
        <h1 class="player-name">Midnight Skeleton</h1>
      </div>
      <div class="health-container">
        <div class="health-progress-container">
          <div class="health-progress-bar" :style="{width: healthBarWidth}"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

  import {usePlayer} from "@/composable/usePlayer";
  import {computed} from "vue";

  const playerState = usePlayer();

  const healthBarWidth = computed(() => {
    return playerState.health.value >= 0 ?  + playerState.health.value + '%' : '0%';
  })

</script>

<style scoped>
  .container {
    display: flex;
    gap: 10px;
    width: 280px;
    position: fixed;
    top: 10px;
    left: 10px;
    border-radius: 5px;
    border: 2px solid #ee5e0a;
    background: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    padding: 5px;
    box-shadow: 0 0 15px 5px rgba(0, 0, 0, 0.3);
    user-select: none;
  }

  .avatar-container {
    width: 50px;
    min-width: 50px;
    background: #ee5e0a;
    border-radius: 5px;
    overflow: hidden;
  }

  .avatar-img {
    width: 100%;
    height: auto;
    object-fit: fill;
    margin-top: 5px;
    transform: scale(110%);
  }

  .stats-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    gap: 5px;
  }

  .player-name-container {}

  .player-name {
    color: #fff;
    font-size: 16px;
    font-family: "Metal Mania", system-ui;
    line-height: 0;
  }

  .health-container {
    width: 100%;
  }

  .health-progress-container {
    width: 100%;
    background: #5e5e5e;
    height: 16px;
    border-radius: 3px;
    padding: 1px;
    position: relative;
  }

  .health-progress-container:before {
    content: 'HP';
    position: absolute;
    left: calc(50% - 1ch);
    color: #fff;
    font-weight: bold;
    font-size: 12px;
  }

  .health-progress-bar {
    background: #28A745;
    border-radius: 3px;
    width: 100%;
    height: 100%;
    transition: width ease-out 105ms;
  }

  @media only screen and (min-width: 768px) {
    .avatar-container {
      width: 100px;
    }

    .player-name {
      font-size: 20px;
    }

  }

</style>