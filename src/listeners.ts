import defaultSkinURLClassic from '../res/shauapufu.png'
import defaultSkinURLSlim from '../res/neferupitou.png'
import plusURL from '../res/icons/plus.png'
import minusURL from '../res/icons/minus.png'
import plusSelectedURL from '../res/icons/plus_selected.png'
import minusSelectedURL from '../res/icons/minus_selected.png'
import undoURL from '../res/icons/undo.png'
import redoURL from '../res/icons/redo.png'
import undoSelectedURL from '../res/icons/undo_selected.png'
import redoSelectedURL from '../res/icons/redo_selected.png'
import saveButtonURL from '../res/icons/save.png'
import saveButtonSelectedURL from '../res/icons/save_selected.png'
import upURL from '../res/icons/up_arrow.png'
import upSelectedURL from '../res/icons/up_arrow_selected.png'
import downURL from '../res/icons/down_arrow.png'
import downSelectedURL from '../res/icons/down_arrow_selected.png'
import classicURL from '../res/icons/classic.png'
import classicSelectedURL from '../res/icons/classic_blue.png'
import slimURL from '../res/icons/slim.png'
import slimSelectedURL from '../res/icons/slim_blue.png'

import headURL from '../res/icons/parts/head.png'
import headSelectedURL from '../res/icons/parts/head_blue.png'
import bodyURL from '../res/icons/parts/body.png'
import bodySelectedURL from '../res/icons/parts/body_blue.png'
import leftArmURL from '../res/icons/parts/left_arm.png'
import leftArmSelectedURL from '../res/icons/parts/left_arm_blue.png'
import rightArmURL from '../res/icons/parts/right_arm.png'
import rightArmSelectedURL from '../res/icons/parts/right_arm_blue.png'
import leftLegURL from '../res/icons/parts/left_leg.png'
import leftLegSelectedURL from '../res/icons/parts/left_leg_blue.png'
import rightLegURL from '../res/icons/parts/right_leg.png'
import rightLegSelectedURL from '../res/icons/parts/right_leg_blue.png'

import {
  cameraControls,
  cameraMove,
  drawing,
  mouse,
  mouseButton,
  mouseDown,
  painting,
  picking,
  setCameraMove,
  setMouseButton,
  setMouseDown,
  setPainting,
  setDrawing,
  setPicking,
  setControlKeyDown,
  controlKeyDown,
} from './input'
import {
  camera,
  height,
  layer,
  layers,
  mouseTexture,
  redoStacks,
  renderer,
  scene,
  setHeight,
  setMouseTexture,
  setWidth,
  showZoom,
  textureCTX,
  undoStacks,
  width,
  zoom,
  zoomPos,
  outerLayerVisible,
  togglePartAlt,
  enableAltMode,
  disableAltMode,
  innerSkinLayer,
  updateTexture,
  draggingLayerDiv,
  dragLayer,
  stopDragging,
  getLayerCtx,
  addLayer,
  removeLayer,
  setLayer,
  togglePart,
  setClassicSlimModel,
  setUVFromRaycast,
  toggleOuterLayer,
  updateToggleAnimateButton,
  togglePlayPlayerModelAnimation,
  setToggleOuterButtonHover,
} from './render'
import { download, raycaster, rgb2hex, wrap } from './util'
import { clamp } from 'three/src/math/MathUtils'
import { Intersection, Mesh } from 'three'
import {
  aCanvas,
  addLayerDiv,
  bCanvas,
  colorPicker,
  dragOverlay,
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
  lCanvas,
  rCanvas,
  redoButton,
  removeLayerDiv,
  saveButton,
  saveDiv,
  sCanvas,
  showCanvas2d,
  skinTypeClassic,
  skinTypeSelect,
  skinTypeSlim,
  textureSkinTypeClassic,
  textureSkinTypeSlim,
  toggleAnimateButton,
  toggleBodyButton,
  toggleHeadButton,
  toggleLeftArmButton,
  toggleLeftLegButton,
  toggleOuterButton,
  toggleRightArmButton,
  toggleRightLegButton,
  undoButton,
} from './staticElements'
import {
  setAlpha,
  updateColorRGB,
  hotbarColors,
  hotbar,
  setHotbar,
  updateColorHSL,
  hsl,
  rgb,
  updateColorHex,
} from './colorPicker'

