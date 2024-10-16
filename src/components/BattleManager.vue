<template>
  <PlayerCharacter />

  <template v-if="currentRound">
    <template v-for="enemy in currentStage.enemies" :key="enemy.enemyId">
      <Suspense>
        <SkeletonEnemyModel
            v-if="!enemy.isDead && enemy.type === EnemyTypeEnum.SKELETON"
            :config="enemy"
            @die="enemyDied"
        />
      </Suspense>
      <Suspense>
        <SpiderEnemyModel
            v-if="!enemy.isDead && enemy.type === EnemyTypeEnum.SPIDER"
            :config="enemy"
            @die="enemyDied"
        />
      </Suspense>
      <Suspense>
        <SlimeEnemyModel
            v-if="!enemy.isDead && enemy.type === EnemyTypeEnum.SLIME"
            :config="enemy"
            @die="enemyDied"
        />
      </Suspense>
      <Suspense>
        <ZombieEnemy
            v-if="!enemy.isDead && enemy.type === EnemyTypeEnum.ZOMBIE"
            :config="enemy"
            @die="enemyDied"
        />
      </Suspense>
    </template>
  </template>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import {AnimationClip, Object3D, Vector3} from 'three';
import { generateUUID } from 'three/src/math/MathUtils';
import { EnemyTypeEnum } from '../../enum/enemy-type.enum';

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
  model: Object3D;
  animation: AnimationClip[]
}

</script>

<script setup lang="ts">
  import {ref, onMounted, markRaw} from 'vue';
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
  import {useEnemiesSpawned} from "@/composable/useEnemiesSpawned";

  const resources = useResources();
  const playerState = usePlayer();
  const { scene } = useTresContext();
  const { onLoop } = useRenderLoop();

  const rounds = ref<Round[]>([]);
  const currentRoundNum = ref<number>(1);
  const currentStageNum = ref<number>(1);

  const currentRound = ref<Round | null>(null);
  const currentStage = ref<RoundStage | null>(null);

  const arenaSize = 25;
  const minSpawnDistance = 4;
  const playerPosition = new Vector3(0, 0, 0);

  let usedPositions: Vector3[] = [];
  const activeHealthParticles = [];

  onMounted(() => {
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
      return;
    }

    currentRound.value = rounds.value[currentRoundNum.value - 1];
    currentStageNum.value = 1;
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
    currentStage.value = currentRound.value.stages[currentStageNum.value - 1];

    currentStage.value.enemies.forEach((enemy) => {
      enemy.isDead = false;
    });

    currentStage.value.enemies.forEach((enemy) => {
      enemy.spawnPosition = getStrategicPosition();
    });
  };

  const spawnHealthParticles = (startPosition: Vector3) => {
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

  const enemyDied = (event: {id: string, position: Vector3}) => {

    const {id, position} = event;
    const enemy = currentStage.value?.enemies.find(
        (e) => e.enemyId === id
    );

    if (enemy) {
      if (position) {
        spawnHealthParticles(position);
      }

      enemy.isDead = true;

      setTimeout(() => {
        checkStageProgress();
      }, 1)
    }
  };

  const checkStageProgress = () => {
    if (currentStage.value?.enemies.every((e) => e.isDead)) {
      currentStageNum.value++;
      startStage();
    }
  };

  const resetGame = () => {
    currentRoundNum.value = 1;
    currentStageNum.value = 1;
    startRound();
  };

  const allRoundsCompleted = () => {
    // Método chamado quando o jogador completa todos os rounds
    // Você pode adicionar lógica aqui futuramente
  };

  const getRandomSpawnPosition = (
      existingPositions: Vector3[]
  ): Vector3 => {
    let position: Vector3;
    let attempts = 0;
    do {
      const x = Math.random() * arenaSize - arenaSize / 2;
      const z = Math.random() * arenaSize - arenaSize / 2;
      position = new Vector3(x, 0, z);
      attempts++;
    } while (
        (position.distanceTo(playerPosition) < minSpawnDistance ||
            existingPositions.some(
                (pos) => pos.distanceTo(position) < minSpawnDistance
            )) &&
        attempts < 100
        );
    return position;
  };

  const getRound1 = (): Round => {
    const stages: RoundStage[] = [];

    stages.push({
      enemies: [
        /*createSkeletonEnemy(1.5, 2.5, 1000),
        createSlimeEnemy(0.5, 3.5, 2000),*/
        createSpiderEnemy(1, 2.5, 1000),
        createSpiderEnemy(1, 2.5, 1000),
        createSpiderEnemy(1, 2.5, 1000),

      ],
    });

    stages.push({
      enemies: [
        createSkeletonEnemy(1, 2.5, 800),
        createSkeletonEnemy(1, 2.5, 1000),
        createSkeletonEnemy(1, 2.5, 1200),
        createZombieEnemy(1.5, 1),
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
      moveSpeed: number,
      attackDelayLongRange: number,
      isBoss = false
  ): Enemy => {

    const spawnPosition = getStrategicPosition();
    const {scene, animations} = resources.get('slime');

    return {
      enemyId: generateUUID(),
      spawnPosition,
      moveSpeed,
      rotationSpeed: 2,
      damage: isBoss ? 15 : 10,
      health: isBoss ? 70 : 30,
      attackDelay: 1000,
      attackDelayLongRange,
      scale,
      isDead: false,
      type: EnemyTypeEnum.SLIME,
      model: markRaw(scene),
      animations
    };
  };

  const createSpiderEnemy = (
      scale: number,
      moveSpeed: number,
      attackDelay: number,
      isBoss = false
  ): Enemy => {

    const spawnPosition = getStrategicPosition();
    const {scene, animations} = resources.get('spider');

    return {
      enemyId: generateUUID(),
      spawnPosition,
      moveSpeed,
      rotationSpeed: 2,
      damage: isBoss ? 15 : 10,
      health: isBoss ? 80 : 40,
      attackDelay,
      attackDelayLongRange: 2000,
      scale,
      isDead: false,
      type: EnemyTypeEnum.SPIDER,
      model: markRaw(scene),
      animations
    };
  };

  const createSkeletonEnemy = (
      scale: number,
      moveSpeed: number,
      attackDelay: number,
      isBoss = false
  ): Enemy => {
    const adjustedScale = Math.max(scale, 0.5);
    let adjustedMoveSpeed = moveSpeed;

    if (adjustedScale < 1) {
      adjustedMoveSpeed = moveSpeed * (1 / adjustedScale);
    }

    const spawnPosition = getStrategicPosition();
    const {scene, animations} = resources.get('skeleton');

    return {
      enemyId: generateUUID(),
      spawnPosition,
      moveSpeed: adjustedMoveSpeed,
      rotationSpeed: 2,
      damage: isBoss ? 15 : 10,
      health: isBoss ? 90 : 50,
      attackDelay,
      scale: adjustedScale,
      isDead: false,
      type: EnemyTypeEnum.SKELETON,
      model: markRaw(scene),
      animations
    } as Enemy;
  };

  const createZombieEnemy = (
      scale: number,
      moveSpeed: number
  ): Enemy => {

    const spawnPosition = getStrategicPosition();
    const {scene, animations} = resources.get('zombie');

    return {
      enemyId: generateUUID(),
      spawnPosition,
      moveSpeed,
      rotationSpeed: 1,
      damage: 0,
      health: 100,
      attackDelay: 0,
      scale,
      isDead: false,
      type: EnemyTypeEnum.ZOMBIE,
      model: markRaw(scene),
      animations
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

  defineExpose({
    startRound,
    resetGame,
  });
</script>
