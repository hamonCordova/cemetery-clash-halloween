<template>
  <primitive v-if="model" ref="skeletonRef" :object="model" :scale="[1.5, 1.5, 1.5]" cast-shadow :position="[0, 0.01, 0]"></primitive>
</template>

<script setup lang="ts">
  import gsap from 'gsap'
  import {onMounted, shallowRef} from "vue";
  import {useAnimations} from "@tresjs/cientos";
  import {SkeletonAnimationEnum} from "../../enum/skeleton-animation.enum";
  import {AnimationAction, MathUtils, Mesh, Quaternion, Vector3} from "three";
  import {useRenderLoop, useTresContext} from "@tresjs/core";
  import {EnemyTypeDamageRangeEnum} from "../../enum/enemy-type-damage-range.enum";
  import {useResources} from "@/composable/useResources";
  import {useGameState} from "@/composable/useGameState";
  import {usePlayer} from "@/composable/usePlayer";
  import {useEventBus} from "@vueuse/core";
  import {useEnemiesSpawned} from "@/composable/useEnemiesSpawned";
  import {useSounds} from "@/composable/useSounds";

  const resources = useResources();
  const {scene: model, animations} = resources.get('skeleton');
  const { actions } = useAnimations(animations, model)
  const { scene, camera } = useTresContext()
  const skeletonRef = shallowRef<Mesh>();
  const { onLoop } = useRenderLoop()
  const enemiesState = useEnemiesSpawned();
  const gameState = useGameState();
  const playerState = usePlayer();
  const sounds = useSounds();
  const playerEventBus = useEventBus('playerEventBus');

  let currentAnimation: AnimationAction | undefined;

  const jumpDuration = 0.8;
  let _isJumping = false;
  let isAttacking = false;

  const actionSounds = {
    attack: sounds.createAudioPlayer(['swordSwing1', 'swordSwing2', 'swordSwing3', 'swordSwing4']),
    steps: sounds.createAudioPlayer(['skeletonSteps1', 'skeletonSteps2', 'skeletonSteps3', 'skeletonSteps4', 'skeletonSteps5', 'skeletonSteps6']),
    jump: sounds.createAudioPlayer(['skeletonJump'])
  }

  onMounted(() => {
    animate(SkeletonAnimationEnum.Idle);

    playerEventBus.on((event) => {
      if (event === 'attack') {
        attack();
      }
    })
  })

  onLoop(({delta, elapsed, clock}) => {
    move(delta)
    moveCamera();
  })

  const moveCamera = () => {
    if (skeletonRef.value && camera.value && gameState.isPlaying.value) {
      const cameraOffset = new Vector3(0, 7, 15);
      const characterPosition = skeletonRef.value.position.clone();
      const cameraTargetPosition = characterPosition.add(cameraOffset);

      camera.value.position.lerp(cameraTargetPosition, 0.1);

      const targetPosition = skeletonRef.value.position.clone();
      targetPosition.y += 1;

      camera.value.lookAt(targetPosition);
    }
  }

  const animate = (animationName, duration = 1) => {
    const newAnimation = actions[animationName];
    const oldAnimation = currentAnimation;

    if (currentAnimation === newAnimation) {
      return;
    }

    currentAnimation = newAnimation;

    newAnimation.reset();
    newAnimation.play();

    if (animationName === SkeletonAnimationEnum.Jump_Land) {
      const animationClipDuration = newAnimation.getClip().duration;
      newAnimation.setEffectiveTimeScale(animationClipDuration / (jumpDuration * 4));
    }

    if (oldAnimation) {
      newAnimation.crossFadeFrom(oldAnimation, duration, false);
    }
  };

  const move = (delta) => {
    const direction = new Vector3(0, 0, 0);
    const activeMovements = playerState.activeMovements;

    let isMoving = false;
    const isFreezed = playerState.isFreezed();
    const isJumping = activeMovements.jump;
    const isRunning = activeMovements.run;

    const speed = isRunning ? 8 : 5;

    if (activeMovements.usingJoystick && activeMovements.joystickMovement && activeMovements.joystickMovement.lengthSq() > 0) {

      direction.copy(activeMovements.joystickMovement);
      direction.multiplyScalar(speed * delta);

      isMoving = true;
    } else {

      if (activeMovements.up) {
        direction.z -= 1;
        isMoving = true;
      }

      if (activeMovements.down) {
        direction.z += 1;
        isMoving = true;
      }

      if (activeMovements.left) {
        direction.x -= 1;
        isMoving = true;
      }

      if (activeMovements.right) {
        direction.x += 1;
        isMoving = true;
      }

      if (isMoving) {
        const speed = isRunning ? 8 : 5;
        direction.normalize().multiplyScalar(speed * delta);
      }
    }

    if (isJumping && !isFreezed) {
      jump();
    }

    if (isMoving) {

      if (!isAttacking && !isJumping) {

        if (isRunning) {
          if (!_isJumping) {
            actionSounds.steps?.setCooldown(300);
            actionSounds.steps?.playRandom()
          }
          animate(SkeletonAnimationEnum.Run, 0.5);
        } else {
          if (!_isJumping) {
            actionSounds.steps?.setCooldown(500);
            actionSounds.steps?.playRandom()
          }
          animate(SkeletonAnimationEnum.Walk, 0.5);
        }

      }

      const speed = isRunning ? 8 : 5;
      direction.normalize();

      // Movimento pretendido
      let movement = direction.clone().multiplyScalar(speed * delta);

      // Zera o componente Y do movimento
      movement.y = 0;

      let movementDirection = movement.clone().normalize();

      const characterPos = skeletonRef.value.position.clone();
      characterPos.y = 0;

      // Variável para acumular as normais de colisão
      let collisionNormal = new Vector3(0, 0, 0);

      enemiesState.enemies.value.forEach(enemy => {
        // Clonar a posição do inimigo antes de usá-la
        const enemyPos = enemy.position.clone();
        enemyPos.y = 0;

        const collisionDistance = 1.5; // Ajuste conforme necessário

        // Calcular o vetor do personagem para o inimigo
        const toEnemy = enemyPos.clone().sub(characterPos);

        const distanceSquared = toEnemy.lengthSq();
        const collisionDistanceSquared = collisionDistance * collisionDistance;

        if (distanceSquared < collisionDistanceSquared) {
          const normalizedToEnemy = toEnemy.clone().normalize();
          const dotProduct = movementDirection.dot(normalizedToEnemy);

          if (dotProduct > 0) {
            // Acumular a normal de colisão
            collisionNormal.add(normalizedToEnemy);
          }
        }
      });

      // Se houver colisões, ajustar o movimento
      if (collisionNormal.lengthSq() > 0) {
        collisionNormal.normalize();

        // Remover a componente do movimento na direção da normal de colisão acumulada
        const movementIntoCollision = movementDirection.clone().projectOnVector(collisionNormal);
        movementDirection.sub(movementIntoCollision);
        movementDirection.normalize();

        // Recalcular o movimento ajustado, assegurando que Y permaneça zero
        movement = movementDirection.clone().multiplyScalar(speed * delta);
        movement.y = 0;
      }

      if (!isFreezed) {
        // Atualiza a posição com o movimento permitido
        skeletonRef.value.position.add(movement);

        // Clamp the position to stay within the 25x25 area
        const battleArenaOffset = 1;
        const battleArenaHalfSize = (25 - battleArenaOffset) / 2;
        skeletonRef.value.position.x = MathUtils.clamp(skeletonRef.value.position.x, -battleArenaHalfSize, battleArenaHalfSize);
        skeletonRef.value.position.z = MathUtils.clamp(skeletonRef.value.position.z, -battleArenaHalfSize, battleArenaHalfSize);

        playerState.updatePlayerPosition(skeletonRef.value.position);
      }

      // Atualiza a rotação do personagem
      const targetRotationY = Math.atan2(direction.x, direction.z);
      const currentQuaternion = skeletonRef.value.quaternion.clone();
      const targetQuaternion = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), targetRotationY);
      currentQuaternion.rotateTowards(targetQuaternion, delta * 10);
      skeletonRef.value.quaternion.copy(currentQuaternion);


    } else {
      if (isAttacking) return;
      animate(SkeletonAnimationEnum.Idle, 0.5);
    }
  };

  const attack = () => {
    if (isAttacking) return;
    isAttacking = true;

    const currentAttackAnimationEnum = Math.floor((Math.random() * 10)) % 2 === 0 ? SkeletonAnimationEnum.Sword : SkeletonAnimationEnum.Punch;
    const attackAnimation = actions[currentAttackAnimationEnum];
    const animationDuration = attackAnimation.getClip().duration / attackAnimation.timeScale;
    animate(currentAttackAnimationEnum, 0.1);

    setTimeout(() => {
      actionSounds.attack?.playRandom();
      checkAttackHit();
    }, (animationDuration * 1000) * 0.4);

    setTimeout(() => {
      isAttacking = false;
    }, 400);
  };

  const checkAttackHit = () => {
    const playerPos = skeletonRef.value.position;
    const playerQuaternion = skeletonRef.value.quaternion;

    const enemies = enemiesState.enemies.value;

    const attackAngle = Math.cos(45 * (Math.PI / 180)); // 45 degrees

    enemies.forEach((enemy) => {
      const enemyPos = enemy.position;
      const enemyType = enemy.type;
      const attackRange = EnemyTypeDamageRangeEnum[enemyType];

      const distance = playerPos.distanceTo(enemyPos);
      if (distance > attackRange) {
        console.warn('enemy out of range')
        return; // Enemy is out of range
      }

      // Check if enemy is in front of player
      const playerForward = new Vector3(0, 0, 1).applyQuaternion(playerQuaternion);
      const directionToEnemy = new Vector3().subVectors(enemyPos, playerPos).normalize();

      const dot = playerForward.dot(directionToEnemy);

      if (dot > attackAngle) {
        // Enemy is within 45 degrees in front of player
        // Attack hits
        console.warn('enemy hit')
        enemiesState.damageEnemy(enemy.id, 30);
      }
    });
  };

  const jump = () => {
    if (_isJumping) return;

    const timeline = gsap.timeline({
      onStart: () => {
        _isJumping = true;
        actionSounds.jump?.playRandom();
        animate(SkeletonAnimationEnum.Jump_Land, 0.1);
      },
      onComplete: () => {
        playerState.activeMovements.jump = false;
        _isJumping = false;
      }
    });

    timeline.to(skeletonRef.value.position, {
      y: 2,
      duration: jumpDuration / 2,
      ease: 'power1.out'
    });

    timeline.to(skeletonRef.value.position, {
      y: 0,
      duration: (jumpDuration / 2) * jumpDuration,
      ease: 'circ.in'
    });
  };

</script>