const prevDraw: { x: undefined | number; y: undefined | number } = { x: undefined, y: undefined }

window.addEventListener('blur', () => {
  setCameraMove(false)
  setMouseDown(false)
  setPainting(false)
  setDrawing(false)
  setPainting(false)
  setMouseButton(-1)
  setControlKeyDown(false)
  disableAltMode()
})

document.addEventListener('mousemove', onMouseMove)
function onMouseMove(event: MouseEvent) {
  if (draggingLayerDiv) dragLayer(event)

  mouse.x = (event.clientX / width) * 2 - 1
  mouse.y = -(event.clientY / height) * 2 + 1

  if (mouseDown && (mouseButton === 0 || mouseButton === 1 || mouseButton === 2)) {
    switch (picking) {
      case 'h':
        onPickN(onPickH, clamp(event.clientX - colorPicker.clientLeft, 0, 256), 360)
        break
      case 's':
        onPickN(onPickS, clamp(event.clientX - colorPicker.clientLeft, 0, 256), 100)
        break
      case 'l':
        onPickN(onPickL, clamp(event.clientX - colorPicker.clientLeft, 0, 256), 100)
        break
      case 'r':
        onPickN(onPickR, clamp(event.clientX - colorPicker.clientLeft, 0, 256), 255)
        break
      case 'g':
        onPickN(onPickG, clamp(event.clientX - colorPicker.clientLeft, 0, 256), 255)
        break
      case 'b':
        onPickN(onPickB, clamp(event.clientX - colorPicker.clientLeft, 0, 256), 255)
        break
      case 'a':
        onPickN(onPickA, clamp(event.clientX - colorPicker.clientLeft, 0, 256), 255)
        break
      default:
        if (painting) {
          if (mouseButton === 0 || mouseButton === 2) {
            draw(mouseTexture.x, mouseTexture.y)
          } else {
            eyeDropper3D()
          }
        }
    }
  }

  if (cameraMove && mouseButton === 0) {
    cameraControls(event.movementX, event.movementY)
  }
}

function eyeDropper3D() {
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(scene.children)

  if (intersects.length > 0) {
    let intersect
    if (controlKeyDown && outerLayerVisible) {
      intersect = intersects[1]
      intersectDrop(intersect)
    } else {
      if (!intersectDrop(intersects[0])) {
        intersectDrop(intersects[1])
      }
    }
  }
}

function intersectDrop(intersect: Intersection): boolean {
  const x = Math.floor(intersect.uv!.x * 64)
  const y = 64 - Math.floor(intersect.uv!.y * 64) - 1

  const c = textureCTX.getImageData(x, y, 1, 1).data

  setAlpha(c![3])
  updateColorRGB(c![0], c![1], c![2])

  if (hotbarColors[hotbar].alpha === 0) {
    return false
  }
  return true
}

showCanvas2d.addEventListener('mousemove', onDraw)
function onDraw(this: HTMLElement, event: MouseEvent) {
  drawFromOffset(event.offsetX, event.offsetY)
}

