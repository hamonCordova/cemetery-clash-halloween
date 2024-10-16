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
import { Vector3 } from 'three';
import { generateUUID } from 'three/src/math/MathUtils';
import { EnemyTypeEnum } from '../../enum/enemy-type.enum';
import {useResources} from "@/composable/useResources";
import SkeletonEnemyModel from '@/components/SkeletonEnemyModel.vue';
import SpiderEnemyModel from '@/components/SpiderEnemyModel.vue';
import SlimeEnemyModel from '@/components/SlimeEnemyModel.vue';
import ZombieEnemy from '@/components/ZombieEnemy.vue';
import PlayerCharacter from '@/components/PlayerCharacter.vue';

const resources = useResources();

const rounds = ref<Round[]>([]);
const currentRoundNum = ref<number>(1);
const currentStageNum = ref<number>(1);

const currentRound = ref<Round | null>(null);
const currentStage = ref<RoundStage | null>(null);

const arenaSize = 25;
const minSpawnDistance = 4;
const playerPosition = new Vector3(0, 0, 0);

onMounted(() => {
  createRounds();
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
    // Jogador terminou todos os rounds
    allRoundsCompleted();
    return;
  }

  currentRound.value = rounds.value[currentRoundNum.value - 1];
  currentStageNum.value = 1;
  startStage();
};

// Lista para armazenar as posições já usadas em um estágio
let usedPositions: Vector3[] = [];

const startStage = () => {
  if (!currentRound.value) return;

  if (currentStageNum.value > currentRound.value.stages.length) {
    currentRoundNum.value++;
    startRound();
    return;
  }

  currentStage.value = currentRound.value.stages[currentStageNum.value - 1];

  // Resetar inimigos mortos
  currentStage.value.enemies.forEach((enemy) => {
    enemy.isDead = false;
  });

  // Resetar a lista de posições usadas para o novo estágio
  usedPositions = [];

  // Reatribuir posições aos inimigos para evitar sobreposição
  currentStage.value.enemies.forEach((enemy) => {
    enemy.spawnPosition = getStrategicPosition();
  });
};

const enemyDied = (enemyId: string) => {
  const enemy = currentStage.value?.enemies.find(
      (e) => e.enemyId === enemyId
  );
  if (enemy) {
    enemy.isDead = true;
    checkStageProgress();
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

// Funções para criar rounds e estágios

const getRound1 = (): Round => {
  const stages: RoundStage[] = [];

  // Estágio 1: Slimes pequenas com delays diferentes
  stages.push({
    enemies: [
      /*createSkeletonEnemy(1.5, 2.5, 1000),
      createSlimeEnemy(0.5, 3.5, 2000),*/
      createSpiderEnemy(1, 2.5, 1000),

    ],
  });
  // Estágio 2: Skeletons com escala padrão
  stages.push({
    enemies: [
      createSkeletonEnemy(1, 2.5, 800),
      createSkeletonEnemy(1, 2.5, 1000),
      createSkeletonEnemy(1, 2.5, 1200),
      createZombieEnemy(1.5, 1),
    ],
  });

  // Estágio 3: Mix de inimigos com zombies
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

  // Estágio 1: Mix com mais inimigos
  stages.push({
    enemies: [
      createSlimeEnemy(0.5, 3.5, 1000),
      createSlimeEnemy(0.5, 3.5, 1500),
      createSpiderEnemy(0.7, 3, 1000),
      createSkeletonEnemy(1, 2.5, 800),
      createZombieEnemy(1.5, 1),
    ],
  });

  // Estágio 2: Skeletons pequenos e rápidos
  stages.push({
    enemies: [
      createSkeletonEnemy(0.7, 3.5, 1000),
      createSkeletonEnemy(0.7, 3.5, 1000),
      createSkeletonEnemy(0.7, 3.5, 1200),
      createZombieEnemy(1.5, 1),
    ],
  });

  // Estágio 3: Boss Spider com suporte
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

  // Estágio 1: Muitos inimigos rápidos
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

  // Estágio 2: Boss Skeleton com minions
  stages.push({
    enemies: [
      createSkeletonEnemy(1.5, 2, 800, true),
      createSkeletonEnemy(0.7, 4.5, 800),
      createSlimeEnemy(0.5, 4, 1000),
      createZombieEnemy(1.5, 1),
      createZombieEnemy(1.5, 1),
    ],
  });

  // Estágio 3: Desafio final
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

// Funções para criar inimigos específicos

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
    damage: 0, // Zombies não causam dano
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

<style scoped>
/* Adicione estilos se necessário */
</style>
