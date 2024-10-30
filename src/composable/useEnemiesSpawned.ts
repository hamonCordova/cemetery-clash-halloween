import { createGlobalState, useEventBus } from '@vueuse/core'
import { ref } from 'vue'
import { Vector3 } from 'three'
import type { EnemyTypeEnum } from '../../enum/enemy-type.enum'

export const useEnemiesSpawned = createGlobalState(() => {
  const enemies = ref<
    Array<{ id: string; position: Vector3; health: number; type: EnemyTypeEnum }>
  >([])
  const enemyEventBus = useEventBus('enemyEventBus')

  const registerEnemy = (id: string, position: Vector3, health: number, type: EnemyTypeEnum) => {
    enemies.value.push({ id, position, health: health || 100, type })
  }

  const updateEnemyPosition = (id: string, position: Vector3) => {
    const enemy = enemies.value.find((e) => e.id === id)
    if (enemy) {
      enemy.position.copy(position)
    }
  }

  const removeEnemy = (id: string) => {
    enemies.value = enemies.value.filter((e) => e.id !== id)
  }

  const damageEnemy = (id: string, damage: number) => {
    const enemy = enemies.value.find((e) => e.id === id)
    if (enemy && !enemy.isDead) {
      enemy.health -= damage
      enemyEventBus.emit('damageReceived', id)
      if (enemy.health <= 0) {
        enemyEventBus.emit('die', id)

        enemy.isDead = true
      }
    }
  }

  return {
    enemies,
    registerEnemy,
    updateEnemyPosition,
    removeEnemy,
    damageEnemy,
  }
})
