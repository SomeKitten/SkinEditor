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

import defaultHeadURL from '../res/neferupitou.png'
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

export const layers: HTMLCanvasElement[] = []
export const layerCTXs: CanvasRenderingContext2D[] = []

export const undoStacks: HTMLCanvasElement[][] = []
export const redoStacks: HTMLCanvasElement[][] = []

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

export const textureImage = document.createElement('img')
textureImage.src = defaultHeadURL
textureImage.addEventListener('load', () => {
  if (textureImage.width === 64 && textureImage.height === 64) {
    setTexture()
  } else {
    // TODO better alert
    alert('Skin texture must be 64x64')
  }
})

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

export const innerSkinLayer: Mesh[] = []
export const outerSkinLayer: Mesh[] = []

const EPS = 0.01

export const parts = [
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
  // TODO (high priority) add slim/wide toggle
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
parts[0].outerLayer.geometry.scale(9 / 8.5, 9 / 8.5, 9 / 8.5)

disableAltMode()

const highlightSections = [
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

// TODO (high priority) add more animation modes (walking, running, attacking, sneaking, looking around etc)
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

export function togglePart(partIndex: number) {
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

export function addLayer() {
  layers.push(document.createElement('canvas'))
  layers[layers.length - 1].width = 64
  layers[layers.length - 1].height = 64
  layers[layers.length - 1].id = 'layer' + (layers.length - 1) + '-canvas'
  layers[layers.length - 1].className = 'layer-canvas'

  layerCTXs.push(layers[layers.length - 1].getContext('2d')!)

  const layerDiv = document.createElement('div')
  layerDiv.id = 'layer' + (layers.length - 1)
  layerDiv.className = 'layer'

  const layerLabel = document.createElement('p')
  layerLabel.innerHTML = 'Layer ' + (layers.length - 1)
  layerLabel.id = 'layer' + (layers.length - 1) + '-label'
  layerLabel.className = 'layer-label'

  layerDiv.appendChild(layerLabel)
  layerDiv.appendChild(layers[layers.length - 1])

  const l = layers.length - 1
  layerDiv.addEventListener('mousedown', (_event: MouseEvent) => {
    setLayer(l)
  })

  layersDiv.prepend(layerDiv)
}

export function setLayer(value: number) {
  // ! must match CSS --background
  layers[layer].parentElement!.style.backgroundColor = 'rgb(30, 30, 30)'

  layer = value

  layers[layer].parentElement!.style.backgroundColor = 'rgb(10, 10, 10)'
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
  console.log(newZoom)

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

export function setWidth(value: number) {
  width = value

  const rightSideWidth = Math.min(window.innerWidth * textureWidth, window.innerHeight * textureHeight)

  showCanvas2d.width = rightSideWidth
  textureChecker.width = rightSideWidth

  layersDiv.style.width = rightSideWidth + 6 + 'px'

  setHotbar(hotbar)
  updateTexture()
}

export function setHeight(value: number) {
  height = value

  const rightSideWidth = Math.min(window.innerWidth * textureWidth, window.innerHeight * textureHeight)

  showCanvas2d.height = rightSideWidth
  textureChecker.height = rightSideWidth

  layersDiv.style.height = rightSideWidth - 6 + 'px'

  updateTexture()
}

setWidth(window.innerWidth)
setHeight(window.innerHeight)

export function setAlpha(value: number) {
  hotbarColors[hotbar].alpha = value
}

// TODO (high priority) figure out what to do with other layers on import
// perhaps make a new layer and import into that?

// TODO (high priority) add name-search skin importing
function setTexture() {
  layerCTXs[0].clearRect(0, 0, 64, 64)
  layerCTXs[0].drawImage(textureImage, 0, 0)
  updateTexture()
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

// TODO (high priority) part outline needs to be dynamic colour
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

  showCTX2d.clearRect(0, 0, showCanvas2d.width, showCanvas2d.height)
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
      hotbarColors[hotbar].color.set(rhhex)

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

addLayer()
addLayer()
addLayer()

setLayer(0)
