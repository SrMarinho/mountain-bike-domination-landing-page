<template>
  <div class="w-full h-screen flex items-center m-0 border-0">
    <div
      class="w-full h-screen fixed bg-black text-white flex justify-center items-center z-50"
      v-if="isLoading"
    >
      Loading: {{ Math.round(loadingProgress) }}%
    </div>
    <div
      class="w-full h-screen fixed bg-black text-white flex flex-col justify-center items-center gap-4 z-50"
      v-if="loadError"
    >
      <p class="text-red-400 text-xl font-bold">Falha ao carregar a cena 3D</p>
      <button
        class="px-6 py-2 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black duration-200"
        @click="initScene"
      >
        Tentar novamente
      </button>
    </div>
    <div
      class="container sm:w-full h-screen flex flex-col justify-center items-center text-white sm:px-0 md:px-4 lg:px-8 gap-8 max-w-4xl bg-gradient-to-r from-black to-transparent"
    >
      <h1 class="flex flex-col text-6xl md:text-8xl font-bold">
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400"
          >DOWNHILL</span
        >
        <span class="text-white">DOMINATION</span>
      </h1>
      <h2 class="max-w-2xl text-2xl text-gray-300">
        Where skill meets the mountain. Experience the ultimate adrenaline rush as you conquer
        technical trails and defy gravity
      </h2>
      <div class="flex gap-4">
        <button
          class="flex justify-center items-center gap-2 bg-cyan-400 py-4 px-8 sm:px-2 sm:py-1 font-bold text-xl rounded-lg bg-gradient-to-r from-cyan-600 to-green-600 hover:from-cyan-500 hover:to-green-500 hover:shadow-cyan-400/30 hover:shadow-lg duration-200 hover:scale-105"
        >
          <PlayIcon class="w-6" />
          Watch Demo
        </button>
        <button
          class="flex justify-center items-center py-4 px-10 text-cyan-400 font-bold text-xl border-cyan-400 border-solid border-2 rounded-lg hover:bg-cyan-400 hover:text-black duration-200 hover:scale-105"
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Engine3d } from '@/libs/threejs/core/engine3d'
import { Bike3D } from '@/libs/threejs/objects/bike'
import { Terrain2 } from '@/libs/threejs/objects/terrain2'
import { useSceneManager } from '@/composables/sceneManager'
import { PlayIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'
import gsap from 'gsap'

const isLoading = ref(true)
const loadingProgress = ref(0)
const loadError = ref(false)
const sceneManager = useSceneManager()

let canvas: HTMLCanvasElement | null
let renderer: THREE.WebGLRenderer
let camera: THREE.PerspectiveCamera
let controls: OrbitControls
let engine: Engine3d | null = null

let gui: GUI

let mainLight: THREE.SpotLight

let mouseMoveListener: ((e: MouseEvent) => void) | null = null
let deviceOrientationListener: ((e: DeviceOrientationEvent) => void) | null = null
let resizeListener: (() => void) | null = null

// Configurações
const sceneConfig = {
  canvasId: 'myCanvas',
  camera: {
    position: new THREE.Vector3(-0.398, 1.231, 1.7),
    fov: 60,
  },
  bloomParams: {
    strength: 1.5,
    radius: 0.5,
    threshold: 0.15,
  },
  controlsTarget: new THREE.Vector3(0, 0, 0),
}

// Inicialização principal
async function initScene() {
  loadError.value = false
  isLoading.value = true
  loadingProgress.value = 0

  try {
    const base = setupBaseScene()
    canvas = base.canvas
    renderer = base.renderer
    camera = base.camera

    engine = new Engine3d(canvas, renderer, camera)
    engine.start()

    gui = new GUI()

    await loadAssets(gui)

    isLoading.value = false
    loadingProgress.value = 100

    cameraAnimation(camera)

    let lastMouseTime = 0
    mouseMoveListener = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastMouseTime < 16) return
      lastMouseTime = now
      mouseHandler(e, canvas!, controls)
    }
    document.addEventListener('mousemove', mouseMoveListener)

    deviceOrientationListener = (e: DeviceOrientationEvent) => {
      gyroscopeHandler(e, canvas!, controls)
    }
    window.addEventListener('deviceorientation', deviceOrientationListener, { passive: true })

    resizeListener = () => resizeHandler(canvas!, camera, controls)
    window.addEventListener('resize', resizeListener)
    resizeHandler(canvas!, camera, controls)

    setupGuiControls('camera', gui, camera)
    gui.show(false)
  } catch (error) {
    console.error('Erro ao inicializar cena:', error)
    isLoading.value = false
    loadError.value = true
  }
}

