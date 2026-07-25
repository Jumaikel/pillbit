# Proceso de Publicación de Release

Este documento describe los pasos necesarios para preparar y publicar una nueva versión de PillBit.

## 1. Preparación Local

1. **Actualizar la versión:**
   - Actualiza el número de versión en `package.json` (`"version": "x.y.z"`).
   - Actualiza la versión en `app.json` (asegúrate de actualizar `version` y, de ser necesario, `android.versionCode` e `ios.buildNumber`).

2. **Verificar el código:**
   - Ejecuta el linter: `pnpm run lint` para asegurar que no hay problemas de estilo o errores estáticos.
   - Ejecuta las pruebas: `pnpm run test` (si aplican).
   - Asegúrate de que la aplicación compila y levanta correctamente de forma local (con `pnpm start` o `pnpm run android`).

3. **Actualizar Documentación:**
   - Documenta los cambios, nuevas funcionalidades y correcciones de esta versión en el archivo `docs/PROJECT_CONTEXT.md` en la sección de "Changelog".

## 2. Generación de los Binarios

Si utilizas EAS (Expo Application Services) para compilar la aplicación, puedes generar los binarios así:
- **Para Android (APK de prueba):** `eas build --platform android --profile preview`
- **Para Android (AAB para tienda):** `eas build --platform android --profile production`
- **Para iOS:** `eas build --platform ios`

Descarga los archivos generados (como el `.apk`) para poder adjuntarlos a la release en GitHub.

## 3. Publicación en GitHub

1. **Commit y Creación de Tag:**
   - Añade y haz commit de los cambios de versión:
     ```bash
     git add package.json app.json docs/PROJECT_CONTEXT.md
     git commit -m "chore: release v0.6.0"
     ```
   - Crea un tag de git para marcar la versión:
     ```bash
     git tag v0.6.0
     ```
   - Sube los cambios y los tags al repositorio remoto:
     ```bash
     git push origin main
     git push origin v0.6.0
     ```

2. **Crear la Release en la plataforma de GitHub:**
   - Ve a la página de tu repositorio en GitHub.
   - En la barra lateral derecha, haz clic en **Releases** y luego en **Draft a new release**.
   - Selecciona el tag que acabas de subir (ej. `v0.6.0`).
   - Rellena el **Título** y la **Descripción** usando un formato Markdown limpio (sin emojis, como se indica en las instrucciones del equipo).
   - Arrastra y suelta el archivo `.apk` descargado en la sección de "Attach binaries".
   - Haz clic en **Publish release**.
