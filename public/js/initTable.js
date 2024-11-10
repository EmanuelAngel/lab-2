console.log('hola')

const initTable = ({
  tableId,
  order = [[1, 'asc']],
  pageLength = 10,
  columnDefs = [],
  responsive = true,
  additionalOptions = {}
} = {}) => {
  if (!tableId) {
    console.error('Se requiere un tableId para inicializar DataTable')
    return
  }

  const defaultColumnDefs = [
    {
      targets: -1,
      orderable: false,
      searchable: false
    }
  ]

  const config = {
    responsive,
    language: {
      url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
    },
    columnDefs: [...defaultColumnDefs, ...columnDefs],
    order,
    pageLength,
    lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, 'Todos']],
    ...additionalOptions
  }

  try {
    const existingTable = $(tableId).DataTable()
    if (existingTable) {
      existingTable.destroy()
    }

    return $(tableId).DataTable(config)
  } catch (error) {
    console.error(`Error al inicializar DataTable en ${tableId}:`, error)
  }
}
