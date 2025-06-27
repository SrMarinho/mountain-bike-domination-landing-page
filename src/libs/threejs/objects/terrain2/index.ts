import * as THREE from 'three'

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export class Terrain2 {
  public model!: THREE.Group
  constructor() {}

  async loadModel(): Promise<THREE.Group> {
    const loader = new GLTFLoader()

    const gltf = await loader.loadAsync('/rock_terrain_2.glb')

    this.model = gltf.scene
    this.model.name = 'rock_terrain_2'
    return this.model
  }
}
