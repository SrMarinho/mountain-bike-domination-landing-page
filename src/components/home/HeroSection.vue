<template>
  <div class="w-full h-screen flex items-center">
    <div
      class="w-full h-screen fixed bg-black text-white flex justify-center items-center z-50"
      v-if="isLoading"
    >
      Loading: {{ Math.round(loadingProgress) }}%
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
    <ObjectController class="z-50" :scene="sceneManager" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Engine3d } from '@/libs/threejs/core/engine3d'
import { Bike3D } from '@/libs/threejs/objects/bike'
import { Terrain2 } from '@/libs/threejs/objects/terrain2'
import { useSceneManager } from '@/composables/sceneManager'
import gsap from 'gsap'

// Estados reativos
const isLoading = ref(true)
const loadingProgress = ref(0)
const sceneManager = useSceneManager()

let canvas: HTMLCanvasElement | null
let renderer: THREE.WebGLRenderer
let camera: THREE.PerspectiveCamera
let composer: EffectComposer
let controls: OrbitControls

let gui: GUI

let mainLight: THREE.SpotLight

// Configurações
const sceneConfig = {
  canvasId: 'myCanvas',
  cameraPosition: new THREE.Vector3(-0.398, 1.231, 4),
  bloomParams: {
    strength: 1.5,
    radius: 0.5,
    threshold: 0.15,
  },
  controlsTarget: new THREE.Vector3(0, 0, 0),
}

// Inicialização principal
async function initScene() {
  try {
    const { renderer, camera, composer, controls } = setupBaseScene()
    const engine = new Engine3d(
      renderer.domElement,
      sceneManager.scene,
      renderer,
      camera,
      composer,
      controls,
    )

    engine.start()

    gui = new GUI()
    onUnmounted(() => gui.destroy())

    // Carregamento assíncrono de assets
    await loadAssets(gui)

    // Finalização
    isLoading.value = false
    loadingProgress.value = 100

    cameraAnimation(camera)
    // gui.hide()
  } catch (error) {
    console.error('Erro ao inicializar cena:', error)
    isLoading.value = false
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
  camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)
  camera.name = 'camera'
  camera.position.copy(sceneConfig.cameraPosition)
  sceneManager.add(camera)

  // Efeitos pós-processamento
  composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(sceneManager.scene, camera))

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    sceneConfig.bloomParams.strength,
    sceneConfig.bloomParams.radius,
    sceneConfig.bloomParams.threshold,
  )
  composer.addPass(bloomPass)

  // Controles
  controls = new OrbitControls(camera, canvas)
  controls.listenToKeyEvents(window)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.screenSpacePanning = false
  controls.maxPolarAngle = Math.PI
  controls.target.copy(sceneConfig.controlsTarget)

  return { renderer, camera, composer, controls }
}

// Carregamento de assets
async function loadAssets(gui: GUI) {
  const loadPromises: Promise<void>[] = []
  const totalAssets = 4 // Ajuste conforme necessário
  const progressIncrement = 100 / totalAssets

  // Background
  loadPromises.push(
    new Promise((resolve) => {
      const loader = new THREE.TextureLoader()
      loader.load('landscape1.jpg', (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace
        sceneManager.scene.background = texture
        loadingProgress.value += progressIncrement
        resolve()
      })
    }),
  )

  // Bike
  const bike = new Bike3D()
  loadPromises.push(
    bike.loadModel().then((model: THREE.Object3D) => {
      model.position.set(0.3, 1.87, -0.016)
      model.rotation.set(0, 3.6, 0)
      model.castShadow = true
      controls.target.set(model.position.x - 1, model.position.y, model.position.z)
      sceneManager.add(model)
      const objTarget = new THREE.Object3D()
      objTarget.position.set(0, 2, 1)
      mainLight.target = objTarget
      console.log(mainLight)

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

      textureLoader.load('sky_bg.jpg', (texture) => {
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
      })
    }),
  )

  // Luzes
  setupLights()

  await Promise.all(loadPromises)
}

// Configuração de luzes
function setupLights() {
  // Luz ambiente
  const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
  sceneManager.add(ambientLight)

  // Luz principal
  mainLight = new THREE.SpotLight(0xffffff, 10, 0, Math.PI * 0.08)
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

  setupGuiControls('mainLght', gui, mainLight)

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
  gsap.to(camera.position, {
    z: 2.385,
    duration: 1,
    ease: 'power4.inOut',
  })

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

  gsap.from(camera, {
    fov: 35,
    onUpdate: () => {
      camera.updateProjectionMatrix()
      controls.update()
    },
  })

  gsap.to(camera, {
    fov: 45,
    duration: 1,
    ease: 'power2.inOut',
    onUpdate: () => {
      camera.updateProjectionMatrix()
      controls.update()
    },
  })
}

onMounted(initScene)
</script>

<style scoped></style>
