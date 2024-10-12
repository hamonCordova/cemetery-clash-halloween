<template>
  <primitive
      v-if="config"
      ref="enemyRef"
      :object="model"
      cast-shadow
  >
    <Html
      center
      transform
      :distance-factor="4"
      :position="[0, 1.6, -0.1]"
    >
    <div class="enemy-health" :class="{'enemy-health--dead': isDead}">
      <div class="enemy-health__progress" :style="{width: (enemyStoreInstance?.health || 0) + '%'}"></div>
    </div>
    </Html>
  </primitive>
</template>

<script setup lang="ts">
import {computed, onMounted, onUnmounted, shallowRef, toValue} from 'vue';
import {Html, useAnimations, useGLTF} from '@tresjs/cientos';
import {Mesh, Quaternion, Vector3} from 'three';
import {useRenderLoop} from '@tresjs/core';
import {useEnemyStore} from '@/stores/enemyStore';
import {ZombieAnimationEnum} from '../../enum/zombie-animation.enum';
import {useEventBus} from "@vueuse/core";
import type {Enemy} from "@/components/BattleManager.vue";
import {EnemyTypeEnum} from "../../enum/enemy-type.enum";
import {LoopRepeat} from "three/src/constants";
import gsap from "gsap";
import {useResources} from "@/composable/useResources";
import {usePlayer} from "@/composable/usePlayer";

const emit = defineEmits(['die'])
  const {config} = defineProps({
    config: {
      type: Object as Enemy,
      required: true
    }
  })

  const resources = useResources();
  const { scene: model, animations } = resources.get('zombie');
  const { actions } = useAnimations(animations, model);
  const { onLoop } = useRenderLoop();

  const playerState = usePlayer();
  const enemyStore = useEnemyStore();
  const enemyEventBus = useEventBus('enemyEventBus');

  const enemyRef = shallowRef<Mesh>();
  const freezeDistance = 2;
  let isCrawling = false;
  let isFreezing= false;
  let isDead = false;

  const enemyStoreInstance = computed(() => {
    return enemyStore.enemies.find(e => e.id === config.enemyId);
  })

  onMounted(() => {
    spawnEnemy();
    listenEvents();
  });

  onUnmounted(() => {
    enemyStore.removeEnemy(config.enemyId);
  });

  onLoop(({ delta }) => {
    moveTowardsPlayer(delta);
  });

  const listenEvents = () => {
    enemyEventBus.on((event, payload) => {
      if (event === 'die' && config.enemyId === payload) {
        die()
      }
    });
  }

  const spawnEnemy = () => {
    enemyStore.registerEnemy(config.enemyId, config.spawnPosition, EnemyTypeEnum.ZOMBIE);
    enemyRef.value.position.set(
        config.spawnPosition.x,
        config.spawnPosition.y,
        config.spawnPosition.z,
    )

    enemyRef.value.scale.set(
        config.scale || 1.5,
        config.scale || 1.5,
        config.scale || 1.5,
    )
  }

  const die = () => {

    isDead = true;
    playerState.unfreeze(config.enemyId);

    gsap.to(
        enemyRef.value.position,
        {
          y: -2,
          duration: 2,
          ease: 'power2.in',
          onComplete: () => {
            emit('die', config.enemyId)
          }
        }
    )
  }

  const crawl = () => {
    if (isCrawling || isDead) return;

    const crawlAction = actions[ZombieAnimationEnum.Crawl].setLoop(LoopRepeat);
    crawlAction.reset();
    crawlAction.play();

    isCrawling = true;
    isFreezing = false;
  }

  const stopCrawling = () => {
    if (!isCrawling) return;

    actions[ZombieAnimationEnum.Crawl].paused = true;
    isCrawling = false;
  }

  const followPlayerRotation = (targetPosition: Vector3, delta: number) => {

    // Get enemy position and subtract from the target
    const enemyPos = enemyRef.value.position;
    const direction = new Vector3().subVectors(targetPosition, enemyPos).normalize();

    // Calculate the target Y angle
    const targetAngle = Math.atan2(direction.x, direction.z);

    // Change rotation smoothly using quaternion
    const enemyQuaternion = enemyRef.value.quaternion.clone()
    const targetQuaternion = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), targetAngle);

    const rotationSpeed = config.rotationSpeed || 5;
    enemyQuaternion.rotateTowards(targetQuaternion, delta * rotationSpeed);

    // Apply enemy quaternion
    enemyRef.value.quaternion.copy(enemyQuaternion);
  };

  const freezePlayer = () => {
    const enemyPos = enemyRef.value.position;
    const enemyQuaternion = enemyRef.value.quaternion;

    const playerPos = new Vector3().copy(playerState.playerPosition.value);

    const distance = enemyPos.distanceTo(playerPos);
    if (distance > freezeDistance) {
      return;
    }

    const enemyForward = new Vector3(0, 0, 1).applyQuaternion(enemyQuaternion);
    const directionToPlayer = new Vector3().subVectors(playerPos, enemyPos).normalize();

    const dot = enemyForward.dot(directionToPlayer);

    const attackAngle = Math.cos(45 * (Math.PI / 180)); // 45 degrees

    if (dot > attackAngle) {
      isFreezing = true;
      playerState.freeze(config.enemyId);
    }
  };

  const moveTowardsPlayer = (delta: number) => {

    if (isDead) return;

    if (enemyRef.value && playerState.playerPosition.value) {

      const enemyPos = enemyRef.value.position;
      const playerPos = new Vector3().copy(playerState.playerPosition.value);
      playerPos.y = 0;

      const directionToPlayer = new Vector3().subVectors(playerPos, enemyPos);
      const distanceToPlayer = enemyPos.distanceTo(playerPos);

      if (isFreezing) {
        followPlayerRotation(playerPos, delta);
        return;
      }

      if (distanceToPlayer <= freezeDistance) {
        freezePlayer();
        stopCrawling();
        followPlayerRotation(playerPos, delta);
        return;
      }

      // Implement separation behavior to avoid overlapping with other enemies
      const separationForce = new Vector3(0, 0, 0);
      const neighbors = enemyStore.enemies.filter((e) => e.id !== config.enemyId);
      const separationDistance = 2; // Adjust as needed

      for (const neighbor of neighbors) {
        const neighborPos = neighbor.position;
        const distance = enemyPos.distanceTo(neighborPos);
        if (distance < separationDistance) {
          const repulse = new Vector3()
              .subVectors(enemyPos, neighborPos)
              .normalize()
              .multiplyScalar(4 / distance); // Adjusted to prevent large forces
          separationForce.add(repulse);
        }
      }

      // Combine the direction to player and the separation force
      const combinedDirection = new Vector3()
          .copy(directionToPlayer)
          .add(separationForce);

      // Normalize and move enemy towards player, considering separation
      combinedDirection.normalize();
      enemyPos.add(combinedDirection.multiplyScalar(config.moveSpeed * delta));

      // Rotate enemy to face movement direction
      followPlayerRotation(enemyPos.clone().add(combinedDirection), delta);

      // Set walking animation
      crawl()

      // Update enemy position in the store
      enemyStore.updateEnemyPosition(config.enemyId, enemyPos);
    }
  };

</script>
<style>
.enemy-health {
  background: #ccc;
  width: 70px;
  height: 5px;
  border-radius: 5px;
  padding: 1px;
  opacity: 100;
  transition: opacity ease-out 120ms;
}

.enemy-health--dead {
  opacity: 0;
}

.enemy-health__progress {
  background: red;
  border-radius: 5px;
  height: 100%;
  width: 100%;
  transition: width ease-in 120ms;
}
</style>