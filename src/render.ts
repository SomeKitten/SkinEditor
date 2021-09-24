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
import { genBlockUVs, targetC } from './util'

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

export const colorPicker = <HTMLCanvasElement>document.getElementById('color-palette')
const cpCTX = colorPicker.getContext('2d')

export const pickColor = new Color()

updateColor('hsl', 0, 100, 50)

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

export function updateColor(type: string, rh: number, gs: number, bl: number) {
  rh = Math.floor(rh)
  gs = Math.floor(gs)
  bl = Math.floor(bl)
  if (type === 'hsl') {
    pickColor.set(`hsl(${rh}, ${gs}%, ${bl}%)`)
  }
  if (type === 'rgb') {
    pickColor.set(`rgb(${rh}, ${gs}, ${bl})`)
  }

  cpCTX!.fillStyle = pickColor.getStyle()
  cpCTX!.fillRect(0, 0, 256, 32)

  updateHSL()
  updateRGB()
}

function updateHSL() {
  pickColor.getHSL(targetC)

  updateH(targetC.s * 100, targetC.l * 100)
  updateS(targetC.h * 360, targetC.l * 100)
  updateL(targetC.h * 360, targetC.s * 100)
}
function updateRGB() {
  updateR(pickColor.g * 255, pickColor.b * 255)
  updateG(pickColor.r * 255, pickColor.b * 255)
  updateB(pickColor.r * 255, pickColor.g * 255)
}

function updateH(s: number, l: number) {
  const hGradient = cpCTX!.createLinearGradient(0, 0, colorPicker.width, 0)

  hGradient.addColorStop(0, `hsl(0, ${s}%, ${l}%)`)
  hGradient.addColorStop(0.15, `hsl(60, ${s}%, ${l}%)`)
  hGradient.addColorStop(0.33, `hsl(120, ${s}%, ${l}%)`)
  hGradient.addColorStop(0.49, `hsl(180, ${s}%, ${l}%)`)
  hGradient.addColorStop(0.67, `hsl(240, ${s}%, ${l}%)`)
  hGradient.addColorStop(0.84, `hsl(300, ${s}%, ${l}%)`)
  hGradient.addColorStop(1, `hsl(360, ${s}%, ${l}%)`)

  cpCTX!.fillStyle = hGradient
  cpCTX!.fillRect(0, 32 * 1, 256, 32)
}
function updateS(h: number, l: number) {
  const sGradient = cpCTX!.createLinearGradient(0, 0, colorPicker.width, 0)

  sGradient.addColorStop(0, `hsl(${h}, 0%, ${l}%)`)
  sGradient.addColorStop(1, `hsl(${h}, 100%, ${l}%)`)

  cpCTX!.fillStyle = sGradient
  cpCTX!.fillRect(0, 32 * 2, 256, 32)
}
function updateL(h: number, s: number) {
  const lGradient = cpCTX!.createLinearGradient(0, 0, colorPicker.width, 0)

  lGradient.addColorStop(0, `hsl(${h}, ${s}%, 0%)`)
  lGradient.addColorStop(0.5, `hsl(${h}, ${s}%, 50%)`)
  lGradient.addColorStop(1, `hsl(${h}, ${s}%, 100%)`)

  cpCTX!.fillStyle = lGradient
  cpCTX!.fillRect(0, 32 * 3, 256, 32)
}

function updateR(g: number, b: number) {
  const rGradient = cpCTX!.createLinearGradient(0, 0, colorPicker.width, 0)

  rGradient.addColorStop(0, `rgb(0, ${g}, ${b})`)
  rGradient.addColorStop(1, `rgb(255, ${g}, ${b})`)

  cpCTX!.fillStyle = rGradient
  cpCTX!.fillRect(0, 32 * 4, 256, 32)
}
function updateG(r: number, b: number) {
  const gGradient = cpCTX!.createLinearGradient(0, 0, colorPicker.width, 0)

  gGradient.addColorStop(0, `rgb(${r}, 0, ${b})`)
  gGradient.addColorStop(1, `rgb(${r}, 255, ${b})`)

  cpCTX!.fillStyle = gGradient
  cpCTX!.fillRect(0, 32 * 5, 256, 32)
}
function updateB(r: number, g: number) {
  const bGradient = cpCTX!.createLinearGradient(0, 0, colorPicker.width, 0)

  bGradient.addColorStop(0, `rgb(${r}, ${g}, 0)`)
  bGradient.addColorStop(1, `rgb(${r}, ${g}, 255)`)

  cpCTX!.fillStyle = bGradient
  cpCTX!.fillRect(0, 32 * 6, 256, 32)
}
