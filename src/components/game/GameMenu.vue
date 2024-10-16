<template>
  <div class="container">
    <div class="wrapper">
      <div class="logo-container">
        <img class="logo-img" src="/img/cemetery-clash-halloween-logo.webp" alt="Cemetery Clash: Halloween logo" width="1024" height="828" />
      </div>
      <ul>
        <li>
          <button @click="emit('startGame')">Start game</button>
        </li>
        <li>
          <button @click="gameState.toggleSoundState()">{{gameState.isSoundsEnabled.value ? 'Disable' : 'Enable'}} sounds</button>
        </li>
      </ul>
      <footer>
        <div class="footer-container">
          Developed by <a href="https://www.linkedin.com/in/hamoncordova/" target="_blank">Hamon Córdova</a>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">

  import {useGameState} from "@/composable/useGameState";

  const emit = defineEmits(['startGame'])

  const gameState = useGameState();

</script>

<style scoped>
  .container {
    width: 100vw;
    height: 100%;
    position: fixed;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.90) 1%, transparent 100%);
  }

  .wrapper {
    width: 100%;
    height: 100%;
    padding: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .logo-container {
    width: 400px;
    max-width: 100%;
  }

  .logo-img {
    width: 100%;
    height: auto;
    object-fit: contain;
  }

  ul {
    list-style: none;
    width: 100%;
  }

  li {
    width: 100%;
  }

  button {
    background: linear-gradient(360deg, #ee5e0a, #f5b442);
    box-shadow: inset 0 0 8px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #000;
    border-radius: 10px;
    width: 90%;
    height: 43px;
    cursor: pointer;
    font-size: 34px;
    font-family: "Metal Mania", system-ui;
    transition: filter 120ms ease-out, box-shadow 120ms ease-out;
    margin-top: 30px;
  }

  button:hover {
    filter: brightness(1.2);
    box-shadow: inset 0 0 8px 3px rgba(0, 0, 0, 0.4);
  }

  footer {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    flex-grow: 1;
    width: 100%;
  }

  .footer-container {
    border-top: 1px solid #808080;
    padding-top: 15px;
    width: 100%;
    color: #fff;
    text-align: center;
  }

  a {
    color: #ee5e0a;
  }

  @media only screen and (min-width: 768px) {
   .container {
     width: 600px;
   }
  }
</style>