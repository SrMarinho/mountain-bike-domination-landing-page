import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'

export class Engine3d {
  constructor(
    public canvas: HTMLElement,
    public scene: THREE.Scene,
    public renderer: THREE.WebGLRenderer,
    public camera: THREE.Camera,
    public composer?: EffectComposer | null,
  ) {
    this.loop = this.loop.bind(this)
  }

  public start(): void {
    this.loop()
  }

  private loop(): void {
    // this.resizeRendererToDisplaySize(this.renderer)
    this.update()
    if (this.composer) {
      this.composer.render()
    } else {
      this.renderer.render(this.scene, this.camera)
    }

    requestAnimationFrame(this.loop)
  }

  public update(): void {
    return
  }

  public resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
    const canvas = renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
      renderer.setSize(width, height, false)
    }
    return needResize
  }
}
