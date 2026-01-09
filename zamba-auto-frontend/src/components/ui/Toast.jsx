import React, { useEffect } from 'react'
import { 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaTimes,
  FaExclamationCircle 
} from 'react-icons/fa'

const Toast = ({
  id,
  message,
  type = 'info',
  duration = 3000,
  onClose,
  position = 'top-right'
}) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose(id)
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [id, duration, onClose])
  
  const icons = {
    success: <FaCheckCircle className="w-5 h-5" />,
    error: <FaExclamationCircle className="w-5 h-5" />,
    warning: <FaExclamationTriangle className="w-5 h-5" />,
    info: <FaInfoCircle className="w-5 h-5" />
  }
  
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }
  
  const iconColors = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  }
  
  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  }
  
  return (
    <div
      className={`fixed ${positions[position]} z-50 animate-slide-in`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className={`flex items-center p-4 rounded-card shadow-lg border ${colors[type]} min-w-[300px] max-w-md`}>
        <div className={`flex-shrink-0 ${iconColors[type]}`}>
          {icons[type]}
        </div>
        
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        
        <button
          onClick={() => onClose(id)}
          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Fermer"
        >
          <FaTimes className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default Toast