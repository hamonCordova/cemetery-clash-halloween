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
      :position="[0, 1.6, -0.1]"
    >
    <div class="enemy-health" :class="{'enemy-health--dead': isDead || !isSpawned}">
      <div class="enemy-health__progress"  :style="{width: (enemyStoreInstance?.health || 0) + '%'}"></div>
    </div>
    </Html>
  </primitive>
</template>

<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref, shallowRef, watch} from 'vue';
  import {useAnimations, Html} from '@tresjs/cientos';
  import {
    Mesh,
    MeshToonMaterial,
    Quaternion, SphereGeometry,
    Vector3
  } from 'three';
  import {useRenderLoop, useTresContext} from '@tresjs/core';
  import {SpiderAnimationEnum} from '../../enum/spider-animation.enum';
  import {LoopOnce} from "three/src/constants";
  import gsap from 'gsap';
  import {useEventBus} from "@vueuse/core";
  import type {Enemy} from "@/components/BattleManager.vue";
  import useCharacter from "@/composable/useCharacter";
  import {EnemyTypeEnum} from "../../enum/enemy-type.enum";
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

  const isSpawned = ref(false);
  const resources = useResources();
  const { scene: model, animations } = resources.get('spider');
  const { actions } = useAnimations(animations, model);
  const { onLoop } = useRenderLoop();
  const { scene } = useTresContext();
  const enemyRef = shallowRef<Mesh>();
  const sounds = useSounds();
  const playerState = usePlayer();
  const enemiesState = useEnemiesSpawned();
  const enemyEventBus = useEventBus('enemyEventBus');

  // TODO this should be dynamic. Remember passing to useCharacter
  const attackDistance = 3;
  const distantAttackDistance = 9;
  const isAttackingByDistance = ref(false);
  let spiderBallMesh: Mesh | undefined;

  const { attack, stopWalk, walk, die, idle, resetActions, isDead, isAttacking } = useCharacter(
    enemyRef,
    actions,
    {
      walk: SpiderAnimationEnum.Walk,
      idle: SpiderAnimationEnum.Idle,
      attack: SpiderAnimationEnum.Attack,
      die: SpiderAnimationEnum.Death,
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
    attack: sounds.createAudioPlayer(['spiderAttack'], model),
    ballSplash: sounds.createAudioPlayer(['spiderBallSplash'], model, 2),
    death: sounds.createAudioPlayer(['spiderDeath'], model, 1),
    hitReceived: sounds.createAudioPlayer(['spiderHitReceived1', 'spiderHitReceived2', 'spiderHitReceived3', 'spiderHitReceived4'], model),
  }

  const enemyStoreInstance = computed(() => {
    return enemiesState.enemies.value.find(e => e.id === props.config?.enemyId);
  })

  const attackConfig = computed(() => {
    return {
      nextAttackDelay: props.config?.attackDelay || 2000,
      firstAttackDelay: props.config?.firstAttackDelay || 500,
    }
  })

  onMounted(() => {
    createSpiderBall();
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

  const createSpiderBall = () => {

    spiderBallMesh = new Mesh(
        new SphereGeometry(0.3, 40),
        new MeshToonMaterial({
          color: '#6a262c',
        })
    )

    spiderBallMesh.position.y = -2;
    scene.value.add(spiderBallMesh)
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

    if (isDead.value) return;
    isDead.value = true;

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

    isDead.value = false;

    enemiesState.registerEnemy(props.config?.enemyId, props.config?.spawnPosition, EnemyTypeEnum.SPIDER);
    enemyRef.value.scale.set(0, 0, 0);
    enemyRef.value.position.set(
        props.config?.spawnPosition?.x,
        props.config?.spawnPosition?.y,
        props.config?.spawnPosition?.z,
    )

    idle();

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
    isSpawned.value = false;
    enemyRef.value.position.set(0, -10, 0);
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
    if (distance > attackDistance) {
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

  const checkProjectileHit = (projectilePosition: Vector3) => {
    const playerPos = new Vector3().copy(playerState.playerPosition.value);
    const distance = projectilePosition.distanceTo(playerPos);

    if (distance <= 1.2) {
      soundActions.ballSplash?.playRandom();
      playerState.takeDamage(props.config?.damage);
    } else {

      const bloodSplatInstance = resources.get('bloodSplate').scene;
      bloodSplatInstance.position.set(projectilePosition.x, 0, projectilePosition.z);

      scene.value.add(bloodSplatInstance);
      soundActions.ballSplash?.playRandom();

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
    const attackDuration = (attackAction.getClip().duration / attackAction.timeScale) * 0.7;

    attackAction.setLoop(LoopOnce);
    attackAction.reset();
    attackAction.play();

    soundActions.attack?.playRandom();


    setTimeout(() => {

      idle();

      const spiderPosition = enemyRef.value.position.clone();
      spiderBallMesh.position.set(spiderPosition.x, 1, spiderPosition.z - 1.5);

      const playerPosition = playerState.playerPosition.value;
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
      }, props.config?.attackDelayLongRange || 4000)
    }, attackDuration * 1000)

  }

  const moveTowardsPlayer = (delta: number) => {

    if (isDead.value) return;

    if (enemyRef.value && playerState.playerPosition.value) {

      const enemyPos = enemyRef.value.position;
      const playerPos = new Vector3().copy(playerState.playerPosition.value);
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
        if (!isAttacking.value) {
          attack(() => {
            soundActions.attack?.playRandom();
          })
        }

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