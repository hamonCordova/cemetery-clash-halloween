import {createGlobalState} from "@vueuse/core";
import {computed, ref} from "vue";
import {GameStateModeEnum} from "../../enum/game-mode.enum";

export const useGameState = createGlobalState(() => {

    const _isPlaying = ref(false);
    const mode = ref<GameStateModeEnum>(GameStateModeEnum.PRODUCTION);

    const isPlaying = computed({
        get() {
            return _isPlaying.value
        },
        set(isPlaying: boolean) {
            _isPlaying.value = isPlaying;
        }
    })

    return {
        isPlaying,
        mode,
    }

})