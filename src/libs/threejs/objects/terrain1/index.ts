import * as THREE from 'three'

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export class Terrain1 {
  public model!: THREE.Group
  constructor() {}

  async loadModel(): Promise<THREE.Group> {
    const loader = new GLTFLoader()

    const gltf = await loader.loadAsync('/moss_covered_rock_pile.glb')

    this.model = gltf.scene
    this.model.name = 'moss_covered_rock_pile'
    return this.model
  }
}
