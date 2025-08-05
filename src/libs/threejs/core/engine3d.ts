import * as THREE from 'three'
import type { SceneInterface } from '../interfaces/scene_interface'

export class Engine3d {
  private clock: THREE.Clock
  private animationFrameId: number | null = null
  private isRunning = false
  public scene: SceneInterface | null = null

  constructor(
    public canvas: HTMLCanvasElement,
    public renderer: THREE.WebGLRenderer,
    public camera: THREE.PerspectiveCamera,
  ) {
    this.clock = new THREE.Clock()
    this.scene = null
    this.loop = this.loop.bind(this)
    this.handleResize = this.handleResize.bind(this)

    this.setupEventListeners()
  }

  public start(): void {
    if (this.isRunning) return

    this.isRunning = true
    this.loop()
  }

  public stop(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
    this.isRunning = false
    this.removeEventListeners()
  }

  private loop(): void {
    this.update()

    if (this.scene && this.camera) {
      this.renderer.render(this.scene.scene, this.camera)
    }

    this.animationFrameId = requestAnimationFrame(this.loop)
  }

  public update(): void {
    if (this.scene) {
      this.scene.update(this.clock.getDelta())
    }
  }

  private handleResize(): void {
    const width = this.canvas.clientWidth
    const height = this.canvas.clientHeight

    this.renderer.setSize(width, height, false)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    if (this.scene) {
      this.scene.composer.setSize(width, height)
    }
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', this.handleResize)
    // Adicione outros event listeners conforme necessário
  }

  private removeEventListeners(): void {
    window.removeEventListener('resize', this.handleResize)
    // Remova outros event listeners aqui
  }

  public setScene(scene: SceneInterface) {
    this.scene = scene
  }

  public dispose(): void {
    this.stop()

    if (this.scene) {
      this.scene.dispose()
    }
  }
}
