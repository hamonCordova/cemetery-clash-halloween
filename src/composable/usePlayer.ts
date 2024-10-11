import {createGlobalState} from "@vueuse/core";
import type {GameMovements} from "../../interfaces/game-movements";
import {Vector3} from "three";

export const usePlayer = createGlobalState(() => {

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

    return {
        activeMovements
    }
})