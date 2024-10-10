import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Vector3 } from 'three';
import {useEventBus} from "@vueuse/core";
import type {EnemyTypeEnum} from "../../enum/enemy-type.enum";

interface EnemyAlive {
    id: string;
    position: Vector3;
    health: number,
    isDead: boolean,
    type: EnemyTypeEnum
}

export const useEnemyStore = defineStore('enemyStore', () => {

    const enemies = ref<Array<EnemyAlive>>([]);
    const enemyEventBus = useEventBus('enemyEventBus');

    const registerEnemy = (id: string, position: Vector3, type: EnemyTypeEnum) => {
        enemies.value.push({ id, position, health: 100, type });
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
            enemyEventBus.emit('damageReceived', id);
            if (enemy.health <= 0) {
                removeEnemy(id);
                enemyEventBus.emit('die', id)

                enemy.isDead = true;
                console.warn('ENEMY DIED')
            }
        }
    };


    return {
        enemies,
        registerEnemy,
        updateEnemyPosition,
        removeEnemy,
        damageEnemy,
    };
});
