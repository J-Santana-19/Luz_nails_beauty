# Estructura de Supabase — Luz Beauty Studio

Esta carpeta centraliza el versionado del esquema de **PostgreSQL** para Supabase.

> **Estado:** Estructura preparada. **No se han ejecutado migraciones ni conectado a una base de datos real.**

---

## Organización

- `migrations/`: Contendrá los archivos SQL secuenciales que definen tablas, índices, triggers (`updated_at`), políticas RLS y políticas de Storage (por ejemplo: `0001_initial_schema.sql`).
- `seed.sql`: Plantilla propuesta con las 6 categorías oficiales iniciales de Luz Beauty Studio.

## Reglas de Versionado

1. **Inmutabilidad:** Nunca modificar una migración que ya fue aplicada en un entorno compartido o producción; en su lugar, crear una nueva migración incremental.
2. **Orden secuencial:** Nombrar los archivos con prefijo numérico o timestamp (`0001_...`, `0002_...`).
3. **RLS obligatorio:** Toda tabla creada en una migración debe incluir `ENABLE ROW LEVEL SECURITY` y sus políticas correspondientes.
4. **Sin credenciales:** Nunca incluir contraseñas, tokens ni claves de Supabase en archivos SQL del repositorio.

Para ver el diseño completo de tablas y relaciones, consultar [`docs/DATABASE.md`](../docs/DATABASE.md).
