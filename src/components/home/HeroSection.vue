<template>
  <div class="w-full h-screen relative flex lg:items-center m-0 border-0">
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
    <!-- Gradiente mobile/tablet: cobre o topo da tela de cima para baixo -->
    <div class="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-b from-black to-transparent lg:hidden" />

    <!-- Botão de permissão de giroscópio (iOS) -->
    <button
      v-if="needsGyroPermission"
      @click="requestGyroPermission"
      class="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 px-4 py-2 text-sm border border-cyan-400 text-cyan-400 rounded-lg lg:hidden"
    >
      Ativar giroscópio
    </button>

    <div
      class="absolute top-1/3 -translate-y-1/2 left-0 w-full lg:static lg:translate-y-0 lg:h-screen flex flex-col justify-center items-center text-white px-6 lg:px-8 gap-4 lg:gap-8 max-w-4xl lg:bg-gradient-to-r lg:from-black lg:to-transparent"
    >
      <h1 ref="heroTitle" class="flex flex-col items-center lg:items-start text-5xl sm:text-8xl lg:text-8xl font-bold">
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400"
          >DOWNHILL</span
        >
        <span class="text-white">DOMINATION</span>
      </h1>
      <h2 ref="heroSubtitle" class="hidden lg:block max-w-2xl text-2xl text-gray-300">
        Where skill meets the mountain. Experience the ultimate adrenaline rush as you conquer
        technical trails and defy gravity
      </h2>
      <div ref="heroButtons" class="flex gap-3 lg:gap-4">
        <button
          class="flex justify-center items-center gap-2 py-3 px-6 lg:py-4 lg:px-8 font-bold text-lg lg:text-xl rounded-lg bg-gradient-to-r from-cyan-600 to-green-600 hover:from-cyan-500 hover:to-green-500 hover:shadow-cyan-400/30 hover:shadow-lg duration-200 hover:scale-105"
        >
          <PlayIcon class="w-6 shrink-0" />
          Watch Demo
        </button>
        <button
          class="flex justify-center items-center py-3 px-8 lg:py-4 lg:px-10 text-cyan-400 font-bold text-lg lg:text-xl border-cyan-400 border-solid border-2 rounded-lg hover:bg-cyan-400 hover:text-black duration-200 hover:scale-105"
        >
          Explore trails
        </button>
      </div>
      <div ref="heroStats" class="flex w-full justify-around">
        <div>
          <p class="text-cyan-400 text-2xl lg:text-3xl font-bold">50+</p>
          <p class="text-gray-400 text-sm lg:text-base">Trails</p>
        </div>

        <div>
          <p class="text-green-400 text-2xl lg:text-3xl font-bold">2000m</p>
          <p class="text-gray-400 text-sm lg:text-base">Vertical Drop</p>
        </div>

        <div>
          <p class="text-orange-400 text-2xl lg:text-3xl font-bold">80km/h</p>
          <p class="text-gray-400 text-sm lg:text-base">Top Speed</p>
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
import { onMounted, onUnmounted, ref, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js'
import { Engine3d } from '@/libs/threejs/core/engine3d'
import { Bike3D } from '@/libs/threejs/objects/bike'
import { Terrain2 } from '@/libs/threejs/objects/terrain2'
import { useSceneManager } from '@/composables/sceneManager'
import { PlayIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'
import gsap from 'gsap'

const isLoading = ref(true)
const loadingProgress = ref(0)
const loadError = ref(false)
const needsGyroPermission = ref(false)

const heroTitle = ref<HTMLElement | null>(null)
const heroSubtitle = ref<HTMLElement | null>(null)
const heroButtons = ref<HTMLElement | null>(null)
const heroStats = ref<HTMLElement | null>(null)
const sceneManager = useSceneManager()

let canvas: HTMLCanvasElement | null
let renderer: THREE.WebGLRenderer
let camera: THREE.PerspectiveCamera
let controls: OrbitControls
let engine: Engine3d | null = null
let composer: EffectComposer

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

    composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(sceneManager.scene, camera))

    // Bloom opera em HDR linear — threshold alto para só afetar reflexos especulares
    composer.addPass(
      new UnrealBloomPass(
        new THREE.Vector2(canvas.clientWidth, canvas.clientHeight),
        0.35,  // strength  — sutil
        0.35,  // radius    — spread apertado
        0.88,  // threshold — apenas os picos de especular
      ),
    )

    // OutputPass aplica ACES tone mapping e conversão de color space
    composer.addPass(new OutputPass())

    // SMAA como última passagem — antialiasing no resultado final LDR
    composer.addPass(new SMAAPass())

    engine.onFrame = () => {
      controls.update()
      sceneManager.scene.backgroundRotation.y += 0.00012
      composer.render()
    }
    engine.start()

    await loadAssets()

    isLoading.value = false
    loadingProgress.value = 100

    cameraAnimation(camera)
    animateHeroEntrance()

    let lastMouseTime = 0
    mouseMoveListener = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastMouseTime < 16) return
      lastMouseTime = now
      mouseHandler(e, canvas!, controls)
    }
    document.addEventListener('mousemove', mouseMoveListener)

    await setupGyroscope()

    resizeListener = () => {
      resizeHandler(canvas!, camera, controls)
      composer.setSize(canvas!.clientWidth, canvas!.clientHeight)
    }
    window.addEventListener('resize', resizeListener)
    resizeHandler(canvas!, camera, controls)

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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.9
  renderer.outputColorSpace = THREE.SRGBColorSpace

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
async function loadAssets() {
  const loadPromises: Promise<void>[] = []
  const totalAssets = 4 // Ajuste conforme necessário
  const progressIncrement = 100 / totalAssets

  // Background HDRI — fundo + reflexos nos materiais metálicos da bike
  loadPromises.push(
    new Promise<void>((resolve) => {
      new RGBELoader().load(
        'environment.hdr',
        (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping
          sceneManager.scene.background = texture
          sceneManager.scene.environment = texture
          sceneManager.scene.backgroundBlurriness = 0.1
          sceneManager.scene.environmentIntensity = 0.35
          loadingProgress.value += progressIncrement
          resolve()
        },
        undefined,
        () => {
          // fallback: landscape1.jpg até o environment.hdr ser adicionado em /public
          new THREE.TextureLoader().load('landscape1.jpg', (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace
            tex.mapping = THREE.EquirectangularReflectionMapping
            sceneManager.scene.background = tex
          })
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
      sceneManager.add(model)

      // Flutuação suave da bike
      gsap.to(model.position, {
        y: 1.87 + 0.04,
        duration: 2.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })

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

function addLightTarget(x: number, y: number, z: number): THREE.Object3D {
  const target = new THREE.Object3D()
  target.position.set(x, y, z)
  sceneManager.scene.add(target)
  return target
}

// Configuração de luzes — rig cinematográfico
function setupLights() {
  // Ambiente quase negro com toque azul frio (atmosfera noturna)
  const ambientLight = new THREE.AmbientLight(0x04091a, 1.5)
  sceneManager.add(ambientLight)

  // Key light — branco-frio de cima, iluminação base com sombra nítida
  mainLight = new THREE.SpotLight(0xd0e8ff, 25, 0, Math.PI * 0.1)
  mainLight.position.set(1.2, 5.5, 3)
  mainLight.penumbra = 0.5
  mainLight.decay = 1.5
  mainLight.castShadow = true
  mainLight.shadow.bias = -0.001
  mainLight.shadow.normalBias = 0.04
  mainLight.shadow.mapSize.width = 2048
  mainLight.shadow.mapSize.height = 2048
  mainLight.name = 'main_light'
  mainLight.target = addLightTarget(0.3, 1.87, 0)
  sceneManager.add(mainLight)

  // Rim light cyan — por trás-esquerda, contorno elétrico (cor da brand)
  const rimCyan = new THREE.SpotLight(0x00e5ff, 65, 6, Math.PI * 0.04)
  rimCyan.position.set(-1.8, 3.5, -2.5)
  rimCyan.penumbra = 0.8
  rimCyan.decay = 1.5
  rimCyan.target = addLightTarget(0.3, 1.87, 0)
  sceneManager.add(rimCyan)

  // Rim light laranja — por trás-direita, contorno quente (contraste quente/frio)
  const rimOrange = new THREE.SpotLight(0xff5500, 50, 5, Math.PI * 0.05)
  rimOrange.position.set(2.2, 2.5, -2)
  rimOrange.penumbra = 0.7
  rimOrange.decay = 1.5
  rimOrange.target = addLightTarget(0.3, 1.87, 0)
  sceneManager.add(rimOrange)

  // Fill light lateral suave — evita que o lado sombrio fique 100% preto
  const fillLight = new THREE.SpotLight(0x1a3060, 10, 8, Math.PI * 0.2)
  fillLight.position.set(-3, 2, 2)
  fillLight.penumbra = 1.0
  fillLight.decay = 2
  fillLight.target = addLightTarget(0.3, 1.87, 0)
  sceneManager.add(fillLight)
}

function animateHeroEntrance() {
  const els = [heroTitle.value, heroSubtitle.value, heroButtons.value, heroStats.value]
  gsap.set(els, { opacity: 0, y: 40 })
  gsap.timeline({ delay: 0.3 })
    .to(heroTitle.value,    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
    .to(heroSubtitle.value, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.5')
    .to(heroButtons.value,  { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
    .to(heroStats.value,    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
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

async function setupGyroscope() {
  // iOS 13+ requer permissão explícita
  const needsPermission =
    typeof DeviceOrientationEvent !== 'undefined' &&
    typeof (DeviceOrientationEvent as any).requestPermission === 'function'

  if (needsPermission) {
    needsGyroPermission.value = true
    return
  }

  attachGyroscopeListener()
}

async function requestGyroPermission() {
  try {
    const permission = await (DeviceOrientationEvent as any).requestPermission()
    if (permission === 'granted') {
      needsGyroPermission.value = false
      attachGyroscopeListener()
    }
  } catch (e) {
    console.warn('Permissão de giroscópio negada', e)
  }
}

function attachGyroscopeListener() {
  deviceOrientationListener = (e: DeviceOrientationEvent) => gyroscopeHandler(e)
  window.addEventListener('deviceorientation', deviceOrientationListener, { passive: true })
}

function gyroscopeHandler(event: DeviceOrientationEvent) {
  // gamma: inclinação lateral (-90 a 90°), positivo = tilt para direita
  // beta: inclinação frente/trás (-180 a 180°), ~75° = celular em pé na vertical
  if (event.gamma !== null) {
    const gamma = Math.max(-30, Math.min(30, event.gamma))
    controls.object.position.x = 0.3 - (gamma / 30) * 0.3
  }

  if (event.beta !== null) {
    const beta = Math.max(45, Math.min(105, event.beta))
    controls.object.position.y = 0.6 + ((75 - beta) / 30) * 0.2
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
  const isMobile = window.innerWidth < 768
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024

  if (isMobile) {
    gsap.to(camera.position, { x: 0.3, y: 0.6, z: 4.0, duration: 0 })
    gsap.to(controls.target, { x: 0.3, y: 2.8, z: -0.016, duration: 0 })
  } else if (isTablet) {
    gsap.to(camera.position, { x: 0.3, y: 0.6, z: 2.8, duration: 0 })
    gsap.to(controls.target, { x: 0.3, y: 2.8, z: -0.016, duration: 0 })
  } else {
    const w = Math.min(window.innerWidth, 1590)
    gsap.to(camera.position, {
      x: lerp(1024, -0.4, 1590, -0.75, w),
      y: 1.231,
      z: lerp(1024, 2.6, 1590, 1.7, w),
      duration: 0,
    })
    gsap.to(controls.target, {
      x: lerp(1024, -0.3, 1590, -0.7, w),
      y: 1.87,
      z: -0.016,
      duration: 0,
    })
  }
}

watch(isLoading, (loading) => {
  document.body.style.overflow = loading ? 'hidden' : ''
}, { immediate: true })

onMounted(initScene)

onUnmounted(() => {
  composer?.dispose()
  engine?.dispose()
  if (mouseMoveListener) document.removeEventListener('mousemove', mouseMoveListener)
  if (deviceOrientationListener)
    window.removeEventListener('deviceorientation', deviceOrientationListener)
  if (resizeListener) window.removeEventListener('resize', resizeListener)
})
</script>

<style scoped></style>
