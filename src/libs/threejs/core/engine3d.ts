import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export class Engine3d {
  private animationFrameId: number | null = null
  private isRunning = false

  constructor(
    public canvas: HTMLCanvasElement, // Tipo mais específico
    public scene: THREE.Scene,
    public renderer: THREE.WebGLRenderer,
    public camera: THREE.PerspectiveCamera, // Tipo mais específico
    public composer?: EffectComposer,
    public controls?: OrbitControls,
  ) {
    this.loop = this.loop.bind(this)
    this.handleResize = this.handleResize.bind(this)

    // Configuração inicial
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

    if (this.composer) {
      this.composer.render()
    } else {
      this.renderer.render(this.scene, this.camera)
    }

    this.animationFrameId = requestAnimationFrame(this.loop)
  }

  public update(): void {
    if (this.controls) {
      this.controls.update()
    }
  }

  private handleResize(): void {
    const width = this.canvas.clientWidth
    const height = this.canvas.clientHeight

    this.renderer.setSize(width, height, false)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    if (this.composer) {
      this.composer.setSize(width, height)
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

  public dispose(): void {
    this.stop()

    // Limpeza de recursos
    if (this.controls) {
      this.controls.dispose()
    }

    if (this.composer) {
      this.composer.dispose()
    }

    this.renderer.dispose()
    // Adicione outras limpezas necessárias
  }
}
