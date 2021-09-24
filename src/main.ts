import './style.css'
import {
    BoxGeometry,
    BufferAttribute,
    DoubleSide,
    Mesh,
    MeshBasicMaterial,
    NearestFilter,
    PerspectiveCamera,
    Raycaster,
    Scene,
    Spherical,
    TextureLoader,
    Vector2,
    Vector3,
    WebGLRenderer,
} from 'three'

function genBlockUVs(u: number, v: number, x: number, y: number, z: number, texturew: number, textureh: number) {
    // bl, br, tl, tr
    let top = [
        [u + z, v],
        [u + z + x, v],
        [u + z, v - z],
        [u + z + x, v - z],
    ]

    let bottom = [
        [u + z + x, v - z],
        [u + z + x + x, v - z],
        [u + z + x, v],
        [u + z + x + x, v],
    ]

    let right = [
        [u, v - z],
        [u + z, v - z],
        [u, v - z - y],
        [u + z, v - z - y],
    ]

    let front = [
        [u + z, v - z],
        [u + x + z, v - z],
        [u + z, v - z - y],
        [u + x + z, v - z - y],
    ]

    let left = [
        [u + z + x, v - z],
        [u + z + z + x, v - z],
        [u + z + x, v - z - y],
        [u + z + z + x, v - z - y],
    ]

    let back = [
        [u + z + x + z, v - z],
        [u + z + x + z + x, v - z],
        [u + z + x + z, v - z - y],
        [u + z + x + z + x, v - z - y],
    ]

    let uvs_all = []

    for (let uv of left) {
        uvs_all.push(uv[0] / texturew)
        uvs_all.push(uv[1] / textureh)
    }
    for (let uv of right) {
        uvs_all.push(uv[0] / texturew)
        uvs_all.push(uv[1] / textureh)
    }
    for (let uv of top) {
        uvs_all.push(uv[0] / texturew)
        uvs_all.push(uv[1] / textureh)
    }
    for (let uv of bottom) {
        uvs_all.push(uv[0] / texturew)
        uvs_all.push(uv[1] / textureh)
    }
    for (let uv of front) {
        uvs_all.push(uv[0] / texturew)
        uvs_all.push(uv[1] / textureh)
    }
    for (let uv of back) {
        uvs_all.push(uv[0] / texturew)
        uvs_all.push(uv[1] / textureh)
    }

    return new BufferAttribute(new Float32Array(uvs_all), 2)
}

function cameraControls(movementX: number, movementY: number) {
    if (mouseButton === 0) {
        targetS.setFromVector3(camera.position)
        rotateSpherical(targetS, movementY * sensitivity, movementX * sensitivity)

        let adjust = 0
        let tolerance = 0.01
        if (targetS.phi < tolerance) {
            adjust = tolerance - targetS.phi
        }
        if (targetS.phi > Math.PI - tolerance) {
            adjust = Math.PI - tolerance - targetS.phi
        }
        targetS.phi += adjust

        camera.position.setFromSpherical(targetS)

        lookAt(camera, camOrbit)
    }
}

function rotateSpherical(spherical: Spherical, angleX: number, angleY: number) {
    spherical.theta -= angleY
    spherical.phi = spherical.phi - angleX
}

function lookAt(obj: PerspectiveCamera, focus: Vector3) {
    let offset = focus.clone()
    offset.sub(obj.position)

    obj.rotation.y = -Math.atan2(offset.x, -offset.z)
    obj.rotation.x = Math.atan2(offset.y, Math.sqrt(offset.x * offset.x + offset.z * offset.z))
    obj.rotation.z = 0
}

window.onresize = () => {
    width = width
    height = height

    renderer.setSize(width, height)

    camera.aspect = width / height
    camera.updateProjectionMatrix()
}

document.addEventListener('mousemove', onMouseMove)
function onMouseMove(event: MouseEvent) {
    mouse.x = (event.clientX / width) * 2 - 1
    mouse.y = -(event.clientY / height) * 2 + 1

    if (mouseDown) {
        cameraControls(event.movementX, event.movementY)
    }

    mouseDrag = true
}

document.addEventListener('mousedown', onMouseDown)
export function onMouseDown(event: MouseEvent) {
    mouseDown = true
    mouseButton = event.button
    mouseDrag = false
}

document.addEventListener('mouseup', onMouseUp)
function onMouseUp(_event: MouseEvent) {
    mouseDown = false
}

window.addEventListener('resize', onWindowResize)
function onWindowResize() {
    camera.aspect = width / height
    camera.updateProjectionMatrix()

    renderer.setSize(width, height)
}

const animate = function () {
    requestAnimationFrame(animate)

    // cube.rotation.x += 0.01
    // cube.rotation.y += 0.01

    renderer.render(scene, camera)
}

const scene = new Scene()

let width = window.innerWidth
let height = window.innerHeight

export const camera = new PerspectiveCamera(75, width / height, 0.1, 1000)
camera.rotation.order = 'ZYX'
camera.position.set(1, 1, 1)
const camOrbit = new Vector3()

const targetS = new Spherical()

const renderer = new WebGLRenderer()
renderer.setSize(width, height)
document.body.appendChild(renderer.domElement)

const mouse = new Vector2()
let mouseDrag = false
let mouseDown = false
let mouseButton = -1
const sensitivity = 0.007

const raycaster = new Raycaster()

const uvs = genBlockUVs(0, 64, 8, 8, 8, 64, 64)
const geometry = new BoxGeometry()
geometry.setAttribute('uv', uvs)
const texture = new TextureLoader().load('../img/neferupitou.png')
texture.minFilter = NearestFilter
texture.magFilter = NearestFilter
const material = new MeshBasicMaterial({
    color: 0xffffff,
    map: texture,
    transparent: false,
    alphaTest: 0.5,
    depthWrite: true,
    depthTest: true,
    side: DoubleSide,
})
const cube = new Mesh(geometry, material)
scene.add(cube)

animate()
