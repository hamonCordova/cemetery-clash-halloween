<template>
  <primitive ref="enemyRef" :object="model" :position="[0, -10, 0]">
    <TresGroup
      :scale="[3, 3, 3]"
      :position="[0, 2.3, -0.1]"
      :rotation="[0, 1.6, 0]"
      v-if="!isDead && isSpawned"
    >
      <TresMesh>
        <TresPlaneGeometry :args="[0.4, 0.02, 1]" />
        <TresMeshBasicMaterial color="gray" :side="DoubleSide" :transparent="true" :opacity="0.6" />
      </TresMesh>
      <TresMesh ref="healthBarRef" :position-z="0.001">
        <TresPlaneGeometry :args="[0.4, 0.02, 1]" />
        <TresMeshBasicMaterial color="red" :side="DoubleSide" />
      </TresMesh>
    </TresGroup>
  </primitive>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, shallowRef, watch } from 'vue'
  import { useAnimations, Html } from '@tresjs/cientos'
  import {
    Mesh,
    Quaternion,
    Vector3,
    Vector2,
    SphereGeometry,
    MeshBasicMaterial,
    DoubleSide,
  } from 'three'
  import { useRenderLoop, useTresContext } from '@tresjs/core'
  import { SlimeAnimationEnum } from '../../enum/slime-animation.enum'
  import { LoopOnce } from 'three/src/constants'
  import gsap from 'gsap'
  import { useEventBus } from '@vueuse/core'
  import type { Enemy } from '@/components/BattleManager.vue'
  import useCharacter from '@/composable/useCharacter'
  import { EnemyTypeEnum } from '../../enum/enemy-type.enum'
  import { useResources } from '@/composable/useResources'
  import { usePlayer } from '@/composable/usePlayer'
  import { useEnemiesSpawned } from '@/composable/useEnemiesSpawned'
  import { useSounds } from '@/composable/useSounds'
  import { BattleLayersEnum } from '../../enum/battle-layers.enum'
  import GameAudioPlayer from '../../models/game-audio-player'
  import { throttle } from '@/utils/timeout-utils'

  const emit = defineEmits(['die'])
  const props = defineProps({
    config: {
      type: Object as Enemy,
    },
  })

  const isSpawned = ref(false)
  const resources = useResources()
  const { scene: model, animations } = resources.get('slime')
  const { actions } = useAnimations(animations, model)
  const { onLoop } = useRenderLoop()
  const { scene } = useTresContext()
  const sounds = useSounds()
  const enemyRef = shallowRef<Mesh>()
  const healthBarRef = shallowRef<Mesh>()
  const playerState = usePlayer()
  const enemiesState = useEnemiesSpawned()
  const enemyEventBus = useEventBus('enemyEventBus')
  const attackDistance = 2
  let isAttackingByDistance = false
  const { attack, die, idle, resetActions, isDead, isAttacking } = useCharacter(
    enemyRef,
    actions,
    {
      walk: SlimeAnimationEnum.Walk,
      idle: SlimeAnimationEnum.Idle,
      attack: SlimeAnimationEnum.Attack,
      die: SlimeAnimationEnum.Death,
    },
    () => attackConfig.value,
    {
      finishAttack: () => checkAttackHit(),
      onDie: () => {
        emit('die', { id: props.config?.enemyId, position: enemyStoreInstance.value?.position })
        enemiesState.removeEnemy(props.config?.enemyId)
      },
    }
  )

  const soundActions = {
    slide: sounds.createAudioPlayer(['slimeSlide'], model),
    death: sounds.createAudioPlayer(['slimeDeath'], model, 1),
    attack: sounds.createAudioPlayer(['slimeAttack'], model),
    hit: sounds.createAudioPlayer(['slimeHit'], model),
    hitReceived: sounds.createAudioPlayer(
      ['slimeHitReceived1', 'slimeHitReceived2', 'slimeHitReceived3'],
      model,
      1
    ),
  }

  const enemyStoreInstance = computed(() => {
    return enemiesState.enemies.value.find((e) => e.id === props.config?.enemyId)
  })

  const healthPercentage = computed(() => {
    const health = Math.max(0, enemyStoreInstance.value?.health || 0)
    const maxHealth = props.config?.health || 1
    return health / maxHealth
  })

  const attackConfig = computed(() => {
    return {
      nextAttackDelay: props.config?.attackDelay || 2000,
    }
  })

  onMounted(() => {})

  onLoop(({ delta }) => {
    if (playerState.isDead.value) {
      return
    }

    if (!isSpawned.value) {
      if (props.config) {
        followPlayerRotation(playerState.playerPosition.value, delta)
      }
      return
    }

    moveTowardsPlayer(delta)
  })

  const updateHealthBar = () => {
    if (healthBarRef.value) {
      const percentage = healthPercentage.value
      healthBarRef.value.scale.x = percentage
      healthBarRef.value.position.x = -0.2 * (1 - percentage)
    }
  }

  const listenEvents = () => {
    enemyEventBus.on((event, payload) => {
      if (event === 'die' && props.config?.enemyId === payload) {
        soundActions.death?.playRandom()
        die()
      }

      if (event === 'damageReceived' && props.config?.enemyId === payload) {
        updateHealthBar()
        soundActions.hitReceived?.playRandom()
      }
    })
  }

  const unspawnEnemy = () => {
    if (isDead.value) return
    isDead.value = true

    gsap.to(enemyRef.value.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: props.config?.moveSpeed || 4,
      ease: 'elastic.in',
      onComplete: () => {
        emit('die', { id: props.config?.enemyId, position: enemyStoreInstance.value?.position })
        enemiesState.removeEnemy(props.config?.enemyId)
      },
    })
  }

  const spawnEnemy = () => {
    isDead.value = false

    enemiesState.registerEnemy(
      props.config?.enemyId,
      props.config?.spawnPosition,
      props.config?.health,
      EnemyTypeEnum.SLIME
    )
    enemyRef.value.scale.set(0, 0, 0)
    enemyRef.value.position.set(
      props.config?.spawnPosition.x,
      props.config?.spawnPosition.y,
      props.config?.spawnPosition.z
    )

    idle()

    gsap.to(enemyRef.value.scale, {
      x: props.config?.scale || 1.5,
      y: props.config?.scale || 1.5,
      z: props.config?.scale || 1.5,
      duration: 1,
      ease: 'elastic.out',
      onComplete: () => (isSpawned.value = true),
    })
  }

  const reset = () => {
    isSpawned.value = false
    isAttackingByDistance = false
    enemyRef.value.position.set(0, -10, 0)
    enemyRef.value?.rotation.set(0, 0, 0)
    resetActions()
  }

  const followPlayerRotation = (targetPosition: Vector3, delta: number) => {
    const enemyPos = enemyRef.value.position
    const direction = new Vector3().subVectors(targetPosition, enemyPos).normalize()

    // Adjust targetAngle by subtracting Math.PI / 2
    const targetAngle = Math.atan2(direction.x, direction.z) - Math.PI / 2

    const enemyQuaternion = enemyRef.value.quaternion.clone()
    const targetQuaternion = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), targetAngle)

    const rotationSpeed = props.config?.rotationSpeed || 5
    enemyQuaternion.rotateTowards(targetQuaternion, delta * rotationSpeed)

    enemyRef.value.quaternion.copy(enemyQuaternion)
  }

  const checkAttackHit = () => {
    const enemyPos = enemyRef.value.position
    const enemyQuaternion = enemyRef.value.quaternion

    const playerPos = new Vector3().copy(playerState.playerPosition.value)

    const distance = enemyPos.distanceTo(playerPos)
    if (distance > attackDistance) {
      return // Player is out of range
    }

    // Adjusted forward vector to account for initial rotation
    const enemyForward = new Vector3(1, 0, 0).applyQuaternion(enemyQuaternion)
    const directionToPlayer = new Vector3().subVectors(playerPos, enemyPos).normalize()

    const dot = enemyForward.dot(directionToPlayer)

    const attackAngle = Math.cos(45 * (Math.PI / 180)) // 45 degrees

    if (dot > attackAngle) {
      // Player is within 45 degrees in front of enemy
      // Attack hits
      soundActions.hit?.playRandom()
      playerState.takeDamage(props.config?.damage) // or any function to apply damage
    }
  }

  function getBoundaryIntersectionPoint(
    start: Vector3,
    direction: Vector3,
    arenaSize: number
  ): Vector3 {
    const halfArenaSize = arenaSize / 2
    const tValues = []

    // X-axis boundaries
    if (direction.x !== 0) {
      const t1 = (-halfArenaSize - start.x) / direction.x
      const t2 = (halfArenaSize - start.x) / direction.x
      tValues.push(t1, t2)
    }

    // Z-axis boundaries
    if (direction.z !== 0) {
      const t3 = (-halfArenaSize - start.z) / direction.z
      const t4 = (halfArenaSize - start.z) / direction.z
      tValues.push(t3, t4)
    }

    // Positive t values (future intersection points)
    const positiveTValues = tValues.filter((t) => t > 0)

    // Smallest positive t (closest intersection)
    const minT = Math.min(...positiveTValues)

    // Intersection point calculation
    const intersectionPoint = new Vector3(
      start.x + direction.x * minT,
      start.y,
      start.z + direction.z * minT
    )

    return intersectionPoint
  }

  const longRangeAttack = () => {
    if (isAttackingByDistance || isDead.value) return
    isAttackingByDistance = true
    idle()

    const attackAction = actions[SlimeAnimationEnum.Attack]
    attackAction.setLoop(LoopOnce)
    attackAction.reset()
    attackAction.play()
    soundActions.attack?.playRandom()

    const attackDuration = (attackAction.getClip().duration / attackAction.timeScale) * 0.7

    // Flag to ensure only one damage application per attack
    let hasDealtDamage = false

    setTimeout(() => {
      idle()

      const slimePosition = enemyRef.value.position.clone()
      const playerPosition = playerState.playerPosition.value.clone()

      // Calculate direction vector
      const directionToPlayer = new Vector3().subVectors(playerPosition, slimePosition).normalize()

      // Calculate the target position on the arena boundary
      const arenaSize = 24 // Your arena is 24x24 units
      const targetPosition = getBoundaryIntersectionPoint(
        slimePosition,
        directionToPlayer,
        arenaSize
      )

      // Rotate enemy to face the target position
      followPlayerRotation(targetPosition, 0.016) // deltaTime ~0.016s for 60fps

      const tl = gsap.timeline({
        onUpdate: () => {
          // Collision detection
          const enemyPos = enemyRef.value.position
          const playerPos = playerState.playerPosition.value
          const collisionDistance = 1 // Adjust as needed

          const horizontalDistance = new Vector2(enemyPos.x, enemyPos.z).distanceTo(
            new Vector2(playerPos.x, playerPos.z)
          )

          const verticalDistance = Math.abs(enemyPos.y - playerPos.y)

          if (
            horizontalDistance <= collisionDistance &&
            verticalDistance <= 1 && // Adjust vertical tolerance as needed
            !hasDealtDamage
          ) {
            soundActions.hit?.playRandom()
            soundActions.attack?.playRandom()
            playerState.takeDamage(props.config?.damage)
            hasDealtDamage = true // Prevent further damage during this attack
          }

          // Trail effect
          if (!isDead.value) {
            soundActions.slide?.playRandom()
            createTrailEffect(enemyPos.clone())
          }
        },
        onComplete: () => {
          // Reset enemy position or other logic after attack completes
          setTimeout(() => {
            isAttackingByDistance = false
          }, props.config?.attackDelayLongRange || 4000)
        },
      })

      tl.to(
        enemyRef.value.position,
        {
          duration: props.config?.moveSpeed || 2,
          x: targetPosition.x,
          z: targetPosition.z,
          ease: 'power2.out',
        },
        0
      )
    }, attackDuration * 1000)
  }

  const createTrailEffect = throttle((position: Vector3) => {
    const geometry = new SphereGeometry(0.5, 8, 8) // Adjust size as needed
    const material = new MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    })
    const trailMesh = new Mesh(geometry, material)

    trailMesh.renderOrder = 9999
    trailMesh.position.copy(position)
    scene.value.add(trailMesh)

    gsap.to(trailMesh.material, {
      duration: 1.5,
      opacity: 0,
      onComplete: () => {
        scene.value.remove(trailMesh)
        trailMesh.geometry.dispose()
        trailMesh.material.dispose()
      },
    })
  }, 50)

  const moveTowardsPlayer = (delta: number) => {
    if (isDead.value) return

    if (enemyRef.value && playerState.playerPosition.value) {
      const enemyPos = enemyRef.value.position
      const playerPos = new Vector3().copy(playerState.playerPosition.value)
      playerPos.y = 0

      const distanceToPlayer = enemyPos.distanceTo(playerPos)

      followPlayerRotation(playerPos, delta)

      if (distanceToPlayer <= attackDistance && !isAttacking.value && !isDead.value) {
        soundActions.attack?.playRandom()
        attack()
        followPlayerRotation(playerPos, delta)
      }

      // Check if enemy is already performing a long-range attack
      if (!isAttackingByDistance) {
        longRangeAttack()
        idle()
      }

      // Update enemy position in the store
      enemiesState.updateEnemyPosition(props.config?.enemyId, enemyPos)
    }
  }

  watch(
    () => props.config,
    (config) => {
      if (!config) {
        reset()
        return
      }

      setTimeout(() => {
        spawnEnemy()
        listenEvents()
      }, props.config?.spawnDelay || 0)
    }
  )

  watch(
    () => playerState.isDead.value,
    (isPlayerDead: boolean) => {
      if (isPlayerDead) {
        unspawnEnemy()
      }
    }
  )
</script>
