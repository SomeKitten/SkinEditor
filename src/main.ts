import './style.css'
import { camera, renderer, scene } from './render'
import { camOrbit, lookAt } from './util'
import './listeners'

console.log('TEST!')

lookAt(camera, camOrbit)

const animate = function () {
  requestAnimationFrame(animate)

  renderer.render(scene, camera)
}

animate()
