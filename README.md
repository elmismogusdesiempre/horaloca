# Hora Loca — Photobooth local, etapa 1

Implementación inicial ejecutable; **no es una entrega comercial certificada**. Hay 64 definiciones renderizables y pruebas automatizadas del motor. Falta validar la cámara, el tracking, el rendimiento y la calidad artística en dispositivos físicos. No se presentan como aprobados esos criterios.

## Ejecutar

Node 22.12+ o 24, `npm ci`, `npm run dev`. Abre la URL indicada por Vite. Panel: `/organizador.html`; invitado: `/`. Guarda el evento, abre photobooth, permite cámara y pulsa el botón. Cada sesión dura aproximadamente 21 segundos, más la exportación.

Para tabletas necesitas HTTPS: un origen HTTP por IP de red no permite normalmente getUserMedia. `npm run build` produce `dist/`, listo para hosting estático. `vercel.json` configura Vercel (Vite, salida dist). No se necesitan variables, claves ni backend. Importa **este** repositorio en Vercel y usa los valores del archivo. Las rutas están pensadas para la raíz de un dominio; un subdirectorio requiere ajustar las rutas absolutas.

## Arquitectura

- `js/camera`: getUserMedia, recorte proporcional y espejo.
- `js/tracking`: MediaPipe Face Landmarker, 3 caras como máximo, asociación por proximidad, suavizado, frecuencia adaptativa 80/160 ms y ocultación al perder tracking.
- `js/effects`: catálogo, selección, vectores originales, partículas, composiciones editoriales y motor por capas. Misma función para preview y captura.
- `js/ui`: panel, guía ilustrada, experiencia invitado y máquina de sesión con bloqueo de doble inicio.
- `js/collage`: 2×2 de 2400×2200 o tira de 1200×3600. JPEG de calidad configurable en configuración interna, recorte proporcional, nombre, frase y fecha.
- `js/storage`: IndexedDB; un evento local y hasta 12 collages, eliminando los más antiguos. Interfaces locales explícitas para reemplazar licencia/sincronización en etapa 2. No hay licencias comerciales simuladas.
- `public/models`, `public/vendor/wasm`: modelo y runtime autoalojados. La cámara y la inferencia no suben imágenes. Las fuentes Google Fonts generan peticiones de tipografía; hay fuentes de sistema de respaldo.

## Funciones

Catálogo visual por tema, búsqueda, selección mixta, recomendados por tema, preview animado con guía y cámara opcional, colores, nombre, frase, logotipo local de hasta 2 MB, collage, sonido sintetizado opcional y retorno automático de 10–300 s. Un evento se crea/editando y guardando en el panel; no hay lista de múltiples eventos.

Cuatro capturas con 5 s de preparación y 3–2–1 independientes. Aleatoriedad limitada estrictamente a IDs habilitados; una capa por ranura, máximo tres capas, sin dos marcos/cine competidores. Se evita repetir composiciones si existen suficientes; si solo hay un efecto se reutiliza. Se priorizan composiciones distintas de la sesión anterior mientras la página permanece abierta.

Cámara espejo y exportación espejo deliberadamente coherentes. Cada captura copia el Canvas visible, incluyendo accesorios y escena. Las miniaturas son el render real del efecto sobre una **guía ilustrada**, no fotografías reales ni evidencia de tracking.

## Catálogo

64 efectos: Fiesta 24, Bodas 10, Quince 10, Cine 10, Corporativo 10. Lista y metadatos en [docs/CATALOGO.md](docs/CATALOGO.md). El estado `implemented-unvalidated-camera` significa implementado, pendiente de aceptación física. Renderizar píxeles distintos no certifica diferenciación artística suficiente.

## Pruebas y límites

`npm test`: selección aleatoria (500 sesiones), compatibilidad, no repetición, degradación sin tracking, doble inicio, cuentas regresivas, cancelación, fallos de captura; render real de los 64 efectos usando Canvas nativo de Node y exportación de ambos collages. Genera `work/effects-contact-sheet.png` y dos JPEG de QA. `npm run build`: comprueba empaquetado de las dos páginas y copia los modelos.

El Canvas de Node no equivale a Safari/Chrome. No se ejecutó un navegador, una cámara física ni inferencia facial real en este entorno. Sigue [docs/VALIDACION.md](docs/VALIDACION.md) antes de usar en un evento. La etapa 1 permanece **pendiente de aceptación**.

Los accesorios son ilustración vectorial 2D, con escala y rotación en el plano; no hay oclusión 3D, segmentación de pelo/cuerpo, perspectiva completa de yaw/pitch ni iluminación estimada de la escena. Giros extremos, manos sobre la cara, poca luz, cruces de personas y caras pequeñas requieren validación/mejora. La corbata se aproxima al cuello desde el mentón; no hay seguimiento corporal. El pelo es ilustrado, no reemplaza cabello real. El modelo se carga bajo demanda al activar la cámara; WASM se selecciona según capacidades. La frecuencia adaptativa no es una certificación de FPS.

IndexedDB puede borrarse o agotarse; descarga cada recuerdo importante. No hay galería visible, eliminación manual por sesión ni sincronización. Solo guarda los últimos 12 resultados por navegador/origen. El panel no está protegido por contraseña: modo local de prueba.

## Etapa 2

Validación física y refinamiento artístico con fotografías; pose 3D/oclusiones; pipeline de assets y presupuestos por dispositivo; telemetría opt-in; PWA/service worker y reintentos offline; galería y borrado; multi-evento; licencias 24 h y dispositivo activo con servidor; transferencia, cupos, autenticación y pagos; sincronización durable y recuperación; Drive/Sheets mediante un puente seguro; páginas privadas de descarga y QR.

**Drive y Apps Script no están creados ni conectados.** En esta etapa el núcleo es local, como requiere el alcance. No hay herramientas Google conectadas en esta sesión. Su aprovisionamiento necesitará conexión de la cuenta y un despliegue autenticado; nunca se debe insertar una clave de Apps Script en el JavaScript público. El motor fotográfico no depende de Google.

## Recursos

Arte vectorial original en `art.js` y `scene.js`. Dependencias y procedencia: [THIRD_PARTY.md](THIRD_PARTY.md). Sin marcas de cadenas ni personajes de terceros.
