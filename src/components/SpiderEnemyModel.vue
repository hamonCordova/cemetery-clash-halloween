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
  import {
    AnimationAction,
    Box3,
    BoxGeometry,
    CircleGeometry,
    Mesh,
    MeshBasicMaterial, MeshStandardMaterial, MeshToonMaterial,
    Quaternion, SphereGeometry,
    Vector3
  } from 'three';
  import {useRenderLoop, useTresContext} from '@tresjs/core';
  import {usePlayerStore} from '@/stores/playerStore';
  import {useEnemyStore} from '@/stores/enemyStore';
  import {SpiderAnimationEnum} from '../../enum/spider-animation.enum';
  import {generateUUID} from 'three/src/math/MathUtils';
  import {LoopOnce, LoopRepeat} from "three/src/constants";
  import gsap from 'gsap';
  import {useEventBus} from "@vueuse/core";
  import type {Enemy} from "@/components/BattleManager.vue";
  import useCharacter from "@/composable/useCharacter";
  import {EnemyTypeEnum} from "../../enum/enemy-type.enum";
  import {useResources} from "@/composable/useResources";

  const emit = defineEmits(['die'])
  const {config} = defineProps({
    config: {
      type: Object as Enemy,
      required: true
    }
  })

  const resources = useResources();
  const { scene: model, animations } = resources.get('spider');
  const { actions, mixer } = useAnimations(animations, model);
  const { onLoop } = useRenderLoop();
  const { scene } = useTresContext();
  const enemyRef = shallowRef<Mesh>();
  const playerStore = usePlayerStore();
  const enemyStore = useEnemyStore();
  const enemyEventBus = useEventBus('enemyEventBus');
  const { attack, stopWalk, walk, die, idle, isDead } = useCharacter(
    enemyRef,
    actions,
    {
      walk: SpiderAnimationEnum.Walk,
      idle: SpiderAnimationEnum.Idle,
      attack: SpiderAnimationEnum.Attack,
      die: SpiderAnimationEnum.Death,
    },
    {
     nextAttackDelay: config.attackDelay || 1000
    },
    {
      finishAttack: () => checkAttackHit(),
      onDie: () => emit('die', config.enemyId)
    },
  )

  // TODO this should be dynamic. Remember passing to useCharacter
  const attackDistance = 3;
  const distantAttackDistance = 9;

  const isAttackingByDistance = ref(false);
  const longRangeDelay = 4000;

  let spiderBallMesh: Mesh | undefined;

  const enemyStoreInstance = computed(() => {
    return enemyStore.enemies.find(e => e.id === config.enemyId);
  })

  onMounted(() => {
    createSpiderBall();
    spawnEnemy();
    listenEvents();
  });

  onUnmounted(() => {
    enemyStore.removeEnemy(config.enemyId);
  });

  onLoop(({ delta }) => {
    moveTowardsPlayer(delta);
  });

  const createSpiderBall = () => {

    spiderBallMesh = new Mesh(
        new SphereGeometry(0.3, 40),
        new MeshToonMaterial({
          color: '#6a262c',
        })
    )

    scene.value.add(spiderBallMesh)
    spiderBallMesh.position.y = -2;
  }

  const listenEvents = () => {
    enemyEventBus.on((event, payload) => {
      if (event === 'die' && config.enemyId === payload) {
        die()
      }
    });
  }

  const spawnEnemy = () => {
    enemyStore.registerEnemy(config.enemyId, config.spawnPosition, EnemyTypeEnum.SPIDER);
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

  const checkProjectileHit = (projectilePosition: Vector3) => {
    const playerPos = new Vector3().copy(playerStore.playerPosition);
    const distance = projectilePosition.distanceTo(playerPos);

    if (distance <= 1) {
      playerStore.takeDamage(10);
    } else {
      const bloodSplatInstance = resources.get('bloodSplate').scene;
      bloodSplatInstance.position.set(projectilePosition.x, 0, projectilePosition.z);
      scene.value.add(bloodSplatInstance);

      setTimeout(() => {
        scene.value.remove(bloodSplatInstance);
        bloodSplatInstance.geometry?.dispose();
        bloodSplatInstance.material?.dispose();
      }, 5000);
    }
  };

  const longRangeAttack = () => {

    if (isAttackingByDistance.value) return

    isAttackingByDistance.value = true;
    stopWalk();

    const attackAction = actions[SpiderAnimationEnum.Attack];
    attackAction.setLoop(LoopOnce);
    attackAction.reset();
    attackAction.play();

    const attackDuration = (attackAction.getClip().duration / attackAction.timeScale) * 0.7;

    setTimeout(() => {

      idle();

      const spiderPosition = enemyRef.value.position.clone();
      spiderBallMesh.position.set(spiderPosition.x, 1, spiderPosition.z - 1.5);

      const playerPosition = playerStore.playerPosition;
      const duration = 0.8;

      const tl = gsap.timeline({
        onComplete: () => {
          checkProjectileHit(spiderBallMesh.position);
        }
      });

      tl.to(spiderBallMesh.position, {
        duration: duration,
        x: playerPosition.x,
        ease: "linear"
      }, 0);

      tl.to(spiderBallMesh.position, {
        duration: duration,
        z: playerPosition.z,
        ease: "linear"
      }, 0);

      tl.to(spiderBallMesh.position, {
        duration: duration / 2,
        y: 4 ,
        ease: "power1.out"
      }, 0);

      tl.to(spiderBallMesh.position, {
        duration: duration / 2,
        y: -1,
        ease: "power1.in"
      }, duration / 2);

      setTimeout(() => {
        isAttackingByDistance.value = false;
      }, longRangeDelay)
    }, attackDuration * 1000)

  }

  const moveTowardsPlayer = (delta: number) => {

    if (isDead.value) return;

    if (enemyRef.value && playerStore.playerPosition) {

      const enemyPos = enemyRef.value.position;
      const playerPos = new Vector3().copy(playerStore.playerPosition);
      playerPos.y = 0;

      const directionToPlayer = new Vector3().subVectors(playerPos, enemyPos);
      const distanceToPlayer = enemyPos.distanceTo(playerPos);

      if (distanceToPlayer >= distantAttackDistance) {
        stopWalk();
        longRangeAttack();
        followPlayerRotation(playerPos, delta)
        return;
      }

      if (distanceToPlayer <= attackDistance) {
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