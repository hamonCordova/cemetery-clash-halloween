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
    <div class="enemy-health" :class="{ 'enemy-health--dead': isDead }">
      <div
          class="enemy-health__progress"
          :style="{ width: (enemyStoreInstance?.health || 0) + '%' }"
      ></div>
    </div>
    </Html>
  </primitive>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref, shallowRef } from 'vue';
  import { useAnimations, Html } from '@tresjs/cientos';
  import {
    Mesh,
    Quaternion,
    Vector3,
      Vector2,
    SphereGeometry,
    MeshBasicMaterial,
  } from 'three';
  import { useRenderLoop, useTresContext } from '@tresjs/core';
  import { useEnemyStore } from '@/stores/enemyStore';
  import { SlimeAnimationEnum } from '../../enum/slime-animation.enum';
  import { LoopOnce } from 'three/src/constants';
  import gsap from 'gsap';
  import { useEventBus } from '@vueuse/core';
  import type { Enemy } from '@/components/BattleManager.vue';
  import useCharacter from '@/composable/useCharacter';
  import { EnemyTypeEnum } from '../../enum/enemy-type.enum';
  import { useResources } from '@/composable/useResources';
  import {usePlayer} from "@/composable/usePlayer";
  import {useEnemiesSpawned} from "@/composable/useEnemiesSpawned";

  const emit = defineEmits(['die']);
  const { config } = defineProps({
    config: {
      type: Object as Enemy,
      required: true,
    },
  });

  const resources = useResources();
  const { scene: model, animations } = resources.get('slime');
  const { actions, mixer } = useAnimations(animations, model);
  const { onLoop } = useRenderLoop();
  const { scene } = useTresContext();
  const enemyRef = shallowRef<Mesh>();
  const playerState = usePlayer();
  const enemiesState = useEnemiesSpawned();
  const enemyEventBus = useEventBus('enemyEventBus');
  const { attack, die, idle, isDead } = useCharacter(
      enemyRef,
      actions,
      {
        walk: SlimeAnimationEnum.Walk,
        idle: SlimeAnimationEnum.Idle,
        attack: SlimeAnimationEnum.Attack,
        die: SlimeAnimationEnum.Death,
      },
      {
        nextAttackDelay: config.attackDelay || 1000,
      },
      {
        finishAttack: () => checkAttackHit(),
        onDie: () => emit('die', config.enemyId),
      }
  );

  const attackDistance = 2;

  const isAttackingByDistance = ref(false);
  const longRangeDelay = config.attackDelayLongRange || 4000;

  const enemyStoreInstance = computed(() => {
    return enemiesState.enemies.value.find((e) => e.id === config.enemyId);
  });

  onMounted(() => {
    spawnEnemy();
    listenEvents();
  });

  onUnmounted(() => {
    enemiesState.removeEnemy(config.enemyId);
  });

  onLoop(({ delta }) => {
    moveTowardsPlayer(delta);
  });

  const listenEvents = () => {
    enemyEventBus.on((event, payload) => {
      if (event === 'die' && config.enemyId === payload) {
        die();
      }
    });
  };

  const spawnEnemy = () => {
    enemiesState.registerEnemy(
        config.enemyId,
        config.spawnPosition,
        EnemyTypeEnum.SPIDER
    );
    enemyRef.value.position.set(
        config.spawnPosition.x,
        config.spawnPosition.y,
        config.spawnPosition.z
    );

    enemyRef.value.scale.set(
        config.scale || 1.5,
        config.scale || 1.5,
        config.scale || 1.5
    );

    // No rotation adjustment needed due to compensated rotation logic
  };

  const followPlayerRotation = (targetPosition: Vector3, delta: number) => {
    const enemyPos = enemyRef.value.position;
    const direction = new Vector3()
        .subVectors(targetPosition, enemyPos)
        .normalize();

    // Adjust targetAngle by subtracting Math.PI / 2
    const targetAngle = Math.atan2(direction.x, direction.z) - Math.PI / 2;

    const enemyQuaternion = enemyRef.value.quaternion.clone();
    const targetQuaternion = new Quaternion().setFromAxisAngle(
        new Vector3(0, 1, 0),
        targetAngle
    );

    const rotationSpeed = config.rotationSpeed || 5;
    enemyQuaternion.rotateTowards(targetQuaternion, delta * rotationSpeed);

    enemyRef.value.quaternion.copy(enemyQuaternion);
  };

  const checkAttackHit = () => {
    const enemyPos = enemyRef.value.position;
    const enemyQuaternion = enemyRef.value.quaternion;

    const playerPos = new Vector3().copy(playerState.playerPosition.value);

    const distance = enemyPos.distanceTo(playerPos);
    if (distance > attackDistance) {
      return; // Player is out of range
    }

    // Adjusted forward vector to account for initial rotation
    const enemyForward = new Vector3(1, 0, 0).applyQuaternion(enemyQuaternion);
    const directionToPlayer = new Vector3()
        .subVectors(playerPos, enemyPos)
        .normalize();

    const dot = enemyForward.dot(directionToPlayer);

    const attackAngle = Math.cos(45 * (Math.PI / 180)); // 45 degrees

    if (dot > attackAngle) {
      // Player is within 45 degrees in front of enemy
      // Attack hits
      playerState.takeDamage(10); // or any function to apply damage
    }
  };

  function getBoundaryIntersectionPoint(
      start: Vector3,
      direction: Vector3,
      arenaSize: number
  ): Vector3 {
    const halfArenaSize = arenaSize / 2;
    const tValues = [];

    // X-axis boundaries
    if (direction.x !== 0) {
      const t1 = (-halfArenaSize - start.x) / direction.x;
      const t2 = (halfArenaSize - start.x) / direction.x;
      tValues.push(t1, t2);
    }

    // Z-axis boundaries
    if (direction.z !== 0) {
      const t3 = (-halfArenaSize - start.z) / direction.z;
      const t4 = (halfArenaSize - start.z) / direction.z;
      tValues.push(t3, t4);
    }

    // Positive t values (future intersection points)
    const positiveTValues = tValues.filter((t) => t > 0);

    // Smallest positive t (closest intersection)
    const minT = Math.min(...positiveTValues);

    // Intersection point calculation
    const intersectionPoint = new Vector3(
        start.x + direction.x * minT,
        start.y,
        start.z + direction.z * minT
    );

    return intersectionPoint;
  }

  const longRangeAttack = () => {
    if (isAttackingByDistance.value || isDead.value) return;
    isAttackingByDistance.value = true;
    idle();

    const attackAction = actions[SlimeAnimationEnum.Attack];
    attackAction.setLoop(LoopOnce);
    attackAction.reset();
    attackAction.play();

    const attackDuration =
        (attackAction.getClip().duration / attackAction.timeScale) * 0.7;

    // Flag to ensure only one damage application per attack
    let hasDealtDamage = false;

    setTimeout(() => {
      idle();

      const slimePosition = enemyRef.value.position.clone();
      const playerPosition = playerState.playerPosition.value.clone();

      // Calculate direction vector
      const directionToPlayer = new Vector3()
          .subVectors(playerPosition, slimePosition)
          .normalize();

      // Calculate the target position on the arena boundary
      const arenaSize = 24; // Your arena is 24x24 units
      const targetPosition = getBoundaryIntersectionPoint(
          slimePosition,
          directionToPlayer,
          arenaSize
      );

      // Rotate enemy to face the target position
      followPlayerRotation(targetPosition, 0.016); // deltaTime ~0.016s for 60fps

      const tl = gsap.timeline({
        onUpdate: () => {
          // Collision detection
          const enemyPos = enemyRef.value.position;
          const playerPos = playerState.playerPosition.value;
          const collisionDistance = 1; // Adjust as needed

          const horizontalDistance = new Vector2(
              enemyPos.x,
              enemyPos.z
          ).distanceTo(new Vector2(playerPos.x, playerPos.z));

          const verticalDistance = Math.abs(enemyPos.y - playerPos.y);

          if (
              horizontalDistance <= collisionDistance &&
              verticalDistance <= 1 && // Adjust vertical tolerance as needed
              !hasDealtDamage
          ) {
            playerState.takeDamage(10);
            hasDealtDamage = true; // Prevent further damage during this attack
          }

          // Trail effect
          createTrailEffect(enemyPos.clone());
        },
        onComplete: () => {
          // Reset enemy position or other logic after attack completes
          setTimeout(() => {
            isAttackingByDistance.value = false;
          }, longRangeDelay);
        },
      });

      tl.to(
          enemyRef.value.position,
          {
            duration: 2,
            x: targetPosition.x,
            z: targetPosition.z,
            ease: 'power2.out',
          },
          0
      );
    }, attackDuration * 1000);
  };

  function createTrailEffect(position: Vector3) {
    // Create a simple green sphere at the given position
    const geometry = new SphereGeometry(0.5, 8, 8); // Adjust size as needed
    const material = new MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    const trailMesh = new Mesh(geometry, material);

    trailMesh.position.copy(position);
    scene.value.add(trailMesh);

    // Fade out and remove the trail mesh over time
    gsap.to(trailMesh.material, {
      duration: 2,
      opacity: 0,
      onComplete: () => {
        scene.value.remove(trailMesh);
        trailMesh.geometry.dispose();
        trailMesh.material.dispose();
      },
    });
  }

  const moveTowardsPlayer = (delta: number) => {
    if (isDead.value) return;

    if (enemyRef.value && playerState.playerPosition.value) {
      const enemyPos = enemyRef.value.position;
      const playerPos = new Vector3().copy(playerState.playerPosition.value);
      playerPos.y = 0;

      const distanceToPlayer = enemyPos.distanceTo(playerPos);

      followPlayerRotation(playerPos, delta);

      if (distanceToPlayer <= attackDistance) {
        attack();
        followPlayerRotation(playerPos, delta);
      }

      // Check if enemy is already performing a long-range attack
      if (!isAttackingByDistance.value) {
        longRangeAttack();
        idle();
      }

      // Update enemy position in the store
      enemiesState.updateEnemyPosition(config.enemyId, enemyPos);
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