function draw(x: number, y: number, connectPrev: boolean = false) {
  if (x < 0 || y < 0 || x > 63 || y > 63) {
    prevDraw.x = undefined
    prevDraw.y = undefined
    return
  }

  // if starting to draw...
  if (prevDraw.x === undefined || prevDraw.y === undefined) {
    prevDraw.x = x
    prevDraw.y = y

    undoableState()
  }

  if (mouseButton === 0) {
    getLayerCtx(layer).fillStyle = `rgb(${hotbarColors[hotbar].color.r * 255}, ${hotbarColors[hotbar].color.g * 255}, ${
      hotbarColors[hotbar].color.b * 255
    }, ${hotbarColors[hotbar].alpha / 255})`

    getLayerCtx(layer).clearRect(x, y, 1, 1)
    getLayerCtx(layer).fillRect(x, y, 1, 1)

    if (connectPrev) {
      line(x, y, prevDraw.x, prevDraw.y)
    }
  } else {
    getLayerCtx(layer).clearRect(x, y, 1, 1)
    clearLine(x, y, prevDraw.x, prevDraw.y)
  }

  prevDraw.x = x
  prevDraw.y = y

  updateTexture()
}

function eyeDropper2D(x: number, y: number) {
  const c = textureCTX.getImageData(x, y, 1, 1).data

  setAlpha(c![3])
  updateColorRGB(c![0], c![1], c![2])
}

function clearLine(x: number, y: number, x1: number, y1: number) {
  const distX = x1 - x
  const distY = y1 - y
  const steps = Math.sqrt(distX * distX + distY * distY)

  for (let i = 0; i < steps; i++) {
    getLayerCtx(layer).clearRect(Math.floor(x + (distX * i) / steps), Math.floor(y + (distY * i) / steps), 1, 1)
  }
}

function line(x: number, y: number, x1: number, y1: number) {
  const distX = x1 - x
  const distY = y1 - y
  const steps = Math.sqrt(distX * distX + distY * distY)

  for (let i = 0; i < steps; i++) {
    getLayerCtx(layer).clearRect(Math.floor(x + (distX * i) / steps), Math.floor(y + (distY * i) / steps), 1, 1)
    getLayerCtx(layer).fillRect(Math.floor(x + (distX * i) / steps), Math.floor(y + (distY * i) / steps), 1, 1)
  }
}

showCanvas2d.addEventListener('mousedown', onDrawStart)
function onDrawStart(this: HTMLElement, event: MouseEvent) {
  setMouseButton(event.button)

  if (event.button === 0 || event.button === 1 || event.button === 2) {
    setDrawing(true)

    drawFromOffset(event.offsetX, event.offsetY)
  }
}

saveDiv.addEventListener('mousedown', exitSave)
function exitSave(event: Event) {
  if (event instanceof MouseEvent && event.button === 2) return

  saveDiv.hidden = true
}

document.addEventListener('contextmenu', onContextMenu)
function onContextMenu(event: Event) {
  if (saveDiv.hidden) event.preventDefault()
}

function drawFromOffset(x: number, y: number) {
  setMouseTexture(
    (x * 64) / showCanvas2d.width / showZoom + zoomPos.x,
    (y * 64) / showCanvas2d.height / showZoom + zoomPos.y,
  )

  if (drawing) {
    if (mouseButton === 1) {
      eyeDropper2D(mouseTexture.x, mouseTexture.y)
    } else {
      draw(mouseTexture.x, mouseTexture.y, true)
    }
  }

  updateTexture()
}

document.addEventListener('wheel', (event: WheelEvent) => {
  if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
    setHotbar(wrap(hotbar + (event.deltaY > 0 ? 1 : -1), 0, 8))
  }
})

renderer.domElement.addEventListener('wheel', onZoom3D)
function onZoom3D(event: WheelEvent) {
  if (
    (event.ctrlKey || event.shiftKey || event.altKey) &&
    !((camera.position.length() < 13 && event.deltaY < 0) || (camera.position.length() > 40 && event.deltaY > 0))
  ) {
    camera.position.multiplyScalar(Math.pow(Math.pow(2, 1 / 4), event.deltaY / 100))
  }

  event.preventDefault()
}

showCanvas2d.addEventListener('wheel', onZoom)
function onZoom(this: HTMLElement, event: WheelEvent) {
  if (event.ctrlKey || event.shiftKey) {
    zoom(event.deltaY / -100)
    updateTexture()
  }

  event.preventDefault()
}

renderer.domElement.addEventListener('mousemove', (_event: MouseEvent) => {
  setUVFromRaycast()

  updateTexture()
})

