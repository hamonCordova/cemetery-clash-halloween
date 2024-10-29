import {createGlobalState} from "@vueuse/core";
import {ref} from "vue";

export const useModalCredits = createGlobalState(() => {
    const isOpen = ref(false);

    const open = () => {
        isOpen.value = true;
    }

    const close = () => {
        isOpen.value = false;
    }

    return {
        isOpen,
        open,
        close
    }
})