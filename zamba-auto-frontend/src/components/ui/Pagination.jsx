import React from 'react'
import { FaChevronLeft, FaChevronRight, FaEllipsisH } from 'react-icons/fa'

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  showFirst = true,
  showLast = true,
  className = ''
}) => {
  const range = (start, end) => {
    const length = end - start + 1
    return Array.from({ length }, (_, i) => start + i)
  }
  
  const startPages = range(1, Math.min(boundaryCount, totalPages))
  const endPages = range(Math.max(totalPages - boundaryCount + 1, boundaryCount + 1), totalPages)
  
  const siblingsStart = Math.max(
    Math.min(
      currentPage - siblingCount,
      totalPages - boundaryCount - siblingCount * 2 - 1
    ),
    boundaryCount + 2
  )
  
  const siblingsEnd = Math.min(
    Math.max(
      currentPage + siblingCount,
      boundaryCount + siblingCount * 2 + 2
    ),
    endPages.length > 0 ? endPages[0] - 2 : totalPages - 1
  )
  
  const itemList = [
    ...(showFirst ? ['first'] : []),
    ...startPages,
    ...(siblingsStart > boundaryCount + 2 ? ['start-ellipsis'] : boundaryCount + 1 < totalPages - boundaryCount ? [boundaryCount + 1] : []),
    ...range(siblingsStart, siblingsEnd),
    ...(siblingsEnd < totalPages - boundaryCount - 1 ? ['end-ellipsis'] : totalPages - boundaryCount > boundaryCount ? [totalPages - boundaryCount] : []),
    ...endPages,
    ...(showLast ? ['last'] : [])
  ]
  
  const handleClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page)
    }
  }
  
  const renderItem = (item, index) => {
    if (item === 'first') {
      return (
        <button
          key="first"
          onClick={() => handleClick(1)}
          className="px-3 py-2 rounded-lg text-primary-gray hover:bg-gray-100"
          aria-label="Première page"
        >
          1
        </button>
      )
    }
    
    if (item === 'last') {
      return (
        <button
          key="last"
          onClick={() => handleClick(totalPages)}
          className="px-3 py-2 rounded-lg text-primary-gray hover:bg-gray-100"
          aria-label="Dernière page"
        >
          {totalPages}
        </button>
      )
    }
    
    if (item === 'start-ellipsis' || item === 'end-ellipsis') {
      return (
        <span key={`ellipsis-${index}`} className="px-3 py-2">
          <FaEllipsisH className="w-4 h-4 text-gray-400" />
        </span>
      )
    }
    
    const page = Number(item)
    const isCurrent = page === currentPage
    
    return (
      <button
        key={page}
        onClick={() => handleClick(page)}
        className={`px-4 py-2 rounded-lg transition-colors ${
          isCurrent
            ? 'bg-primary-orange text-white'
            : 'text-primary-gray hover:bg-gray-100'
        }`}
        aria-label={`Page ${page}`}
        aria-current={isCurrent ? 'page' : undefined}
      >
        {page}
      </button>
    )
  }
  
  if (totalPages <= 1) return null
  
  return (
    <nav className={`flex items-center justify-center space-x-1 ${className}`} aria-label="Pagination">
      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-2 rounded-lg text-primary-gray hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Page précédente"
      >
        <FaChevronLeft className="w-4 h-4" />
      </button>
      
      {itemList.map(renderItem)}
      
      <button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-2 rounded-lg text-primary-gray hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Page suivante"
      >
        <FaChevronRight className="w-4 h-4" />
      </button>
    </nav>
  )
}

export default Pagination