renderer.domElement.addEventListener('mousedown', onSceneMouseDown)
function onSceneMouseDown(event: MouseEvent) {
  setMouseButton(event.button)

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(scene.children)

  if (!event.shiftKey && intersects.length > 0) {
    if (event.altKey) {
      if (event.button !== 0) return
      let index = innerSkinLayer.indexOf(intersects[0].object as Mesh)
      if (index === -1) return

      togglePartAlt(index)
    } else {
      setPainting(true)

      if (mouseButton === 0 || mouseButton === 2) {
        draw(mouseTexture.x, mouseTexture.y)
        updateTexture()
      } else if (mouseButton === 1) {
        eyeDropper3D()
      }
    }
  } else {
    setCameraMove(true)
  }
}

document.addEventListener('mousedown', onMouseDown)
function onMouseDown(event: MouseEvent) {
  setMouseDown(true)
  setMouseButton(event.button)
}

document.addEventListener('mouseup', onMouseUp)
function onMouseUp(_event: MouseEvent) {
  setCameraMove(false)
  setMouseDown(false)
  setPainting(false)
  setDrawing(false)
  setPicking('')

  if (draggingLayerDiv) stopDragging()

  prevDraw.x = undefined
  prevDraw.y = undefined
}

document.addEventListener('keydown', onKeyDown)
function onKeyDown(event: KeyboardEvent) {
  const eventKey = event.key.toLowerCase()

  if (!saveDiv.hidden) {
    saveDiv.hidden = true
    return
  }

  if (event.ctrlKey) {
    if (eventKey === 's') {
      download()
      event.preventDefault()
    }

    if (eventKey === 'z') {
      if (event.shiftKey) {
        redo()
      } else {
        undo()
      }
      event.preventDefault()
    }

    if (eventKey === 'y') {
      redo()
      event.preventDefault()
    }
  }

  if (eventKey === 'tab') {
    toggleOuterLayer()
    event.preventDefault()
  }

  if (eventKey === 'control') {
    setControlKeyDown(true)
    event.preventDefault()
  }

  if (eventKey === 'shift') {
    renderer.domElement.classList.add('cursor-grab')
  }

  if (eventKey === 'alt') {
    enableAltMode()
    event.preventDefault()
  }

  // space key
  if (eventKey === ' ') {
    togglePlayPlayerModelAnimation(toggleAnimateButtonHover)
    event.preventDefault()
  }

  updateTexture()
}

function undo() {
  if (undoStacks.length > 0) {
    const undoLayers = undoStacks.pop()!
    newCanvasState(redoStacks, undoLayers)
  }

  updateTexture()
}

function redo() {
  if (redoStacks.length > 0) {
    const redoLayers = redoStacks.pop()!
    newCanvasState(undoStacks, redoLayers)
  }

  updateTexture()
}

function undoableState() {
  newCanvasState(undoStacks)
  redoStacks.length = 0
}

// TODO keep layer order when undoing/redoing
// TODO stop making new states when exiting/entering canvas/model
export function newCanvasState(
  stack: { [key: string]: HTMLCanvasElement }[],
  newLayers?: { [key: string]: HTMLCanvasElement },
) {
  const stackElement: { [key: string]: HTMLCanvasElement } = {}
  for (let l = 0; l < layers.length; l++) {
    const oldCanvas = document.createElement('canvas')
    oldCanvas.width = 64
    oldCanvas.height = 64
    oldCanvas.getContext('2d')?.drawImage(layers[l], 0, 0)
    stackElement[layers[l].id.slice(0, -7)] = oldCanvas
  }
  stack.push(stackElement)

  if (newLayers) {
    for (const l in layers) {
      if (!newLayers[layers[l].id.slice(0, -7)]) removeLayer(layers[l])
    }

    for (const newLayer in newLayers) {
      let canvas = document.getElementById(newLayer + '-canvas') as HTMLCanvasElement
      if (!canvas) {
        addLayer(newLayer)
        canvas = document.getElementById(newLayer + '-canvas') as HTMLCanvasElement
      }

      const ctx = canvas.getContext('2d')!
      ctx.clearRect(0, 0, 64, 64)
      ctx.drawImage(newLayers[newLayer], 0, 0)
    }
  }
}

