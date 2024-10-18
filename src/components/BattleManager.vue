<template>

  <PlayerCharacter ref="playerCharacterRef" />

  <SpiderEnemyModel
      v-for="spiderId in spiderEnemiesIdPool"
      :key="spiderId"
      :config="currentStage?.enemies?.find(e => e.enemyId === spiderId)"
      @die="enemyDied"
  />

  <SkeletonEnemyModel
      v-for="skeletonId in skeletonEnemiesIdPool"
      :key="skeletonId"
      :config="currentStage?.enemies?.find(e => e.enemyId === skeletonId)"
      @die="enemyDied"
  />

  <ZombieEnemy
      v-for="zombieId in zombieEnemiesIdPool"
      :key="zombieId"
      :config="currentStage?.enemies?.find(e => e.enemyId === zombieId)"
      @die="enemyDied"
  />

  <SlimeEnemyModel
      v-for="slimeId in slimeEnemiesIdPool"
      :key="slimeId"
      :config="currentStage?.enemies?.find(e => e.enemyId === slimeId)"
      @die="enemyDied"
  />

</template>

<script lang="ts">
import {onMounted, ref} from 'vue';
import {AnimationClip, Object3D, Vector3} from 'three';
import {generateUUID} from 'three/src/math/MathUtils';
import {EnemyTypeEnum} from '../../enum/enemy-type.enum';

export interface Round {
  num: number;
  stages: RoundStage[];
}

export interface RoundStage {
  enemies: Enemy[];
}

export interface Enemy {
  enemyId: string;
  moveSpeed: number; // Usado com delta (delta * moveSpeed)
  rotationSpeed: number; // Usado com delta (delta * rotationSpeed)
  damage: number; // Máximo 15
  health: number; // Máximo 50
  spawnPosition: Vector3;
  attackDelay: number; // Em ms, mínimo 800
  attackDelayLongRange?: number; // Em ms, mínimo 1000 - Apenas para spider e slime
  scale: number; // Para slimes mínimo de 0.3. Spider mínimo de 0.3. Skeleton mínimo de 0.5 (quanto menor, mais move speed precisa ter)
  isDead: boolean;
  type: EnemyTypeEnum;
}

</script>

