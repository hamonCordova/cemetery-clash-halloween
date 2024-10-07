import {type Reactive, ref, type ShallowRef, toValue} from "vue";
import {LoopOnce, LoopRepeat} from "three/src/constants";
import gsap from "gsap";
import type {AnimationAction, Mesh} from "three";

interface CharacterActionsName {
    idle: string;
    walk: string;
    attack: string;
    die: string;
}

interface CharacterAttackConfig {
    nextAttackDelay: string;
}

interface CharacterEvents {
    finishAttack: () => void;
    onDie: () => void
}

export default function useCharacter(
    characterRef: Reactive<Mesh>,
    actions: AnimationAction[],
    actionsName: CharacterActionsName,
    attackConfig: CharacterAttackConfig,
    eventsCallbacks: CharacterEvents
) {

    const isWalking = ref(false);
    const isIdle = ref(false);
    const isDead = ref(false);
    const isAttacking = ref(false);

    let nextAttackTimeout;

    const attack = () => {

        if (isAttacking.value || isDead.value) return;
        isAttacking.value = true;

        if (nextAttackTimeout) {
            clearTimeout(nextAttackTimeout);
        }

        const attackAction = actions[actionsName.attack].setLoop(LoopOnce);
        const attackActionDuration = attackAction.getClip().duration / attackAction.timeScale;

        attackAction.reset();
        attackAction.play();
        attackAction.crossFadeFrom(actions[isWalking.value ? actionsName.walk : actionsName.idle], 0.1);

        setTimeout(() => {
            eventsCallbacks.finishAttack ? eventsCallbacks.finishAttack() : undefined;
            idle();
        }, attackActionDuration * 1000)

        nextAttackTimeout = setTimeout(() => {
            isAttacking.value = false;
        }, attackConfig.nextAttackDelay);
    }

    const stopAttack = () => {
        const attackAction = actions[actionsName.attack];
        attackAction.stop();
    }

    const idle = () => {

        if (isDead.value) return;

        const idleAction = actions[actionsName.idle];

        idleAction.reset();
        idleAction.play();
        idleAction.crossFadeFrom(actions[actionsName.attack], 0.5);
        isIdle.value = true;
    }

    const stopIdle = () => {
        actions[actionsName.idle].stop();
    }

    const walk = () => {
        if (isWalking.value || isDead.value) return;

        const walkAction = actions[actionsName.walk].setLoop(LoopRepeat);
        walkAction.reset();
        walkAction.play();

        walkAction.crossFadeFrom(actions[isAttacking.value ? actionsName.attack : actionsName.idle], 0.5);
        isWalking.value = true;

        isAttacking.value = false;
    }

    const stopWalk = () => {
        if (!isWalking.value) return;

        actions[actionsName.walk].stop();
        isWalking.value = false;
    }

    const die = () => {

        if (isDead.value) return;

        const dieAction = actions[actionsName.die];
        dieAction.reset();
        dieAction.setLoop(LoopOnce);
        dieAction.clampWhenFinished = true;
        dieAction.play();
        isDead.value = true;
        stopIdle();
        stopWalk();
        stopAttack();

        setTimeout(() => {
            gsap.to(
                toValue(characterRef).position,
                {
                    y: -2,
                    duration: 2,
                    ease: 'power2.in',
                    onComplete: () => {
                        eventsCallbacks.onDie ? eventsCallbacks.onDie() : undefined;
                    }
                }
            )
        }, 1000)

    }

    return {
        isWalking,
        isIdle,
        isAttacking,
        isDead,
        attack,
        stopAttack,
        walk,
        stopWalk,
        idle,
        stopIdle,
        die,
    }
}