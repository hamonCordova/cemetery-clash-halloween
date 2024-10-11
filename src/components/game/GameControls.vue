<template>
  <div class="nipple-container" v-if="isMobile" ref="nippleContainer"></div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import nipplejs from 'nipplejs';
  import { DocumentUtils } from '@/utils/document-utils';
  import { usePlayer } from '@/composable/usePlayer';
  import { Vector3 } from 'three';

  const isMobile = DocumentUtils.isMobile();
  const { activeMovements } = usePlayer();
  const nippleInstance = ref(null);
  const nippleContainer = ref(null);

  onMounted(() => {
    if (isMobile && nippleContainer.value) {
      nippleInstance.value = nipplejs.create({
        zone: nippleContainer.value,
        mode: 'static',
        position: { left: '50%', top: '50%' },
        color: '#c9c3b2',
        threshold: 0.25,
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
  };

  const handleKeyEvent = (type: 'keyup' | 'keydown', event: KeyboardEvent) => {
    const active = type === 'keydown';
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        activeMovements.up = active;
        return;
      case 'ArrowDown':
      case 'KeyS':
        activeMovements.down = active;
        return;
      case 'ArrowLeft':
      case 'KeyA':
        activeMovements.left = active;
        return;
      case 'ArrowRight':
      case 'KeyD':
        activeMovements.right = active;
        return;
      case 'ShiftLeft':
      case 'ShiftRight':
        activeMovements.run = active;
        return;
      case 'Space':
        activeMovements.jump = active;
        return;
    }
  };

  const handleNippleMove = (event: any, data: any) => {
    const { angle, distance } = data;

    if (!angle) return;

    const radianAngle = angle.radian - Math.PI / 2;

    const movementX = -Math.sin(radianAngle) * (distance / 50);
    const movementZ = -Math.cos(radianAngle) * (distance / 50);

    activeMovements.run = true;
    activeMovements.joystickMovement = new Vector3(movementX, 0, movementZ);
  };

  const handleNippleMoveEnd = () => {
    activeMovements.run = false;
    activeMovements.joystickMovement = new Vector3(0, 0, 0);
  };
</script>

<style scoped>
  .nipple-container {
    height: 150px;
    width: 150px;
    position: fixed;
    bottom: 0;
    left: 0;
  }
</style>
