import type { ComponentInterface } from '../interfaces/component_interface'
import { Vector3, Quaternion } from 'three'

class TransformationComponent implements ComponentInterface {
  public position: Vector3
  public rotation: Quaternion
  public scale: Vector3

  constructor() {
    this.position = new Vector3()
    this.rotation = new Quaternion()
    this.scale = new Vector3(1, 1, 1)
  }

  update(deltaTime: number): void {}

  dispose(): void {}
}

export { TransformationComponent }