document.addEventListener('keyup', onKeyUp)
function onKeyUp(event: KeyboardEvent) {
  const eventKey = event.key.toLowerCase()

  if (eventKey === 'control') {
    setControlKeyDown(false)
  }

  if (eventKey === 'shift') {
    renderer.domElement.classList.remove('cursor-grab')
  }

  if (eventKey === 'alt') {
    disableAltMode()
    event.preventDefault()
  }

  updateTexture()
}

document.addEventListener('dragover', (event: DragEvent) => {
  dragOverlay.hidden = false

  event.preventDefault()
})

dragOverlay.addEventListener('dragleave', () => {
  dragOverlay.hidden = true
})
document.addEventListener('dragend', () => {
  dragOverlay.hidden = true
})

hotbarCanvas.addEventListener('mousedown', hotbarClick)

function hotbarClick(event: MouseEvent) {
  const clientWidth = hotbarCanvas.clientWidth - 35 // padding
  const offsetX = event.offsetX - 35 // padding

  const border = clientWidth * (2 / 184)
  const innerWidth = clientWidth - border * 2
  const size = innerWidth * (1 / 9)

  setHotbar(clamp(Math.floor((offsetX - border) / size), 0, 8))
}

window.addEventListener('resize', onWindowResize)
function onWindowResize() {
  setWidth(window.innerWidth)
  setHeight(window.innerHeight)

  renderer.setSize(width, height)

  camera.aspect = width / height
  camera.updateProjectionMatrix()
}

hCanvas.addEventListener('mousedown', (event: MouseEvent) => {
  setPicking('h')
  onPickN(onPickH, event.offsetX, 360)
})
sCanvas.addEventListener('mousedown', (event: MouseEvent) => {
  setPicking('s')
  onPickN(onPickS, event.offsetX, 100)
})
lCanvas.addEventListener('mousedown', (event: MouseEvent) => {
  setPicking('l')
  onPickN(onPickL, event.offsetX, 100)
})

rCanvas.addEventListener('mousedown', (event: MouseEvent) => {
  setPicking('r')
  onPickN(onPickR, event.offsetX, 255)
})
gCanvas.addEventListener('mousedown', (event: MouseEvent) => {
  setPicking('g')
  onPickN(onPickG, event.offsetX, 255)
})
bCanvas.addEventListener('mousedown', (event: MouseEvent) => {
  setPicking('b')
  onPickN(onPickB, event.offsetX, 255)
})
aCanvas.addEventListener('mousedown', (event: MouseEvent) => {
  setPicking('a')
  onPickN(onPickA, event.offsetX, 255)
})

function onPickN(func: Function, value: number, n: number) {
  func((value * n) / 256)
}

function onPickH(value: number) {
  updateColorHSL(value, hsl.s, hsl.l)
}

function onPickS(value: number) {
  updateColorHSL(hsl.h, value, hsl.l)
}

function onPickL(value: number) {
  updateColorHSL(hsl.h, hsl.s, value)
}

function onPickR(value: number) {
  updateColorRGB(value, rgb.g, rgb.b)
}

function onPickG(value: number) {
  updateColorRGB(rgb.r, value, rgb.b)
}

function onPickB(value: number) {
  updateColorRGB(rgb.r, rgb.g, value)
}

function onPickA(value: number) {
  setAlpha(Math.floor(value))
  updateColorRGB(rgb.r, rgb.g, rgb.b)
}

inputHElement.addEventListener('input', inputH)
function inputH(this: HTMLInputElement, _event: Event) {
  onPickH(clamp(Number(this.value), 0, 360))
}

