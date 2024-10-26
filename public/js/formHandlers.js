// public/js/forms/formHandlers.js
import { validateField, baseValidationRules } from './baseValidation.js'
import { showToast } from './showToast.js'

export function setupFormValidation (form, additionalValidations = {}) {
  // Combinar validaciones base con adicionales
  const validationRules = {
    ...baseValidationRules,
    ...additionalValidations
  }

  // Agregar validación en línea para todos los campos de texto
  form.querySelectorAll('input, select').forEach(field => {
    // Validar mientras el usuario escribe
    field.addEventListener('input', () => {
      validateField(field, validationRules)
    })

    // Validar cuando el campo pierde el foco
    field.addEventListener('blur', () => {
      validateField(field, validationRules)
    })

    // Para selects, validar cuando cambia el valor
    if (field.tagName === 'SELECT') {
      field.addEventListener('change', () => {
        validateField(field, validationRules)
      })
    }
  })
}

// Función para inicializar un formulario base
export function initializeBaseForm (formId, submitUrl, {
  getAdditionalData = () => ({}),
  additionalValidations = {},
  beforeSubmit = () => true,
  onSuccess = () => {},
  redirectUrl = null
} = {}) {
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector(formId)
    if (!form) return

    // Configurar validaciones en línea
    setupFormValidation(form, additionalValidations)

    // Manejar envío del formulario
    form.addEventListener('submit', async (e) => {
      e.preventDefault()

      // Validación adicional antes del envío
      if (!beforeSubmit()) {
        return
      }

      const submitButton = form.querySelector('button[type="submit"]')
      submitButton.disabled = true
      submitButton.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Registrando...
      `

      try {
        // Obtener datos base del formulario
        const formData = new FormData(form)
        const baseData = {
          nombre_usuario: formData.get('nombre_usuario'),
          nombre: formData.get('nombre'),
          apellido: formData.get('apellido'),
          dni: formData.get('dni'),
          email: formData.get('email'),
          contraseña: formData.get('contraseña'),
          telefono: formData.get('telefono'),
          direccion: formData.get('direccion'),
          ...getAdditionalData(formData)
        }

        const response = await fetch(submitUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(baseData)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Error al registrar')
        }

        showToast('Registro exitoso', 'success')
        onSuccess()

        if (redirectUrl) {
          setTimeout(() => {
            window.location.href = redirectUrl
          }, 1500)
        }
      } catch (error) {
        showToast(error.message, 'danger')
        console.error('Error:', error)
        submitButton.disabled = false
        submitButton.textContent = form.dataset.submitText || 'Registrar'
      }
    })
  })
}
