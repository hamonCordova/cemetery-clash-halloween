<template>
  <div class="modal-overlay" @click="modalCreditsState.close()">
    <div class="modal" @click="$event.stopPropagation()">
      <div class="modal-header">
        <h2 class="title">Credits</h2>
        <button class="close-btn" @click="modalCreditsState.close()">Close</button>
      </div>
      <div class="modal-content">
        <p>
          Developed by <a href="https://www.linkedin.com/in/hamoncordova/" target="_blank">Hamon Córdova</a>
        </p>
        <p>
          Theme music <a href="https://freesound.org/people/UNIVERSFIELD/sounds/706326/" target="_blank">This Is Halloween</a> by <a href="https://freesound.org/people/UNIVERSFIELD/" target="_blank">UNIVERSFIELD</a>
        </p>
        <p>
          Sounds licensed via <a href="https://getsoundly.com" target="_blank">Soundly</a>
        </p>
        <p>
          <a href="https://iconscout.com/icons/mouse-click" target="_blank">Mouse Click Icon</a> by
          <a href="https://iconscout.com/contributors/bukeicon" target="_blank">Buke Icon</a> on
          <a href="https://iconscout.com" target="_blank">IconScout</a>
        </p>
        <p>
          Models by <a href="https://poly.pizza/u/Quaternius" target="_blank">Quaternius</a> on <a href="https://poly.pizza" target="_blank">Poly Pizza</a>
        </p>
        <p>
          Halloween Bits Models by <a href="https://poly.pizza/u/Kay%20Lousberg" target="_blank">Kay Lousberg</a> on <a href="https://poly.pizza" target="_blank">Poly Pizza</a>
        </p>
        <p>
          <a href="https://sketchfab.com/3d-models/halloween-pumpkin-low-poly-8259b8b0fbfa45f69dcfdb8a0d14e568" target="_blank">Halloween Pumpkin Low Poly</a> by
          <a href="https://sketchfab.com/vovchanski" target="_blank">vovchanski</a> on <a href="https://sketchfab.com" target="_blank">Sketchfab</a>
        </p>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

  import {useModalCredits} from "@/composable/useModalCredits";

  const modalCreditsState = useModalCredits();
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  width: 800px;
  max-width: 95vw;
  background-color: #222;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
  background-color: #333;
  color: #fff;
}

.title {
  display: inline-block;
  font-family: "Metal Mania", system-ui;
  letter-spacing: 2px;
  font-size: 35px;
  margin: 0;
  padding: 0;
}

.close-btn {
  background: transparent;
  color: #f65a00;
  font-size: 19px;
  margin: 0;
  cursor: pointer;
  width: auto;
  padding: 7px 15px;
  height: 35px;
  border: 1px solid #f65a00;
  box-shadow: none;
  transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;
}

.close-btn:hover {
  background: #f65a00;
  color: #fff;
}

.modal-content {
  padding: 15px 25px;
  max-height: 400px;
  overflow-y: auto;
  color: #eee;
}

.modal-content a {
  color: #f65a00;
  text-decoration: none;
}

.modal-content a:hover {
  text-decoration: underline;
}
</style>
