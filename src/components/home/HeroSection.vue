<template>
  <div class="w-full h-screen flex items-center">
    <div
      class="h-screen flex flex-col justify-center text-white px-10 gap-8 max-w-4xl bg-gradient-to-r from-black to-transparent"
    >
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

    <canvas
      id="myCanvas"
      class="absolute w-full h-screen -z-50 bg-gradient-to-b from-cyan-500 to-white"
    />
    <ObjectController :scene="sceneManeger" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import * as THREE from 'three'
import { PlayIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'
import { Engine3d } from '@/libs/threejs/core/engine3d'
import { Bike3D } from '@/libs/threejs/objects/bike'
import { useSceneManager } from '@/composables/sceneManager'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { Terrain2 } from '@/libs/threejs/objects/terrain2'
import ObjectController from '../controllers/ObjectController.vue'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'

const sceneManeger = useSceneManager()

async function main(): Promise<void> {
  const canvas: HTMLElement | null = document.querySelector('#myCanvas')

  if (!canvas) {
    throw new Error('Canvas não encontrado')
  }

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true })
  renderer.setClearColor(0x000000, 0)
  renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  const camera = new THREE.PerspectiveCamera(
    45,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000,
  )
  camera.position.set(-0.398, 1.231, 2.385)
  camera.rotation.set(0.3, 0.0, 0.0)

  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(sceneManeger.scene, camera))
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5, // Strength (força do brilho)
    0.4, // Radius (raio do brilho)
    0.15, // Threshold (limiar de luminosidade)
  )
  composer.addPass(bloomPass)

  const engine = new Engine3d(canvas, sceneManeger.scene, renderer, camera, composer)

  engine.start()

  const gui = new GUI()

  const loader = new THREE.TextureLoader()
  const bgTexture = loader.load('landscape1.jpg')
  bgTexture.colorSpace = THREE.SRGBColorSpace
  sceneManeger.scene.background = bgTexture

  const color = 0x404040
  const intensity: number = 0.5
  const light = new THREE.AmbientLight(color, intensity)
  sceneManeger.add(light)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
  directionalLight.position.set(20, 20, 20)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  sceneManeger.scene.add(directionalLight)
  const folder1 = gui.addFolder('Directional Light')
  folder1.add(directionalLight, 'intensity', 0, 5)

  const rimLight = new THREE.SpotLight(0xffc9a9, 3, 10, Math.PI * 0.1)
  rimLight.position.set(0.866, 3.611, -1.18)
  rimLight.intensity = 20
  rimLight.penumbra = 0.5
  rimLight.decay = 2
  sceneManeger.add(rimLight)

  const rimLight2 = new THREE.SpotLight(0xc4ffa9, 3, 10, Math.PI * 0.1)
  rimLight2.position.set(-0.5, 1.87, 0)
  rimLight.intensity = 20
  rimLight2.penumbra = 0.5
  rimLight2.decay = 2
  sceneManeger.add(rimLight2)

  const bike = new Bike3D()
  bike.loadModel().then((model: THREE.Object3D) => {
    // model.position.set(0.9, -0.09, 0.2)
    // model.rotation.set(0, -2.7, 0)

    model.position.set(0.601, 1.87, -0.016)
    model.rotation.set(0, 3.6, 0)

    rimLight.target = model
    sceneManeger.add(rimLight.target)

    rimLight2.target = model
    sceneManeger.add(rimLight2.target)
    sceneManeger.add(model)
  })

  const t2 = new Terrain2()
  t2.loadModel().then((model: THREE.Object3D) => {
    model.position.set(0, 0.532, 0)
    model.scale.set(0.1, 0.1, 0.1)
    // model.rotation.set(0, -2.7, -0.2)

    sceneManeger.add(model)
  })

  // gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
  // gui.add(light, 'intensity', 0, 5, 0.01)
  // gui.add(rimLight.target.position, 'x', -10, 10)
  // gui.add(rimLight.target.position, 'z', -10, 10)
  // gui.add(rimLight.target.position, 'y', 0, 10)
}

onMounted(main)
</script>

<style scoped></style>
