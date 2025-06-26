import * as THREE from 'three'

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export class Bike3D {
  public model!: THREE.Group
  constructor() {}

  async loadModel(): Promise<THREE.Group> {
    const loader = new GLTFLoader()

    const gltf = await loader.loadAsync('/mountain_bike.glb')

    this.model = gltf.scene
    this.model.name = 'bike'
    return this.model
  }
}
