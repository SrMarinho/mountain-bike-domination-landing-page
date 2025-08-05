import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { Entity } from '../entities/entity'

interface SceneInterface {
  canvas: HTMLCanvasElement
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
  renderer: THREE.WebGLRenderer
  composer: EffectComposer
  objects: Entity[]

  setup(): void

  update(deltaTime: number): void

  render(): void

  dispose(): void
}

export type { SceneInterface }
