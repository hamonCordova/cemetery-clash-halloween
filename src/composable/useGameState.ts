import {createGlobalState} from "@vueuse/core";
import {computed, ref} from "vue";
import {GameStateModeEnum} from "../../enum/game-mode.enum";

export const useGameState = createGlobalState(() => {

    const _isPlaying = ref(false);
    const mode = ref<GameStateModeEnum>(GameStateModeEnum.PRODUCTION);
    const isSoundsEnabled = ref(true);

    const isPlaying = computed({
        get() {
            return _isPlaying.value
        },
        set(isPlaying: boolean) {
            _isPlaying.value = isPlaying;
        }
    })

    const toggleSoundState = () => {
        isSoundsEnabled.value = !isSoundsEnabled.value;
    }

    return {
        isPlaying,
        mode,
        isSoundsEnabled,
        toggleSoundState
    }

})