export function showToast (message, type) {
  const toastHTML = /* html */ `
    <div class="toast align-items-center text-bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>`

  const toastContainer = document.getElementById('toast-container')
  toastContainer.insertAdjacentHTML('beforeend', toastHTML)

  const toastElement = toastContainer.lastChild
  const toast = new bootstrap.Toast(toastElement)
  toast.show()

  // Eliminar el toast después de un tiempo
  setTimeout(() => {
    toastElement.remove()
  }, 5000) // Se elimina después de 5 segundos
}
