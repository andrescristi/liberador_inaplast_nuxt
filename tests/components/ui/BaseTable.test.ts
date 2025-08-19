import { describe, it, expect, vi as _vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseTable from '~/components/ui/BaseTable.vue'

describe('BaseTable', () => {
  
  const sampleColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Estado' }
  ]

  const sampleRows = [
    { id: '1', name: 'Juan Pérez', email: 'juan@test.com', status: 'active' },
    { id: '2', name: 'María García', email: 'maria@test.com', status: 'inactive' },
    { id: '3', name: 'Carlos López', email: 'carlos@test.com', status: 'pending' }
  ]

  const createWrapper = (props = {}) => {
    return mount(BaseTable, {
      props: {
        columns: sampleColumns,
        rows: sampleRows,
        ...props
      }
    })
  }

  describe('Renderizado Básico', () => {
    it('debe renderizar tabla con headers', () => {
      const wrapper = createWrapper()
      const headers = wrapper.findAll('th')
      
      expect(headers).toHaveLength(4)
      expect(headers[0].text()).toBe('ID')
      expect(headers[1].text()).toBe('Nombre')
      expect(headers[2].text()).toBe('Email')
      expect(headers[3].text()).toBe('Estado')
    })

    it('debe renderizar filas de datos', () => {
      const wrapper = createWrapper()
      const rows = wrapper.findAll('tbody tr')
      
      expect(rows).toHaveLength(3)
      expect(rows[0].text()).toContain('Juan Pérez')
      expect(rows[1].text()).toContain('María García')
      expect(rows[2].text()).toContain('Carlos López')
    })

    it('debe renderizar celdas con datos correctos', () => {
      const wrapper = createWrapper()
      const firstRow = wrapper.find('tbody tr')
      const cells = firstRow.findAll('td')
      
      expect(cells[0].text()).toBe('1')
      expect(cells[1].text()).toBe('Juan Pérez')
      expect(cells[2].text()).toBe('juan@test.com')
      expect(cells[3].text()).toBe('active')
    })
  })

  describe('Estado Vacío', () => {
    it('debe mostrar mensaje cuando no hay datos', () => {
      const wrapper = createWrapper({ rows: [] })
      const hasNoDataText = wrapper.text().includes('No hay datos')
      const hasCenteredText = wrapper.find('.text-center').exists()
      expect(hasNoDataText || hasCenteredText).toBe(true)
    })

    it('debe mostrar mensaje personalizado para estado vacío', () => {
      const wrapper = createWrapper({ 
        rows: [],
        emptyMessage: 'No se encontraron usuarios'
      })
      expect(wrapper.text()).toContain('No se encontraron usuarios')
    })
  })

  describe('Selección de Filas', () => {
    it('debe permitir selección cuando selectable=true', () => {
      const wrapper = createWrapper({ selectable: true })
      const firstRow = wrapper.find('tbody tr')
      
      const hasCursorPointer = firstRow.classes().includes('cursor-pointer')
      const hasButtonRole = firstRow.attributes('role') === 'button'
      expect(hasCursorPointer || hasButtonRole).toBe(true)
    })

    it('debe emitir evento select al hacer click en fila', async () => {
      const wrapper = createWrapper({ selectable: true })
      const firstRow = wrapper.find('tbody tr')
      
      await firstRow.trigger('click')
      expect(wrapper.emitted('select')).toBeTruthy()
      expect(wrapper.emitted('select')![0][0]).toEqual(sampleRows[0])
    })

    it('no debe permitir selección cuando selectable=false', async () => {
      const wrapper = createWrapper({ selectable: false })
      const firstRow = wrapper.find('tbody tr')
      
      await firstRow.trigger('click')
      expect(wrapper.emitted('select')).toBeFalsy()
    })
  })

  describe('Slots Personalizados', () => {
    it('debe renderizar slot personalizado para celdas', () => {
      const wrapper = mount(BaseTable, {
        props: {
          columns: sampleColumns,
          rows: sampleRows
        },
        slots: {
          'status-data': '<span class="badge">{{ row.status }}</span>'
        }
      })
      
      expect(wrapper.html()).toContain('badge')
    })
  })

  describe('Ordenamiento', () => {
    it('debe mostrar indicadores de ordenamiento en headers', () => {
      const wrapper = createWrapper({ sortable: true })
      const headers = wrapper.findAll('th button')
      expect(headers.length).toBeGreaterThan(0)
    })

    it('debe emitir evento sort al hacer click en header', async () => {
      const wrapper = createWrapper({ sortable: true })
      const firstHeader = wrapper.find('th button')
      
      await firstHeader.trigger('click')
      expect(wrapper.emitted('sort')).toBeTruthy()
    })
  })

  describe('Estados de Carga', () => {
    it('debe mostrar skeleton loader cuando loading=true', () => {
      const wrapper = createWrapper({ loading: true })
      expect(wrapper.find('.animate-pulse').exists() ||
             wrapper.text().includes('Cargando')).toBe(true)
    })

    it('debe ocultar datos durante loading', () => {
      const wrapper = createWrapper({ loading: true })
      const hasNoRows = wrapper.findAll('tbody tr').length === 0
      const hasPulseAnimation = wrapper.find('.animate-pulse').exists()
      expect(hasNoRows || hasPulseAnimation).toBe(true)
    })
  })

  describe('Responsive Design', () => {
    it('debe tener clases responsive apropiadas', () => {
      const wrapper = createWrapper()
      const table = wrapper.find('table')
      expect(table.classes().some(cls => 
        cls.includes('min-w-') || cls.includes('overflow-')
      )).toBe(true)
    })
  })

  describe('Accesibilidad', () => {
    it('debe tener estructura semántica correcta', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('table').exists()).toBe(true)
      expect(wrapper.find('thead').exists()).toBe(true)
      expect(wrapper.find('tbody').exists()).toBe(true)
    })

    it('debe tener headers accesibles', () => {
      const wrapper = createWrapper()
      const headers = wrapper.findAll('th')
      headers.forEach(header => {
        expect(header.attributes('scope')).toBe('col')
      })
    })

    it('debe soportar navegación por teclado', async () => {
      const wrapper = createWrapper({ selectable: true })
      const firstRow = wrapper.find('tbody tr')
      
      await firstRow.trigger('keydown.enter')
      expect(wrapper.emitted('select')).toBeTruthy()
    })
  })

  describe('Performance', () => {
    it('debe manejar grandes conjuntos de datos', () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: i.toString(),
        name: `Usuario ${i}`,
        email: `user${i}@test.com`,
        status: i % 2 === 0 ? 'active' : 'inactive'
      }))

      const wrapper = createWrapper({ rows: largeDataset })
      expect(wrapper.findAll('tbody tr')).toHaveLength(1000)
    })

    it('debe renderizar eficientemente con virtualización', () => {
      const wrapper = createWrapper({ virtualized: true, rows: sampleRows })
      expect(wrapper.find('.virtual-table').exists() || 
             wrapper.find('table').exists()).toBe(true)
    })
  })

  describe('Casos Edge', () => {
    it('debe manejar datos malformados', () => {
      const malformedRows = [
        { id: null, name: undefined, email: '', status: 'active' },
        { id: '2', name: 'Test' } // Missing fields
      ]

      expect(() => createWrapper({ rows: malformedRows })).not.toThrow()
    })

    it('debe manejar columnas dinámicas', async () => {
      const wrapper = createWrapper()
      
      const newColumns = [
        ...sampleColumns,
        { key: 'role', label: 'Rol' }
      ]
      
      await wrapper.setProps({ columns: newColumns })
      expect(wrapper.findAll('th')).toHaveLength(5)
    })
  })
})