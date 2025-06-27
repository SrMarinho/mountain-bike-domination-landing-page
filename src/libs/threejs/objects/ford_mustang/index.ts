import * as THREE from 'three'

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export class FordMustang1969 {
  public model!: THREE.Group
  constructor() {}

  async loadModel(): Promise<THREE.Group> {
    const loader = new GLTFLoader()

    const gltf = await loader.loadAsync('/ford_mustang_john_bowe_1969.glb')

    this.model = gltf.scene
    this.model.name = 'FordMustang1969'
    return this.model
  }
}
