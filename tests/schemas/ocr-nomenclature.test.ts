import { describe, it, expect } from 'vitest'
import { ocrDataSchema, ocrValidatedSchema } from '~/schemas/orders/ocr'
import type { OCRData, OCRValidatedData } from '~/schemas/orders/ocr'

describe('OCR Schema Nomenclature', () => {
  describe('ocrDataSchema', () => {
    it('acepta datos con nomenclatura camelCase', () => {
      const validOCRData: OCRData = {
        cliente: 'Cliente Test',
        producto: 'Producto Test',
        codigoProducto: 'PROD-001',
        lote: 'LOT-001',
        fechaFabricacion: '2024-01-01',
        pedido: 'PED-001',
        turno: 'mañana',
        numeroOperario: 'OP-001',
        maquina: 'MAQ-001',
        inspectorCalidad: 'IC-001',
        jefeDeTurno: 'JT-001',
        ordenDeCompra: 'OC-001'
      }

      const result = ocrDataSchema.safeParse(validOCRData)
      expect(result.success).toBe(true)
      
      if (result.success) {
        expect(result.data.fechaFabricacion).toBe('2024-01-01')
        expect(result.data.numeroOperario).toBe('OP-001')
        expect(result.data.inspectorCalidad).toBe('IC-001')
        expect(result.data.jefeDeTurno).toBe('JT-001')
        expect(result.data.ordenDeCompra).toBe('OC-001')
        expect(result.data.codigoProducto).toBe('PROD-001')
      }
    })

    it('acepta datos parciales con campos opcionales', () => {
      const partialOCRData: Partial<OCRData> = {
        cliente: 'Cliente Test',
        fechaFabricacion: '2024-01-01',
        numeroOperario: 'OP-001'
      }

      const result = ocrDataSchema.safeParse(partialOCRData)
      expect(result.success).toBe(true)
      
      if (result.success) {
        expect(result.data.cliente).toBe('Cliente Test')
        expect(result.data.fechaFabricacion).toBe('2024-01-01')
        expect(result.data.numeroOperario).toBe('OP-001')
        expect(result.data.producto).toBeUndefined()
        expect(result.data.inspectorCalidad).toBeUndefined()
      }
    })

    it('rechaza nomenclatura snake_case obsoleta', () => {
      const legacyOCRData = {
        cliente: 'Cliente Test',
        fecha_fabricacion: '2024-01-01', // Nomenclatura obsoleta
        numero_operario: 'OP-001',        // Nomenclatura obsoleta
        inspector_calidad: 'IC-001'       // Nomenclatura obsoleta
      }

      const result = ocrDataSchema.safeParse(legacyOCRData)
      expect(result.success).toBe(true) // Debe pasar porque los campos snake_case no están definidos
      
      if (result.success) {
        // Los campos con nomenclatura obsoleta no deben existir en el resultado
        expect(result.data).not.toHaveProperty('fecha_fabricacion')
        expect(result.data).not.toHaveProperty('numero_operario')
        expect(result.data).not.toHaveProperty('inspector_calidad')
        
        // Solo deben existir los campos con nomenclatura correcta
        expect(result.data.fechaFabricacion).toBeUndefined()
        expect(result.data.numeroOperario).toBeUndefined()
        expect(result.data.inspectorCalidad).toBeUndefined()
      }
    })
  })

  describe('ocrValidatedSchema', () => {
    it('valida correctamente datos completos con camelCase', () => {
      const validatedData: OCRValidatedData = {
        cliente: 'Cliente Test',
        producto: 'Producto Test',
        codigoProducto: 'PROD-001',
        pedido: 'PED-001',
        fechaFabricacion: '2024-01-01',
        turno: 'mañana',
        numeroOperario: 'OP-001',
        maquina: 'MAQ-001',
        inspectorCalidad: 'IC-001',
        // Campos opcionales
        lote: 'LOT-001',
        jefeDeTurno: 'JT-001',
        ordenDeCompra: 'OC-001'
      }

      const result = ocrValidatedSchema.safeParse(validatedData)
      expect(result.success).toBe(true)
      
      if (result.success) {
        expect(result.data.fechaFabricacion).toBe('2024-01-01')
        expect(result.data.numeroOperario).toBe('OP-001')
        expect(result.data.inspectorCalidad).toBe('IC-001')
        expect(result.data.codigoProducto).toBe('PROD-001')
        expect(result.data.jefeDeTurno).toBe('JT-001')
        expect(result.data.ordenDeCompra).toBe('OC-001')
      }
    })

    it('falla cuando faltan campos requeridos', () => {
      const incompleteData = {
        cliente: 'Cliente Test',
        // Faltan campos requeridos con nomenclatura camelCase
        fechaFabricacion: '2024-01-01'
      }

      const result = ocrValidatedSchema.safeParse(incompleteData)
      expect(result.success).toBe(false)
      
      if (!result.success) {
        const issues = result.error.issues
        expect(issues.some(issue => issue.path.includes('producto'))).toBe(true)
        expect(issues.some(issue => issue.path.includes('codigoProducto'))).toBe(true)
        expect(issues.some(issue => issue.path.includes('numeroOperario'))).toBe(true)
        expect(issues.some(issue => issue.path.includes('inspectorCalidad'))).toBe(true)
      }
    })

    it('acepta campos opcionales vacíos', () => {
      const dataWithoutOptionals: OCRValidatedData = {
        cliente: 'Cliente Test',
        producto: 'Producto Test',
        codigoProducto: 'PROD-001',
        pedido: 'PED-001',
        fechaFabricacion: '2024-01-01',
        turno: 'mañana',
        numeroOperario: 'OP-001',
        maquina: 'MAQ-001',
        inspectorCalidad: 'IC-001'
        // Sin campos opcionales: lote, jefeDeTurno, ordenDeCompra
      }

      const result = ocrValidatedSchema.safeParse(dataWithoutOptionals)
      expect(result.success).toBe(true)
      
      if (result.success) {
        expect(result.data.lote).toBeUndefined()
        expect(result.data.jefeDeTurno).toBeUndefined()
        expect(result.data.ordenDeCompra).toBeUndefined()
      }
    })
  })

  describe('Consistencia de tipos TypeScript', () => {
    it('verifica que OCRData incluye todos los campos con nomenclatura camelCase', () => {
      // Test de tipos estático - si compila, los tipos son correctos
      const ocrData: OCRData = {
        cliente: 'test',
        producto: 'test',
        codigoProducto: 'test',
        lote: 'test',
        fechaFabricacion: 'test',
        pedido: 'test',
        turno: 'test',
        numeroOperario: 'test',
        maquina: 'test',
        inspectorCalidad: 'test',
        jefeDeTurno: 'test',
        ordenDeCompra: 'test'
      }

      // Verificar que los campos existen en el tipo
      expect(typeof ocrData.fechaFabricacion).toBe('string')
      expect(typeof ocrData.numeroOperario).toBe('string')
      expect(typeof ocrData.inspectorCalidad).toBe('string')
      expect(typeof ocrData.jefeDeTurno).toBe('string')
      expect(typeof ocrData.ordenDeCompra).toBe('string')
      expect(typeof ocrData.codigoProducto).toBe('string')
    })

    it('verifica que OCRValidatedData incluye campos requeridos con camelCase', () => {
      const validatedData: OCRValidatedData = {
        cliente: 'test',
        producto: 'test',
        codigoProducto: 'test',
        pedido: 'test',
        fechaFabricacion: 'test',
        turno: 'mañana',
        numeroOperario: 'test',
        maquina: 'test',
        inspectorCalidad: 'test'
      }

      // Verificar que los campos requeridos existen
      expect(typeof validatedData.fechaFabricacion).toBe('string')
      expect(typeof validatedData.numeroOperario).toBe('string')
      expect(typeof validatedData.inspectorCalidad).toBe('string')
      expect(typeof validatedData.codigoProducto).toBe('string')
    })
  })

  describe('Migración de datos legacy', () => {
    it('documenta que la migración de snake_case a camelCase está completa', () => {
      // Este test documenta que ya no aceptamos nomenclatura snake_case
      const legacyFieldNames = [
        'fecha_fabricacion',
        'numero_operario',
        'inspector_calidad',
        'jefe_de_turno',
        'orden_de_compra',
        'codigo_producto'
      ]

      const modernFieldNames = [
        'fechaFabricacion',
        'numeroOperario',
        'inspectorCalidad',
        'jefeDeTurno',
        'ordenDeCompra',
        'codigoProducto'
      ]

      // Verificar que los esquemas contienen los nombres modernos
      const schemaKeys = Object.keys(ocrDataSchema.shape)
      
      modernFieldNames.forEach(modernField => {
        expect(schemaKeys.includes(modernField)).toBe(true)
      })

      legacyFieldNames.forEach(legacyField => {
        expect(schemaKeys.includes(legacyField)).toBe(false)
      })
    })
  })
})