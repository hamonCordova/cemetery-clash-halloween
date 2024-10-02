import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Vector3 } from 'three';

export const useEnemyStore = defineStore('enemyStore', () => {
    const enemies = ref<Array<{ id: string; position: Vector3; health: number, isDead: boolean }>>([]);
    let onDieCallBack: (id) => void;

    const registerEnemy = (id: string, position: Vector3) => {
        enemies.value.push({ id, position, health: 100 });
    };

    const updateEnemyPosition = (id: string, position: Vector3) => {
        const enemy = enemies.value.find((e) => e.id === id);
        if (enemy) {
            enemy.position.copy(position);
        }
    };

    const removeEnemy = (id: string) => {
        enemies.value = enemies.value.filter((e) => e.id !== id);
    };

    const damageEnemy = (id: string, damage: number) => {
        const enemy = enemies.value.find((e) => e.id === id);
        if (enemy && !enemy.isDead) {
            enemy.health -= damage;
            if (enemy.health <= 0) {
             //   removeEnemy(id);
                if (onDieCallBack) {
                    onDieCallBack();
                }
                enemy.isDead = true;
                console.warn('ENEMY DIED')
            }
        }
    };

    const setOnDieCallback = (onDie?: (id: string) => void) => {
        onDieCallBack = onDie;
    }

    return {
        enemies,
        registerEnemy,
        updateEnemyPosition,
        removeEnemy,
        damageEnemy,
        setOnDieCallback
    };
});
