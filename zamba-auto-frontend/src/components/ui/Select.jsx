import React, { forwardRef } from 'react'
import { FaChevronDown, FaExclamationCircle } from 'react-icons/fa'

const Select = forwardRef(({
  label,
  error,
  helperText,
  options = [],
  placeholder = 'Sélectionnez...',
  containerClassName = '',
  labelClassName = '',
  selectClassName = '',
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
        <select
          ref={ref}
          className={`
            form-select
            appearance-none
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
            ${selectClassName}
          `}
          {...props}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          
          {options.map((option) => (
            <option 
              key={option.value || option} 
              value={option.value || option}
            >
              {option.label || option}
            </option>
          ))}
        </select>
        
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
          <FaChevronDown className="h-4 w-4 text-gray-400" />
        </div>
        
        {error && (
          <div className="absolute inset-y-0 right-8 pr-3 flex items-center pointer-events-none">
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

Select.displayName = 'Select'

export default Select