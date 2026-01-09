import React from 'react'
import { FaCheck } from 'react-icons/fa'

const Stepper = ({
  steps = [],
  currentStep = 0,
  orientation = 'horizontal',
  className = ''
}) => {
  const isVertical = orientation === 'vertical'
  
  return (
    <div className={`${isVertical ? 'flex flex-col' : 'flex'} ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep
        const isLast = index === steps.length - 1
        
        return (
          <React.Fragment key={index}>
            {/* Step container */}
            <div className={`flex ${isVertical ? 'flex-col' : 'flex-1'} items-center`}>
              {/* Step circle */}
              <div className="relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isCompleted
                      ? 'bg-primary-orange border-primary-orange'
                      : isCurrent
                      ? 'border-primary-orange'
                      : 'border-gray-300'
                  }`}
                >
                  {isCompleted ? (
                    <FaCheck className="w-5 h-5 text-white" />
                  ) : (
                    <span
                      className={`font-medium ${
                        isCurrent ? 'text-primary-orange' : 'text-gray-500'
                      }`}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>
                
                {/* Step label */}
                <div
                  className={`absolute ${isVertical ? 'left-12 top-1/2 -translate-y-1/2' : 'top-full left-1/2 -translate-x-1/2 mt-3'} ${
                    isVertical ? 'w-auto' : 'text-center'
                  }`}
                >
                  <div
                    className={`font-medium whitespace-nowrap ${
                      isCompleted || isCurrent
                        ? 'text-primary-dark'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </div>
                  
                  {step.description && (
                    <div className="text-sm text-gray-500 mt-1">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Connector line (not for last step) */}
              {!isLast && (
                <div
                  className={`flex-1 ${isVertical ? 'h-12 w-0.5 my-2' : 'h-0.5 mt-5'} ${
                    isCompleted ? 'bg-primary-orange' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default Stepper