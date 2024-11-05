import { showToast } from './showToast.js'

export const baseValidationRules = {
  nombre_usuario: {
    required: true,
    minLength: 3,
    message: 'El nombre de usuario es requerido y debe tener al menos 3 caracteres'
  },
  nombre: {
    required: true,
    minLength: 3,
    message: 'El nombre es requerido y debe tener al menos 3 caracteres'
  },
  apellido: {
    required: true,
    minLength: 3,
    message: 'El apellido es requerido y debe tener al menos 3 caracteres'
  },
  dni: {
    required: true,
    pattern: /^\d{6,11}$/,
    message: 'El DNI debe contener entre 6 y 11 dígitos'
  },
  telefono: {
    required: true,
    pattern: /^\d{6,11}$/,
    message: 'El teléfono debe contener entre 6 y 11 dígitos'
  },
  direccion: {
    required: true,
    minLength: 3,
    message: 'La dirección es requerida y debe tener al menos 3 caracteres'
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Ingrese un email válido'
  },
  contraseña: {
    required: true,
    minLength: 3,
    message: 'La contraseña debe tener al menos 3 caracteres'
  },

  nombre_especialidad: {
    required: true,
    minLength: 3,
    pattern: /^[A-Za-zÀ-ÿ\s]+$/,
    message: 'El nombre de la especialidad es obligatorio y debe tener al menos 3 caracteres.'
  }
}

export function validateField (field, rules = baseValidationRules) {
  const value = field.value.trim()
  const fieldRules = rules[field.id] || rules[field.name]

  if (!fieldRules) return true

  let isValid = true
  let message = ''

  if (fieldRules.required && !value) {
    isValid = false
    message = fieldRules.message
  } else if (fieldRules.minLength && value.length < fieldRules.minLength) {
    isValid = false
    message = fieldRules.message
  } else if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
    isValid = false
    message = fieldRules.message
  }

  updateFieldValidation(field, isValid, message)
  return isValid
}

function updateFieldValidation (field, isValid, message) {
  const feedbackElement = field.nextElementSibling

  if (!isValid) {
    field.classList.add('is-invalid')
    field.classList.remove('is-valid')

    if (!feedbackElement || !feedbackElement.classList.contains('error-message')) {
      const errorDiv = document.createElement('div')
      errorDiv.className = 'error-message text-danger'
      errorDiv.textContent = message
      field.parentNode.insertBefore(errorDiv, field.nextSibling)
    } else {
      feedbackElement.textContent = message
    }
  } else {
    field.classList.remove('is-invalid')
    field.classList.add('is-valid')
    if (feedbackElement && feedbackElement.classList.contains('error-message')) {
      feedbackElement.remove()
    }
  }
}

export async function submitForm (form, url, getFormData, validateAdditionalFields) {
  const submitButton = form.querySelector('button[type="submit"]')
  submitButton.disabled = true
  submitButton.innerHTML = `
    <span class="spinner-border spinner-border-sm" role="status"></span>
    Registrando...
  `

  let isValid = true

  // Validar campos base
  form.querySelectorAll('input:not([type="hidden"])').forEach(field => {
    if (!validateField(field)) {
      isValid = false
    }
  })

  // Validar campos adicionales
  if (validateAdditionalFields && !validateAdditionalFields()) {
    isValid = false
  }

  if (!isValid) {
    submitButton.disabled = false
    submitButton.textContent = 'Registrar'
    return false
  }

  try {
    const data = getFormData()
    console.log('Datos a enviar:', data)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al registrar')
    }

    showToast('Registro exitoso', 'success')
    return true
  } catch (error) {
    showToast(error.message, 'danger')
    console.error('Error:', error)
    return false
  } finally {
    submitButton.disabled = false
    submitButton.textContent = 'Registrar'
  }
}
