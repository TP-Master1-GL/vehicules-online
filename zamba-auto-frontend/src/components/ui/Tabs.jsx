import React, { useState } from 'react'

const Tabs = ({
  tabs = [],
  defaultActiveTab = 0,
  onChange,
  variant = 'default',
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab)
  
  const handleTabClick = (index, tab) => {
    setActiveTab(index)
    onChange?.(index, tab)
  }
  
  const variants = {
    default: 'border-b border-gray-200',
    pills: '',
    underline: 'border-b border-gray-200'
  }
  
  const tabVariants = {
    default: {
      active: 'border-primary-orange text-primary-orange',
      inactive: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    },
    pills: {
      active: 'bg-primary-orange text-white',
      inactive: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
    },
    underline: {
      active: 'border-primary-orange text-primary-orange',
      inactive: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }
  }
  
  return (
    <div className={className}>
      <div className={variants[variant]}>
        <nav className={`flex ${variant === 'pills' ? 'space-x-2' : '-mb-px'}`} aria-label="Tabs">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => handleTabClick(index, tab)}
              className={`
                ${variant === 'pills' 
                  ? 'px-3 py-2 text-sm font-medium rounded-md' 
                  : 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                }
                ${activeTab === index 
                  ? tabVariants[variant].active 
                  : tabVariants[variant].inactive
                }
                ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                transition-colors duration-200
              `}
              disabled={tab.disabled}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
              {tab.badge && (
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  activeTab === index 
                    ? 'bg-white/20' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="mt-4">
        {tabs[activeTab]?.content}
      </div>
    </div>
  )
}

export default Tabs