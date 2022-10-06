import outerLayerURL from '../res/icons/toggle_skin_outer.png'
import outerLayer2URL from '../res/icons/toggle_skin_outer2.png'
import outerLayerBlueURL from '../res/icons/toggle_skin_outer_blue.png'
import outerLayer2BlueURL from '../res/icons/toggle_skin_outer2_blue.png'
import playURL from '../res/icons/play.png'
import pauseURL from '../res/icons/pause.png'
import playBlueURL from '../res/icons/play_blue.png'
import pauseBlueURL from '../res/icons/pause_blue.png'
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
import { genBlockUVs, raycaster } from './util'
import { clamp } from 'three/src/math/MathUtils'

import { mouse, controlKeyDown } from './input'
import { BodyPart } from './bodyPart'
import { UVSection } from './uvSection'
import {
  layersDiv,
  showCanvas2d,
  textureChecker,
  toggleAnimateButton,
  toggleBodyButton,
  toggleHeadButton,
  toggleLeftArmButton,
  toggleLeftLegButton,
  toggleOuterButton,
  toggleRightArmButton,
  toggleRightLegButton,
} from './staticElements'
import { hotbar, setHotbar } from './colorPicker'

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

const processingTextureSize = 256

export const textureCanvas = document.createElement('canvas')
textureCanvas.width = 64
textureCanvas.height = 64
export const textureCTX = textureCanvas.getContext('2d')!

export const showCanvas3d = document.createElement('canvas')
showCanvas3d.width = processingTextureSize
showCanvas3d.height = processingTextureSize
export const showCTX3d = showCanvas3d.getContext('2d')!

export const bufferCanvas2d = document.createElement('canvas')
bufferCanvas2d.width = processingTextureSize
bufferCanvas2d.height = processingTextureSize
export const bufferCTX2d = bufferCanvas2d.getContext('2d')!

export const bufferCanvas3d = document.createElement('canvas')
bufferCanvas3d.width = processingTextureSize
bufferCanvas3d.height = processingTextureSize
export const bufferCTX3d = bufferCanvas3d.getContext('2d')!

export const showCTX2d = showCanvas2d.getContext('2d')!
export let showZoom = 8 / 10
export let zoomPos = { x: -8, y: -8 }
export const mouseTexture = { x: 0, y: 0 }

const maskCanvas = document.createElement('canvas')
maskCanvas.width = processingTextureSize
maskCanvas.height = processingTextureSize
const maskCTX = maskCanvas.getContext('2d')!
maskCTX.fillStyle = 'black'
maskCTX.fillRect(0, 0, processingTextureSize, processingTextureSize)

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

export let playPlayerModelAnimation = false
export let playerModelAnimationTime = 0
export function togglePlayPlayerModelAnimation(selected: boolean) {
  playPlayerModelAnimation = !playPlayerModelAnimation

  updateToggleAnimateButton(selected)

  playerModelAnimationTime = Date.now()
  animatePlayerModel()
}

