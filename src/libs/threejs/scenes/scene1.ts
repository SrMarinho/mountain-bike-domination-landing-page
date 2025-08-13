import * as THREE from 'three'
import type { SceneInterface } from '../interfaces/scene_interface'
import { EffectComposer } from 'three/examples/jsm/Addons.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { Entity } from '../entities/entity'

class Scene1 implements SceneInterface {
  public canvas: HTMLCanvasElement
  public scene: THREE.Scene
  public camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
  public renderer: THREE.WebGLRenderer
  public composer: EffectComposer
  public objects: Entity[]

  constructor(canvas: HTMLCanvasElement, renderer: THREE.WebGLRenderer) {
    this.canvas = canvas
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(60, this.canvas.width / this.canvas.height, 0.1, 1000)
    this.renderer = renderer
    this.composer = new EffectComposer(this.renderer)
    this.objects = []
  }
  start(): void {}

  public setup(): void {
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.5,
      0.15,
    )
    this.composer.addPass(bloomPass)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
  }

  public update(deltaTime: number): void {
    this.objects.map((obj) => {
      obj.update(deltaTime)
    })
  }

  public render(): void {}

  resize(): void {}

  public dispose(): void {
    if (this.composer) {
      this.composer.dispose()
    }
  }
}

export default Scene1
