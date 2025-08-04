import type { ComponentInterface } from '../interfaces/component_interface'
import { TransformationComponent } from './transformation_component'
import { GraphicComponent } from './graphic_component'
import { PhysicComponent } from './physic_component'

export class Entity {
  private components: Map<string, ComponentInterface>
  private transform: TransformationComponent

  constructor() {
    this.components = new Map()
    this.transform = new TransformationComponent()
    this.addComponent('transform', this.transform)
  }

  public addComponent(name: string, component: ComponentInterface): void {
    this.components.set(name, component)

    // Conecta automaticamente os componentes ao transformation
    if (component instanceof GraphicComponent) {
      component.setTransformationComponent(this.transform)
    } else if (component instanceof PhysicComponent) {
      component.setTransformationComponent(this.transform)
    }
  }

  public getComponent<T extends ComponentInterface>(name: string): T | undefined {
    return this.components.get(name) as T
  }

  public getTransformation(): TransformationComponent {
    return this.transform
  }

  public update(deltaTime: number): void {
    this.components.forEach((component) => {
      component.update(deltaTime)
    })
  }
}
