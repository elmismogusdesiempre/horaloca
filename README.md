# Hora Loca — Photobooth local, etapa 1

Implementación inicial ejecutable; **no es una entrega comercial certificada**. Hay 72 definiciones renderizables y pruebas automatizadas del motor. Falta validar la cámara, el tracking, el rendimiento y la calidad artística en dispositivos físicos. No se presentan como aprobados esos criterios.

## Publicación de prueba

Web: https://horaloca.vercel.app · Panel: https://horaloca.vercel.app/organizador.html . La publicación no sustituye la aceptación física.

## Ejecutar

Node 22.12+ o 24, `npm ci`, `npm run dev`. Abre la URL indicada por Vite. Panel: `/organizador.html`; invitado: `/`. Guarda el evento, abre photobooth, permite cámara y pulsa el botón. Cada sesión dura aproximadamente 21 segundos, más la exportación.

Para tabletas necesitas HTTPS: un origen HTTP por IP de red no permite normalmente getUserMedia. `npm run build` produce `dist/`, listo para hosting estático. `vercel.json` configura Vercel (Vite, salida dist). No se necesitan variables, claves ni backend. Importa **este** repositorio en Vercel y usa los valores del archivo. Las rutas están pensadas para la raíz de un dominio; un subdirectorio requiere ajustar las rutas absolutas.

## Arquitectura

- `js/camera`: getUserMedia, recorte proporcional y espejo.
- `js/tracking`: MediaPipe Face Landmarker, 3 caras como máximo, asociación por proximidad, suavizado, frecuencia adaptativa 80/160 ms y ocultación al perder tracking.
- `js/effects`: catálogo, selección, vectores originales, partículas, composiciones editoriales y motor por capas. Misma función para preview y captura.
- `js/ui`: panel, guía ilustrada, experiencia invitado y máquina de sesión con bloqueo de doble inicio.
- `js/collage`: 2×2 de 2400×2200 o tira de 1200×3600. JPEG de calidad seleccionable en el panel, recorte proporcional, nombre, frase y fecha.
- `js/storage`: IndexedDB; un evento local y hasta 12 collages, eliminando los más antiguos. Interfaces locales explícitas para reemplazar licencia/sincronización en etapa 2. No hay licencias comerciales simuladas.
- `public/models`, `public/vendor/wasm`: modelo y runtime autoalojados. La cámara y la inferencia no suben imágenes. Las fuentes Google Fonts generan peticiones de tipografía; hay fuentes de sistema de respaldo.

## Funciones

Catálogo visual por tema, búsqueda, selección mixta, recomendados por tema, preview animado con guía y cámara opcional, colores, nombre, frase, logotipo local de hasta 2 MB, collage, sonido sintetizado opcional y retorno automático de 10–300 s. Un evento se crea/editando y guardando en el panel; no hay lista de múltiples eventos.

Cuatro capturas con 5 s de preparación y 3–2–1 independientes. Aleatoriedad limitada estrictamente a IDs habilitados; una capa por ranura, máximo tres capas, sin dos marcos/cine competidores. Se evita repetir composiciones si existen suficientes; si solo hay un efecto se reutiliza. Se priorizan composiciones distintas de la sesión anterior mientras la página permanece abierta.

Cámara espejo y exportación espejo deliberadamente coherentes. Cada captura copia el Canvas visible, incluyendo accesorios y escena. Las miniaturas son el render real del efecto sobre una **guía ilustrada**, no fotografías reales ni evidencia de tracking.

## Catálogo

72 efectos: Fiesta 24, Bodas 10, Quince 10, Cine 18, Corporativo 10. Lista y metadatos en [docs/CATALOGO.md](docs/CATALOGO.md). El estado `implemented-unvalidated-camera` significa implementado, pendiente de aceptación física. Renderizar píxeles distintos no certifica diferenciación artística suficiente.

## Pruebas y límites

`npm test`: 35 pruebas aprobadas; selección aleatoria (500 sesiones), compatibilidad, no repetición, degradación sin tracking, doble inicio, cuentas regresivas, cancelación, fallos de captura, mapeo espejo y asociación sintética de rostros; render real de los 72 efectos usando Canvas nativo de Node y exportación de ambos collages. Genera `work/effects-contact-sheet.png` y dos JPEG de QA. `npm run build`: comprueba empaquetado de las dos páginas y copia los modelos.

El Canvas de Node no equivale a Safari/Chrome. No se ejecutó un navegador, una cámara física ni inferencia facial real en este entorno. Sigue [docs/VALIDACION.md](docs/VALIDACION.md) antes de usar en un evento. La etapa 1 permanece **pendiente de aceptación**.

Los accesorios son ilustración vectorial 2D, con escala y rotación en el plano; no hay oclusión 3D, segmentación de pelo/cuerpo, perspectiva completa de yaw/pitch ni iluminación estimada de la escena. Giros extremos, manos sobre la cara, poca luz, cruces de personas y caras pequeñas requieren validación/mejora. La corbata se aproxima al cuello desde el mentón; no hay seguimiento corporal. El pelo es ilustrado, no reemplaza cabello real. El modelo se carga bajo demanda al activar la cámara; WASM se selecciona según capacidades. La frecuencia adaptativa no es una certificación de FPS.