export function updateToggleAnimateButton(selected?: boolean) {
  if (selected) {
    if (playPlayerModelAnimation) {
      ;(toggleAnimateButton.children[0] as HTMLImageElement).src = pauseBlueURL
    } else {
      ;(toggleAnimateButton.children[0] as HTMLImageElement).src = playBlueURL
    }
  } else {
    if (playPlayerModelAnimation) {
      ;(toggleAnimateButton.children[0] as HTMLImageElement).src = pauseURL
    } else {
      ;(toggleAnimateButton.children[0] as HTMLImageElement).src = playURL
    }
  }
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

export function toggleOuterLayer(selected?: boolean) {
  outerLayerVisible = !outerLayerVisible
  for (const part of parts) {
    if (part.visible && outerLayerVisible) {
      scene.add(part.outerLayer)
    } else {
      scene.remove(part.outerLayer)
    }
  }

  updateToggleOuterButton(selected)

  setUVFromRaycast(mouseTexture.x, mouseTexture.y)
  updateTexture()
}

export function updateToggleOuterButton(selected?: boolean) {
  if (selected) {
    if (outerLayerVisible) {
      ;(toggleOuterButton.children[0] as HTMLImageElement).src = outerLayer2BlueURL
    } else {
      ;(toggleOuterButton.children[0] as HTMLImageElement).src = outerLayerBlueURL
    }
  } else {
    if (outerLayerVisible) {
      ;(toggleOuterButton.children[0] as HTMLImageElement).src = outerLayer2URL
    } else {
      ;(toggleOuterButton.children[0] as HTMLImageElement).src = outerLayerURL
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

function updateToggleButtons(index: number, visible: boolean) {
  if (visible) {
    ;[
      toggleHeadButton,
      toggleBodyButton,
      toggleRightArmButton,
      toggleLeftArmButton,
      toggleRightLegButton,
      toggleLeftLegButton,
    ][index].classList.remove('opacity-30')
  } else {
    ;[
      toggleHeadButton,
      toggleBodyButton,
      toggleRightArmButton,
      toggleLeftArmButton,
      toggleRightLegButton,
      toggleLeftLegButton,
    ][index].classList.add('opacity-30')
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

  updateToggleButtons(partIndex, part.visible)
}

export function togglePart(partIndex: number) {
  disableAltMode()

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

  updateToggleButtons(partIndex, part.visible)

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

export function setMouseTexture(x: number, y: number) {
  mouseTexture.x = Math.floor(x)
  mouseTexture.y = Math.floor(y)
}

export function setUVFromRaycast(defaultX = -1, defaultY = -1) {
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(scene.children)

  let intersect
  if (controlKeyDown && outerLayerVisible) {
    intersect = intersects[1]

    if (!intersect || outerSkinLayer.includes(intersect.object as Mesh)) {
      setMouseTexture(defaultX, defaultY)
      return
    }
  } else {
    intersect = intersects[0]
  }

  if (!intersect) {
    setMouseTexture(defaultX, defaultY)
    return
  }

  setMouseTexture(intersect.uv!.x * 64, 64 - intersect.uv!.y * 64)
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

// TODO make outlines have a set thickness regardless of zoom
// TODO outlines on transparent pixels should be based off of the colour of the pixel behind them
export function updateTexture() {
  const u = mouseTexture.x
  const v = mouseTexture.y

  const size = processingTextureSize

  layer1Mat.map!.needsUpdate = true
  layer2Mat.map!.needsUpdate = true

  textureCTX.imageSmoothingEnabled = false
  showCTX2d.imageSmoothingEnabled = false
  showCTX3d.imageSmoothingEnabled = false
  bufferCTX2d.imageSmoothingEnabled = false
  bufferCTX3d.imageSmoothingEnabled = false

  textureCTX.clearRect(0, 0, textureCanvas.width, textureCanvas.width)
  showCTX2d.clearRect(0, 0, showCanvas2d.width, showCanvas2d.width)
  showCTX3d.clearRect(0, 0, size, size)
  bufferCTX2d.clearRect(0, 0, size, size)
  bufferCTX3d.clearRect(0, 0, size, size)

  compileLayers(textureCTX, layers)
  zoomBorder()

  if (u !== undefined && v !== undefined) {
    const scale = size / 64

    bufferCTX2d.lineWidth = 1
    bufferCTX3d.lineWidth = 1

    for (const section of highlightSections) {
      section.highlight(bufferCTX2d, u, v, scale)
      section.highlight(bufferCTX3d, u, v, scale)
    }

    bufferCTX2d.fillStyle = 'rgb(200, 200, 200)'
    bufferCTX3d.fillStyle = 'rgb(200, 200, 200)'
    strokeRect(bufferCTX2d, (u * size) / 64, (v * size) / 64, scale, scale)
    strokeRect(bufferCTX3d, (u * size) / 64, (v * size) / 64, scale, scale)

    bufferCTX2d.globalCompositeOperation = 'difference'
    bufferCTX3d.globalCompositeOperation = 'difference'
  }

  bufferCTX2d.drawImage(textureCanvas, 0, 0, size, size)
  bufferCTX3d.drawImage(textureCanvas, 0, 0, size, size)

  bufferCTX2d.globalCompositeOperation = 'source-over'
  bufferCTX3d.globalCompositeOperation = 'source-over'

  drawZoomed(showCTX2d, bufferCanvas2d)
  showCTX3d.drawImage(bufferCanvas3d, 0, 0, showCanvas3d.width, showCanvas3d.width)
}

export function strokeRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillRect(x, y, w, 1)
  ctx.fillRect(x, y + h - 1, w, 1)
  ctx.fillRect(x, y, 1, h)
  ctx.fillRect(x + w - 1, y, 1, h)
}

function compileLayers(ctx: CanvasRenderingContext2D, layers: HTMLCanvasElement[]) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  for (const layer of layers) {
    ctx.drawImage(layer, 0, 0, ctx.canvas.width, ctx.canvas.height)
  }
}

function zoomBorder() {
  showCTX2d.fillStyle = 'rgb(30, 30, 30)'
  showCTX2d.fillRect(0, 0, showCanvas2d.width, showCanvas2d.width)

  showCTX2d.globalCompositeOperation = 'destination-out'
  drawZoomed(showCTX2d, maskCanvas)
  showCTX2d.globalCompositeOperation = 'source-over'
}

function drawZoomed(dest: CanvasRenderingContext2D, src: HTMLCanvasElement) {
  const srcSize = src.width
  const destSize = dest.canvas.width
  dest.drawImage(
    src,
    zoomPos.x * (srcSize / 64),
    zoomPos.y * (srcSize / 64),
    srcSize / showZoom,
    srcSize / showZoom,
    0,
    0,
    destSize,
    destSize,
  )
}

const layerMarginVert = 3
const layerPaddingVert = 6
const layerHeight = 64 + layerPaddingVert + layerMarginVert

setWidth(window.innerWidth)
setHeight(window.innerHeight)
