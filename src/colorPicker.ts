import { Color } from 'three'
import hotbarImgURL from '../res/hotbar.png'
import hotbarSelectImgURL from '../res/hotbar_select.png'
import {
  resultCanvas,
  inputResultElement,
  hCanvas,
  inputHElement,
  sCanvas,
  inputSElement,
  lCanvas,
  inputLElement,
  rCanvas,
  inputRElement,
  gCanvas,
  inputGElement,
  bCanvas,
  inputBElement,
  aCanvas,
  inputAElement,
  hotbarCanvas,
} from './staticElements'

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

  updateColorRGB(
    hotbarColors[hotbar].color.r * 255,
    hotbarColors[hotbar].color.g * 255,
    hotbarColors[hotbar].color.b * 255,
  )
}

export function setAlpha(value: number) {
  hotbarColors[hotbar].alpha = value
}

export function updateColorHex(hex: number) {
  hex = Math.floor(hex)

  hotbarColors[hotbar].color.set(hex >> 8)
  setAlpha(hex & 0xff)

  hotbarColors[hotbar].color.getHSL(hsl)
  hsl.h = Math.floor(360 * hsl.h)
  hsl.s = Math.floor(100 * hsl.s)
  hsl.l = Math.floor(100 * hsl.l)

  rgb.r = Math.floor(hotbarColors[hotbar].color.r * 255)
  rgb.g = Math.floor(hotbarColors[hotbar].color.g * 255)
  rgb.b = Math.floor(hotbarColors[hotbar].color.b * 255)

  updateColor()
}

export function updateColorHSL(h: number, s: number, l: number) {
  h = Math.floor(h)
  s = Math.floor(s)
  l = Math.floor(l)

  hsl.h = h
  hsl.s = s
  hsl.l = l

  hotbarColors[hotbar].color.set(`hsl(${h}, ${s}%, ${l}%)`)
  rgb.r = Math.floor(hotbarColors[hotbar].color.r * 255)
  rgb.g = Math.floor(hotbarColors[hotbar].color.g * 255)
  rgb.b = Math.floor(hotbarColors[hotbar].color.b * 255)

  updateColor()
  updateHEX()
}

export function updateColorRGB(r: number, g: number, b: number) {
  r = Math.floor(r)
  g = Math.floor(g)
  b = Math.floor(b)

  rgb.r = r
  rgb.g = g
  rgb.b = b

  hotbarColors[hotbar].color.set(`rgb(${r}, ${g}, ${b})`)
  hotbarColors[hotbar].color.getHSL(hsl)
  hsl.h = Math.floor(360 * hsl.h)
  hsl.s = Math.floor(100 * hsl.s)
  hsl.l = Math.floor(100 * hsl.l)

  updateColor()
  updateHEX()
}

export function updateColor() {
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
