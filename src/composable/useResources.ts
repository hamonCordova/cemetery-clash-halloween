import {createGlobalState, useEventBus} from "@vueuse/core";
import {LoadingManager} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {ref} from "vue";

export const useResources = createGlobalState(() => {

    const isLoaded = ref(false);
    let resources = {}

    const sources = [
        {
            name: 'moon',
            path: '../static/models/scene/Moon.glb',
            type: 'GLTFLoader'
        },
        {
            name: 'candles',
            path: '../static/models/scene/Candles.glb',
            type: 'GLTFLoader'
        },
        {
            name: 'cobweb',
            path: '../static/models/scene/Cobweb.glb',
            type: 'GLTFLoader'
        },
        {
            name: 'crypt',
            path: '../static/models/scene/Crypt.glb',
            type: 'GLTFLoader'
        },
        {
            name: 'damagedGrave',
            path: '../static/models/scene/DamagedGrave.glb',
            type: 'GLTFLoader'
        },
        {
            name: 'deadTree',
            path: '../static/models/scene/DeadTree.glb',
            type: 'GLTFLoader'
        },
        {
            name: 'grass',
            path: '../static/models/scene/Grass.glb',
            type: 'GLTFLoader'
        },
        {
            name: 'grave',
            path: '../static/models/scene/Grave.glb',
            type: 'GLTFLoader'
        },
        {
            name: 'gravestone',
            path: '../static/models/scene/Gravestone.glb',
            type: 'GLTFLoader'
        },
        {
            name: 'postWithSkull',
            path: '../static/models/scene/PostWithSkull.glb',
            type: 'GLTFLoader'
        },
        {
            name: 'pumpkin',
            path: '../static/models/scene/Pumpkin.glb',
            type: 'GLTFLoader'
        },
        {
            name: 'skeleton',
            path: '../static/models/Skeleton.glb',
            type: 'GLTFLoader'
        },
        {
            name: 'spider',
            path: '../static/models/Spider.glb',
            type: 'GLTFLoader'
        },
        {
            name: 'zombie',
            path: '../static/models/Zombie.glb',
            type: 'GLTFLoader'
        },
        {
            name: 'bloodSplate',
            path: '../static/models/BloodSplat.glb',
            type: 'GLTFLoader'
        },
    ];

    const load = (onLoad: () => void) => {

        const loadingManager = new LoadingManager(() => {
            if (onLoad) onLoad();
            isLoaded.value = true;
        })

        const gltfLoader = new GLTFLoader(loadingManager);

        sources.forEach(source => {
            if (source.type === 'GLTFLoader') {
                gltfLoader.load(source.path, (gltf) => {
                    resources[source.name] = gltf;
                })
            }
        })
    }

    return {
        load,
        isLoaded,
        resources,
    }
})
