<template>
  <primitive
      ref="enemyRef"
      :object="model"
      :position="[0, 1.01, 0]"
  >
    <Html
      v-if="isSpawned"
      center
      transform
      :distance-factor="4"
      :position="[0, 1.6, -0.1]"
    >
    <div class="enemy-health" :class="{'enemy-health--dead': isDead || !isSpawned}">
      <div class="enemy-health__progress"  :style="{width: (enemyStoreInstance?.health || 0) + '%'}"></div>
    </div>
    </Html>
  </primitive>
</template>

<script setup lang="ts">
import {computed, onMounted, onUnmounted, shallowRef, watch, ref} from 'vue';
import {Html, useAnimations} from '@tresjs/cientos';
import {Mesh, Quaternion, Vector3} from 'three';
import {useRenderLoop} from '@tresjs/core';
import {SkeletonAnimationEnum} from '../../enum/skeleton-animation.enum';
import {useEventBus} from "@vueuse/core";
import type {Enemy} from "@/components/BattleManager.vue";
import useCharacter from "@/composable/useCharacter";
import {EnemyTypeEnum} from "../../enum/enemy-type.enum";
import {useResources} from "@/composable/useResources";
import {usePlayer} from "@/composable/usePlayer";
import {useEnemiesSpawned} from "@/composable/useEnemiesSpawned";
import {useSounds} from "@/composable/useSounds";
import gsap from "gsap";
import {BattleLayersEnum} from "../../enum/battle-layers.enum";

  const emit = defineEmits(['die'])
  const props = defineProps({
    config: {
      type: Object as Enemy,
    }
  })

  const isSpawned = ref(false);
  const resources = useResources();
  const { scene: model, animations } = resources.get('skeleton');
  const { actions } = useAnimations(animations, model);
  const { onLoop } = useRenderLoop();
  const enemyRef = shallowRef<Mesh>();
  const playerState = usePlayer();
  const enemiesState = useEnemiesSpawned();
  const sounds = useSounds();
  const enemyEventBus = useEventBus('enemyEventBus');
  const attackDistance = 2;

  const { attack, stopWalk, walk, die, receiveHit, resetActions, isDead, isAttacking } = useCharacter(
    enemyRef,
    actions,
    {
      walk: SkeletonAnimationEnum.Walk,
      idle: SkeletonAnimationEnum.Idle,
      attack: SkeletonAnimationEnum.Sword,
      die: SkeletonAnimationEnum.Death,
      hitReact: SkeletonAnimationEnum.HitReact
    },
      () => attackConfig.value,
    {
      finishAttack: () => checkAttackHit(),
      onDie: () => {
        emit('die', {id: props.config?.enemyId, position: enemyStoreInstance.value?.position})
        enemiesState.removeEnemy(props.config?.enemyId);
      }
    },
  )

  const soundActions = {
    attack: sounds.createAudioPlayer(['skeletonEnemySwordSwing1', 'skeletonEnemySwordSwing2'], model),
    death: sounds.createAudioPlayer(['skeletonDeath'], model, 1),
    hitReceived: sounds.createAudioPlayer(['skeletonEnemyHit1', 'skeletonEnemyHit2', 'skeletonEnemyHit3'], model, 1),
  }

  const enemyStoreInstance = computed(() => {
    return enemiesState.enemies.value.find(e => e.id ===props.config?.enemyId);
  })

  const attackConfig = computed(() => {
    return {
      nextAttackDelay: props.config?.attackDelay || 2000,
    }
  })

  onMounted(() => {
    setLayer(BattleLayersEnum.POOL)
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
        receiveHit()
      }
    });

  }

  const unspawnEnemy = () => {
    gsap.to(enemyRef.value.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: 2.5,
      ease: "elastic.in",
      onComplete: () => {
        emit('die', {id: props.config?.enemyId, position: enemyStoreInstance.value?.position})
        enemiesState.removeEnemy(props.config?.enemyId);
      }
    });
  }


const spawnEnemy = () => {
    setLayer(BattleLayersEnum.ACTIVE)

    enemiesState.registerEnemy(props.config?.enemyId, props.config?.spawnPosition, EnemyTypeEnum.SKELETON);
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

  const reset = () => {
    setLayer(BattleLayersEnum.POOL)
    isSpawned.value = false;
    enemyRef.value.position.set(0, 1.01, 0);
    enemyRef.value?.rotation.set(0, 0, 0);
    resetActions();
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

  const checkAttackHit = () => {
    const enemyPos = enemyRef.value.position;
    const enemyQuaternion = enemyRef.value.quaternion;

    const playerPos = new Vector3().copy(playerState.playerPosition.value);

    const distance = enemyPos.distanceTo(playerPos);
    const attackRange = 2; // Adjust as needed
    if (distance > attackRange) {
      return; // Player is out of range
    }

    // Check if player is in front of enemy
    const enemyForward = new Vector3(0, 0, 1).applyQuaternion(enemyQuaternion);
    const directionToPlayer = new Vector3().subVectors(playerPos, enemyPos).normalize();

    const dot = enemyForward.dot(directionToPlayer);

    const attackAngle = Math.cos(45 * (Math.PI / 180)); // 45 degrees

    if (dot > attackAngle) {
      // Player is within 45 degrees in front of enemy
      // Attack hits
      playerState.takeDamage(props.config?.damage); // or any function to apply damage
    }
  };

  const moveTowardsPlayer = (delta: number) => {

    if (isDead.value) return;

    if (enemyRef.value && playerState.playerPosition.value) {

      const enemyPos = enemyRef.value.position;
      const playerPos = new Vector3().copy(playerState.playerPosition.value);
      playerPos.y = 0;

      const directionToPlayer = new Vector3().subVectors(playerPos, enemyPos);
      const distanceToPlayer = enemyPos.distanceTo(playerPos);

      if (distanceToPlayer <= attackDistance) {

        if (!isAttacking.value) {
          soundActions.attack?.playRandom();
        }

        attack()
        stopWalk();
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
      walk()

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