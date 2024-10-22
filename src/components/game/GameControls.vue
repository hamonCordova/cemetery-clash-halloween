<template>
  <div v-if="isMobile" :class="['mobile-controls', {'mobile-controls--enabled': gameState.isPlaying.value}]">
    <div class="nipple-container" @click="$event.stopPropagation()" ref="nippleContainer"></div>
    <div class="buttons-container">
      <button class="button button--jump"
              @touchstart="activeMovements.jump = true; $event.preventDefault(); $event.stopPropagation()"
              @touchend="activeMovements.jump = false; $event.stopPropagation()">
        <img src="/img/arrow_n.svg" alt="Jump icon" />
      </button>
      <button class="button button--attack"
              @touchstart="attack(); $event.preventDefault(); $event.stopPropagation()"
              @touchend="$event.preventDefault(); $event.stopPropagation()">
        <img src="/img/tool_sword_b.svg" alt="Attack icon" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import nipplejs from 'nipplejs';
  import { DocumentUtils } from '@/utils/document-utils';
  import { usePlayer } from '@/composable/usePlayer';
  import { Vector3 } from 'three';
  import {useGameState} from "@/composable/useGameState";

  const isMobile = DocumentUtils.isMobile();
  const { activeMovements, attack } = usePlayer();
  const nippleInstance = ref(null);
  const nippleContainer = ref(null);
  const gameState = useGameState();

  onMounted(() => {
    if (isMobile && nippleContainer.value) {
      nippleInstance.value = nipplejs.create({
        zone: nippleContainer.value,
        mode: 'static',
        position: { left: '50%', top: '50%' },
        color: '#c9c3b2',
        threshold: 0.35,
        fadeTime: 400,
        maxNumberOfNipples: 1,
      });

      activeMovements.usingJoystick = true;
    }

    initEventListeners();
  });

  onUnmounted(() => {
    if (nippleInstance.value) {
      nippleInstance.value.off('move', handleNippleMove);
      nippleInstance.value.off('end', handleNippleMoveEnd);
    }
  });

  const initEventListeners = () => {
    if (isMobile && nippleInstance.value) {
      nippleInstance.value.on('move', handleNippleMove);
      nippleInstance.value.on('end', handleNippleMoveEnd);
    } else {
      window.addEventListener('keydown', (event) => {
        handleKeyEvent('keydown', event);
      });

      window.addEventListener('keyup', (event) => {
        handleKeyEvent('keyup', event);
      });
    }

    window.addEventListener('click', (event) => {
      if (!gameState.isPlaying.value) return;
      attack();
    });
  };

  const handleKeyEvent = (type: 'keyup' | 'keydown', event: KeyboardEvent) => {

    if (!gameState.isPlaying.value) return;

    const active = type === 'keydown';
    switch (event.key.toLowerCase()) {
      case 'w':
      case 'z':
      case 'arrowup':
        activeMovements.up = active;
        return;
      case 's':
      case 'arrowdown':
        activeMovements.down = active;
        return;
      case 'a':
      case 'q':
      case 'arrowleft':
        activeMovements.left = active;
        return;
      case 'd':
      case 'arrowright':
        activeMovements.right = active;
        return;
      case 'shift':
        activeMovements.run = active;
        return;
      case ' ':
        activeMovements.jump = active;
        return;
    }
  };

  const handleNippleMove = (event: any, data: any) => {

    const { angle, distance } = data;

    if (!angle || !gameState.isPlaying.value) return;

    const radianAngle = angle.radian - Math.PI / 2;

    const movementX = -Math.sin(radianAngle) * (distance / 150);
    const movementZ = -Math.cos(radianAngle) * (distance / 150);

    activeMovements.run = true;
    activeMovements.joystickMovement = new Vector3(movementX, 0, movementZ);
  };

  const handleNippleMoveEnd = () => {
    if (!gameState.isPlaying) return;

    activeMovements.run = false;
    activeMovements.joystickMovement = new Vector3(0, 0, 0);
  };

</script>

<style>

  .mobile-controls {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    opacity: 0;
  }

  .mobile-controls--enabled {
    opacity: 1;
  }

  .nipple-container {
    height: 150px;
    width: 150px;
    position: relative;
  }

  .nipple .back {
    background-color: rgba(255, 255, 255, 1) !important;
  }

  .nipple .front {
    background-color: #020202 !important;
  }

  .buttons-container {
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    gap: 10px;
    padding: 0 30px 30px 30px;
  }

  .button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    outline: none;
    border: 1px solid #ccc;
    background: rgba(255, 255, 255, 0.22);
    transition: box-shadow linear 80ms;
  }

  .button:active {
    box-shadow: inset 2px 0 4px 4px rgba(0, 0, 0, 0.2);
  }

  .button--attack {
    width: 70px;
    height: 70px;
    border-radius: 50%;
  }


</style>
