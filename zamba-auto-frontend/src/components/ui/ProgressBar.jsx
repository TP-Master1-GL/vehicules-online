import React from 'react'

const ProgressBar = ({
  value = 0,
  max = 100,
  showLabel = true,
  labelPosition = 'right',
  size = 'md',
  color = 'primary-orange',
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  
  const sizes = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-6'
  }
  
  const colors = {
    'primary-orange': 'bg-primary-orange',
    'primary-blue': 'bg-primary-blue',
    'green': 'bg-green-500',
    'red': 'bg-red-500',
    'yellow': 'bg-yellow-500',
    'gradient': 'bg-gradient-to-r from-primary-orange to-orange-400'
  }
  
  const labelColors = {
    'primary-orange': 'text-primary-orange',
    'primary-blue': 'text-primary-blue',
    'green': 'text-green-600',
    'red': 'text-red-600',
    'yellow': 'text-yellow-600',
    'gradient': 'text-primary-orange'
  }
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-1">
        {showLabel && labelPosition === 'left' && (
          <span className={`text-sm font-medium ${labelColors[color]}`}>
            {percentage.toFixed(0)}%
          </span>
        )}
        
        {showLabel && labelPosition === 'center' && (
          <div className="w-full text-center">
            <span className={`text-sm font-medium ${labelColors[color]}`}>
              {percentage.toFixed(0)}%
            </span>
          </div>
        )}
      </div>
      
      <div className={`${sizes[size]} w-full bg-gray-200 rounded-full overflow-hidden`}>
        <div
          className={`${sizes[size]} ${colors[color]} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      
      {showLabel && labelPosition === 'right' && (
        <div className="mt-1 text-right">
          <span className={`text-sm font-medium ${labelColors[color]}`}>
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}
      
      {showLabel && labelPosition === 'bottom' && (
        <div className="mt-1 text-center">
          <span className={`text-sm font-medium ${labelColors[color]}`}>
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}
    </div>
  )
}

export default ProgressBar