# Carpeta de Pruebas (`tests/`) — Luz Beauty Studio

Esta carpeta organiza la futura suite de pruebas automatizadas del proyecto.

> **Estado actual:** Suite activa ejecutada con `npm test` (Vitest + Testing Library) en `components/`, `integration/` y `e2e/`. Las pruebas contra un proyecto remoto real de Supabase quedan pendientes de configuración en `.env`.

---

## Organización

- **`components/`**: Pruebas unitarias y de componentes de interfaz (renderizado, estados `loading`/`empty`/`error`, validación de campos del formulario, filtros de galería).
- **`integration/`**: Pruebas de integración entre módulos (construcción y codificación de enlaces `wa.me`, capa de servicios hacia Supabase, protección de rutas del panel administrativo).
- **`e2e/`**: Pruebas de extremo a extremo (End-to-End) simulando recorridos completos de visitantes y administradores en navegador.

El detalle completo de casos de prueba planificados se encuentra en [`docs/TESTING.md`](../docs/TESTING.md).
