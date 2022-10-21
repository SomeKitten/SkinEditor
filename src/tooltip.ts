const tooltipDiv = document.createElement('div')
tooltipDiv.id = 'tooltip'
document.body.appendChild(tooltipDiv)

const idTooltipMap = new Map()
idTooltipMap.set('top-bar-undo', ['Undo', '- Control + Z'])
idTooltipMap.set('top-bar-redo', ['Redo', '- Control + Y', '- Control + Shift + Z'])
idTooltipMap.set('top-bar-toggle-outer', ['Toggle Outer Skin Layer', '- Tab'])
idTooltipMap.set('top-bar-toggle-animate', ['Play / Pause', '- Space'])
idTooltipMap.set('top-bar-save', ['Save', '- Control + S'])

idTooltipMap.set('toggle-part-head', ["Toggle Player's:", 'Head Visibility'])
idTooltipMap.set('toggle-part-body', ["Toggle Player's:", 'Body Visibility'])
idTooltipMap.set('toggle-part-right-arm', ["Toggle Player's:", 'Right Arm Visibility'])
idTooltipMap.set('toggle-part-left-arm', ["Toggle Player's:", 'Left Arm Visibility'])
idTooltipMap.set('toggle-part-right-leg', ["Toggle Player's:", 'Right Leg Visibility'])
idTooltipMap.set('toggle-part-left-leg', ["Toggle Player's:", 'Left Leg Visibility'])

idTooltipMap.set('add-layer', ['Add Layer'])
idTooltipMap.set('remove-layer', ['Remove Layer'])

document.addEventListener('mousemove', mouseMoveForTooltip)
function mouseMoveForTooltip(event: MouseEvent) {
  let element = document.elementFromPoint(event.clientX, event.clientY)
  if (element) {
    let id = element.id
    while (!id && element.parentElement) {
      element = element.parentElement
      id = element.id
    }

    if (id) {
      const tooltip = idTooltipMap.get(id)
      if (tooltip) {
        tooltipDiv.innerText = tooltip.join('\n')
        tooltipDiv.hidden = false
      } else {
        tooltipDiv.hidden = true
      }
    } else {
      tooltipDiv.hidden = true
    }
  }

  if (event.clientX < window.innerWidth - (tooltipDiv.getBoundingClientRect().width + 40)) {
    tooltipDiv.style.right = ''
    tooltipDiv.style.left = event.clientX + 20 + 'px'
  } else {
    tooltipDiv.style.left = ''
    tooltipDiv.style.right = window.innerWidth - event.clientX + 20 + 'px'
  }

  tooltipDiv.style.top = event.clientY + 10 + 'px'
}
