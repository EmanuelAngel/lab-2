const initTable = ({
  tableId,
  order = [[0, 'asc']],
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
      processing: 'Procesando...',
      search: 'Buscar:',
      lengthMenu: 'Mostrar _MENU_ registros',
      info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
      infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
      infoFiltered: '(filtrado de un total de _MAX_ registros)',
      infoPostFix: '',
      loadingRecords: 'Cargando...',
      zeroRecords: 'No se encontraron resultados',
      emptyTable: 'Ningún dato disponible en esta tabla',
      paginate: {
        first: 'Primero',
        previous: 'Anterior',
        next: 'Siguiente',
        last: 'Último'
      },
      aria: {
        sortAscending: ': Activar para ordenar la columna de manera ascendente',
        sortDescending:
          ': Activar para ordenar la columna de manera descendente'
      }
    },
    columnDefs: [...defaultColumnDefs, ...columnDefs],
    order,
    pageLength,
    lengthMenu: [
      [5, 10, 25, 50, -1],
      [5, 10, 25, 50, 'Todos']
    ],
    ...additionalOptions
  }

  try {
    const existingTable = document.querySelector(tableId)?._DT_?.instance
    if (existingTable) existingTable.destroy()

    return new DataTable(tableId, config)
  } catch (error) {
    console.error(`Error al inicializar DataTable en ${tableId}:`, error)
  }
}
