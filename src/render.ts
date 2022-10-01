import {
  CanvasTexture,
  Color,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  NearestFilter,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three'
import { compileLayers, genBlockUVs, raycaster, strokeRect } from './util'
import { clamp } from 'three/src/math/MathUtils'

import hotbarImgURL from '../res/hotbar.png'
import hotbarSelectImgURL from '../res/hotbar_select.png'
import { mouse, shift } from './input'
import { BodyPart } from './bodyPart'
import { UVSection } from './uvSection'
import {
  aCanvas,
  bCanvas,
  gCanvas,
  hCanvas,
  hotbarCanvas,
  inputAElement,
  inputBElement,
  inputGElement,
  inputHElement,
  inputLElement,
  inputRElement,
  inputResultElement,
  inputSElement,
  layersDiv,
  lCanvas,
  rCanvas,
  resultCanvas,
  sCanvas,
  showCanvas2d,
  textureCanvas,
  textureChecker,
} from './staticElements'

export let width = window.innerWidth
export let height = window.innerHeight

export const scene = new Scene()
scene.background = new Color(0x383838)

export let layer = 0
export let draggingLayerDiv: HTMLDivElement | null = null
export let draggingOrigin: number = 0
export let prevDragPos: number = 0
const draggingSpacer = document.createElement('div')
draggingSpacer.style.height = '73px'
let draggingLayer: HTMLCanvasElement

export const layers: HTMLCanvasElement[] = []
// ? layerCount is used to keep track of what layers have existed before
let layerCount = 0

export const undoStacks: { [key: string]: HTMLCanvasElement }[] = []
export const redoStacks: { [key: string]: HTMLCanvasElement }[] = []

const skinTextureSize = 1024

export const textureCTX = textureCanvas.getContext('2d')!

export const showCanvas3d = document.createElement('canvas')
showCanvas3d.width = skinTextureSize
showCanvas3d.height = skinTextureSize
export const showCTX3d = showCanvas3d.getContext('2d')!

export const highlightCanvas = document.createElement('canvas')
highlightCanvas.width = 64
highlightCanvas.height = 64

export const highlightCTX = highlightCanvas.getContext('2d')!

export const showCTX2d = showCanvas2d.getContext('2d')!
export let showZoom = 8 / 10
export let zoomPos = { x: -8, y: -8 }
export const mouseTexture = { x: 0, y: 0 }

const maskCanvas = document.createElement('canvas')
maskCanvas.width = 64
maskCanvas.height = 64
const maskCTX = maskCanvas.getContext('2d')!
maskCTX.fillStyle = 'black'
maskCTX.fillRect(0, 0, 64, 64)

const texture = new CanvasTexture(showCanvas3d)
texture.minFilter = NearestFilter
texture.magFilter = NearestFilter

// TODO make a toggle for shading in the 3d viewport

export const layer1Mat = new MeshBasicMaterial({
  color: 0xffffff,
  map: texture,
  depthWrite: true,
  depthTest: true,
  side: DoubleSide,
})

export const layer2Mat = new MeshBasicMaterial({
  color: 0xffffff,
  transparent: true,
  map: texture,
  depthWrite: true,
  depthTest: true,
  side: DoubleSide,
})

export const whiteMat = new MeshBasicMaterial({
  color: 0xffffff,
  depthWrite: true,
  depthTest: true,
  side: DoubleSide,
})

export const blackMat = new MeshBasicMaterial({
  color: 0x000000,
  depthWrite: true,
  depthTest: true,
  side: DoubleSide,
})

export let outerLayerVisible: boolean = true

const EPS = 0.01

// TODO fix transparent pixels cutting through other pixels
const classicParts = [
  new BodyPart( // head
    genBlockUVs(0, 64, 8, 8, 8, 64, 64),
    genBlockUVs(32, 64, 8, 8, 8, 64, 64),
    new Vector3(0, 12, 0),
    new Vector3(0, 0, 0),
    new Vector3(8, 8, 8),
  ),
  new BodyPart( // torso
    genBlockUVs(16, 48, 8, 12, 4, 64, 64),
    genBlockUVs(16, 32, 8, 12, 4, 64, 64),
    new Vector3(0 + EPS, 2 + EPS, 0 + EPS),
    new Vector3(0, 0, 0),
    new Vector3(8, 12, 4),
  ),
  new BodyPart( // right arm
    genBlockUVs(40, 48, 4, 12, 4, 64, 64),
    genBlockUVs(40, 32, 4, 12, 4, 64, 64),
    new Vector3(-6 + EPS * 4, 6 + EPS * 4, 0 + EPS * 4),
    new Vector3(0, -4, 0),
    new Vector3(4, 12, 4),
  ),
  new BodyPart( // left arm
    genBlockUVs(32, 16, 4, 12, 4, 64, 64),
    genBlockUVs(48, 16, 4, 12, 4, 64, 64),
    new Vector3(6 + EPS * 4, 6 + EPS * 4, 0 + EPS * 4),
    new Vector3(0, -4, 0),
    new Vector3(4, 12, 4),
  ),
  new BodyPart( // right leg
    genBlockUVs(0, 48, 4, 12, 4, 64, 64),
    genBlockUVs(0, 32, 4, 12, 4, 64, 64),
    new Vector3(-2 + EPS * 2, -4 + EPS * 2, 0 + EPS * 2),
    new Vector3(0, -6, 0),
    new Vector3(4, 12, 4),
  ),
  new BodyPart( // left leg
    genBlockUVs(16, 16, 4, 12, 4, 64, 64),
    genBlockUVs(0, 16, 4, 12, 4, 64, 64),
    new Vector3(2 + EPS * 3, -4 + EPS * 3, 0 + EPS * 3),
    new Vector3(0, -6, 0),
    new Vector3(4, 12, 4),
  ),
]
// scale head outer layer
classicParts[0].outerLayer.geometry.scale(9 / 8.5, 9 / 8.5, 9 / 8.5)

const slimParts = [
  new BodyPart( // head
    genBlockUVs(0, 64, 8, 8, 8, 64, 64),
    genBlockUVs(32, 64, 8, 8, 8, 64, 64),
    new Vector3(0, 12, 0),
    new Vector3(0, 0, 0),
    new Vector3(8, 8, 8),
  ),
  new BodyPart( // torso
    genBlockUVs(16, 48, 8, 12, 4, 64, 64),
    genBlockUVs(16, 32, 8, 12, 4, 64, 64),
    new Vector3(0 + EPS, 2 + EPS, 0 + EPS),
    new Vector3(0, 0, 0),
    new Vector3(8, 12, 4),
  ),
  new BodyPart( // right arm
    genBlockUVs(40, 48, 3, 12, 4, 64, 64),
    genBlockUVs(40, 32, 3, 12, 4, 64, 64),
    new Vector3(-5.5 + EPS * 4, 6 + EPS * 4, 0 + EPS * 4),
    new Vector3(0, -4, 0),
    new Vector3(3, 12, 4),
  ),
  new BodyPart( // left arm
    genBlockUVs(32, 16, 3, 12, 4, 64, 64),
    genBlockUVs(48, 16, 3, 12, 4, 64, 64),
    new Vector3(5.5 + EPS * 4, 6 + EPS * 4, 0 + EPS * 4),
    new Vector3(0, -4, 0),
    new Vector3(3, 12, 4),
  ),
  new BodyPart( // right leg
    genBlockUVs(0, 48, 4, 12, 4, 64, 64),
    genBlockUVs(0, 32, 4, 12, 4, 64, 64),
    new Vector3(-2 + EPS * 2, -4 + EPS * 2, 0 + EPS * 2),
    new Vector3(0, -6, 0),
    new Vector3(4, 12, 4),
  ),
  new BodyPart( // left leg
    genBlockUVs(16, 16, 4, 12, 4, 64, 64),
    genBlockUVs(0, 16, 4, 12, 4, 64, 64),
    new Vector3(2 + EPS * 3, -4 + EPS * 3, 0 + EPS * 3),
    new Vector3(0, -6, 0),
    new Vector3(4, 12, 4),
  ),
]
// scale head outer layer
slimParts[0].outerLayer.geometry.scale(9 / 8.5, 9 / 8.5, 9 / 8.5)

export let parts = slimParts

export const innerSkinLayer: Mesh[] = []
export const outerSkinLayer: Mesh[] = []

for (const part of parts) {
  part.visible = true
  part.addToSceneAlt()
}

disableAltMode()

const classicSections = [
  new UVSection(0, 64, 8, 8, 8),
  new UVSection(32, 64, 8, 8, 8),
  new UVSection(16, 48, 8, 12, 4),
  new UVSection(16, 32, 8, 12, 4),
  new UVSection(40, 48, 4, 12, 4),
  new UVSection(40, 32, 4, 12, 4),
  new UVSection(32, 16, 4, 12, 4),
  new UVSection(48, 16, 4, 12, 4),
  new UVSection(0, 48, 4, 12, 4),
  new UVSection(0, 32, 4, 12, 4),
  new UVSection(16, 16, 4, 12, 4),
  new UVSection(0, 16, 4, 12, 4),
]

const slimSections = [
  new UVSection(0, 64, 8, 8, 8),
  new UVSection(32, 64, 8, 8, 8),
  new UVSection(16, 48, 8, 12, 4),
  new UVSection(16, 32, 8, 12, 4),
  new UVSection(40, 48, 3, 12, 4),
  new UVSection(40, 32, 3, 12, 4),
  new UVSection(32, 16, 3, 12, 4),
  new UVSection(48, 16, 3, 12, 4),
  new UVSection(0, 48, 4, 12, 4),
  new UVSection(0, 32, 4, 12, 4),
  new UVSection(16, 16, 4, 12, 4),
  new UVSection(0, 16, 4, 12, 4),
]

let highlightSections = slimSections

export const camera = new PerspectiveCamera(75, width / height, 0.1, 1000)
camera.rotation.order = 'ZYX'
camera.position.set(24, 24, 24)

export const renderer = new WebGLRenderer()
renderer.setSize(width, height)
renderer.domElement.id = 'dom-element'
document.body.appendChild(renderer.domElement)

const resultCTX = resultCanvas.getContext('2d')!

const hCTX = hCanvas.getContext('2d')!
const sCTX = sCanvas.getContext('2d')!
const lCTX = lCanvas.getContext('2d')!
const rCTX = rCanvas.getContext('2d')!
const gCTX = gCanvas.getContext('2d')!
const bCTX = bCanvas.getContext('2d')!
const aCTX = aCanvas.getContext('2d')!

export const hsl = { h: 0, s: 0, l: 0 }
export const rgb = { r: 0, g: 0, b: 0 }

export let hotbar = 0
export const hotbarImg = document.createElement('img')
hotbarImg.src = hotbarImgURL
hotbarImg.addEventListener('load', () => {
  setHotbar(hotbar)
})
export const hotbarSelectImg = document.createElement('img')
hotbarSelectImg.src = hotbarSelectImgURL
hotbarSelectImg.addEventListener('load', () => {
  setHotbar(hotbar)
})
export const hotbarCTX = hotbarCanvas.getContext('2d')!
export const hotbarColors: { color: Color; alpha: number }[] = [
  { color: new Color(1, 0, 0), alpha: 255 },
  { color: new Color(1, 0, 0), alpha: 255 },
  { color: new Color(1, 0, 0), alpha: 255 },
  { color: new Color(1, 0, 0), alpha: 255 },
  { color: new Color(1, 0, 0), alpha: 255 },
  { color: new Color(1, 0, 0), alpha: 255 },
  { color: new Color(1, 0, 0), alpha: 255 },
  { color: new Color(1, 0, 0), alpha: 255 },
  { color: new Color(1, 0, 0), alpha: 255 },
]

setHotbar(hotbar)

export let playPlayerModelAnimation = false
export let playerModelAnimationTime = 0
export function setPlayPlayerModelAnimation(value: boolean) {
  playPlayerModelAnimation = value

  playerModelAnimationTime = Date.now()
  animatePlayerModel()
}

export function setClassicSlimModel(type: string) {
  for (const part of parts) {
    part.removeFromSceneAlt()
  }

  if (type === 'classic') {
    parts = classicParts
    highlightSections = classicSections
  } else if (type === 'slim') {
    parts = slimParts
    highlightSections = slimSections
  } else {
    throw new Error('Invalid model type')
  }

  for (const part of parts) {
    part.visible = true
    part.addToSceneAlt()
  }

  disableAltMode()
}

export function toggleClassicSlimModel() {
  if (parts === classicParts) {
    setClassicSlimModel('slim')
  } else {
    setClassicSlimModel('classic')
  }
}

// TODO add more animation modes (walking, running, attacking, sneaking, looking around etc)
// TODO take a look at Planet Minecraft's skin viewer for inspiration
// TODO make walking animation more accurate, currently uses arbitrary values
export function animatePlayerModel() {
  const now = Date.now() - playerModelAnimationTime

  // rotate arms
  parts[2].innerLayer.setRotationFromAxisAngle(new Vector3(1, 0, 0), Math.sin(now / 300) / 4)
  parts[2].outerLayer.setRotationFromAxisAngle(new Vector3(1, 0, 0), Math.sin(now / 300) / 4)
  parts[3].innerLayer.setRotationFromAxisAngle(new Vector3(1, 0, 0), -Math.sin(now / 300) / 4)
  parts[3].outerLayer.setRotationFromAxisAngle(new Vector3(1, 0, 0), -Math.sin(now / 300) / 4)

  // rotate legs
  parts[4].innerLayer.setRotationFromAxisAngle(new Vector3(1, 0, 0), -Math.sin(now / 300) / 4)
  parts[4].outerLayer.setRotationFromAxisAngle(new Vector3(1, 0, 0), -Math.sin(now / 300) / 4)
  parts[5].innerLayer.setRotationFromAxisAngle(new Vector3(1, 0, 0), Math.sin(now / 300) / 4)
  parts[5].outerLayer.setRotationFromAxisAngle(new Vector3(1, 0, 0), Math.sin(now / 300) / 4)
}

export function toggleOuterLayer() {
  outerLayerVisible = !outerLayerVisible
  for (const part of parts) {
    if (part.visible && outerLayerVisible) {
      scene.add(part.outerLayer)
    } else {
      scene.remove(part.outerLayer)
    }
  }
}

export function enableAltMode() {
  for (const part of parts) {
    part.enableAltMode()
  }
}

export function disableAltMode() {
  for (const part of parts) {
    part.disableAltMode()
  }

  centerModel()
}

export function centerModel() {
  const center = new Vector3(0, 0, 0)
  let visibleCount = 0
  for (const part of parts) {
    if (part.visible) {
      center.add(part.innerLayer.position)
      visibleCount++
    }
  }

  center.divideScalar(visibleCount)

  for (const part of parts) {
    part.innerLayer.position.sub(center)
    part.outerLayer.position.sub(center)
  }
}

export function togglePartAlt(partIndex: number) {
  let visibleCount = 0
  for (const part of parts) {
    if (part.visible) {
      visibleCount++
    }
  }

  if (visibleCount === 1 && parts[partIndex].visible) return

  const part = parts[partIndex]
  part.setVisible(!part.visible)
}

export function togglePart(partIndex: number) {
  let visibleCount = 0
  for (const part of parts) {
    if (part.visible) {
      visibleCount++
    }
  }

  if (visibleCount === 1 && parts[partIndex].visible) return

  const part = parts[partIndex]
  part.visible = !part.visible

  if (part.visible) {
    part.addToScene()
  } else {
    part.removeFromScene()
  }

  centerModel()
}

export function getLayerCtx(layer: number) {
  return layers[layer].getContext('2d')!
}

function startDragging(layerDiv: HTMLDivElement, y: number) {
  if (draggingLayerDiv) {
    draggingLayerDiv.style.position = 'static'
    draggingLayerDiv.style.zIndex = '0'
  }

  layerDiv.style.position = 'absolute'
  layerDiv.style.zIndex = '50'

  const rect = layerDiv.getBoundingClientRect()
  const rect2 = layerDiv.parentElement!.getBoundingClientRect()
  const rect3 = layerDiv.parentElement!.parentElement!.getBoundingClientRect()
  draggingOrigin = y - (rect.top - rect2.top)
  prevDragPos = y - draggingOrigin + rect2.top - rect3.top - 3

  layerDiv.style.top = `${prevDragPos}px`

  draggingLayerDiv = layerDiv

  layersDiv.removeChild(draggingLayerDiv)
  layersDiv.appendChild(draggingLayerDiv)

  const index = clamp(
    Math.floor((prevDragPos - rightSideHeight + layerHeight / 2 - 40) / layerHeight),
    0,
    layers.length,
  )

  if (draggingSpacer.parentElement) layersDiv.removeChild(draggingSpacer)
  layersDiv.insertBefore(draggingSpacer, layersDiv.children[index])
}

// TODO re-do layer dragging to work better on all browsers
export function dragLayer(event: MouseEvent) {
  if (!draggingLayerDiv) return

  let index = clamp(Math.floor((prevDragPos - rightSideHeight + layerHeight / 2 - 40) / layerHeight), 0, layers.length)
  draggingLayer = layers.splice(layers.length - index - 1, 1)[0]

  let y = event.clientY

  const rect = draggingLayerDiv.parentElement!.getBoundingClientRect()
  const rect2 = draggingLayerDiv.parentElement!.parentElement!.getBoundingClientRect()

  y = y - draggingOrigin + rect.top - rect2.top - 3

  const minY = rightSideHeight + 43

  if (navigator.userAgent.indexOf('Chrome') != -1) {
    y = clamp(y, minY, minY + layers.length * layerHeight + 6)
  } else {
    y = clamp(y, minY, minY + layers.length * layerHeight)
  }

  draggingLayerDiv.style.top = `${y}px`

  prevDragPos = y

  index = clamp(Math.floor((prevDragPos - rightSideHeight + layerHeight / 2 - 40) / layerHeight), 0, layers.length)

  layers.splice(layers.length - index, 0, draggingLayer)

  if (draggingSpacer.parentElement) layersDiv.removeChild(draggingSpacer)
  layersDiv.insertBefore(draggingSpacer, layersDiv.children[index])

  setLayer(draggingLayer)

  updateTexture()
}

export function stopDragging() {
  if (!draggingLayerDiv) return

  draggingLayerDiv.style.position = ''
  draggingLayerDiv.style.zIndex = ''
  draggingLayerDiv.style.left = ''
  draggingLayerDiv.style.top = ''

  const index = clamp(
    Math.floor((prevDragPos - rightSideHeight + layerHeight / 2 - 40) / layerHeight),
    0,
    layers.length,
  )

  layersDiv.removeChild(draggingSpacer)
  layersDiv.removeChild(draggingLayerDiv)
  layersDiv.insertBefore(draggingLayerDiv, layersDiv.children[index])

  draggingLayerDiv = null

  updateTexture()
}

export function addLayer(layerid?: string) {
  if (!layerid) layerid = 'layer' + ++layerCount

  const newLayer = document.createElement('canvas')
  layers.push(newLayer)
  newLayer.width = 64
  newLayer.height = 64
  newLayer.id = layerid + '-canvas'
  newLayer.className = 'layer-canvas'

  const layerDiv = document.createElement('div')
  layerDiv.style.width = `${rightSideWidth - 6}px`
  layerDiv.id = layerid
  layerDiv.className = 'layer'

  const layerLabel = document.createElement('p')
  layerLabel.innerHTML = 'Layer ' + layerid.slice(5)
  layerLabel.id = layerid + '-label'
  layerLabel.className = 'layer-label'

  layerDiv.appendChild(layerLabel)
  layerDiv.appendChild(newLayer)

  layerDiv.addEventListener('mousedown', (event: MouseEvent) => {
    setLayer(newLayer)
    startDragging(layerDiv, event.clientY)
    dragLayer(event)
  })

  layersDiv.prepend(layerDiv)

  return newLayer
}

export function removeLayer(oldLayer: HTMLCanvasElement) {
  const index = layers.indexOf(oldLayer!)
  const div = oldLayer.parentElement as HTMLDivElement

  layersDiv.removeChild(div!)
  layers.splice(index, 1)

  updateTexture()

  layer = 0
  layers[0].parentElement!.style.backgroundColor = 'rgb(10, 10, 10)'
}

export function setLayer(l: HTMLCanvasElement) {
  // ! must match CSS --background
  layers[layer].parentElement!.style.backgroundColor = 'rgb(30, 30, 30)'

  layer = layers.indexOf(l)

  l.parentElement!.style.backgroundColor = 'rgb(10, 10, 10)'
}

export function setHotbar(value: number) {
  hotbar = value

  hotbarCTX.imageSmoothingEnabled = false
  hotbarCTX.clearRect(0, 0, hotbarCanvas.width, hotbarCanvas.height)

  hotbarCTX.drawImage(hotbarImg, 1, 1)

  hotbarCTX.drawImage(hotbarSelectImg, 20 * hotbar, 0)

  for (let i = 0; i < hotbarColors.length; i++) {
    hotbarCTX.fillStyle = hotbarColors[i].color.getStyle()
    hotbarCTX.fillRect(i * 20 + 4, 4, 16, 16)
  }

  updateColor(
    'rgb',
    hotbarColors[hotbar].color.r * 255,
    hotbarColors[hotbar].color.g * 255,
    hotbarColors[hotbar].color.b * 255,
  )
}

export function setMouseTexture(x: number, y: number) {
  mouseTexture.x = Math.floor(x)
  mouseTexture.y = Math.floor(y)
}

export function zoom(value: number) {
  const newZoom = clamp(showZoom * Math.pow(Math.pow(2, 1 / 4), value), 8 / 10, 8)

  const x = zoomPos.x
  const y = zoomPos.y

  let mx = mouseTexture.x
  let my = mouseTexture.y

  const newSize = 64 / newZoom

  zoomPos = {
    x: (x - mx) * (showZoom / newZoom) + mx,
    y: (y - my) * (showZoom / newZoom) + my,
  }

  zoomPos.x = clamp(zoomPos.x, -8, 64 - newSize + 8)
  zoomPos.y = clamp(zoomPos.y, -8, 64 - newSize + 8)

  showZoom = newZoom
}

const textureHeight = 0.5
const textureWidth = 0.3

export let rightSideWidth = 0
export let rightSideHeight = 0

export function setWidth(value: number) {
  width = value

  rightSideWidth = Math.min(window.innerWidth * textureWidth, window.innerHeight * textureHeight)

  showCanvas2d.width = rightSideWidth
  textureChecker.width = rightSideWidth

  for (const layer of layersDiv.children) (layer as HTMLDivElement).style.width = `${rightSideWidth - 6}px`

  // TODO (refactor) un-hardcode this to the height of  everything above the layer div
  rightSideHeight = rightSideWidth + 35

  setHotbar(hotbar)
  updateTexture()
}

export function setHeight(value: number) {
  height = value

  rightSideWidth = Math.min(window.innerWidth * textureWidth, window.innerHeight * textureHeight)

  showCanvas2d.height = rightSideWidth
  textureChecker.height = rightSideWidth

  for (const layer of layersDiv.children) (layer as HTMLDivElement).style.width = `${rightSideWidth - 6}px`

  // TODO (refactor) un-hardcode this to the height of  everything above the layer div
  rightSideHeight = rightSideWidth + 35

  updateTexture()
}

export function setAlpha(value: number) {
  hotbarColors[hotbar].alpha = value
}

export function updateTexture3D() {
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(scene.children)

  if (intersects.length > 0) {
    if (shift && outerLayerVisible) {
      if (innerSkinLayer.includes(intersects[1].object as Mesh)) {
        const uv = intersects[1].uv!
        updateTexture(Math.floor(uv.x * 64), Math.floor(uv.y * 64), '2d')
      }
    } else {
      const uv = intersects[0].uv!
      updateTexture(Math.floor(uv.x * 64), Math.floor(uv.y * 64), '2d')
    }
  } else {
    updateTexture()
  }
}

// TODO part outline needs to be dynamic colour
// TODO outlines on transparent pixels should be based off of the colour of the pixel behind them
// TODO (refactor) simplify math by using only width, not height
export function updateTexture(u?: number, v?: number, highlight?: string) {
  textureCTX.imageSmoothingEnabled = false
  showCTX2d.imageSmoothingEnabled = false
  showCTX3d.imageSmoothingEnabled = false
  highlightCTX.imageSmoothingEnabled = false

  layer1Mat.map!.needsUpdate = true
  layer2Mat.map!.needsUpdate = true

  textureCTX.clearRect(0, 0, textureCanvas.width, textureCanvas.height)
  showCTX3d.clearRect(0, 0, showCanvas3d.width, showCanvas3d.height)

  compileLayers(textureCTX, layers)
  compileLayers(showCTX3d, layers)

  showCTX2d.fillStyle = 'rgb(30, 30, 30)'
  showCTX2d.fillRect(0, 0, showCanvas2d.width, showCanvas2d.height)

  showCTX2d.globalCompositeOperation = 'destination-out'
  showCTX2d.drawImage(
    maskCanvas,
    zoomPos.x * (textureCanvas.width / 64),
    zoomPos.y * (textureCanvas.height / 64),
    textureCanvas.width / showZoom,
    textureCanvas.height / showZoom,
    0,
    0,
    showCanvas2d.width,
    showCanvas2d.height,
  )
  showCTX2d.globalCompositeOperation = 'source-over'

  showCTX2d.drawImage(
    textureCanvas,
    zoomPos.x * (textureCanvas.width / 64),
    zoomPos.y * (textureCanvas.height / 64),
    textureCanvas.width / showZoom,
    textureCanvas.height / showZoom,
    0,
    0,
    showCanvas2d.width,
    showCanvas2d.height,
  )

  if (!highlight) return

  const data = textureCTX.getImageData(0, 0, textureCanvas.width, textureCanvas.height).data
  const index = (u! + (63 - v!) * 64) * 4
  let colour = (255 - data[index] + (255 - data[index] + 1) + (255 - data[index] + 2)) / 3
  if (colour <= 128 && colour > 64) colour = 64
  if (colour < 192 && colour > 128) colour = 192

  if (highlight === '2d') {
    highlightCanvas.width = showCanvas2d.width * showZoom
    highlightCanvas.height = showCanvas2d.height * showZoom

    highlightCTX.clearRect(0, 0, highlightCanvas.width, highlightCanvas.height)

    let scale = highlightCanvas.width / 64
    highlightCTX.lineWidth = clamp(Math.floor((1 / 8) * scale), 2, 1000)
    for (const section of highlightSections) {
      section.highlight(highlightCTX, u!, v!, scale)
    }

    showCTX3d.fillStyle = `rgb(${colour}, ${colour}, ${colour})`
    scale = showCanvas3d.width / 64
    strokeRect(showCTX3d, u! * scale, (63 - v!) * scale, 16, 16)
  } else {
    highlightCanvas.width = skinTextureSize
    highlightCanvas.height = skinTextureSize

    highlightCTX.clearRect(0, 0, highlightCanvas.width, highlightCanvas.height)

    let scale = highlightCanvas.width / 64
    highlightCTX.lineWidth = 2
    for (const section of highlightSections) {
      section.highlight(highlightCTX, u!, v!, scale)
    }

    showCTX3d.drawImage(highlightCanvas, 0, 0, showCanvas3d.width, showCanvas3d.height)

    highlightCTX.clearRect(0, 0, highlightCanvas.width, highlightCanvas.height)
    highlightCTX.fillStyle = `rgb(${colour}, ${colour}, ${colour})`
    scale = highlightCanvas.width / 64
    strokeRect(highlightCTX, u! * scale, (63 - v!) * scale, 16, 16)
  }

  showCTX2d.drawImage(
    highlightCanvas,
    zoomPos.x * (highlightCanvas.width / 64),
    zoomPos.y * (highlightCanvas.height / 64),
    highlightCanvas.width / showZoom,
    highlightCanvas.height / showZoom,
    0,
    0,
    showCanvas2d.width,
    showCanvas2d.height,
  )
}

// rhhex: red / hue / hex
// gs: green / saturation
// bl: blue / lightness
// TODO (refactor) split into different functions
export function updateColor(type: string, rhhex: number, gs: number, bl: number) {
  rhhex = Math.floor(rhhex)
  gs = Math.floor(gs)
  bl = Math.floor(bl)

  switch (type) {
    case 'hsl':
      hsl.h = rhhex
      hsl.s = gs
      hsl.l = bl

      hotbarColors[hotbar].color.set(`hsl(${rhhex}, ${gs}%, ${bl}%)`)
      rgb.r = Math.floor(hotbarColors[hotbar].color.r * 255)
      rgb.g = Math.floor(hotbarColors[hotbar].color.g * 255)
      rgb.b = Math.floor(hotbarColors[hotbar].color.b * 255)
      break
    case 'rgb':
      rgb.r = rhhex
      rgb.g = gs
      rgb.b = bl

      hotbarColors[hotbar].color.set(`rgb(${rhhex}, ${gs}, ${bl})`)
      hotbarColors[hotbar].color.getHSL(hsl)
      hsl.h = Math.floor(360 * hsl.h)
      hsl.s = Math.floor(100 * hsl.s)
      hsl.l = Math.floor(100 * hsl.l)
      break
    case 'hex':
      hotbarColors[hotbar].color.set(rhhex >> 8)
      setAlpha(rhhex & 0xff)

      hotbarColors[hotbar].color.getHSL(hsl)
      hsl.h = Math.floor(360 * hsl.h)
      hsl.s = Math.floor(100 * hsl.s)
      hsl.l = Math.floor(100 * hsl.l)

      rgb.r = Math.floor(hotbarColors[hotbar].color.r * 255)
      rgb.g = Math.floor(hotbarColors[hotbar].color.g * 255)
      rgb.b = Math.floor(hotbarColors[hotbar].color.b * 255)
      break
  }

  resultCTX.clearRect(0, 0, resultCanvas.width, resultCanvas.height)

  resultCTX.fillStyle = `rgba(${hotbarColors[hotbar].color.r * 255}, ${hotbarColors[hotbar].color.g * 255}, ${
    hotbarColors[hotbar].color.b * 255
  }, ${hotbarColors[hotbar].alpha / 255})`
  resultCTX.fillRect(0, 0, 256, 32)

  hotbarCTX.fillStyle = hotbarColors[hotbar].color.getStyle()
  hotbarCTX.fillRect(hotbar * 20 + 4, 4, 16, 16)

  updateHSL()
  updateRGB()
  updateA(
    hotbarColors[hotbar].color.r,
    hotbarColors[hotbar].color.g,
    hotbarColors[hotbar].color.b,
    hotbarColors[hotbar].alpha,
  )
  if (type !== 'hex') updateHEX()
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
  inputResultElement.value = hotbarColors[hotbar].color.getHexString() + hotbarColors[hotbar].alpha.toString(16)
}

function updateH(h: number, s: number, l: number) {
  const hGradient = hCTX.createLinearGradient(0, 0, hCanvas.width, 0)

  hGradient.addColorStop(0, `hsl(0, ${s}%, ${l}%)`)
  hGradient.addColorStop(0.15, `hsl(60, ${s}%, ${l}%)`)
  hGradient.addColorStop(0.33, `hsl(120, ${s}%, ${l}%)`)
  hGradient.addColorStop(0.49, `hsl(180, ${s}%, ${l}%)`)
  hGradient.addColorStop(0.67, `hsl(240, ${s}%, ${l}%)`)
  hGradient.addColorStop(0.84, `hsl(300, ${s}%, ${l}%)`)
  hGradient.addColorStop(1, `hsl(360, ${s}%, ${l}%)`)

  hCTX.fillStyle = hGradient
  hCTX.fillRect(0, 0, 256, 32)

  hCTX.beginPath()
  hCTX.moveTo((h * 256) / 360, 0)
  hCTX.lineTo((h * 256) / 360, 32)
  hCTX.stroke()
  inputHElement.value = `${h}`
}

function updateS(h: number, s: number, l: number) {
  const sGradient = sCTX.createLinearGradient(0, 0, sCanvas.width, 0)

  sGradient.addColorStop(0, `hsl(${h}, 0%, ${l}%)`)
  sGradient.addColorStop(1, `hsl(${h}, 100%, ${l}%)`)

  sCTX.fillStyle = sGradient
  sCTX.fillRect(0, 0, 256, 32)

  sCTX.beginPath()
  sCTX.moveTo((s * 256) / 100, 0)
  sCTX.lineTo((s * 256) / 100, 32)
  sCTX.stroke()
  inputSElement.value = `${s}`
}

function updateL(h: number, s: number, l: number) {
  const lGradient = lCTX.createLinearGradient(0, 0, lCanvas.width, 0)

  lGradient.addColorStop(0, `hsl(${h}, ${s}%, 0%)`)
  lGradient.addColorStop(0.5, `hsl(${h}, ${s}%, 50%)`)
  lGradient.addColorStop(1, `hsl(${h}, ${s}%, 100%)`)

  lCTX.fillStyle = lGradient
  lCTX.fillRect(0, 0, 256, 32)

  lCTX.beginPath()
  lCTX.moveTo((l * 256) / 100, 0)
  lCTX.lineTo((l * 256) / 100, 32)
  lCTX.stroke()
  inputLElement.value = `${l}`
}

function updateR(r: number, g: number, b: number) {
  const rGradient = rCTX.createLinearGradient(0, 0, rCanvas.width, 0)

  rGradient.addColorStop(0, `rgb(0, ${g}, ${b})`)
  rGradient.addColorStop(1, `rgb(255, ${g}, ${b})`)

  rCTX.fillStyle = rGradient
  rCTX.fillRect(0, 0, 256, 32)

  rCTX.beginPath()
  rCTX.moveTo(r, 0)
  rCTX.lineTo(r, 32)
  rCTX.stroke()
  inputRElement.value = `${r}`
}

function updateG(r: number, g: number, b: number) {
  const gGradient = gCTX.createLinearGradient(0, 0, gCanvas.width, 0)

  gGradient.addColorStop(0, `rgb(${r}, 0, ${b})`)
  gGradient.addColorStop(1, `rgb(${r}, 255, ${b})`)

  gCTX.fillStyle = gGradient
  gCTX.fillRect(0, 0, 256, 32)

  gCTX.beginPath()
  gCTX.moveTo(g, 0)
  gCTX.lineTo(g, 32)
  gCTX.stroke()
  inputGElement.value = `${g}`
}

function updateB(r: number, g: number, b: number) {
  const bGradient = bCTX.createLinearGradient(0, 0, bCanvas.width, 0)

  bGradient.addColorStop(0, `rgb(${r}, ${g}, 0)`)
  bGradient.addColorStop(1, `rgb(${r}, ${g}, 255)`)

  bCTX.fillStyle = bGradient
  bCTX.fillRect(0, 0, 256, 32)

  bCTX.beginPath()
  bCTX.moveTo(b, 0)
  bCTX.lineTo(b, 32)
  bCTX.stroke()
  inputBElement.value = `${b}`
}

function updateA(r: number, g: number, b: number, a: number) {
  const aGradient = aCTX.createLinearGradient(0, 0, aCanvas.width, 0)

  aGradient.addColorStop(0, `rgba(${r * 255}, ${g * 255}, ${b * 255}, 0)`)
  aGradient.addColorStop(1, `rgba(${r * 255}, ${g * 255}, ${b * 255}, 255)`)

  aCTX.clearRect(0, 0, aCanvas.width, aCanvas.height)

  aCTX.fillStyle = aGradient
  aCTX.fillRect(0, 0, 256, 32)

  aCTX.beginPath()
  aCTX.moveTo(a, 0)
  aCTX.lineTo(a, 32)
  aCTX.stroke()
  inputAElement.value = `${a}`
}

const layerMarginVert = 3
const layerPaddingVert = 6
const layerHeight = 64 + layerPaddingVert + layerMarginVert

setWidth(window.innerWidth)
setHeight(window.innerHeight)
