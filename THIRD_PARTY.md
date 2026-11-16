# Dependencias y procedencia

- `@mediapipe/tasks-vision` 0.10.32, Google, Apache-2.0. Runtime JS empaquetado por Vite; archivos WASM del mismo paquete en `public/vendor/wasm`. Fuente: https://github.com/google-ai-edge/mediapipe . Se conserva su cabecera de licencia.
- Face Landmarker float16 v1, Google MediaPipe: https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task . Modelo distribuido por MediaPipe; consultar model card y términos del distribuidor antes de la comercialización: https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker . No es un modelo entrenado por Hora Loca.
- Vite 7.2.2 (MIT) y dependencias: herramienta de desarrollo/build.
- `@napi-rs/canvas`: MIT, solo QA en Node; no se distribuye en frontend.
- DM Sans y Space Grotesk: Google Fonts, SIL Open Font License; cargadas como CSS remoto con respaldo Arial. No son necesarias para el motor.
- Ilustraciones, marcos, composiciones y partículas: código vectorial original del proyecto. No se incluyen logotipos de terceros ni fotos de personas.

El lockfile fija las versiones exactas. No modificar el modelo o WASM sin actualizar procedencia, checksum y pruebas. La revisión legal comercial completa y revisión de dependencias queda pendiente.
