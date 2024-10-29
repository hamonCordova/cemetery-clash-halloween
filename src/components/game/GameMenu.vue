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
          <button class="secondary-btn" @click="gameState.toggleSoundState()">{{gameState.isSoundsEnabled.value ? 'Disable' : 'Enable'}} sounds</button>
        </li>
        <li>
          <button class="secondary-btn" style="margin-top: 15px" @click="modalCredits.open()">Credits</button>
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
  import {useModalCredits} from "@/composable/useModalCredits";

  const emit = defineEmits(['startGame'])

  const gameState = useGameState();
  const modalCredits = useModalCredits();

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
    padding: 0;
    list-style: none;
    width: 100%;
  }

  li {
    width: 100%;
    text-align: center;
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

    button {
      width: 90%;
    }
  }
</style>