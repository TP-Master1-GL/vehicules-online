import React, { useState, useRef } from 'react'
import { createPortal } from 'react-dom'

const Tooltip = ({
  children,
  content,
  position = 'top',
  delay = 200,
  className = '',
  tooltipClassName = ''
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const triggerRef = useRef(null)
  let timeoutId = null

  const showTooltip = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setCoords({
        x: rect.left + rect.width / 2,
        y: rect.top
      })
    }
    
    timeoutId = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    setIsVisible(false)
  }

  const positions = {
    top: {
      style: { left: coords.x, top: coords.y },
      transform: 'translate(-50%, -100%)',
      arrow: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full'
    },
    bottom: {
      style: { left: coords.x, top: coords.y },
      transform: 'translate(-50%, 0)',
      arrow: 'top-0 left-1/2 -translate-x-1/2 -translate-y-full'
    },
    left: {
      style: { left: coords.x, top: coords.y },
      transform: 'translate(-100%, -50%)',
      arrow: 'right-0 top-1/2 -translate-y-1/2 translate-x-full'
    },
    right: {
      style: { left: coords.x, top: coords.y },
      transform: 'translate(0, -50%)',
      arrow: 'left-0 top-1/2 -translate-y-1/2 -translate-x-full'
    }
  }

  const currentPosition = positions[position]

  return (
    <>
      <div
        ref={triggerRef}
        className={`inline-block ${className}`}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>

      {isVisible &&
        createPortal(
          <div
            className="fixed z-50 pointer-events-none"
            style={currentPosition.style}
          >
            <div
              className={`transform ${currentPosition.transform} bg-gray-900 text-white text-sm rounded py-2 px-3 max-w-xs ${tooltipClassName}`}
              role="tooltip"
            >
              {content}
              <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${currentPosition.arrow}`} />
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

export default Tooltip