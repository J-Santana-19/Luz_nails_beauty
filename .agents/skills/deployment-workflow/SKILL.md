---
name: deployment-workflow
description: >-
  Lista de verificación y pasos para preparar y validar un despliegue en
  Cloudflare Pages conectado a GitHub.
---

# Flujo de Despliegue en Cloudflare Pages

Usa esta habilidad antes de publicar cambios en producción o configurar el despliegue continuo.

## Pasos Previos

1. **Verificar variables de entorno:** Confirmar que `.env` no existe en el repositorio y que `.env.example` está actualizado.
2. **Ejecutar verificaciones:** Correr pruebas disponibles según `docs/TESTING.md` y validar que el build de producción finaliza sin errores.
3. **Revisar seguridad:** Comprobar que ninguna clave `service_role` o secreto privado quedó incluido en el código cliente.
4. **Verificar `Assets/`:** Confirmar que `Assets/` permanece intacta en Git.

## Configuración en Cloudflare Pages

1. Conectar el repositorio de GitHub en Cloudflare Pages.
2. Configurar rama de producción (`main`), comando de build y directorio de salida (según el framework definido en `docs/DEPLOYMENT.md`).
3. Cargar las variables de entorno públicas requeridas en Cloudflare Pages (Production y Preview).
4. Verificar la Preview URL antes de fusionar a `main`.
