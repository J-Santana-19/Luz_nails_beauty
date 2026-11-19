---
name: supabase-workflow
description: >-
  Procedimiento para diseñar, versionar y validar migraciones de PostgreSQL,
  políticas RLS y configuración de Supabase Storage en Luz Beauty Studio.
---

# Flujo de Trabajo con Supabase

Usa esta habilidad cuando vayas a definir o modificar tablas, índices, políticas RLS o buckets de Storage para Luz Beauty Studio.

## Pasos

1. **Consultar el diseño vigente:** Lee `docs/DATABASE.md` y `docs/SECURITY.md` antes de redactar SQL.
2. **Crear migración versionada:** Agrega un archivo SQL numerado en `supabase/migrations/` (ejemplo: `0001_initial_schema.sql`), sin sobrescribir migraciones ya aplicadas en producción.
3. **Incluir seguridad desde el inicio:**
   - Habilita RLS en toda tabla nueva (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`).
   - Define políticas separadas para `anon` (solo lectura de registros activos/publicados) y administradores autenticados.
   - Define índices sobre columnas de filtrado frecuente (`is_published`, `category_id`, `display_order`).
4. **Configurar Storage:** Asegúrate de documentar o incluir políticas del bucket `gallery` restringiendo `INSERT`/`UPDATE`/`DELETE` a administradores autenticados.
5. **Validar:** Verifica sintaxis SQL y confirma que `docs/DATABASE.md` refleja exactamente el esquema actualizado.
