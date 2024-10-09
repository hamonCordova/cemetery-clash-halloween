import {createGlobalState, useEventBus} from "@vueuse/core";
import {LoadingManager, MeshBasicMaterial} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {ref} from "vue";
import {useAnimations} from "@tresjs/cientos";
import {clone} from "three/examples/jsm/utils/SkeletonUtils";

export const useResources = createGlobalState(() => {

    const isLoaded = ref(false);
    let resources = {};

    const sources = [
        {
            name: 'moon',
            path: '../static/models/scene/Moon.glb',
            type: 'GLTFLoader'
        },
        {
            name: 'candles',
            path: '../static/models/scene/Candles.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'cobweb',
            path: '../static/models/scene/Cobweb.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'crypt',
            path: '../static/models/scene/Crypt.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'damagedGrave',
            path: '../static/models/scene/DamagedGrave.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'deadTree',
            path: '../static/models/scene/DeadTree2.glb',
            type: 'GLTFLoader',
            castShadow: true,
        },
        {
            name: 'deadTree2',
            path: '../static/models/scene/DeadTree.glb',
            type: 'GLTFLoader',
            castShadow: true,
        },
        {
            name: 'postLantern',
            path: '../static/models/scene/PostLantern.glb',
            type: 'GLTFLoader',
            castShadow: true,
        },
        {
            name: 'grass',
            path: '../static/models/scene/Grass.glb',
            type: 'GLTFLoader'
        },
        {
            name: 'rockGrass',
            path: '../static/models/scene/RockGrass.glb',
            type: 'GLTFLoader'
        },
        {
            name: 'graveUnder',
            path: '../static/models/scene/GraveUnder.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'grave',
            path: '../static/models/scene/Grave.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'gravestone',
            path: '../static/models/scene/Gravestone.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'postWithSkull',
            path: '../static/models/scene/PostWithSkull.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'pumpkin',
            path: '../static/models/scene/Pumpkin.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'coffin',
            path: '../static/models/scene/Coffin.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'skull',
            path: '../static/models/scene/Skull.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'ribcage',
            path: '../static/models/scene/Ribcage.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'bone',
            path: '../static/models/scene/Bone.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'smallDeadTree',
            path: '../static/models/scene/SmallDeadTree.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'plaqueCandles',
            path: '../static/models/scene/PlaqueDeadCandles.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'shovel',
            path: '../static/models/scene/Shovel.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'lantern',
            path: '../static/models/scene/Lantern.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'fence',
            path: '../static/models/scene/Fence.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'fenceGate',
            path: '../static/models/scene/FenceGate.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'fenceBroken',
            path: '../static/models/scene/FenceBroken.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'path',
            path: '../static/models/scene/Path.glb',
            type: 'GLTFLoader'
        },
        {
            name: 'rockPathSmall',
            path: '../static/models/scene/RockPathSmall.glb',
            type: 'GLTFLoader'
        },
        {
            name: 'rockPathThin',
            path: '../static/models/scene/RockPathThin.glb',
            type: 'GLTFLoader'
        },
        {
            name: 'floorSmall',
            path: '../static/models/scene/FloorSmall.glb',
            type: 'GLTFLoader'
        },
        {
            name: 'cemetary',
            path: '../static/models/scene/Cemetary.glb',
            type: 'GLTFLoader'
        },
        {
            name: 'skeleton',
            path: '../static/models/Skeleton.glb',
            type: 'GLTFLoader',
            castShadow: false
        },
        {
            name: 'spider',
            path: '../static/models/Spider.glb',
            type: 'GLTFLoader',
            castShadow: false
        },
        {
            name: 'zombie',
            path: '../static/models/Zombie.glb',
            type: 'GLTFLoader',
            castShadow: false
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

                    if (source.castShadow) {
                        gltf.scene.traverse(obj => {
                            if (obj.isMesh) {
                                obj.castShadow = true;
                                obj.receiveShadow = true;
                            }
                        })
                    }

                    resources[source.name] = gltf;
                })
            }
        })
    }

    const get = (resourceName: string, opacity?: number) => {
        const resource = resources[resourceName];
        const resourceType = sources.find(s => s.name === resourceName)?.type
        if (resourceType === 'GLTFLoader') {

            const scene = clone(resource.scene);
            if (opacity) {
                scene.traverse((obj) => {
                    if (obj.isMesh) {
                        obj.material = obj.material.clone();
                        obj.material.transparent = true;
                        obj.material.opacity = opacity;
                    }
                })
            }

            return {
                scene,
                animations: resource.animations
            }
        }

        return resource;
    }

    return {
        load,
        get,
        isLoaded,
        resources,
    }
})
