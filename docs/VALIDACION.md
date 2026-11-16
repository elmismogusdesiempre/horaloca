# Estado de aceptación y prueba reproducible

Fecha de ejecución automatizada: 16 noviembre 2026. Resultado: 35 pruebas automatizadas aprobadas y build de producción correcto. HTTP 200 para ambas páginas, modelo y ambos WASM del despliegue inicial. Sin navegador ni inferencia física.

Estado general: pendiente de aceptación física y artística.

| Criterio solicitado | Evidencia actual | Estado |
|---|---|---|
| 1 Cámara en navegadores compatibles | getUserMedia implementado | Pendiente física |
| 2 Sesión automática de cuatro fotos | Máquina ejecutada con captura inyectada | Parcial; falta cámara |
| 3 Cuenta regresiva independiente | 12 ticks 3–2–1 comprobados | Motor aprobado |
| 4 Solo autorizados | 500 selecciones aleatorias | Motor aprobado |
| 5 Catálogo ≥60 diferenciado | 72 renderizados, inspección de hoja | Cantidad comprobada; arte pendiente |
| 6 Landmarks reales | Integración MediaPipe, sin posiciones fallback | Pendiente inferencia real |
| 7 Ajuste en movimiento | Escala/roll y suavizado implementados | Pendiente física |
| 8 Ambientes y marcos | Render Canvas nativo | Parcial; falta navegador |
| 9 Preview organizador | Tarjetas reales, guía y cámara opcional | Pendiente flujo navegador |
| 10 Collage cuatro fotos | Dos JPEG reales exportados por motor | Motor aprobado; E2E pendiente |
| 11 Efectos en resultado | Exportación desde imágenes procesadas | Motor aprobado; E2E pendiente |
| 12 Táctil y escritorio | CSS responsivo, controles accesibles | Pendiente dispositivos |
| 13 Consola/memoria tras sesiones | Liberación de recursos implementada | Pendiente medición |
| 14 Limitaciones documentadas | README y este documento | Documentado |
| 15 Pruebas reales funcionales | Ejecución de lógica y Canvas nativo | Parcial; sin cámara/navegador |

## Protocolo manual

1. Desplegar `dist` por HTTPS. Registrar sistema, dispositivo, navegador, orientación, luz y resolución de cámara.
2. Abrir `/organizador.html`. Activar solo copa, gafas gigantes y confeti. Guardar nombre, frase, color y formato. Recargar y confirmar persistencia. Revisar preview de cada efecto. Cambiar logotipo y quitarlo.
3. Activar cámara en preview. Con una persona frontal, inclinar cabeza ±25°, acercar/alejar (0.6–1.5 m), mirar a ambos lados. Registrar deslizamiento, vibración y FPS. No aceptar aprobación por una sola foto frontal.
4. Añadir 2 y 3 personas, intercambiar posiciones y cruzarse. Tapar cara, salir y volver. Los accesorios deben desaparecer al perder cara; nunca quedarse en el centro. Documentar swaps. Probar poca luz, distintos tonos de piel y gafas reales.
5. Abrir invitado. Permitir cámara, pulsar iniciar 10 veces rápidamente. Debe producir una única sesión: preparación 5 s, cuatro cuentas 3–2–1, cuatro flashes y resultado. Nadie vuelve a tocar durante captura.
6. Verificar solo efectos autorizados y combinaciones compatibles; repetir 5 sesiones. Configurar solo un ambiente y comprobar reutilización permitida. Configurar solo accesorios y bloquear carga del modelo: debe informar que no hay efectos disponibles, sin accesorios estáticos.
7. Descargar cuadrícula, luego tira; inspeccionar resolución, nitidez, caras sin deformación, texto/logotipo y efectos incluidos. Comparar espejo con preview. Verificar retorno automático y descarga antes del retorno.
8. Denegar cámara, detener cámara desde navegador, bloquear modelo/WASM, agotar almacenamiento en perfil de prueba. Confirmar mensajes y recuperación. No borrar datos de un perfil personal para estas pruebas.
9. Completar 20 sesiones. Registrar errores de consola y memoria antes/después, comprobar que streams se cierran al salir del preview y de la página, que las URL de resultados se revocan y que quedan solo 12 registros locales.
10. Repetir Safari iPad, Chrome Android, Chrome/Edge escritorio y Safari macOS. Probar pantalla completa no soportada, vertical/horizontal, permisos y teclado. El fullscreen es opcional y no debe bloquear sesión.

No hay objetivo FPS aprobado todavía. Objetivo para aceptación: render fluido sostenido cercano a 30 FPS con inferencia desacoplada; medir en cada equipo, registrar coste y reducir caras/partículas si no se alcanza. No se promete compatibilidad universal.

## Pruebas manuales de la revisión

- Panel: fondo blanco en escritorio/tableta, campos sin bordes, controles rectangulares. El indicador de foco del teclado sigue visible.
- Invitado: activar cámara y comprobar cobertura completa sin logo, enlaces, paneles o márgenes. Durante sesión, ningún botón visible; solo frases y cuenta. Girar dispositivo y comprobar que no deforma la cara ni desalinea accesorios.
- Salir de fullscreen con Escape y confirmar que la cámara sigue llenando el viewport. Documentar si Safari/iPad no permite ocultar la barra del navegador.
- Cine: probar CCTV y espía, comprobar que la cara se vuelve verde y el collage conserva exactamente el tratamiento; comprobar texto GRABANDO.
- Activar por separado los ocho estilos nuevos; revisar legibilidad, resolución deliberadamente reducida de térmico/cómic, fluidez de VHS/prisma y que el falso color se identifique como simulación.
- Boda: comprobar corona floral a diferentes distancias, tamaño de pétalos, continuidad de hojas y que bouquets en esquinas no cubren caras. Tiaras deben seguir los ojos/cabeza, sin picos triangulares.