IndexedDB puede borrarse o agotarse; descarga cada recuerdo importante. No hay galería visible, eliminación manual por sesión ni sincronización. Solo guarda los últimos 12 resultados por navegador/origen. El panel no está protegido por contraseña: modo local de prueba.

## Etapa 2

Validación física y refinamiento artístico con fotografías; pose 3D/oclusiones; pipeline de assets y presupuestos por dispositivo; telemetría opt-in; PWA/service worker y reintentos offline; galería y borrado; multi-evento; licencias 24 h y dispositivo activo con servidor; transferencia, cupos, autenticación y pagos; sincronización durable y recuperación; Drive/Sheets mediante un puente seguro; páginas privadas de descarga y QR.

**Drive y Apps Script no están creados ni conectados.** En esta etapa el núcleo es local, como requiere el alcance. No hay herramientas Google conectadas en esta sesión. Su aprovisionamiento necesitará conexión de la cuenta y un despliegue autenticado; nunca se debe insertar una clave de Apps Script en el JavaScript público. El motor fotográfico no depende de Google.

## Recursos

Arte vectorial original en `art.js` y `scene.js`. Dependencias y procedencia: [THIRD_PARTY.md](THIRD_PARTY.md). Sin marcas de cadenas ni personajes de terceros.

## Revisión de diseño y efectos

Interfaces blancas, esquinas rectas y controles sin bordes decorativos; preferencias persistidas en AGENTS.md. La cámara ocupa todo el viewport con proporción de captura adaptada a vertical/horizontal (lado mayor 1600 px). Durante las capturas solo se muestran imagen, frases de pose y cuenta regresiva; el botón inicial desaparece. Fullscreen nativo se solicita con interacción del usuario; algunos navegadores, especialmente Safari/iPad, pueden conservar controles propios del navegador. La web no puede forzar a ocultarlos cuando no existe soporte.

Ocho composiciones fotográficas nuevas en Televisión y cine: falso color térmico (no mide temperatura), cianotipia, cómic, VHS, cine negro, hora dorada, prisma e instantánea. CCTV y espías ahora transforman los píxeles de la cámara a fósforo verde con barrido y grano, antes de dibujar indicadores. Las tarjetas y exportaciones usan el mismo pipeline. Thermal/cómic procesan a un máximo de 640 px de ancho para limitar coste; VHS/prisma reutilizan un Canvas auxiliar y pueden necesitar un equipo más potente. Los estilos de fotografía son independientes del fondo blanco de la interfaz.

Corona floral y arreglos de boda: rosas vectoriales con pétalos en capas, hojas con nervaduras y ramas. Tiaras/reina: alambres curvos, perlas y engastes. No se agregan emojis dependientes del sistema. No se habilitan efectos nuevos automáticamente en eventos guardados: el organizador mantiene control de los autorizados.

Las pruebas nuevas verifican valores de píxel del verde CCTV/espía, monocromía de cine negro, falso color térmico y proporciones de viewport. Son pruebas en Canvas nativo de Node; falta comprobar fluidez y compatibilidad visual en cámaras físicas y navegadores.

## Salvapantallas y cierre estricto de cámara

El invitado espera en un carrusel blanco de cuatro instrucciones que rotan cada 5,5 s, sin acceder a la cámara. Un solo toque en «¡TÓCAME PARA EMPEZAR!» abre la cámara e inicia la sesión completa. Tras copiar la cuarta foto se detienen todas las pistas del stream, se pausa/desconecta el video, se cancela el renderizado y se libera el seguimiento **antes** de exportar o guardar el collage. Tras apagar la cámara se muestra una breve preparación y después el collage, sin iniciar el salvapantallas. El resultado se entrega antes de esperar el guardado local. «Otra vez» o el retorno automático no encienden la cámara; se necesita otro toque explícito. Cambiar de pestaña o salir cancela la sesión y apaga la cámara. También se invalidan las solicitudes de cámara pendientes. Las pruebas de MediaStream son instrumentadas; el indicador físico debe comprobarse en Safari/Chrome móvil siguiendo VALIDACION.md.

El flujo del invitado separa los estados captura → preparación → resultado → espera. El salvapantallas solo corresponde a espera, al pulsar «Otra vez» o al retorno automático configurado. La pantalla de resultado es el lugar previsto para el futuro QR privado junto a la fotografía; todavía no se genera un QR ni un enlace remoto. Cambiar de aplicación no descarta un resultado ya entregado (salvo que venza su retorno automático).

## Resultado inmediato y categorías

El resultado muestra el Canvas original en cuanto se componen las cuatro fotos; no espera la compresión JPEG ni el guardado. La descarga conserva resolución/calidad y se prepara en segundo plano. Se eliminó la pausa tras el cuarto flash. No se ha medido todavía la latencia en el teléfono del usuario.

Acceso visible en espera: «Organizador · Configurar fiesta»; ruta directa `/organizador.html`. En móvil los settings aparecen antes de la biblioteca. «Tipo de celebración» incluye 15 años, Bodas y Cumpleaños además de los temas existentes. Elegir tipo aplica recomendados, editables después. Cumpleaños es una selección de efectos existentes, no efectos duplicados para inflar el catálogo.
