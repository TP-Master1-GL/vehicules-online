// components/ui/VehicleAnimation.jsx
import React, { useEffect, useState } from 'react'

const VehicleAnimation = ({ vehicle, type, isVisible }) => {
  const [animationState, setAnimationState] = useState('idle')

  useEffect(() => {
    if (isVisible && type) {
      setAnimationState('playing')
      const timer = setTimeout(() => {
        setAnimationState('completed')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, type])

  const getAnimationContent = () => {
    switch(type) {
      case 'electric':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse text-blue-500 text-4xl">⚡</div>
            <div className="ml-2 text-white font-bold">100% ÉLECTRIQUE</div>
          </div>
        )
      case 'sport':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-bounce text-red-500 text-4xl">🏎️</div>
            <div className="ml-2 text-white font-bold">MODE SPORT</div>
          </div>
        )
      default:
        return null
    }
  }

  if (animationState === 'idle' || !isVisible) return null

  return (
    <div className="absolute inset-0 bg-black bg-opacity-60 z-10 rounded-t-xl flex items-center justify-center">
      <div className="text-center">
        {getAnimationContent()}
        <p className="text-white mt-2 text-sm">Animation {vehicle.name}</p>
      </div>
    </div>
  )
}

export default VehicleAnimation