inputSElement.addEventListener('input', inputS)
function inputS(this: HTMLInputElement, _event: Event) {
  onPickS(clamp(Number(this.value), 0, 100))
}

inputLElement.addEventListener('input', inputL)
function inputL(this: HTMLInputElement, _event: Event) {
  onPickL(clamp(Number(this.value), 0, 100))
}

inputRElement.addEventListener('input', inputR)
function inputR(this: HTMLInputElement, _event: Event) {
  onPickR(clamp(Number(this.value), 0, 255))
}

inputGElement.addEventListener('input', inputG)
function inputG(this: HTMLInputElement, _event: Event) {
  onPickG(clamp(Number(this.value), 0, 255))
}

inputBElement.addEventListener('input', inputB)
function inputB(this: HTMLInputElement, _event: Event) {
  onPickB(clamp(Number(this.value), 0, 255))
}

inputAElement.addEventListener('input', inputA)
function inputA(this: HTMLInputElement, _event: Event) {
  onPickA(clamp(Number(this.value), 0, 255))
}

const ups = document.getElementsByClassName('up')
for (const up of ups) {
  up.addEventListener('mousedown', upMouseDown)
  up.addEventListener('mouseenter', function (this: HTMLImageElement, _event: Event) {
    this.src = upSelectedURL
  })
  up.addEventListener('mouseleave', function (this: HTMLImageElement, _event: Event) {
    this.src = upURL
  })
}
const downs = document.getElementsByClassName('down')
for (const down of downs) {
  down.addEventListener('mousedown', downMouseDown)
  down.addEventListener('mouseenter', function (this: HTMLImageElement, _event: Event) {
    this.src = downSelectedURL
  })
  down.addEventListener('mouseleave', function (this: HTMLImageElement, _event: Event) {
    this.src = downURL
  })
}

function upMouseDown(this: HTMLImageElement, _event: Event) {
  switch (this.classList[1]) {
    case 'arrow-h':
      onPickH(clamp(hsl.h + 1, 0, 360))
      break
    case 'arrow-s':
      onPickS(clamp(hsl.s + 1, 0, 100))
      break
    case 'arrow-l':
      onPickL(clamp(hsl.l + 1, 0, 100))
      break
    case 'arrow-r':
      onPickR(clamp(rgb.r + 1, 0, 255))
      break
    case 'arrow-g':
      onPickG(clamp(rgb.g + 1, 0, 255))
      break
    case 'arrow-b':
      onPickB(clamp(rgb.b + 1, 0, 255))
      break
    case 'arrow-a':
      onPickA(clamp(hotbarColors[hotbar].alpha + 1, 0, 255))
      break
  }
}
function downMouseDown(this: HTMLImageElement, _event: Event) {
  switch (this.classList[1]) {
    case 'arrow-h':
      onPickH(clamp(hsl.h - 1, 0, 360))
      break
    case 'arrow-s':
      onPickS(clamp(hsl.s - 1, 0, 100))
      break
    case 'arrow-l':
      onPickL(clamp(hsl.l - 1, 0, 100))
      break
    case 'arrow-r':
      onPickR(clamp(rgb.r - 1, 0, 255))
      break
    case 'arrow-g':
      onPickG(clamp(rgb.g - 1, 0, 255))
      break
    case 'arrow-b':
      onPickB(clamp(rgb.b - 1, 0, 255))
      break
    case 'arrow-a':
      onPickA(clamp(hotbarColors[hotbar].alpha - 1, 0, 255))
      break
  }
}

inputResultElement.addEventListener('input', onResultType)
function onResultType(this: HTMLInputElement, _event: Event) {
  const bar = hotbarColors[hotbar]
  updateColorHex(rgb2hex(this.value, (bar.color.getHex() << 8) + (bar.alpha & 0xff)))
}

const textureImage = document.createElement('img')
textureImage.addEventListener('load', () => {
  if (textureImage.width === 64 && (textureImage.height === 64 || textureImage.height === 32)) {
    setTexture(textureImage)
  } else {
    // TODO alert about skin size
  }
})

