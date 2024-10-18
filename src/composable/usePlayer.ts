import {createGlobalState, useEventBus} from "@vueuse/core";
import type {GameMovements} from "../../interfaces/game-movements";
import {Vector3} from "three";
import {ref} from "vue";
import {DocumentUtils} from "@/utils/document-utils";


export const usePlayer = createGlobalState(() => {

    const playerEventBus = useEventBus('playerEventBus');
    const playerPosition = ref(new Vector3(0, 0, 0));
    const health = ref(100);
    const isDead = ref(false);
    const freezedByEnemiesId = ref<Map>(new Map());
    const isMobile = DocumentUtils.isMobile();
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

        if (isDead.value) return;
        console.warn('player hit')
        health.value -= (isMobile ? damage * 0.5 : damage);

        if (health.value <= 0) {
            playerEventBus.emit('die');
            isDead.value = true;
            return;
        }

        playerEventBus.emit('damageReceived')
    };

    const increaseHealth = (additionalHealth: number) => {
        if (isDead.value) return;
        health.value = Math.min(100, health.value + additionalHealth);
    }

    const attack = () => {
        playerEventBus.emit('attack');
    }

    const reset = (resetPosition: Vector3) => {
        playerPosition.value.copy(resetPosition);
        freezedByEnemiesId.value = new Map();
        health.value = 100;
        isDead.value = false;
    }

    return {
        activeMovements,
        playerPosition,
        health,
        isDead,
        increaseHealth,
        isFreezed,
        attack,
        updatePlayerPosition,
        takeDamage,
        freeze,
        unfreeze,
        reset
    };
})