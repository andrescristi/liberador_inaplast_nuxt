# Changelog

Todos los cambios notables a este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.6.0] - 2024-12-18

### Added
- Sistema completo de filtrado por liberador en órdenes
- API endpoint optimizada para liberadores activos únicamente
- Exportación Excel con respeto a filtros aplicados
- Limpieza completa de referencias obsoletas a Tesseract.js

### Changed
- Optimización de README.md: reducido de 1,042 a 223 líneas
- Mejora en consistencia de código con correcciones ESLint
- Actualización de documentación para reflejar solo Google Gemini AI

### Fixed
- Filtro por liberador ahora funciona correctamente
- Corrección de tipos en OrderFilters y UpdateOrderForm
- Manejo de parámetros API mejorado en endpoints de órdenes

## [2.5.0] - 2024-12-15

### Added
- Sistema de administración de usuarios con CRUD completo
- Establecimiento manual de contraseñas por administradores
- Dashboard personalizado con métricas por rol
- Tests de validación para limpieza de dependencias

### Changed
- Migración completa de Tesseract.js a Google Gemini AI
- Mejoras en autenticación híbrida JWT + Session
- Optimización de componentes UI con TailwindCSS

### Removed
- Dependencia tesseract.js eliminada completamente
- Referencias obsoletas en documentación

## [2.4.0] - 2024-12-10

### Added
- Sistema de roles avanzado (Inspector, Supervisor, Admin)
- Flujo de liberación en 4 pasos con validaciones
- Integración completa con Google Gemini AI para OCR

### Fixed
- Problemas de autenticación en rutas protegidas
- Validaciones de formulario mejoradas

## [2.3.0] - 2024-12-05

### Added
- Base del sistema de liberación de productos
- Estructura inicial con Nuxt 4.0.3
- Configuración de Supabase como backend

### Security
- Implementación de middleware de autenticación
- Validación de roles y permisos