const fileReader = new FileReader()
fileReader.addEventListener(
  'load',
  function () {
    textureImage.src = <string>fileReader.result
  },
  false,
)

// TODO add name-search skin importing
function setTexture(image: HTMLImageElement) {
  const newLayer = addLayer()
  const newCtx = newLayer.getContext('2d')!
  newCtx.clearRect(0, 0, 64, 64)
  newCtx.drawImage(image, 0, 0)

  setLayer(newLayer)
  updateTexture()
}

document.addEventListener('drop', (event: DragEvent) => {
  dragOverlay.hidden = true
  disableAltMode()

  event.preventDefault()

  if (layers.length >= 4) return

  undoableState()

  if (event.dataTransfer?.items) {
    if (event.dataTransfer.items[0].kind === 'file') {
      const file = event.dataTransfer.items[0].getAsFile()
      if (file?.name.endsWith('png')) {
        fileReader.readAsDataURL(file)
      }
    }
  } else {
    const file = event.dataTransfer!.files[0]
    if (file.name.endsWith('png')) {
      fileReader.readAsDataURL(file)
    }
  }
})

textureSkinTypeClassic.addEventListener('click', () => {
  textureSkinTypeClassic.classList.add('selected')
  textureSkinTypeSlim.classList.remove('selected')

  setClassicSlimModel('classic')
})
textureSkinTypeClassic.addEventListener('mouseleave', () => {
  textureSkinTypeClassic.getElementsByTagName('img')[0].src = classicURL
})
textureSkinTypeClassic.addEventListener('mouseenter', () => {
  textureSkinTypeClassic.getElementsByTagName('img')[0].src = classicSelectedURL
})

textureSkinTypeSlim.addEventListener('click', () => {
  textureSkinTypeSlim.classList.add('selected')
  textureSkinTypeClassic.classList.remove('selected')

  setClassicSlimModel('slim')
})
textureSkinTypeSlim.addEventListener('mouseleave', () => {
  textureSkinTypeSlim.getElementsByTagName('img')[0].src = slimURL
})
textureSkinTypeSlim.addEventListener('mouseenter', () => {
  textureSkinTypeSlim.getElementsByTagName('img')[0].src = slimSelectedURL
})

skinTypeClassic.addEventListener('click', () => {
  textureSkinTypeClassic.classList.add('selected')
  textureSkinTypeSlim.classList.remove('selected')

  setClassicSlimModel('classic')
  textureImage.src = defaultSkinURLClassic
  skinTypeSelect.hidden = true
})
skinTypeSlim.addEventListener('click', () => {
  textureSkinTypeSlim.classList.add('selected')
  textureSkinTypeClassic.classList.remove('selected')

  setClassicSlimModel('slim')
  textureImage.src = defaultSkinURLSlim
  skinTypeSelect.hidden = true
})

// TODO remove layer limit and add scrolling
addLayerDiv.addEventListener('mousedown', () => {
  if (layers.length >= 4) return

  undoableState()
  addLayer()
})
addLayerDiv.addEventListener('mouseleave', () => {
  ;(addLayerDiv.children[0] as HTMLImageElement).src = plusURL
})
addLayerDiv.addEventListener('mouseenter', () => {
  ;(addLayerDiv.children[0] as HTMLImageElement).src = plusSelectedURL
})

removeLayerDiv.addEventListener('mousedown', () => {
  if (layers.length <= 1) {
    // TODO display message that you can't remove the last layer
    return
  }

  undoableState()
  removeLayer(layers[layer])
})
removeLayerDiv.addEventListener('mouseleave', () => {
  ;(removeLayerDiv.children[0] as HTMLImageElement).src = minusURL
})
removeLayerDiv.addEventListener('mouseenter', () => {
  ;(removeLayerDiv.children[0] as HTMLImageElement).src = minusSelectedURL
})

