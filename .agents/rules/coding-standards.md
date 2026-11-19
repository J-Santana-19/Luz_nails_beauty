---
trigger: always_on
description: Estándares de programación, modularidad, manejo de errores y protección de Assets para Luz Beauty Studio.
---

# Estándares de Programación

- **Modularidad:** Escribir funciones y componentes pequeños, con responsabilidad única y nombres descriptivos.
- **Separación de capas:** No mezclar llamadas directas a Supabase ni lógica de formato de WhatsApp dentro de componentes puramente visuales.
- **Sin duplicación:** Extraer utilidades compartidas (ej. constructor de enlaces `wa.me`, formateo de fechas, validadores de archivos).
- **Dependencias mínimas:** No instalar librerías externas si la necesidad puede resolverse limpiamente de forma nativa o con el stack existente.
- **Manejo de errores:** Capturar excepciones en operaciones asíncronas (Supabase Auth, PostgreSQL, Storage) y mostrar mensajes claros al usuario sin exponer trazas técnicas.
- **Integridad de `Assets/`:** Nunca modificar, renombrar, mover ni eliminar archivos dentro de `Assets/`.
