<template>
  <PlayerCharacter />
  <template v-if="currentRound">
    <template v-for="enemy in currentRoundStage.enemies" :key="enemy.enemyId">
      <EnemyModel :config="enemy" @die="enemyDied($event)" v-if="!enemy.isDead && enemy.type === 'SKELETON'" />
      <SpiderEnemyModel :config="enemy" @die="enemyDied($event)" v-if="!enemy.isDead && enemy.type === 'SPIDER'" />
      <Suspense v-if="!enemy.isDead && enemy.type === 'ZOMBIE'">
        <ZombieEnemey :config="enemy" @die="enemyDied($event)" />
      </Suspense>
    </template>
  </template>
</template>

<script lang="ts">
export interface Round {
  num: number;
  stages: Stage[]
}

export interface RoundStage {
  enemies: Enemy[]
}

export interface Enemy {
  enemyId: string;
  moveSpeed: number;
  rotationSpeed: number;
  spawnPosition: Vector3;
  attackDelay: number;
  scale: number;
  isDead: boolean;
  type: EnemyTypeEnum
}

</script>

<script setup lang="ts">
  import EnemyModel from "@/components/EnemyModel.vue";
  import {onMounted, ref} from "vue";
  import {generateUUID} from "three/src/math/MathUtils";
  import {Vector3} from "three";
  import SpiderEnemyModel from "@/components/SpiderEnemyModel.vue";
  import {EnemyTypeEnum} from "../../enum/enemy-type.enum";
  import ZombieEnemey from "@/components/ZombieEnemey.vue";
  import PlayerCharacter from "@/components/PlayerCharacter.vue";

  const rounds = ref<Round[]>([]);

  const currentRoundNum = ref<number>(1);
  const currentRoundStageNum = ref<number>(1);

  const currentRound = ref<Round>();
  const currentRoundStage = ref<RoundStage>();

  onMounted(() => {
    createRounds();
  //  startRound();
  })

  const createRounds = () => {
    rounds.value = [getRound1()]
  }

  const startRound = () => {
    console.warn(currentRoundStageNum.value, currentRoundStageNum.value - 1)
    currentRound.value = rounds.value[currentRoundNum.value - 1];
    currentRoundStage.value = currentRound.value.stages[currentRoundStageNum.value - 1];
    console.warn(currentRoundStage.value?.enemies.length)
  }

  const getRandomSpawnPosition = () => {
    return new Vector3(
        Math.random() * 20 - 10,
        0,
        Math.random() * 20 - 10
    )
  }

  const enemyDied = (enemyId: string) => {
    const enemy = currentRoundStage.value?.enemies.find(e => e.enemyId === enemyId);
    if (enemy) {
      enemy.isDead = true;
      checkRoundProgress();
    }
  }

  const checkRoundProgress = () => {
    if (currentRoundStage.value?.enemies.every(e => e.isDead)) {

      console.warn(currentRound.value?.stages.length, currentRoundStageNum.value)

      if (currentRound.value?.stages.length === currentRoundStageNum.value) {
        currentRoundNum.value = currentRoundNum.value + 1;
        currentRoundStageNum.value = 1;
      } else {
        currentRoundStageNum.value = currentRoundStageNum.value + 1;
      }

      startRound();
    }
  }

  const getRound1 = () => {
    const stages = [
      {
        enemies: [
          {
            enemyId: generateUUID(),
            spawnPosition: new Vector3(-4, 0, -9),
            attackDelay: 5000,
            rotationSpeed: 2,
            scale: 0.5,
            moveSpeed: 2.5,
            type: EnemyTypeEnum.SPIDER
          },
          {
            enemyId: generateUUID(),
            spawnPosition: new Vector3(7, 0, 7),
            attackDelay: 5000,
            rotationSpeed: 2,
            scale: 0.5,
            moveSpeed: 2.5,
            type: EnemyTypeEnum.SPIDER
          },
          {
            enemyId: generateUUID(),
            spawnPosition: getRandomSpawnPosition(),
            attackDelay: 3000,
            rotationSpeed: 3,
            moveSpeed: 3.5,
            type: EnemyTypeEnum.SKELETON
          },
        ]
      } as RoundStage,
      {
        enemies: [
          {
            enemyId: generateUUID(),
            spawnPosition: getRandomSpawnPosition(),
            attackDelay: 3000,
            rotationSpeed: 3,
            moveSpeed: 3.5,
            type: EnemyTypeEnum.SKELETON
          },
          {
            enemyId: generateUUID(),
            spawnPosition: getRandomSpawnPosition(),
            attackDelay: 5000,
            rotationSpeed: 3,
            moveSpeed: 1.5,
            type: EnemyTypeEnum.SKELETON
          },
          {
            enemyId: generateUUID(),
            spawnPosition: getRandomSpawnPosition(),
            attackDelay: 400,
            rotationSpeed: 4,
            moveSpeed: 2.5,
            type: EnemyTypeEnum.SKELETON
          },
        ]
      } as RoundStage,
      {
        enemies: [
          {
            enemyId: generateUUID(),
            spawnPosition: getRandomSpawnPosition(),
            attackDelay: 600,
            rotationSpeed: 5,
            moveSpeed: 6.5,
            scale: 0.9,
            type: EnemyTypeEnum.SKELETON
          },
          {
            enemyId: generateUUID(),
            spawnPosition: getRandomSpawnPosition(),
            attackDelay: 2000,
            rotationSpeed: 2,
            moveSpeed: 1.5,
            scale: 4,
            type: EnemyTypeEnum.SKELETON
          },
        ]
      } as RoundStage
    ]

    return {num: 1, stages} as Round;
  }

</script>