undoButton.addEventListener('click', undo)
undoButton.addEventListener('mouseleave', () => {
  ;(undoButton.children[0] as HTMLImageElement).src = undoURL
})
undoButton.addEventListener('mouseenter', () => {
  ;(undoButton.children[0] as HTMLImageElement).src = undoSelectedURL
})

redoButton.addEventListener('click', redo)
redoButton.addEventListener('mouseleave', () => {
  ;(redoButton.children[0] as HTMLImageElement).src = redoURL
})
redoButton.addEventListener('mouseenter', () => {
  ;(redoButton.children[0] as HTMLImageElement).src = redoSelectedURL
})

toggleOuterButton.addEventListener('click', () => {
  toggleOuterLayer()
})
toggleOuterButton.addEventListener('mouseleave', () => {
  setToggleOuterButtonHover(false)
})
toggleOuterButton.addEventListener('mouseenter', () => {
  setToggleOuterButtonHover(true)
})

let toggleAnimateButtonHover = false
toggleAnimateButton.addEventListener('click', () => {
  togglePlayPlayerModelAnimation(toggleAnimateButtonHover)
})
toggleAnimateButton.addEventListener('mouseleave', () => {
  toggleAnimateButtonHover = false

  updateToggleAnimateButton(toggleAnimateButtonHover)
})
toggleAnimateButton.addEventListener('mouseenter', () => {
  toggleAnimateButtonHover = true

  updateToggleAnimateButton(toggleAnimateButtonHover)
})

saveButton.addEventListener('click', download)
saveButton.addEventListener('mouseleave', () => {
  ;(saveButton.children[0] as HTMLImageElement).src = saveButtonURL
})
saveButton.addEventListener('mouseenter', () => {
  ;(saveButton.children[0] as HTMLImageElement).src = saveButtonSelectedURL
})

toggleHeadButton.addEventListener('click', () => {
  togglePart(0)
})
toggleHeadButton.addEventListener('mouseleave', () => {
  toggleHeadButton.src = headURL
})
toggleHeadButton.addEventListener('mouseenter', () => {
  toggleHeadButton.src = headSelectedURL
})

toggleBodyButton.addEventListener('click', () => {
  togglePart(1)
})
toggleBodyButton.addEventListener('mouseleave', () => {
  toggleBodyButton.src = bodyURL
})
toggleBodyButton.addEventListener('mouseenter', () => {
  toggleBodyButton.src = bodySelectedURL
})

toggleRightArmButton.addEventListener('click', () => {
  togglePart(2)
})
toggleRightArmButton.addEventListener('mouseleave', () => {
  toggleRightArmButton.src = rightArmURL
})
toggleRightArmButton.addEventListener('mouseenter', () => {
  toggleRightArmButton.src = rightArmSelectedURL
})

toggleLeftArmButton.addEventListener('click', () => {
  togglePart(3)
})
toggleLeftArmButton.addEventListener('mouseleave', () => {
  toggleLeftArmButton.src = leftArmURL
})
toggleLeftArmButton.addEventListener('mouseenter', () => {
  toggleLeftArmButton.src = leftArmSelectedURL
})

toggleRightLegButton.addEventListener('click', () => {
  togglePart(4)
})
toggleRightLegButton.addEventListener('mouseleave', () => {
  toggleRightLegButton.src = rightLegURL
})
toggleRightLegButton.addEventListener('mouseenter', () => {
  toggleRightLegButton.src = rightLegSelectedURL
})

toggleLeftLegButton.addEventListener('click', () => {
  togglePart(5)
})
toggleLeftLegButton.addEventListener('mouseleave', () => {
  toggleLeftLegButton.src = leftLegURL
})
toggleLeftLegButton.addEventListener('mouseenter', () => {
  toggleLeftLegButton.src = leftLegSelectedURL
})

const imgs = document.getElementsByTagName('img')

// ! FIREFOX DRAG FIX
for (const img of imgs) {
  img.ondragstart = disableDragging
}

function disableDragging(e: Event) {
  e.preventDefault()
}
