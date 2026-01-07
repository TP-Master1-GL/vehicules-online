import React from 'react'
import { 
  FaInfoCircle, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaExclamationCircle,
  FaTimes 
} from 'react-icons/fa'

const Alert = ({
  variant = 'info',
  title,
  children,
  onClose,
  className = '',
  showIcon = true,
  showCloseButton = false
}) => {
  const variants = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: <FaInfoCircle className="w-5 h-5" />,
      iconColor: 'text-blue-400'
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: <FaCheckCircle className="w-5 h-5" />,
      iconColor: 'text-green-400'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: <FaExclamationTriangle className="w-5 h-5" />,
      iconColor: 'text-yellow-400'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <FaExclamationCircle className="w-5 h-5" />,
      iconColor: 'text-red-400'
    }
  }
  
  const currentVariant = variants[variant]
  
  return (
    <div className={`${currentVariant.bg} ${currentVariant.border} border rounded-card p-4 ${className}`}>
      <div className="flex">
        {showIcon && (
          <div className={`flex-shrink-0 ${currentVariant.iconColor} mr-3`}>
            {currentVariant.icon}
          </div>
        )}
        
        <div className="flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${currentVariant.text} mb-1`}>
              {title}
            </h3>
          )}
          
          <div className={`text-sm ${currentVariant.text}`}>
            {children}
          </div>
        </div>
        
        {showCloseButton && onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={`inline-flex rounded-md p-1.5 ${currentVariant.text} hover:${currentVariant.bg} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${variant}-50 focus:ring-${variant}-600`}
              >
                <span className="sr-only">Fermer</span>
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Alert