<script setup lang="ts">
import {ref, onMounted, markRaw, watch} from 'vue';
  import {AdditiveBlending, BufferGeometry, Float32BufferAttribute, Points, PointsMaterial, Vector3} from 'three';
  import { generateUUID } from 'three/src/math/MathUtils';
  import { EnemyTypeEnum } from '../../enum/enemy-type.enum';
  import {useResources} from "@/composable/useResources";
  import SkeletonEnemyModel from '@/components/SkeletonEnemyModel.vue';
  import SpiderEnemyModel from '@/components/SpiderEnemyModel.vue';
  import SlimeEnemyModel from '@/components/SlimeEnemyModel.vue';
  import ZombieEnemy from '@/components/ZombieEnemy.vue';
  import PlayerCharacter from '@/components/PlayerCharacter.vue';
  import {usePlayer} from "@/composable/usePlayer";
  import {useRenderLoop, useTresContext} from "@tresjs/core";
  import gsap from "gsap";
  import {useSounds} from "@/composable/useSounds";
  import {useGameState} from "@/composable/useGameState";

  const emit = defineEmits(['playerDied']);

  const resources = useResources();
  const playerState = usePlayer();
  const gameState = useGameState();
  const { scene, camera } = useTresContext();
  const { onLoop } = useRenderLoop();
  const sounds = useSounds();
  const playerCharacterRef = ref();

  const rounds = ref<Round[]>([]);
  const currentRoundNum = ref<number>(1);
  const currentStageNum = ref<number>(1);

  const currentRound = ref<Round>();
  const currentStage = ref<RoundStage>();

  const arenaSize = 25;
  const minSpawnDistance = 4;
  const playerPosition = new Vector3(0, 0, 0);

  let usedPositions: Vector3[] = [];
  const activeHealthParticles = [];

  const spiderEnemiesIdPool = [
      generateUUID(),
      generateUUID(),
      generateUUID(),
  ]

  const skeletonEnemiesIdPool = [
    generateUUID(),
    generateUUID(),
    generateUUID(),
    generateUUID(),
  ]

  const zombieEnemiesIdPool = [
    generateUUID(),
    generateUUID(),
    generateUUID(),
  ]

  const slimeEnemiesIdPool = [
    generateUUID(),
    generateUUID(),
    generateUUID(),
  ]

  onMounted(() => {
    camera.value?.layers.set(0)
    createRounds();
  });

  onLoop(() => {
    for (let i = activeHealthParticles.length - 1; i >= 0; i--) {
      const particleData = activeHealthParticles[i];
      const { particles, individualOffsets, particlesReached } = particleData;

      const positions = particles.geometry.attributes.position.array as Float32Array;

      let remainingParticles = 0;

      for (let j = 0; j < positions.length; j += 3) {
        const index = j / 3;

        if (particlesReached[index]) continue;

        const particlePosition = new Vector3(
            positions[j],
            positions[j + 1],
            positions[j + 2]
        );

        const playerPos = playerState.playerPosition.value.clone();

        playerPos.x += individualOffsets[index].x;
        playerPos.z += individualOffsets[index].z;

        const direction = new Vector3()
            .subVectors(playerPos, particlePosition)
            .normalize();

        const speed = 0.3;
        particlePosition.add(direction.multiplyScalar(speed));

        positions[j] = particlePosition.x;
        positions[j + 1] = particlePosition.y;
        positions[j + 2] = particlePosition.z;

        const distanceSquared = particlePosition.distanceToSquared(playerPos);

        if (distanceSquared <= 0.5) {
          particlesReached[index] = true;

          // Visually remove particle
          positions[j] = 9999;
          positions[j + 1] = 9999;
          positions[j + 2] = 9999;
        } else {
          remainingParticles++;
        }
      }

      particles.geometry.attributes.position.needsUpdate = true;

      if (remainingParticles === 0) {
        scene.value.remove(particles);
        particles.geometry.dispose();
        particles.material.dispose();
        activeHealthParticles.splice(i, 1);

        playerState.increaseHealth(10);
      }
    }
  });

  const spawnHealthParticles = (startPosition: Vector3) => {

    if (playerState.isDead.value) {
      return
    }

    const particleCount = 70;
    const particlesGeometry = new BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = startPosition.x + (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = startPosition.y + (Math.random() - 0.5) * 2;
      positions[i * 3 + 2] = startPosition.z + (Math.random() - 0.5) * 2;
    }

    particlesGeometry.setAttribute('position', new Float32BufferAttribute(positions, 3));

    const particlesMaterial = new PointsMaterial({
      color: 0xff0000,
      size: 0.15,
      blending: AdditiveBlending,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });

    const particles = new Points(particlesGeometry, particlesMaterial);
    particles.renderOrder = 9999;
    scene.value.add(particles);

    const individualOffsets = [];
    const particlesReached = new Array(particleCount).fill(false);

    for (let i = 0; i < particleCount; i++) {
      individualOffsets.push({
        x: (Math.random() - 0.5) * 2,
        z: (Math.random() - 0.5) * 2,
      });
    }

    activeHealthParticles.push({ particles, individualOffsets, particlesReached });
  };

  const createRounds = () => {
    rounds.value = [
      getRound1(),
      getRound2(),
      getRound3(),
    ];
  };

  const startRound = () => {
    if (currentRoundNum.value > rounds.value.length) {
      allRoundsCompleted();
      console.warn('all rounds completed')
      return;
    }

    currentRound.value = rounds.value[currentRoundNum.value - 1];
    currentStageNum.value = 1;

    console.warn('currentRound', currentRound.value)

    startStage();
  };

  const startStage = () => {

    if (!currentRound.value) return;

    if (currentStageNum.value > currentRound.value.stages.length) {
      currentRoundNum.value++;
      startRound();
      return;
    }

    usedPositions = [];

    const stage = currentRound.value.stages[currentStageNum.value - 1];
    stage.enemies.forEach((enemy: Enemy) => {

      let enemiesIdPool;
      switch (enemy.type) {
        case EnemyTypeEnum.SPIDER:
          enemiesIdPool = spiderEnemiesIdPool;
          break;
        case EnemyTypeEnum.SKELETON:
          enemiesIdPool = skeletonEnemiesIdPool;
          break;
        case EnemyTypeEnum.ZOMBIE:
          enemiesIdPool = zombieEnemiesIdPool;
          break;
        case EnemyTypeEnum.SLIME:
          enemiesIdPool = slimeEnemiesIdPool;
          break;
      }

      if (!enemiesIdPool) return;
      enemy.enemyId = enemiesIdPool.find(id => !stage.enemies.some(e => e.enemyId === id))

      enemy.isDead = false;
      enemy.spawnPosition = getStrategicPosition();
    });

    console.warn('currentStage', currentStage.value)
    currentStage.value = stage;
  };

  const enemyDied = (event: {id: string, position: Vector3}) => {

    const {id, position} = event;
    const enemyIndex = currentStage.value?.enemies.findIndex(
        (e) => e.enemyId === id
    );

    if (enemyIndex > -1) {
      if (position) {
        spawnHealthParticles(position);
      }

      currentStage.value?.enemies.splice(enemyIndex, 1);

      setTimeout(() => {
        checkStageProgress();
      }, 1)
    }
  };

  const checkStageProgress = () => {

    if (playerState.isDead.value) return;

    if (!currentStage.value?.enemies?.length) {
      currentStageNum.value++;
      startStage();
    }
  };

  const allRoundsCompleted = () => {
    // Método chamado quando o jogador completa todos os rounds
    // Você pode adicionar lógica aqui futuramente
  };

  const getRound1 = (): Round => {

    const stages: RoundStage[] = [];

    stages.push({
      enemies: [
        //createZombieEnemy(1.5, 1, 10),
//        createSpiderEnemy(1, 3.5, 500, 300, 6.5),
     //   createSlimeEnemy(0.5, 3.5, 1, 1000, 2500),
        createSkeletonEnemy(1.5, 0.5, 2, 800),
        createSkeletonEnemy(1.5, 2.5, 5, 2000),
      ],
    });

    stages.push({
      enemies: [
        createZombieEnemy(1.5, 1),
        /*createSkeletonEnemy(1, 2.5, 800),
        createSkeletonEnemy(1, 2.5, 1000),
        createSkeletonEnemy(1, 2.5, 1200),
        createZombieEnemy(1.5, 1),*/
        createSlimeEnemy(0.5, 3.5, 1000),

      //  createSkeletonEnemy(1, 2.5, 800),
      //  createSpiderEnemy(1, 2.5, 1000),
      //  createSpiderEnemy(1, 2.5, 1000),
      //  createSpiderEnemy(1, 2.5, 1000),
      //  createSpiderEnemy(1, 2.5, 1000),
      ],
    });

    stages.push({
      enemies: [
        createSkeletonEnemy(1, 2.5, 800),
        createSlimeEnemy(0.5, 3.5, 1000),
        createSpiderEnemy(1, 2.5, 1000),
        createZombieEnemy(1.5, 1),
      ],
    });

    return { num: 1, stages };
  };

  const getRound2 = (): Round => {
    const stages: RoundStage[] = [];

    stages.push({
      enemies: [
        createSlimeEnemy(0.5, 3.5, 1000),
        createSlimeEnemy(0.5, 3.5, 1500),
        createSpiderEnemy(0.7, 3, 1000),
        createSkeletonEnemy(1, 2.5, 800),
        createZombieEnemy(1.5, 1),
      ],
    });

    stages.push({
      enemies: [
        createSkeletonEnemy(0.7, 3.5, 1000),
        createSkeletonEnemy(0.7, 3.5, 1000),
        createSkeletonEnemy(0.7, 3.5, 1200),
        createZombieEnemy(1.5, 1),
      ],
    });

    stages.push({
      enemies: [
        createSpiderEnemy(2, 2, 800, true),
        createSlimeEnemy(0.5, 3.5, 1000),
        createSkeletonEnemy(1, 2.5, 800),
        createZombieEnemy(1.5, 1),
        createZombieEnemy(1.5, 1),
      ],
    });

    return { num: 2, stages };
  };

  const getRound3 = (): Round => {
    const stages: RoundStage[] = [];

    stages.push({
      enemies: [
        createSlimeEnemy(0.5, 4, 800),
        createSlimeEnemy(0.5, 4, 1000),
        createSlimeEnemy(0.5, 4, 1200),
        createSkeletonEnemy(0.7, 4.5, 800),
        createSkeletonEnemy(0.7, 4.5, 1000),
        createSkeletonEnemy(0.7, 4.5, 1200),
        createZombieEnemy(1.5, 1),
        createZombieEnemy(1.5, 1),
      ],
    });

    stages.push({
      enemies: [
        createSkeletonEnemy(1.5, 2, 800, true),
        createSkeletonEnemy(0.7, 4.5, 800),
        createSlimeEnemy(0.5, 4, 1000),
        createZombieEnemy(1.5, 1),
        createZombieEnemy(1.5, 1),
      ],
    });

    stages.push({
      enemies: [
        createSpiderEnemy(2, 2, 800, true),
        createSkeletonEnemy(1, 2.5, 800),
        createSkeletonEnemy(0.7, 4.5, 1000),
        createSlimeEnemy(0.5, 4, 800),
        createSlimeEnemy(0.5, 4, 1200),
        createZombieEnemy(1.5, 1),
        createZombieEnemy(1.5, 1),
        createZombieEnemy(1.5, 1),
      ],
    });

    return { num: 3, stages };
  };

  const createSlimeEnemy = (
      scale: number,
      moveSpeed: number = 2,
      rotationSpeed: number = 2,
      attackDelay: number = 2000,
      attackDelayLongRange: number = 3000,
      isBoss = false
  ): Enemy => {

    const spawnPosition = getStrategicPosition();

    return {
      enemyId: generateUUID(),
      spawnPosition,
      moveSpeed,
      rotationSpeed,
      damage: isBoss ? 15 : 10,
      health: isBoss ? 70 : 30,
      attackDelay: attackDelay || 2000,
      attackDelayLongRange: attackDelayLongRange || 3000,
      scale,
      isDead: false,
      type: EnemyTypeEnum.SLIME,
    };
  };

  const createSpiderEnemy = (
      scale: number,
      moveSpeed: number,
      attackDelay: number,
      attackDelayLongRange: number,
      rotationSpeed: number,
      isBoss = false
  ): Enemy => {

    const spawnPosition = getStrategicPosition();

    return {
      enemyId: undefined,
      spawnPosition,
      moveSpeed,
      rotationSpeed: rotationSpeed || 2,
      damage: isBoss ? 15 : 10,
      health: isBoss ? 80 : 40,
      attackDelay: attackDelay || 2000,
      attackDelayLongRange: attackDelayLongRange || 4000,
      scale,
      isDead: false,
      type: EnemyTypeEnum.SPIDER,
    };
  };

  const createSkeletonEnemy = (
      scale: number = 1.5,
      moveSpeed = 1.5,
      rotationSpeed = 3,
      attackDelay = 2000,
      isBoss = false
  ): Enemy => {

    const spawnPosition = getStrategicPosition();

    return {
      enemyId: generateUUID(),
      spawnPosition,
      moveSpeed: moveSpeed,
      rotationSpeed: rotationSpeed,
      damage: isBoss ? 15 : 10,
      health: isBoss ? 90 : 50,
      attackDelay,
      scale,
      isDead: false,
      type: EnemyTypeEnum.SKELETON,
    } as Enemy;
  };

  const createZombieEnemy = (
      scale: number,
      moveSpeed: number = 2,
      rotationSpeed = 5
  ): Enemy => {

    return {
      enemyId: generateUUID(),
      spawnPosition: getStrategicPosition(),
      moveSpeed,
      rotationSpeed,
      damage: 0,
      health: 100,
      attackDelay: 0,
      scale,
      isDead: false,
      type: EnemyTypeEnum.ZOMBIE,
    };
  };

  const getStrategicPosition = (): Vector3 => {
    const positions = [
      new Vector3(-10, 0, -10),
      new Vector3(10, 0, -10),
      new Vector3(-10, 0, 10),
      new Vector3(10, 0, 10),
      new Vector3(0, 0, -11),
      new Vector3(0, 0, 11),
      new Vector3(-11, 0, 0),
      new Vector3(11, 0, 0),
      new Vector3(-8, 0, 8),
      new Vector3(8, 0, -8),
    ];

    const availablePositions = positions.filter((pos) => {
      return (
          pos.distanceTo(playerPosition) >= minSpawnDistance &&
          !usedPositions.some(
              (usedPos) => usedPos.distanceTo(pos) < minSpawnDistance
          )
      );
    });

    if (availablePositions.length === 0) {
      usedPositions = [];
      return getStrategicPosition();
    }

    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    const chosenPosition = availablePositions[randomIndex];

    usedPositions.push(chosenPosition);

    return chosenPosition;
  };

  const handleOnPlayerDie = () => {

    if (gameState.isSoundsEnabled.value) {
      setTimeout(() => {
        const enemyDiedSound = sounds.getAudio('evilLaugh', false, 2)
        enemyDiedSound.play();
      }, 500)
    }

    const playerPosition = playerState.playerPosition.value;

    const timeline = gsap.timeline({
      onComplete() {
        emit('playerDied');
      }
    });

    timeline.to(camera.value.position, {
      x: playerPosition.x,
      y: 15,
      z: playerPosition.z,
      duration: 1.5,
      ease: 'power2.in',
    });

    timeline.to(camera.value.rotation, {
      x: -1.5,
      duration: 1.5,
      ease: 'power2.in',
    }, '<');

  }

  const restart = () => {

    gameState.isPlaying.value = false;

    const timeline = gsap.timeline({});

    const lookAtPlayerTimeline = gsap.timeline({
      delay: 0.2,
      onComplete() {

        gameState.isPlaying.value = true;

        setTimeout(() => {
          createRounds();
          currentRound.value = undefined;
          currentStage.value = undefined;
          currentRoundNum.value = 1;
          currentStageNum.value = 1;

          startRound();
        }, 2000)
      }
    })

    timeline.to(camera.value?.position, {
      x: 0,
      duration: 1.5,
      ease: 'power2.out',
      onComplete() {
        playerCharacterRef.value.restart();
      }
    }, '<');

    timeline.to(camera.value.rotation, {
      x: -0.3,
      duration: 1.5,
      ease: 'power2.out',
      onComplete() {
        playerCharacterRef.value.restart();
      }
    }, '<');

    timeline.add(lookAtPlayerTimeline);

    lookAtPlayerTimeline.to(camera.value.position, {
      x: 0,
      y: 7.65,
      z: 15,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate() {
      }
    }, '<');

    lookAtPlayerTimeline.to(camera.value.rotation, {
      x: -0.42,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate() {
      }
    }, '<');

  }

  watch(() => playerState.isDead.value, (isPlayerDead: boolean) => {
    if (isPlayerDead) {
      setTimeout(() => {
        handleOnPlayerDie()
      }, 1000)
    }
  })

  defineExpose({
    startRound,
    restart,
  });

</script>
