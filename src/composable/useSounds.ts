import {createGlobalState} from "@vueuse/core";
import {AudioListener, type Mesh, PositionalAudio} from "three";
import {useResources} from "@/composable/useResources";
import SoundsManager from "../../models/game-audio-player";
import GameAudioPlayer from "../../models/game-audio-player";

export const useSounds = createGlobalState(() => {

    const listener: AudioListener = new AudioListener();
    const resources = useResources();

    const playAudio = (audioName: string, loop = false, volume = 0.5) => {
        if (!listener) return;

        const audio = resources.getAudio(audioName, listener);
        if (!audio) return;

        audio.setLoop(loop);
        audio.setVolume(volume);
        audio.play();
    }

    const createPositionalAudio = (audioName: string, mesh?: Mesh) => {
        const audioBuffer = resources.getAudio(audioName);
        if (!audioBuffer) return;

        const positionalAudio = new PositionalAudio(listener);
        positionalAudio.setBuffer(audioBuffer);
        positionalAudio.setVolume(1);
        positionalAudio.setRefDistance(15);

        if (mesh) {
            mesh.add(positionalAudio);
        }

        return positionalAudio;
    }

    const createMeshActionsAudioPlayers = (actions: {[actionName: string]: string[]}, mesh: Mesh) => {
        if (!actions) return;

        const players: {[key: string]: GameAudioPlayer[]} = {};

        Object.keys(actions).forEach(actionName => {
            const audiosName = actions[actionName];
            const positionalAudios = [];
            audiosName.forEach(audioName => {
                const positionalAudio = createPositionalAudio(audioName, mesh);
                positionalAudios.push(positionalAudio);
            })

            players[actionName] = new SoundsManager(positionalAudios);
        })

        return players;
    }

    const createAudioPlayer = (audiosName: string[], mesh: Mesh) => {
        if (!audiosName) return;

        const positionalAudios = [];

        audiosName.forEach(audioName => {
            const positionalAudio = createPositionalAudio(audioName, mesh);
            positionalAudios.push(positionalAudio);
        })

        return new GameAudioPlayer(positionalAudios);
    }


    return {
        listener,
        playAudio,
        createPositionalAudio,
        createMeshActionsAudioPlayers,
        createAudioPlayer
    }

})