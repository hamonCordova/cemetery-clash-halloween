import {computed, ref} from 'vue';
import { defineStore } from 'pinia';
import { Vector3 } from 'three';

export const usePlayerStore = defineStore('player', () => {

  const playerPosition = ref(new Vector3(0, 0, 0));
  const health = ref(100);
  const freezedByEnemiesId = ref<Map>(new Map());

  const isFreezed = () => {
    return freezedByEnemiesId.value.size > 0;
  }

  const freeze = (enemyId: string) => {
    freezedByEnemiesId.value.set(enemyId);
  }

  const unfreeze = (enemyId: string) => {
    freezedByEnemiesId.value.delete(enemyId);
  }

  const updatePlayerPosition = (position: Vector3) => {
    playerPosition.value.copy(position);
  };

  const takeDamage = (damage: number) => {
    console.warn('player hit')
    health.value -= damage;
    if (health.value <= 0) {
      // Player is dead
      // Implement game over logic here
    }
  };

  return {
    playerPosition,
    health,
    isFreezed,
    updatePlayerPosition,
    takeDamage,
    freeze,
    unfreeze,
  };
});