// Configuração da cena base
function setupBaseScene() {
  canvas = document.querySelector(`#${sceneConfig.canvasId}`)
  if (!canvas) throw new Error('Canvas não encontrado')

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  })
  renderer.setClearColor(0x000000, 0)
  renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  // Câmera
  camera = new THREE.PerspectiveCamera(
    sceneConfig.camera.fov,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000,
  )
  camera.name = 'camera'
  camera.position.copy(sceneConfig.camera.position)
  sceneManager.add(camera)

  // Controles
  controls = new OrbitControls(camera, canvas)
  controls.listenToKeyEvents(window)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.screenSpacePanning = false
  controls.maxPolarAngle = Math.PI
  controls.target.copy(sceneConfig.controlsTarget)
  // controls.autoRotate = true
  controls.keys = {
    LEFT: '',
    UP: '',
    BOTTOM: '',
    RIGHT: '',
  }

  return { canvas, renderer, camera }
}

// Carregamento de assets
async function loadAssets(gui: GUI) {
  const loadPromises: Promise<void>[] = []
  const totalAssets = 4 // Ajuste conforme necessário
  const progressIncrement = 100 / totalAssets

  // Background
  loadPromises.push(
    new Promise<void>((resolve) => {
      const loader = new THREE.TextureLoader()
      loader.load(
        'landscape1.jpg',
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace
          sceneManager.scene.background = texture
          loadingProgress.value += progressIncrement
          resolve()
        },
        undefined,
        (err) => {
          console.error('Falha ao carregar background:', err)
          loadingProgress.value += progressIncrement
          resolve()
        },
      )
    }),
  )

  // Bike
  const bike = new Bike3D()
  loadPromises.push(
    bike.loadModel().then((model: THREE.Object3D) => {
      model.position.set(0.3, 1.87, -0.016)
      model.rotation.set(-0.1, 3.6, 0)
      model.castShadow = true
      // controls.target.set(model.position.x - 1, model.position.y, model.position.z)
      sceneManager.add(model)
      const objTarget = new THREE.Object3D()
      objTarget.position.set(0, 2, 1)
      mainLight.target = objTarget
      loadingProgress.value += progressIncrement
    }),
  )

  // Terrain
  const terrain = new Terrain2()
  loadPromises.push(
    terrain.loadModel().then((model) => {
      model.position.set(0, 0.532, 0)
      model.scale.set(0.1, 0.1, 0.1)
      model.receiveShadow = true
      sceneManager.add(model)
      loadingProgress.value += progressIncrement
    }),
  )

  // Curved Plane
  loadPromises.push(
    new Promise((resolve) => {
      const geometry = new THREE.PlaneGeometry(10, 5, 100, 20)
      const textureLoader = new THREE.TextureLoader()

      textureLoader.load(
        'sky_bg.jpg',
        (texture) => {
          texture.wrapS = THREE.RepeatWrapping
          texture.wrapT = THREE.RepeatWrapping
          texture.repeat.set(1, 1)

          const material = new THREE.MeshStandardMaterial({
            map: texture,
            side: THREE.DoubleSide,
            normalMap: texture,
            color: 0xffffff,
          })

          const curvedPlane = new THREE.Mesh(geometry, material)
          curvedPlane.position.set(0, 4.6, -4.02)
          curvedPlane.rotation.set(0.26, 0, 0)
          curvedPlane.scale.set(3, 3, 3)
          // sceneManager.add(curvedPlane)

          loadingProgress.value += progressIncrement
          resolve()
        },
        undefined,
        (err) => {
          console.error('Falha ao carregar sky_bg:', err)
          loadingProgress.value += progressIncrement
          resolve()
        },
      )
    }),
  )

  // Luzes
  setupLights()

  await Promise.all(loadPromises)
}

