<template>
  <div class="w-full h-screen flex items-center">
    <div class="flex flex-col text-white px-10 gap-8 max-w-4xl">
      <h1 class="flex flex-col text-6xl md:text-8xl font-bold">
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400"
          >DOWNHILL</span
        >
        <span class="text-white">DOMINATION</span>
      </h1>
      <h2 class="text-2xl text-gray-300">
        Where skill meets the mountain. Experience the ultimate adrenaline rush as you conquer
        technical trails and defy gravity
      </h2>
      <div class="flex gap-4">
        <button
          class="flex gap-2 bg-cyan-400 py-4 px-8 font-bold text-xl rounded-lg bg-gradient-to-r from-cyan-600 to-green-600 hover:from-cyan-500 hover:to-green-500 hover:shadow-cyan-400/30 hover:shadow-lg duration-200 hover:scale-105"
        >
          <PlayIcon class="w-6" />
          Watch Demo
        </button>
        <button
          class="py-4 px-10 text-cyan-400 font-bold text-xl border-cyan-400 border-solid border-2 rounded-lg hover:bg-cyan-400 hover:text-black duration-200 hover:scale-105"
        >
          Explore trails
        </button>
      </div>
      <div class="flex w-full justify-around">
        <div>
          <p class="text-cyan-400 text-3xl font-bold">50+</p>
          <p class="text-gray-400">Trails</p>
        </div>

        <div>
          <p class="text-green-400 text-3xl font-bold">2000m</p>
          <p class="text-gray-400">Vertical Drop</p>
        </div>

        <div>
          <p class="text-orange-400 text-3xl font-bold">80km/h</p>
          <p class="text-gray-400">Top Speed</p>
        </div>
      </div>
    </div>

    <ChevronDownIcon
      class="w-6 absolute left-6/12 bottom-0 -translate-x-6/12 -translate-y-8 text-cyan-400 brightness-200"
    />

    <canvas id="myCanvas" class="absolute w-full h-screen -z-50" />

    <ObjectController :scene="sceneManeger" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import * as THREE from 'three'
import { PlayIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'
import { Engine3d } from '@/libs/threejs/core/engine3d'
import { Bike3D } from '@/libs/threejs/objects/bike'
import { Terrain1 } from '@/libs/threejs/objects/terrain1'
import ObjectController from '../controllers/ObjectController.vue'
import { useSceneManager } from '@/composables/sceneManager'

const sceneManeger = useSceneManager()

async function main(): Promise<void> {
  const canvas: HTMLElement | null = document.querySelector('#myCanvas')

  if (!canvas) {
    throw new Error('Canvas não encontrado')
  }

  const renderer = new THREE.WebGLRenderer({ canvas: canvas })
  renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  const camera = new THREE.PerspectiveCamera(
    90,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000,
  )

  const engine = new Engine3d(canvas, sceneManeger.scene, renderer, camera)

  engine.start()

  camera.position.z = 1

  const loader = new THREE.TextureLoader()
  const bgTexture = loader.load('trail1.webp')
  bgTexture.colorSpace = THREE.SRGBColorSpace
  // scene.background = bgTexture

  const color = 0xffffff
  const intensity = 1
  const light = new THREE.AmbientLight(color, intensity)
  sceneManeger.add(light)

  const bike = new Bike3D()
  bike.loadModel().then((model: THREE.Group) => {
    sceneManeger.add(model)
  })

  const terrain1 = new Terrain1()

  terrain1.loadModel().then((model: THREE.Group) => {
    model.position.x = 3
    model.position.y = -4
    sceneManeger.add(model)
  })
}

onMounted(main)
</script>

<style scoped></style>
