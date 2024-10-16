import {createGlobalState, useEventBus} from "@vueuse/core";
import type {GameMovements} from "../../interfaces/game-movements";
import {Vector3} from "three";
import {ref} from "vue";


export const usePlayer = createGlobalState(() => {

    const playerEventBus = useEventBus('playerEventBus');
    const playerPosition = ref(new Vector3(0, 0, 0));
    const health = ref(100);
    const freezedByEnemiesId = ref<Map>(new Map());
    const activeMovements: GameMovements = {
        up: false,
        left: false,
        right: false,
        down: false,
        jump: false,
        run: false,
        usingJoystick: false,
        joystickMovement: new Vector3(0, 0, 0),
    }

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
        playerEventBus.emit('damageReceived')
        health.value -= damage * 0.5;
        if (health.value <= 0) {
            playerEventBus.emit('die');
        }
    };

    const increaseHealth = (additionalHealth: number) => {
        health.value = Math.min(100, health.value + additionalHealth);
    }

    const attack = () => {
        playerEventBus.emit('attack');
    }

    return {
        activeMovements,
        playerPosition,
        health,
        increaseHealth,
        isFreezed,
        attack,
        updatePlayerPosition,
        takeDamage,
        freeze,
        unfreeze,
    };
})