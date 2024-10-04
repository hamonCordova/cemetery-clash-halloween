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
      <div class="enemy-health__progress"  :style="{width: (enemyStoreInstance?.health || 0) + '%'}"></div>
    </div>
    </Html>
  </primitive>
</template>

<script setup lang="ts">
  import {computed, onMounted, onUnmounted, reactive, ref, shallowRef, watch} from 'vue';
  import {useAnimations, useGLTF, Html} from '@tresjs/cientos';
  import {AnimationAction, Box3, Mesh, Quaternion, Vector3} from 'three';
  import {useRenderLoop} from '@tresjs/core';
  import {usePlayerStore} from '@/stores/playerStore';
  import {useEnemyStore} from '@/stores/enemyStore';
  import {SkeletonAnimationEnum} from '../../enum/skeleton-animation.enum';
  import {generateUUID} from 'three/src/math/MathUtils';
  import {LoopOnce, LoopRepeat} from "three/src/constants";
  import gsap from 'gsap';
  import {useEventBus} from "@vueuse/core";
  import type {Enemy} from "@/components/BattleManager.vue";

  const emit = defineEmits(['die'])
  const {config} = defineProps({
    config: {
      type: Object as Enemy,
      required: true
    }
  })

  const { scene: model, animations } = await useGLTF('../static/models/Skeleton.glb');
  const { actions, mixer } = useAnimations(animations, model);
  const { onLoop } = useRenderLoop();

  const enemyRef = shallowRef<Mesh>();

  const playerStore = usePlayerStore();
  const enemyStore = useEnemyStore();
  const enemyEventBus = useEventBus('enemyEventBus');

  const isWalking = ref(false);
  const isIdle = ref(false);
  const isDead = ref(false);

  const attackConfig = reactive({
    isAttacking: false,
    attackDistance: 2,
    nextAttackDelay: config.attackDelay || 1000,
    nextAttackTimeout: undefined,
  })

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
    enemyStore.registerEnemy(config.enemyId, config.spawnPosition);
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

    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    })
  }

  const attack = () => {

    if (attackConfig.isAttacking || isDead.value) return;
    attackConfig.isAttacking = true;

    if (attackConfig.nextAttackTimeout) {
      clearTimeout(attackConfig.nextAttackTimeout);
    }

    const attackAction = actions[SkeletonAnimationEnum.Sword].setLoop(LoopOnce);
    const attackActionDuration = attackAction.getClip().duration / attackAction.timeScale;

    attackAction.reset();
    attackAction.play();
    attackAction.crossFadeFrom(actions[isWalking.value ? SkeletonAnimationEnum.Walk : SkeletonAnimationEnum.Idle], 0.1);

    setTimeout(() => {
      checkAttackHit();
      idle();
    }, attackActionDuration * 1000)

    attackConfig.nextAttackTimeout = setTimeout(() => {
      attackConfig.isAttacking = false;
    }, attackConfig.nextAttackDelay);
  }

  const stopAttack = () => {
    const attackAction = actions[SkeletonAnimationEnum.Sword];
    attackAction.stop();
  }

  const idle = () => {

    if (isDead.value) return;

    const idleAction = actions[SkeletonAnimationEnum.Idle];

    idleAction.reset();
    idleAction.play();
    idleAction.crossFadeFrom(actions[SkeletonAnimationEnum.Sword], 0.5);
    isIdle.value = true;
  }

  const stopIdle = () => {
    actions[SkeletonAnimationEnum.Idle].stop();
  }

  const walk = () => {
    if (isWalking.value || isDead.value) return;

    const walkAction = actions[SkeletonAnimationEnum.Walk].setLoop(LoopRepeat);
    walkAction.reset();
    walkAction.play();

    walkAction.crossFadeFrom(actions[attackConfig.isAttacking ? SkeletonAnimationEnum.Sword : SkeletonAnimationEnum.Idle], 0.5);
    isWalking.value = true;

    attackConfig.isAttacking = false;
  }

  const stopWalk = () => {
    if (!isWalking.value) return;

    actions[SkeletonAnimationEnum.Walk].stop();
    isWalking.value = false;
  }

  const die = () => {

    if (isDead.value) return;

    const dieAction = actions[SkeletonAnimationEnum.Death];
    dieAction.reset();
    dieAction.setLoop(LoopOnce);
    dieAction.clampWhenFinished = true;
    dieAction.play();
    isDead.value = true;
    stopIdle();
    stopWalk();
    stopAttack();

    setTimeout(() => {
      gsap.to(
          enemyRef.value.position,
          {y: -2, duration: 2, ease: 'power2.in', onComplete() {emit('die', config.enemyId)}},
      )
    }, 1000)

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

  const checkAttackHit = () => {
    const enemyPos = enemyRef.value.position;
    const enemyQuaternion = enemyRef.value.quaternion;

    const playerPos = new Vector3().copy(playerStore.playerPosition);

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
      playerStore.takeDamage(10); // or any function to apply damage
    }
  };

  const moveTowardsPlayer = (delta: number) => {

    if (isDead.value) return;

    if (enemyRef.value && playerStore.playerPosition) {

      const enemyPos = enemyRef.value.position;
      const playerPos = new Vector3().copy(playerStore.playerPosition);
      playerPos.y = 0;

      const directionToPlayer = new Vector3().subVectors(playerPos, enemyPos);
      const distanceToPlayer = enemyPos.distanceTo(playerPos);

      if (distanceToPlayer <= attackConfig.attackDistance) {
        attack()
        stopWalk();
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
      walk()

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