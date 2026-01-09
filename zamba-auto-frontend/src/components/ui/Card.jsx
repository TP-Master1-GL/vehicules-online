import React from 'react'

const Card = ({
  children,
  title,
  subtitle,
  footer,
  headerAction,
  noPadding = false,
  hoverable = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`card ${hoverable ? 'hover:shadow-xl' : ''} ${className}`}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-primary-dark">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-primary-gray">
                  {subtitle}
                </p>
              )}
            </div>
            
            {headerAction && (
              <div className="flex-shrink-0">
                {headerAction}
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
      
      {footer && (
        <div className="px-6 py-4 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  )
}

export default Card