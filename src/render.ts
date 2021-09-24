import {
  BoxGeometry,
  CanvasTexture,
  Color,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  NearestFilter,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three'
import { genBlockUVs } from './util'

const layer1ToLayer2 = 9 / 8

export let width = window.innerWidth
export let height = window.innerHeight

export const scene = new Scene()
scene.background = new Color(0x383838)

const layer1UVS = genBlockUVs(0, 64, 8, 8, 8, 64, 64)
const layer1Geometry = new BoxGeometry()
layer1Geometry.setAttribute('uv', layer1UVS)

const layer2UVS = genBlockUVs(32, 64, 8, 8, 8, 64, 64)
const layer2Geometry = new BoxGeometry()
layer2Geometry.setAttribute('uv', layer2UVS)

export const textureCanvas = document.createElement('canvas')
textureCanvas.width = 64
textureCanvas.height = 64
export const ctx = textureCanvas.getContext('2d')
const image = document.createElement('img')
image.src = '../img/neferupitou.png'
image.addEventListener('load', () => {
  setTexture()
})

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

export const layer1 = new Mesh(layer1Geometry, material)
scene.add(layer1)
export const layer2 = new Mesh(layer2Geometry, material)
layer2.scale.multiplyScalar(layer1ToLayer2)
scene.add(layer2)

export const camera = new PerspectiveCamera(75, width / height, 0.1, 1000)
camera.rotation.order = 'ZYX'
camera.position.set(1.1, 1.1, 1.1)

export const renderer = new WebGLRenderer()
renderer.setSize(width, height)
document.body.appendChild(renderer.domElement)

export const colorpicker = <HTMLCanvasElement>document.getElementById('color-palette')
const cpctx = colorpicker.getContext('2d')
const gradient = cpctx!.createLinearGradient(0, 0, colorpicker.width, 0)
gradient.addColorStop(0, 'rgb(255,   0,   0)')
gradient.addColorStop(0.15, 'rgb(255, 255,   0)')
gradient.addColorStop(0.33, 'rgb(0,   255,   0)')
gradient.addColorStop(0.49, 'rgb(0,   255, 255)')
gradient.addColorStop(0.67, 'rgb(0,     0, 255)')
gradient.addColorStop(0.84, 'rgb(255,   0, 255)')
gradient.addColorStop(1, 'rgb(255,   0,   0)')

// gradient.addColorStop(0, 'rgb(255,   0,   0)')
// gradient.addColorStop(0.25, 'rgb(255, 255,   0)')
// gradient.addColorStop(0.5, 'rgb(0,   255,   0)')
// gradient.addColorStop(0.75, 'rgb(0,   255, 255)')
// gradient.addColorStop(1, 'rgb(0,     0, 255)')

cpctx!.fillStyle = gradient
cpctx!.fillRect(0, 0, cpctx!.canvas.width, cpctx!.canvas.height)

export function setWidth(value: number) {
  width = value
}
export function setHeight(value: number) {
  height = value
}

export function setTexture() {
  ctx?.drawImage(image, 0, 0)
  updateTexture()
}

export function updateTexture() {
  material.map!.needsUpdate = true
}
