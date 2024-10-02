<template>
  <primitive
      ref="enemyRef"
      :object="model"
      :scale="[1.5, 1.5, 1.5]"
      cast-shadow
      :position="[enemyPosition.x, enemyPosition.y, enemyPosition.z]"
  ></primitive>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, reactive, ref, shallowRef, watch} from 'vue';
import {useAnimations, useGLTF} from '@tresjs/cientos';
import {AnimationAction, Mesh, Quaternion, Vector3} from 'three';
import {useRenderLoop} from '@tresjs/core';
import {usePlayerStore} from '@/stores/playerStore';
import {useEnemyStore} from '@/stores/enemyStore';
import {SkeletonAnimationEnum} from '../../enum/skeleton-animation.enum';
import {generateUUID} from 'three/src/math/MathUtils';
import {LoopOnce, LoopRepeat} from "three/src/constants";
import gsap from 'gsap';

const enemyId = generateUUID();

// Load the enemy skeleton model
const { scene: model, animations } = await useGLTF('../static/models/Skeleton.glb');
const { actions, mixer } = useAnimations(animations, model);
const { onLoop } = useRenderLoop();

// Reference to the enemy mesh
const enemyRef = shallowRef<Mesh>();

// Initialize enemy at a random position
const enemyPosition = ref(
    new Vector3(
        Math.random() * 20 - 10, // Random X between -10 and 10
        0,
        Math.random() * 20 - 10 // Random Z between -10 and 10
    )
);

let currentAnimation: AnimationAction | undefined;
const moveSpeed = 1.5;

// Access player's position from global store
const playerStore = usePlayerStore();
const enemyStore = useEnemyStore();
enemyStore.setOnDieCallback((enemyId: string) => {
  if (enemyId === enemyId) {
    die()
  }
})

const isWalking = ref(false);
const isIdle = ref(false);
const isDead = ref(false);

const attackConfig = reactive({
  isAttacking: false,
  attackDistance: 2,
  nextAttackDelay: 5000,
  nextAttackTimeout: undefined,
})


onMounted(() => {
  enableShadow();
  enemyStore.registerEnemy(enemyId, enemyPosition.value);
});

onUnmounted(() => {
  enemyStore.removeEnemy(enemyId);
});

onLoop(({ delta }) => {
  moveTowardsPlayer(delta);
});

const enableShadow = () => {
  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

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

  setTimeout(() => {
//    gsap.to(enemyRef.value.position, {y: -2, duration: 2, ease: 'power2.in'})
  }, 1000)

}

const rotateTowards = (targetPosition: Vector3, delta: number) => {
  const enemyPos = enemyRef.value.position;
  const direction = new Vector3().subVectors(targetPosition, enemyPos).normalize();
  const targetRotationY = Math.atan2(direction.x, direction.z);
  const currentQuaternion = enemyRef.value.quaternion.clone();
  const targetQuaternion = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), targetRotationY);
  currentQuaternion.rotateTowards(targetQuaternion, delta * 5);
  enemyRef.value.quaternion.copy(currentQuaternion);
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
      rotateTowards(playerPos, delta);
      return;
    }

    // Implement separation behavior to avoid overlapping with other enemies
    const separationForce = new Vector3(0, 0, 0);
    const neighbors = enemyStore.enemies.filter((e) => e.id !== enemyId);
    const separationDistance = 2; // Adjust as needed

    for (const neighbor of neighbors) {
      const neighborPos = neighbor.position;
      const distance = enemyPos.distanceTo(neighborPos);
      if (distance < separationDistance) {
        const repulse = new Vector3()
            .subVectors(enemyPos, neighborPos)
            .normalize()
            .multiplyScalar(1 / distance); // Adjusted to prevent large forces
        separationForce.add(repulse);
      }
    }

    // Combine the direction to player and the separation force
    const combinedDirection = new Vector3()
        .copy(directionToPlayer)
        .add(separationForce);

    // Normalize and move enemy towards player, considering separation
    combinedDirection.normalize();
    enemyPos.add(combinedDirection.multiplyScalar(moveSpeed * delta));

    // Rotate enemy to face movement direction
    rotateTowards(enemyPos.clone().add(combinedDirection), delta);

    // Set walking animation
    walk()

    // Update enemy position in the store
    enemyStore.updateEnemyPosition(enemyId, enemyPos);
  }
};

</script>
