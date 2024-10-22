import {createGlobalState, useEventBus} from "@vueuse/core";
import {Audio, AudioListener, AudioLoader, ImageLoader, LoadingManager, MeshBasicMaterial, TextureLoader} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {ref} from "vue";
import {useAnimations} from "@tresjs/cientos";
import {clone} from "three/examples/jsm/utils/SkeletonUtils";

export const useResources = createGlobalState(() => {

    const isLoaded = ref(false);
    let resources = {};

    const sources = [
        {
            name: 'blackSmoke',
            path: '/img/blackSmoke00.png',
            type: 'TextureLoader'
        },
        {
            name: 'moon',
            path: '/models/scene/Moon.glb',
            type: 'GLTFLoader'
        },
        {
            name: 'candles',
            path: '/models/scene/Candles.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'cobweb',
            path: '/models/scene/Cobweb.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'crypt',
            path: '/models/scene/Crypt.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'damagedGrave',
            path: '/models/scene/DamagedGrave.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'deadTree',
            path: '/models/scene/DeadTree2.glb',
            type: 'GLTFLoader',
            castShadow: true,
        },
        {
            name: 'deadTree2',
            path: '/models/scene/DeadTree.glb',
            type: 'GLTFLoader',
            castShadow: true,
        },
        {
            name: 'postLantern',
            path: '/models/scene/PostLantern.glb',
            type: 'GLTFLoader',
            castShadow: true,
        },
        {
            name: 'grass',
            path: '/models/scene/Grass.glb',
            type: 'GLTFLoader'
        },
        {
            name: 'rockGrass',
            path: '/models/scene/RockGrass.glb',
            type: 'GLTFLoader'
        },
        {
            name: 'graveUnder',
            path: '/models/scene/GraveUnder.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'grave',
            path: '/models/scene/Grave.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'gravestone',
            path: '/models/scene/Gravestone.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'postWithSkull',
            path: '/models/scene/PostWithSkull.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'pumpkin',
            path: '/models/scene/Pumpkin.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'coffin',
            path: '/models/scene/Coffin.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'coffin2',
            path: '/models/scene/Coffin2.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'skull',
            path: '/models/scene/Skull.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'ribcage',
            path: '/models/scene/Ribcage.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'bone',
            path: '/models/scene/Bone.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'graveMarker',
            path: '/models/scene/Gravemarker.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'smallDeadTree',
            path: '/models/scene/SmallDeadTree.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'plaqueCandles',
            path: '/models/scene/PlaqueCandles.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'shovel',
            path: '/models/scene/Shovel.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'lantern',
            path: '/models/scene/Lantern.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'fence',
            path: '/models/scene/Fence.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'fenceGate',
            path: '/models/scene/FenceGate.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'fenceBroken',
            path: '/models/scene/FenceBroken.glb',
            type: 'GLTFLoader',
            castShadow: true
        },
        {
            name: 'path',
            path: '/models/scene/Path.glb',
            type: 'GLTFLoader'
        },
        {
            name: 'rockPathSmall',
            path: '/models/scene/RockPathSmall.glb',
            type: 'GLTFLoader'
        },
        {
            name: 'rockPathThin',
            path: '/models/scene/RockPathThin.glb',
            type: 'GLTFLoader'
        },
        {
            name: 'floorSmall',
            path: '/models/scene/FloorSmall.glb',
            type: 'GLTFLoader'
        },
        {
            name: 'cemetary',
            path: '/models/scene/Cemetary.glb',
            type: 'GLTFLoader'
        },
        {
            name: 'skeleton',
            path: '/models/Skeleton.glb',
            type: 'GLTFLoader',
            castShadow: false
        },
        {
            name: 'spider',
            path: '/models/Spider.glb',
            type: 'GLTFLoader',
            castShadow: false
        },
        {
            name: 'zombie',
            path: '/models/Zombie.glb',
            type: 'GLTFLoader',
            castShadow: false
        },
        {
            name: 'slime',
            path: '/models/Slime.glb',
            type: 'GLTFLoader',
            castShadow: false
        },
        {
            name: 'bloodSplate',
            path: '/models/BloodSplat.glb',
            type: 'GLTFLoader'
        },
        //Audios
        {
            name: 'themeMusic',
            path: '/sounds/music/halloween_music.mp3',
            type: 'AudioLoader'
        },
        {
            name: 'evilLaugh',
            path: '/sounds/voices/evil_laugh.wav',
            type: 'AudioLoader'
        },
        {
            name: 'round1',
            path: '/sounds/voices/round_1.ogg',
            type: 'AudioLoader'
        },
        {
            name: 'round2',
            path: '/sounds/voices/round_2.ogg',
            type: 'AudioLoader'
        },
        {
            name: 'round3',
            path: '/sounds/voices/round_3.ogg',
            type: 'AudioLoader'
        },
        {
            name: 'finalRound',
            path: '/sounds/voices/final_round.ogg',
            type: 'AudioLoader'
        },
        {
            name: 'swordSwing1',
            path: '/sounds/sword-swing/sword_swing_1.wav',
            type: 'AudioLoader'
        },
        {
            name: 'swordSwing2',
            path: '/sounds/sword-swing/sword_swing_2.wav',
            type: 'AudioLoader'
        },
        {
            name: 'swordSwing3',
            path: '/sounds/sword-swing/sword_swing_3.wav',
            type: 'AudioLoader'
        },
        {
            name: 'swordSwing4',
            path: '/sounds/sword-swing/sword_swing_4.wav',
            type: 'AudioLoader'
        },
        {
            name: 'slimeDeath',
            path: '/sounds/slime/slime_death.wav',
            type: 'AudioLoader'
        },
        {
            name: 'slimeSlide',
            path: '/sounds/slime/slime_slide.wav',
            type: 'AudioLoader'
        },
        {
            name: 'slimeHitReceived1',
            path: '/sounds/slime/slime_hitreceived_1.wav',
            type: 'AudioLoader'
        },
        {
            name: 'slimeHitReceived2',
            path: '/sounds/slime/slime_hitreceived_2.wav',
            type: 'AudioLoader'
        },
        {
            name: 'slimeHitReceived3',
            path: '/sounds/slime/slime_hitreceived_3.wav',
            type: 'AudioLoader'
        },
        {
            name: 'slimeHit',
            path: '/sounds/slime/slime_hit.wav',
            type: 'AudioLoader'
        },
        {
            name: 'slimeAttack',
            path: '/sounds/slime/slime_attack.wav',
            type: 'AudioLoader'
        },
        {
            name: 'skeletonPlayerDeath',
            path: '/sounds/skeleton/skeleton_player_death.ogg',
            type: 'AudioLoader'
        },
        {
            name: 'skeletonSteps1',
            path: '/sounds/skeleton/skeleton_steps_1.wav',
            type: 'AudioLoader'
        },
        {
            name: 'skeletonSteps2',
            path: '/sounds/skeleton/skeleton_steps_2.wav',
            type: 'AudioLoader'
        },
        {
            name: 'skeletonSteps3',
            path: '/sounds/skeleton/skeleton_steps_3.wav',
            type: 'AudioLoader'
        },
        {
            name: 'skeletonSteps4',
            path: '/sounds/skeleton/skeleton_steps_4.wav',
            type: 'AudioLoader'
        },
        {
            name: 'skeletonSteps5',
            path: '/sounds/skeleton/skeleton_steps_5.wav',
            type: 'AudioLoader'
        },
        {
            name: 'skeletonSteps6',
            path: '/sounds/skeleton/skeleton_steps_6.wav',
            type: 'AudioLoader'
        },
        {
            name: 'skeletonJump',
            path: '/sounds/skeleton/skeleton_jump.wav',
            type: 'AudioLoader'
        },
        {
            name: 'skeletonJump',
            path: '/sounds/skeleton/skeleton_jump.wav',
            type: 'AudioLoader'
        },
        {
            name: 'skeletonHitReceived1',
            path: '/sounds/skeleton/skeleton_hit_received_1.ogg',
            type: 'AudioLoader'
        },
        {
            name: 'skeletonHitReceived2',
            path: '/sounds/skeleton/skeleton_hit_received_2.ogg',
            type: 'AudioLoader'
        },
        {
            name: 'skeletonHitReceived3',
            path: '/sounds/skeleton/skeleton_hit_received_3.ogg',
            type: 'AudioLoader'
        },
        {
            name: 'skeletonHitReceived4',
            path: '/sounds/skeleton/skeleton_hit_received_4.ogg',
            type: 'AudioLoader'
        },
        {
            name: 'skeletonEnemyHit1',
            path: '/sounds/skeleton/skeleton_enemy_hit_1.wav',
            type: 'AudioLoader'
        },
        {
            name: 'skeletonEnemyHit2',
            path: '/sounds/skeleton/skeleton_enemy_hit_2.wav',
            type: 'AudioLoader'
        },
        {
            name: 'skeletonEnemyHit3',
            path: '/sounds/skeleton/skeleton_enemy_hit_3.wav',
            type: 'AudioLoader'
        },
        {
            name: 'skeletonDeath',
            path: '/sounds/skeleton/skeleton_death.wav',
            type: 'AudioLoader'
        },
        {
            name: 'skeletonEnemySwordSwing1',
            path: '/sounds/skeleton/skeleton_enemy_sword_swing_1.wav',
            type: 'AudioLoader'
        },
        {
            name: 'skeletonEnemySwordSwing2',
            path: '/sounds/skeleton/skeleton_enemy_sword_swing_2.wav',
            type: 'AudioLoader'
        },
        {
            name: 'zombieDeath',
            path: '/sounds/zombie/zombie_death.wav',
            type: 'AudioLoader'
        },
        {
            name: 'zombieGurgle1',
            path: '/sounds/zombie/zombie_gurgle_1.wav',
            type: 'AudioLoader'
        },
        {
            name: 'zombieGurgle2',
            path: '/sounds/zombie/zombie_gurgle_2.wav',
            type: 'AudioLoader'
        },
        {
            name: 'zombieHitReceived1',
            path: '/sounds/zombie/zombie_hit_received_1.wav',
            type: 'AudioLoader'
        },
        {
            name: 'zombieHitReceived2',
            path: '/sounds/zombie/zombie_hit_received_2.wav',
            type: 'AudioLoader'
        },
        {
            name: 'zombieHitReceived3',
            path: '/sounds/zombie/zombie_hit_received_3.wav',
            type: 'AudioLoader'
        },
        {
            name: 'spiderAttack',
            path: '/sounds/spider/spider_attack.wav',
            type: 'AudioLoader'
        },
        {
            name: 'spiderBallSplash',
            path: '/sounds/spider/spider_ball_splash.wav',
            type: 'AudioLoader'
        },
        {
            name: 'spiderDeath',
            path: '/sounds/spider/spider_death.wav',
            type: 'AudioLoader'
        },
        {
            name: 'spiderHitReceived1',
            path: '/sounds/spider/spider_hit_received_1.wav',
            type: 'AudioLoader'
        },
        {
            name: 'spiderHitReceived2',
            path: '/sounds/spider/spider_hit_received_2.wav',
            type: 'AudioLoader'
        },
        {
            name: 'spiderHitReceived3',
            path: '/sounds/spider/spider_hit_received_3.wav',
            type: 'AudioLoader'
        },
        {
            name: 'spiderHitReceived4',
            path: '/sounds/spider/spider_hit_received_4.wav',
            type: 'AudioLoader'
        }
    ];

    const load = (onLoad: () => void, onProgress: (total: number) => void) => {

        const totalSources = sources.length;

        const loadingManager = new LoadingManager(() => {
            if (onLoad) onLoad();
            isLoaded.value = true;
        }, () => {
            const totalLoaded = Object.keys(resources).length
            if (onProgress) onProgress((totalLoaded / totalSources) * 100);
        }, (url) => {
            console.error(url)
        })

        const gltfLoader = new GLTFLoader(loadingManager);
        const audioLoader = new AudioLoader(loadingManager);
        const textureLoader = new TextureLoader(loadingManager);

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

            if (source.type === 'AudioLoader') {
                audioLoader.load(source.path, (buffer) => {
                    resources[source.name] = buffer;
                })
            }

            if (source.type === 'TextureLoader') {
                textureLoader.load(source.path, (img) => {
                    resources[source.name] = img;
                })
            }


        })
    }

    const get = (resourceName: string, opacity?: number) => {
        const resource = resources[resourceName];
        const resourceType = sources.find(s => s.name === resourceName)?.type
        if (resourceType === 'GLTFLoader') {

            const scene = clone(resource.scene);
            scene.traverse((obj) => {
                if (obj.isMesh) {
                    obj.material = obj.material.clone();
                    if (opacity) {
                        obj.material.transparent = true;
                        obj.material.opacity = opacity;
                    }
                }
            })

            return {
                scene,
                animations: resource.animations
            }
        }

        return resource;
    }

    const getAudio = (name: string, listener: AudioListener) => {
        const resource = resources[name];
        const resourceType = sources.find(s => s.name === name)?.type

        if (resourceType !== 'AudioLoader') return;

        if (!listener) {
            return resource;
        }

        const audio = new Audio(listener);
        audio.setBuffer(resource);

        return audio;
    }

    return {
        load,
        get,
        getAudio,
        isLoaded,
        resources,
    }
})