## Cámara apagada y salvapantallas

El cierre se ejecuta tras copiar la cuarta captura, antes del último retardo, generación del collage y almacenamiento. También se cierran cámara, seguimiento y renderizado al cancelar, ocultar pestaña o salir. Una solicitud de cámara que resuelva después de su cancelación detiene sus pistas sin conectarlas al video. El salvapantallas no solicita medios.

Pruebas automatizadas con MediaStreams y video instrumentados: apagado antes del resultado; fallos de captura/exportación/play; cancelación; permisos y play pendientes; nueva apertura explícita; cinco sesiones consecutivas; cuatro slides cíclicos y un solo temporizador. Esto verifica llamadas y estados de pistas, no el indicador físico del teléfono.

Prueba manual en teléfono:

1. Al abrir el invitado, confirmar cámara apagada y cuatro instrucciones rotando cada 5,5 s. Esperar 30 s: la cámara no debe activarse.
2. Tocar «¡TÓCAME PARA EMPEZAR!» una vez, conceder permiso y completar las cuatro fotos sin otro toque.
3. Tras la cuarta foto, confirmar que se apaga el indicador de uso de cámara. El navegador puede conservar un icono de permiso concedido; distinguirlo del indicador de uso activo. Al ver/descargar el collage, la cámara debe seguir apagada.
4. Pulsar «Otra vez» o esperar el retorno: deben aparecer las instrucciones y mantenerse apagada la cámara. Solo otro toque explícito abre una nueva sesión.
5. Cambiar de pestaña durante cuenta regresiva o carga de cámara: debe apagarse. Volver no debe encenderla automáticamente. Repetir cinco sesiones y comprobar que no quedan streams anteriores activos.
6. Probar denegación de permiso y reintento, rotación de pantalla y restauración desde el historial. Se mantienen layout blanco, esquinas rectas y fullscreen cuando el navegador lo permite.

## Regresión de inicio móvil

El inicio no debe esperar `AudioContext.resume()`: en móvil puede quedar pendiente durante permisos/transiciones. Se solicita la cámara primero y el sonido se prepara sin bloquearla. Pruebas de regresión: audio pendiente, audio rechazado/no disponible y permiso de cámara denegado con audio pendiente. Repetir manualmente en el teléfono donde se observó el fallo. Fullscreen se solicita después de adquirir el video y no condiciona el inicio de cámara.

## Bloqueo anterior a habilitar el botón

Se reprodujo `TypeError: Illegal invocation` al ejecutar el temporizador con las restricciones de receptor de las APIs de Window. Guardar `setInterval` directamente en una propiedad y ejecutarlo como `this.schedule(...)` enlazaba el receptor a Screensaver. La excepción ocurría antes de cargar configuración/habilitar el botón. Los valores por defecto ahora llaman `globalThis.setInterval/clearInterval` conservando su receptor; si el temporizador no está disponible se mantiene una instrucción estática sin interrumpir la inicialización. Una prueba falla con la versión anterior y pasa con la corrección. Sigue pendiente confirmar el flujo en el teléfono del usuario.

## Entrega antes del salvapantallas

Estados del flujo: captura → preparación con cámara apagada → resultado → espera. Apagar el hardware no cambia por sí solo a espera. La prueba del flujo ejecuta las cuatro capturas y verifica que no aparece estado idle ni se activa el carrusel durante preparación/resultado; al volver a empezar sí se activa, sin abrir cámara. El guardado de IndexedDB se hace en segundo plano después de mostrar la foto. El resultado se conserva al ocultar/mostrar la página, hasta «Otra vez» o el retorno automático. QR remoto no implementado; irá en el resultado después de disponer de almacenamiento y enlace privado.

Prueba manual: completar sesión, confirmar indicador de cámara apagado, ver primero la preparación y la tirilla/collage (sin slides intermedios), descargar, y pulsar «Otra vez». Solo entonces deben rotar las instrucciones; otro toque inicia otra sesión. Repetir ocultando la pestaña cuando ya aparece el resultado.

## Vista inmediata y acceso al organizador

La tirilla se compone sincrónicamente en Canvas y se inserta en el resultado antes de iniciar JPEG. La codificación se difiere hasta después de pintar el resultado y habilita la descarga al terminar; no bloquea la foto ni el botón «Otra vez». No hay retardo de 450 ms después de la cuarta captura (sí entre las anteriores). Una prueba mantiene `toBlob` pendiente y comprueba que la composición ya está disponible. Otra comprueba que no hay espera entre el cuarto flash y finish.

El enlace explícito «Organizador · Configurar fiesta» está en el salvapantallas, oculto durante captura. Ruta directa: `/organizador.html`. En móvil, configuración antes de la biblioteca. «Tipo de celebración» admite Fiesta loca, 15 años, Bodas, Cumpleaños, Televisión y cine, y Corporativos. Cambiarlo aplica recomendados de esa categoría; las pestañas siguen permitiendo explorar y mezclar. Cumpleaños reutiliza una selección de efectos de fiesta y no infla el catálogo de 72.

Prueba manual pendiente en teléfono: finalizar sesión y observar la tirilla antes de que se habilite la descarga; comprobar que cámara queda apagada. Esperar descarga y guardar JPEG; revisar resolución. Volver a espera, abrir «Configurar fiesta», cambiar categoría, guardar y completar otra sesión. Durante las fotos no deben aparecer accesos de configuración.
