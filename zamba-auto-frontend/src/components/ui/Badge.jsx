import React from 'react'

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = 'full',
  className = '',
  ...props
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-orange text-white',
    secondary: 'bg-primary-blue text-white',
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800'
  }
  
  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-0.5 text-sm',
    md: 'px-3 py-1 text-sm',
    lg: 'px-3 py-1 text-base'
  }
  
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded',
    lg: 'rounded-lg',
    full: 'rounded-full'
  }
  
  return (
    <span
      className={`inline-flex items-center font-medium ${variants[variant]} ${sizes[size]} ${roundedClasses[rounded]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge