import React from 'react'

const LoadingSpinner = ({
  size = 'md',
  color = 'primary-orange',
  className = '',
  showText = false,
  text = 'Chargement...'
}) => {
  const sizes = {
    xs: 'w-4 h-4 border-2',
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  }
  
  const colors = {
    'primary-orange': 'border-primary-orange border-t-transparent',
    'primary-blue': 'border-primary-blue border-t-transparent',
    'white': 'border-white border-t-transparent',
    'gray': 'border-gray-300 border-t-transparent'
  }
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${sizes[size]} ${colors[color]} rounded-full animate-spin`} />
      
      {showText && (
        <p className="mt-4 text-sm text-primary-gray">{text}</p>
      )}
    </div>
  )
}

export default LoadingSpinner