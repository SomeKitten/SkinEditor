import { BoxGeometry, BufferAttribute, Mesh, MeshBasicMaterial, Scene, Vector3 } from "three"
import { innerSkinLayer, outerSkinLayer } from "./render"

export class BodyPart {
  layer1: Mesh
  layer2: Mesh

  constructor(scene: Scene, layer1Mat: MeshBasicMaterial, layer2Mat: MeshBasicMaterial, layer1UVS: BufferAttribute, layer2UVS: BufferAttribute, pos: Vector3, size: Vector3) {
    const layer1Geometry = new BoxGeometry(size.x, size.y, size.z)
    layer1Geometry.setAttribute('uv', layer1UVS)

    // TODO head 2nd layer is +1, not +0.5
    const layer2Geometry = new BoxGeometry(size.x + 0.5, size.y + 0.5, size.z + 0.5,)
    layer2Geometry.setAttribute('uv', layer2UVS)

    this.layer1 = new Mesh(layer1Geometry, layer1Mat)
    this.layer1.position.copy(pos)
    innerSkinLayer.push(this.layer1)
    scene.add(this.layer1)

    this.layer2 = new Mesh(layer2Geometry, layer2Mat)
    this.layer2.position.copy(pos)
    outerSkinLayer.push(this.layer2)
    scene.add(this.layer2)
  }
}