// Configuração de luzes
function setupLights() {
  // Luz ambiente
  const ambientLight = new THREE.AmbientLight(0x404040, 0.1)
  sceneManager.add(ambientLight)

  // Luz principal
  mainLight = new THREE.SpotLight(0xffffff, 2, 0, Math.PI * 0.08)
  mainLight.position.set(3, -5.8, 3)
  mainLight.penumbra = 0.5
  mainLight.decay = 1
  mainLight.castShadow = true
  mainLight.name = 'main_light'
  sceneManager.add(mainLight)

  const mainLightTarget = new THREE.Object3D()
  mainLightTarget.position.set(1.2, 2, 1)
  mainLight.target = mainLightTarget

  const mainLghtHelper = new THREE.SpotLightHelper(mainLight)
  // sceneManager.scene.add(mainLghtHelper)

  const rimLight = new THREE.SpotLight(0xffc9a9, 20, 4, Math.PI * 0.14)
  rimLight.position.set(0.866, 3.611, -1.18)
  const objTarget = new THREE.Object3D()
  objTarget.position.set(0, 0, 1)
  rimLight.target = objTarget
  rimLight.penumbra = 0.5
  rimLight.decay = 2
  rimLight.castShadow = true

  const rimLight2 = new THREE.SpotLight(0xffffff, 20, 6, Math.PI * 0.05)
  rimLight2.position.set(0, 1.5, -3)
  const objTarget2 = new THREE.Object3D()
  objTarget2.position.set(0, 1.5, 1)
  rimLight2.target = objTarget2
  rimLight2.penumbra = 0.5
  rimLight2.decay = 2
  rimLight2.castShadow = true

  const lightHelper = new THREE.SpotLightHelper(rimLight2)
  // sceneManager.add(lightHelper)

  sceneManager.add(rimLight)
  sceneManager.add(rimLight2)
}

// Controles GUI
function setupGuiControls(name: string, gui: GUI, object: THREE.Object3D) {
  const folder = gui.addFolder(name)
  folder.add(object.scale, 'x', 0, 100).name('Escala X')
  folder.add(object.scale, 'y', 0, 100).name('Escala Y')
  folder.add(object.scale, 'z', 0, 100).name('Escala Z')

  folder.add(object.position, 'x', -100, 100).name('Posição X')
  folder.add(object.position, 'y', -100, 100).name('Posição Y')
  folder.add(object.position, 'z', -100, 100).name('Posição Z')

  folder.add(object.rotation, 'x', -10, 10).name('Rotação X')
  folder.add(object.rotation, 'y', -10, 10).name('Rotação Y')
  folder.add(object.rotation, 'z', -10, 10).name('Rotação Z')
}

async function cameraAnimation(camera: THREE.PerspectiveCamera) {
  gsap.to(camera.rotation, {
    z: Math.PI,
    duration: 1,
    ease: 'power4.inOut',
    delay: 0.1, // substitui o stagger quando são dois tweens separados
    onUpdate: () => {
      camera.updateProjectionMatrix()
      controls.update()
    },
  })
}

async function mouseHandler(
  mouseEvent: MouseEvent,
  canvas: HTMLCanvasElement,
  controls: OrbitControls,
) {
  controls.object.position.x = lerp(0, -0.5, 1, -1, mouseEvent.x / canvas.clientWidth)

  controls.object.position.y = -1 * (mouseEvent.y / canvas.clientHeight) + 0.5 + 1.5
}

function gyroscopeHandler(
  event: DeviceOrientationEvent,
  canvas: HTMLCanvasElement,
  controls: OrbitControls,
) {
  if (event.gamma !== null) {
    controls.object.position.x = -0.5 * ((event.gamma * 10) / canvas.clientWidth) * 2
  }

  if (event.beta !== null) {
    controls.object.position.y = -1 * ((event.beta * 10) / canvas.clientHeight) + 0.5 + 1.5
  }
}

function lerp(x0: number, y0: number, x1: number, y1: number, x: number) {
  if (x0 === x1) {
    return y0
  }

  return y0 + (y1 - y0) * ((x - x0) / (x1 - x0))
}

async function resizeHandler(
  canvas: HTMLCanvasElement,
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
): Promise<void> {
  gsap.to(camera.position, {
    x: lerp(500, 0.1, 1670, -0.75, window.innerWidth),
    y: 1.231,
    z: lerp(500, 2.5, 1670, 1.7, window.innerWidth),
    duration: 0,
  })

  gsap.to(controls.target, {
    x: lerp(500, 0.1, 1670, -0.7, window.innerWidth),
    y: 1.87,
    z: -0.016,
    duration: 0,
  })
}

onMounted(initScene)

onUnmounted(() => {
  gui?.destroy()
  engine?.dispose()
  if (mouseMoveListener) document.removeEventListener('mousemove', mouseMoveListener)
  if (deviceOrientationListener)
    window.removeEventListener('deviceorientation', deviceOrientationListener)
  if (resizeListener) window.removeEventListener('resize', resizeListener)
})
</script>

<style scoped></style>
