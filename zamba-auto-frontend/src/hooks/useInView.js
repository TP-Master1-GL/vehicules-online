// src/hooks/useInView.js
import { useState, useEffect, useRef } from 'react'

const useInView = (options = {}) => {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting)
      
      if (entry.isIntersecting && !hasAnimated) {
        setHasAnimated(true)
      }
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
      ...options
    })

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [options, hasAnimated])

  return [ref, isInView, hasAnimated]
}

export default useInView