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

import defaultHeadURL from '../res/neferupitou.png'

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
image.src = defaultHeadURL
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

export const resultCanvas = <HTMLCanvasElement>document.getElementById('color-result')
const resultCTX = resultCanvas.getContext('2d')

export const hCanvas = <HTMLCanvasElement>document.getElementById('color-h')
const hCTX = hCanvas.getContext('2d')

export const sCanvas = <HTMLCanvasElement>document.getElementById('color-s')
const sCTX = sCanvas.getContext('2d')

export const lCanvas = <HTMLCanvasElement>document.getElementById('color-l')
const lCTX = lCanvas.getContext('2d')

export const rCanvas = <HTMLCanvasElement>document.getElementById('color-r')
const rCTX = rCanvas.getContext('2d')

export const gCanvas = <HTMLCanvasElement>document.getElementById('color-g')
const gCTX = gCanvas.getContext('2d')

export const bCanvas = <HTMLCanvasElement>document.getElementById('color-b')
const bCTX = bCanvas.getContext('2d')

export const hsl = { h: 0, s: 0, l: 0 }
export const rgb = { r: 0, g: 0, b: 0 }
export const color = new Color()

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

export function updateColor(type: string, rhhex: number, gs: number, bl: number) {
  rhhex = Math.floor(rhhex)
  gs = Math.floor(gs)
  bl = Math.floor(bl)

  switch (type) {
    case 'hsl':
      hsl.h = rhhex
      hsl.s = gs
      hsl.l = bl

      color.set(`hsl(${rhhex}, ${gs}%, ${bl}%)`)
      rgb.r = Math.floor(color.r * 255)
      rgb.g = Math.floor(color.g * 255)
      rgb.b = Math.floor(color.b * 255)
      break
    case 'rgb':
      rgb.r = rhhex
      rgb.g = gs
      rgb.b = bl

      color.set(`rgb(${rhhex}, ${gs}, ${bl})`)
      color.getHSL(hsl)
      hsl.h = Math.floor(360 * hsl.h)
      hsl.s = Math.floor(100 * hsl.s)
      hsl.l = Math.floor(100 * hsl.l)
      break
    case 'hex':
      color.set(rhhex)

      color.getHSL(hsl)
      hsl.h = Math.floor(360 * hsl.h)
      hsl.s = Math.floor(100 * hsl.s)
      hsl.l = Math.floor(100 * hsl.l)

      rgb.r = Math.floor(color.r * 255)
      rgb.g = Math.floor(color.g * 255)
      rgb.b = Math.floor(color.b * 255)
      break
  }

  resultCTX!.fillStyle = color.getStyle()
  resultCTX!.fillRect(0, 0, 256, 32)

  updateHSL()
  updateRGB()
  updateHEX()
}

function updateHSL() {
  updateH(hsl.h, hsl.s, hsl.l)
  updateS(hsl.h, hsl.s, hsl.l)
  updateL(hsl.h, hsl.s, hsl.l)
}
function updateRGB() {
  updateR(rgb.r, rgb.g, rgb.b)
  updateG(rgb.r, rgb.g, rgb.b)
  updateB(rgb.r, rgb.g, rgb.b)
}
function updateHEX() {
  ;(<HTMLInputElement>document.getElementById('input-result')).value = color.getHexString()
}

