import * as THREE from 'three'
import type { ComponentInterface } from '../interfaces/component_interface'

class GraphicComponent implements ComponentInterface {
  constructor(mesh: THREE.Object3D) {}
  update(deltaTime: number): void {
    throw new Error('Method not implemented.')
  }

  dispose(): void {
    throw new Error('Method not implemented.')
  }
}
}
