import * as THREE from 'three'

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export class Terrain2 {
  public model!: THREE.Group
  constructor() {}

  async loadModel(): Promise<THREE.Group> {
    const loader = new GLTFLoader()

    const gltf = await loader.loadAsync('/cliff.glb')

    this.model = gltf.scene
    this.model.name = 'cliff'
    return this.model
  }
}