function updateH(h: number, s: number, l: number) {
  const hGradient = hCTX!.createLinearGradient(0, 0, hCanvas.width, 0)

  hGradient.addColorStop(0, `hsl(0, ${s}%, ${l}%)`)
  hGradient.addColorStop(0.15, `hsl(60, ${s}%, ${l}%)`)
  hGradient.addColorStop(0.33, `hsl(120, ${s}%, ${l}%)`)
  hGradient.addColorStop(0.49, `hsl(180, ${s}%, ${l}%)`)
  hGradient.addColorStop(0.67, `hsl(240, ${s}%, ${l}%)`)
  hGradient.addColorStop(0.84, `hsl(300, ${s}%, ${l}%)`)
  hGradient.addColorStop(1, `hsl(360, ${s}%, ${l}%)`)

  hCTX!.fillStyle = hGradient
  hCTX!.fillRect(0, 0, 256, 32)

  hCTX!.beginPath()
  hCTX!.moveTo((h * 256) / 360, 0)
  hCTX!.lineTo((h * 256) / 360, 32)
  hCTX!.stroke()
  ;(<HTMLInputElement>document.getElementById('input-h')).value = `${h}`
}
function updateS(h: number, s: number, l: number) {
  const sGradient = sCTX!.createLinearGradient(0, 0, sCanvas.width, 0)

  sGradient.addColorStop(0, `hsl(${h}, 0%, ${l}%)`)
  sGradient.addColorStop(1, `hsl(${h}, 100%, ${l}%)`)

  sCTX!.fillStyle = sGradient
  sCTX!.fillRect(0, 0, 256, 32)

  sCTX!.beginPath()
  sCTX!.moveTo((s * 256) / 100, 0)
  sCTX!.lineTo((s * 256) / 100, 32)
  sCTX!.stroke()
  ;(<HTMLInputElement>document.getElementById('input-s')).value = `${s}`
}
function updateL(h: number, s: number, l: number) {
  const lGradient = lCTX!.createLinearGradient(0, 0, lCanvas.width, 0)

  lGradient.addColorStop(0, `hsl(${h}, ${s}%, 0%)`)
  lGradient.addColorStop(0.5, `hsl(${h}, ${s}%, 50%)`)
  lGradient.addColorStop(1, `hsl(${h}, ${s}%, 100%)`)

  lCTX!.fillStyle = lGradient
  lCTX!.fillRect(0, 0, 256, 32)

  lCTX!.beginPath()
  lCTX!.moveTo((l * 256) / 100, 0)
  lCTX!.lineTo((l * 256) / 100, 32)
  lCTX!.stroke()
  ;(<HTMLInputElement>document.getElementById('input-l')).value = `${l}`
}

function updateR(r: number, g: number, b: number) {
  const rGradient = rCTX!.createLinearGradient(0, 0, rCanvas.width, 0)

  rGradient.addColorStop(0, `rgb(0, ${g}, ${b})`)
  rGradient.addColorStop(1, `rgb(255, ${g}, ${b})`)

  rCTX!.fillStyle = rGradient
  rCTX!.fillRect(0, 0, 256, 32)

  rCTX!.beginPath()
  rCTX!.moveTo(r, 0)
  rCTX!.lineTo(r, 32)
  rCTX!.stroke()
  ;(<HTMLInputElement>document.getElementById('input-r')).value = `${r}`
}
function updateG(r: number, g: number, b: number) {
  const gGradient = gCTX!.createLinearGradient(0, 0, gCanvas.width, 0)

  gGradient.addColorStop(0, `rgb(${r}, 0, ${b})`)
  gGradient.addColorStop(1, `rgb(${r}, 255, ${b})`)

  gCTX!.fillStyle = gGradient
  gCTX!.fillRect(0, 0, 256, 32)

  gCTX!.beginPath()
  gCTX!.moveTo(g, 0)
  gCTX!.lineTo(g, 32)
  gCTX!.stroke()
  ;(<HTMLInputElement>document.getElementById('input-g')).value = `${g}`
}
function updateB(r: number, g: number, b: number) {
  const bGradient = bCTX!.createLinearGradient(0, 0, bCanvas.width, 0)

  bGradient.addColorStop(0, `rgb(${r}, ${g}, 0)`)
  bGradient.addColorStop(1, `rgb(${r}, ${g}, 255)`)

  bCTX!.fillStyle = bGradient
  bCTX!.fillRect(0, 0, 256, 32)

  bCTX!.beginPath()
  bCTX!.moveTo(b, 0)
  bCTX!.lineTo(b, 32)
  bCTX!.stroke()
  ;(<HTMLInputElement>document.getElementById('input-b')).value = `${b}`
}

// TODO colour hotbar
