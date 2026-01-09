import React, { forwardRef } from 'react'
import { FaExclamationCircle } from 'react-icons/fa'

const Input = forwardRef(({
  label,
  error,
  helperText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  containerClassName = '',
  labelClassName = '',
  inputClassName = '',
  fullWidth = true,
  required = false,
  ...props
}, ref) => {
  const widthClass = fullWidth ? 'w-full' : ''
  
  return (
    <div className={`${widthClass} ${containerClassName}`}>
      {label && (
        <label className={`block text-sm font-medium text-primary-gray mb-2 ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LeftIcon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        <input
          ref={ref}
          className={`
            form-input
            ${LeftIcon ? 'pl-10' : ''}
            ${RightIcon ? 'pr-10' : ''}
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
            ${inputClassName}
          `}
          {...props}
        />
        
        {RightIcon && !error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <RightIcon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FaExclamationCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-2 text-sm text-primary-gray">{helperText}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input