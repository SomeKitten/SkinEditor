import './style.css'
import './listeners'
import { BoxGeometry, CanvasTexture, DoubleSide, Mesh, MeshBasicMaterial, NearestFilter, Scene } from 'three'
import { mouse } from './input'
import { camera, renderer } from './render'
import { camOrbit, genBlockUVs, lookAt, raycaster } from './util'

const scene = new Scene()

const uvs = genBlockUVs(0, 64, 8, 8, 8, 64, 64)
const geometry = new BoxGeometry()
geometry.setAttribute('uv', uvs)

const textureCanvas = document.createElement('canvas')
textureCanvas.width = 64
textureCanvas.height = 64
const ctx = textureCanvas.getContext('2d')
const image = document.createElement('img')
image.src = '../img/neferupitou.png'
image.addEventListener('load', () => {
  ctx?.drawImage(image, 0, 0)
  material.map!.needsUpdate = true
})

document.body.appendChild(textureCanvas)
document.body.appendChild(image)

const texture = new CanvasTexture(textureCanvas)
texture.minFilter = NearestFilter
texture.magFilter = NearestFilter

const material = new MeshBasicMaterial({
  color: 0xffffff,
  transparent: false,
  map: texture,
  alphaTest: 0.5,
  depthWrite: true,
  depthTest: true,
  side: DoubleSide,
})

const cube = new Mesh(geometry, material)
scene.add(cube)

lookAt(camera, camOrbit)

const animate = function () {
  requestAnimationFrame(animate)

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(scene.children)

  if (intersects.length > 0) {
    console.log('WHEEE')
  }

  renderer.render(scene, camera)
}

animate()
