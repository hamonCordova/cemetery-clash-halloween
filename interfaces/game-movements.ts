import type {Vector3} from "three";

export interface GameMovements {
    up: boolean
    left: boolean
    right: boolean
    down: boolean
    jump: boolean
    run: boolean
    usingJoystick: boolean
    joystickMovement: Vector3
}