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

  start(): void

  update(deltaTime: number): void
}

export type { SceneInterface }
