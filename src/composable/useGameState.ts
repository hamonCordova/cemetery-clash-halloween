import {createGlobalState} from "@vueuse/core";
import {computed, ref} from "vue";

export const useGameState = createGlobalState(() => {

    const _isPlaying = ref(false);

    const isPlaying = computed({
        get() {
            return _isPlaying.value
        },
        set(isPlaying: boolean) {
            _isPlaying.value = isPlaying;
        }
    })

    return {
        isPlaying
    }

})