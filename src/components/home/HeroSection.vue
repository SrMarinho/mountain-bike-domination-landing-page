<template>
  <div class="w-full h-screen flex items-center">
    <div
      class="w-full h-screen fixed bg-black text-white flex justify-center items-center z-50"
      v-if="isLoading"
    >
      Loading...
    </div>
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

    <canvas id="myCanvas" class="absolute w-full h-screen -z-50 bg-black" />
    <ObjectController :scene="sceneManager" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
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
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Downhiller } from '@/libs/threejs/objects/downhiller'

const isLoading = ref(true)
const loadingProgress = ref(0)

const sceneManager = useSceneManager()

async function main(): Promise<void> {
  try {
    const canvas: HTMLCanvasElement | null = document.querySelector('#myCanvas')

    if (!canvas) {
      throw new Error('Canvas não encontrado')
    }

    isLoading.value = true
    loadingProgress.value = 0

    const loadPromises: Promise<any>[] = []

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setClearColor(0x000000, 0)
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    const camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000,
    )
    camera.name = 'camera'

    camera.position.set(-0.398, 1.231, 2.385)
    // camera.rotation.set(0.3, 0.0, 0.0)

    sceneManager.add(camera)

    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(sceneManager.scene, camera))
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, // Strength (força do brilho)
      0.5, // Radius (raio do brilho)
      0.15, // Threshold (limiar de luminosidade)
    )
    composer.addPass(bloomPass)

    const controls = new OrbitControls(camera, canvas)
    controls.listenToKeyEvents(window)
    // controls.enablePan = false
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.screenSpacePanning = false
    // controls.minDistance = 0
    // controls.maxDistance = 3
    controls.maxPolarAngle = Math.PI

    controls.target.set(0, 10, 0)

    const engine = new Engine3d(canvas, sceneManager.scene, renderer, camera, composer, controls)

    engine.start()

    const gui = new GUI()

    const loader = new THREE.TextureLoader()
    const bgTexture = loader.load('landscape1.jpg')
    bgTexture.colorSpace = THREE.SRGBColorSpace
    sceneManager.scene.background = bgTexture

    const objectLayer = new THREE.Layers()
    objectLayer.set(1)

    const width = 10
    const height = 5
    const widthSegments = 100
    const heightSegments = 20
    const geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments)

    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load('sky_bg.jpg')

    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(1, 1) // Repetir 2x em cada direção

    const material = new THREE.MeshStandardMaterial({
      map: texture, // Textura principal
      side: THREE.DoubleSide,
      // flatShading: true, // Remova para textura suave
      normalMap: textureLoader.load('sky_bg.jpg'), // Opcional
      color: 0xffffff,
    })

    const bgImglight = new THREE.AmbientLight(0xffffff, 1)
    bgImglight.layers.set(1)
    sceneManager.add(bgImglight)

    const curvedPlane = new THREE.Mesh(geometry, material)
    curvedPlane.layers.set(1)
    sceneManager.add(curvedPlane)
    curvedPlane.position.set(0, 4.6, -4.02)
    curvedPlane.rotation.set(0.26, 0, 0)
    curvedPlane.scale.set(3, 3, 3)
    gui.add(curvedPlane.scale, 'x', 0, 100)
    gui.add(curvedPlane.scale, 'y', 0, 100)
    gui.add(curvedPlane.scale, 'z', 0, 100)

    gui.add(curvedPlane.position, 'x', -100, 100)
    gui.add(curvedPlane.position, 'y', -100, 100)
    gui.add(curvedPlane.position, 'z', -100, 100)

    gui.add(curvedPlane.rotation, 'x', -10, 10)
    gui.add(curvedPlane.rotation, 'y', -10, 10)
    gui.add(curvedPlane.rotation, 'z', -10, 10)
    sceneManager.add(curvedPlane)

    const color = 0x404040
    const intensity: number = 0.4
    const light = new THREE.AmbientLight(color, intensity)
    sceneManager.add(light)

    const mainLight = new THREE.SpotLight(0xffffff, 10, 0, Math.PI * 0.022)
    mainLight.position.set(10, 10, 10)
    mainLight.penumbra = 0.5
    mainLight.decay = 1
    mainLight.castShadow = true
    mainLight.name = 'main_light'
    sceneManager.add(mainLight)

    const rimLight = new THREE.SpotLight(0xffc9a9, 3, 10, Math.PI * 0.1)
    rimLight.position.set(0.866, 3.611, -1.18)
    rimLight.intensity = 20
    rimLight.penumbra = 0.5
    rimLight.decay = 2
    rimLight.castShadow = true
    rimLight.name = 'rim_light'
    sceneManager.add(rimLight)

    const rimLight2 = new THREE.SpotLight(0xffffff, 3, 10, Math.PI * 0.1)
    rimLight2.position.set(-0.5, 1.87, 0)
    rimLight.intensity = 20
    rimLight2.penumbra = 0.5
    rimLight2.decay = 2
    rimLight2.castShadow = true
    rimLight2.name = 'rim_light2'
    sceneManager.add(rimLight2)

    const bike = new Bike3D()
    const bikePromise = bike.loadModel().then((model: THREE.Object3D) => {
      // model.position.set(0.9, -0.09, 0.2)
      // model.rotation.set(0, -2.7, 0)

      model.position.set(0.3, 1.87, -0.016)
      model.rotation.set(0, 3.6, 0)

      mainLight.target = model
      sceneManager.add(mainLight.target)

      rimLight.target = model
      sceneManager.add(rimLight.target)

      rimLight2.target = model
      sceneManager.add(rimLight2.target)

      //shadows
      model.castShadow = true

      controls.target.set(model.position.x - 1, model.position.y, model.position.z)
      controls.update()

      sceneManager.add(model)

      loadingProgress.value += 25
    })
    loadPromises.push(bikePromise)

    const t2 = new Terrain2()
    const terrain2Promise = t2.loadModel().then((model: THREE.Object3D) => {
      model.position.set(0, 0.532, 0)
      model.scale.set(0.1, 0.1, 0.1)
      // model.rotation.set(0, -2.7, -0.2)
      model.receiveShadow = true
      sceneManager.add(model)
    })
    loadPromises.push(terrain2Promise)

    // const downhiller = new Downhiller()
    // downhiller.loadModel().then((model: THREE.Object3D) => {
    //   model.position.set(0.4, 2.245, 0.2)
    //   model.rotation.set(0, -0.4, 0)
    //   model.castShadow = true
    //   sceneManager.add(model)
    // })

    const axesHelper = new THREE.AxesHelper(5)
    // sceneManager.scene.add(axesHelper)

    const gridHelper = new THREE.GridHelper(100, 100)
    // sceneManager.scene.add(gridHelper)

    gui.hide()
    // gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
    // gui.add(light, 'intensity', 0, 5, 0.01)
    // gui.add(rimLight.target.position, 'x', -10, 10)
    // gui.add(rimLight.target.position, 'z', -10, 10)
    // gui.add(rimLight.target.position, 'y', 0, 10)
    await Promise.all(loadPromises)
    loadingProgress.value = 100

    // Esconder loading e mostrar cena
    isLoading.value = false

    onUnmounted(() => {
      gui.destroy()
    })
  } catch (error) {
    console.error('Erro ao carregar cena:', error)
  }
}

onMounted(main)
</script>

<style scoped></style>
