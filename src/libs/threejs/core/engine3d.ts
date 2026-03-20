import * as THREE from 'three'

export class Engine3d {
  private animationFrameId: number | null = null
  private isRunning = false
  public onFrame: (() => void) | null = null

  constructor(
    public canvas: HTMLCanvasElement,
    public renderer: THREE.WebGLRenderer,
    public camera: THREE.PerspectiveCamera,
  ) {
    this.loop = this.loop.bind(this)
    this.handleResize = this.handleResize.bind(this)
    window.addEventListener('resize', this.handleResize)
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
    window.removeEventListener('resize', this.handleResize)
  }

  private loop(): void {
    if (this.onFrame) {
      this.onFrame()
    }
    this.animationFrameId = requestAnimationFrame(this.loop)
  }

  private handleResize(): void {
    const width = this.canvas.clientWidth
    const height = this.canvas.clientHeight
    this.renderer.setSize(width, height, false)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
  }

  public dispose(): void {
    this.stop()
  }
}
