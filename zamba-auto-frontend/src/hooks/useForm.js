import { useState, useCallback } from 'react'

export const useForm = (initialValues = {}, validate) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    if (validate) {
      const validationErrors = validate({ ...values, [name]: value })
      setErrors(prev => ({
        ...prev,
        [name]: validationErrors[name]
      }))
    }
  }, [values, validate])

  const handleBlur = useCallback((e) => {
    const { name } = e.target
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))
    
    if (validate) {
      const validationErrors = validate(values)
      setErrors(prev => ({
        ...prev,
        [name]: validationErrors[name]
      }))
    }
  }, [values, validate])

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }))
  }, [])

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    resetForm,
    setFieldValue,
    setValues
  }
}