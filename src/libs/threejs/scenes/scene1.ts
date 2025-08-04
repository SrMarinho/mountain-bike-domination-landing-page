import * as THREE from 'three'
import type { SceneInterface } from '../interfaces/scene_interface'
import { EffectComposer } from 'three/examples/jsm/Addons.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { Entity } from '../entities/entity'

class Scene1 implements SceneInterface {
  public canvas: HTMLCanvasElement
  public scene: THREE.Scene
  public camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
  public renderer: THREE.WebGLRenderer
  public composer: EffectComposer
  public objects: Entity[]
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(60, this.canvas.width / this.canvas.height, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    this.composer = new EffectComposer(this.renderer)
    this.objects = []
  }

  start(): void {
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

    this.composer.addPass(new RenderPass(this.scene, this.camera))
  }

  update(deltaTime: number): void {
    this.objects.map((obj) => {
      obj.update(deltaTime)
    })
  }
}

export default Scene1
