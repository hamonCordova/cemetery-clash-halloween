<template>
  <primitive
      ref="enemyRef"
      :object="model"
      :position="[0, -10, 0]"
  >
    <Html
      v-if="isSpawned"
      center
      transform
      :distance-factor="4"
      :position="[0, 0.7, 0.4]"
      :scale="[0.6, 0.6, 0.6]"
    >
    <div class="enemy-health" :class="{'enemy-health--dead': isDead || !isSpawned}">
      <div class="enemy-health__progress" :style="{width: (enemyStoreInstance?.health || 0) + '%'}"></div>
    </div>
    </Html>
  </primitive>
</template>

<script setup lang="ts">
  import {computed, onMounted, onUnmounted, shallowRef, watch, ref} from 'vue';
  import {Html, useAnimations} from '@tresjs/cientos';
  import {Mesh, Quaternion, Vector3} from 'three';
  import {useRenderLoop} from '@tresjs/core';
  import {ZombieAnimationEnum} from '../../enum/zombie-animation.enum';
  import {useEventBus} from "@vueuse/core";
  import type {Enemy} from "@/components/BattleManager.vue";
  import {EnemyTypeEnum} from "../../enum/enemy-type.enum";
  import {LoopOnce, LoopRepeat} from "three/src/constants";
  import gsap from "gsap";
  import {useResources} from "@/composable/useResources";
  import {usePlayer} from "@/composable/usePlayer";
  import {useEnemiesSpawned} from "@/composable/useEnemiesSpawned";
  import {useSounds} from "@/composable/useSounds";
  import {BattleLayersEnum} from "../../enum/battle-layers.enum";
  import GameAudioPlayer from "../../models/game-audio-player";

  const emit = defineEmits(['die'])
  const props = defineProps({
    config: {
      type: Object as Enemy,
    }
  })

  const resources = useResources();
  const { scene: model, animations } = resources.get('zombie');
  const { actions } = useAnimations(animations, model);
  const { onLoop } = useRenderLoop();
  const sounds = useSounds();
  const playerState = usePlayer();
  const enemiesState = useEnemiesSpawned();
  const enemyEventBus = useEventBus('enemyEventBus');
  const enemyRef = shallowRef<Mesh>();
  const freezeDistance = 2;
  const isSpawned = ref(false);
  let isCrawling = false;
  let isFreezing = false;
  let isDead = true;

  const soundActions = {
    hitReceived: sounds.createAudioPlayer(['zombieHitReceived1', 'zombieHitReceived2', 'zombieHitReceived3'], model, 1),
    death: sounds.createAudioPlayer(['zombieDeath'], model),
    crawl: sounds.createAudioPlayer(['zombieGurgle1', 'zombieGurgle2'], model),
  }

  const enemyStoreInstance = computed(() => {
    return enemiesState.enemies.value.find(e => e.id === props.config?.enemyId);
  })

  onMounted(() => {
  });

  onUnmounted(() => {
    enemiesState.removeEnemy(props.config?.enemyId);
  });

  onLoop(({ delta }) => {

    if (playerState.isDead.value) {
      return;
    }

    if (!isSpawned.value) {
      if (props.config) {
        followPlayerRotation(playerState.playerPosition.value, delta);
        const crawlAction = actions[ZombieAnimationEnum.Crawl].setLoop(LoopOnce);
        crawlAction.reset();
        crawlAction.play();
      }
      return
    }

    moveTowardsPlayer(delta);
  });

  const setLayer = (layer: number) => {
    model.traverse((mesh) => {
      mesh.layers.set(layer)
    })
  }

  const listenEvents = () => {
    enemyEventBus.on((event, payload) => {
      if (event === 'die' && props.config?.enemyId === payload) {
        soundActions.death?.playRandom();
        die()
      }

      if (event === 'damageReceived' && props.config?.enemyId === payload) {
        soundActions.hitReceived?.playRandom();
      }
    });
  }

  const unspawnEnemy = () => {

    if (isDead) return;
    isDead = true;

    gsap.to(enemyRef.value.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: 3,
      ease: "elastic.in",
      onComplete: () => {
        emit('die', {id: props.config?.enemyId, position: enemyStoreInstance.value?.position})
        enemiesState.removeEnemy(props.config?.enemyId);
      }
    });
  }

  const spawnEnemy = () => {
    isDead = false;

    enemiesState.registerEnemy(props.config?.enemyId, props.config?.spawnPosition, EnemyTypeEnum.ZOMBIE);
    enemyRef.value.scale.set(0, 0, 0);
    enemyRef.value.position.set(
        props.config?.spawnPosition.x,
        props.config?.spawnPosition.y,
        props.config?.spawnPosition.z,
    )

    gsap.to(enemyRef.value.scale, {
      x: props.config?.scale || 1.5,
      y: props.config?.scale || 1.5,
      z: props.config?.scale || 1.5,
      duration: 1,
      ease: "elastic.out",
      onComplete: () => isSpawned.value = true
    });
  }

  const die = () => {

    isDead = true;
    playerState.unfreeze(props.config?.enemyId);

    gsap.to(
        enemyRef.value.position,
        {
          y: -2,
          duration: 2,
          ease: 'power2.in',
          onComplete: () => {
            emit('die', {id: props.config?.enemyId, position: enemyStoreInstance.value?.position})
            enemiesState.removeEnemy(props.config?.enemyId);
          }
        }
    )
  }

  const reset = () => {
    isSpawned.value = false;
    isDead = true;
    isCrawling = false;
    isFreezing = false;
    enemyRef.value.position.set(0, -10, 0);
    enemyRef.value?.rotation.set(0, 0, 0);
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

    const rotationSpeed = props.config?.rotationSpeed || 5;
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
      playerState.freeze(props.config?.enemyId);
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

      soundActions.crawl?.setCooldown(5000);
      soundActions.crawl?.playRandom();

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
      const neighbors = enemiesState.enemies.value.filter((e) => e.id !== props.config?.enemyId);
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
      enemyPos.add(combinedDirection.multiplyScalar(props.config?.moveSpeed * delta));

      // Rotate enemy to face movement direction
      followPlayerRotation(enemyPos.clone().add(combinedDirection), delta);

      // Set walking animation
      crawl()

      // Update enemy position in the store
      enemiesState.updateEnemyPosition(props.config?.enemyId, enemyPos);
    }
  };

  watch(() => props.config, (config) => {
    if (!config) {
      reset();
      return;
    }

    spawnEnemy();
    listenEvents();
  })

  watch(() => playerState.isDead.value, (isPlayerDead: boolean) => {
    if (isPlayerDead) {
      unspawnEnemy()
    }
  })

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