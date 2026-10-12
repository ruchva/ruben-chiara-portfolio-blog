# "La cola está vacía" no es éxito: pruebas de carga que mentían

Antes de llevar el worker de generación de diplomas (`servicio-diploma`) a producción, necesitábamos responder una pregunta simple: ¿puede procesar los volúmenes reales que exige un periodo de graduación masiva - cientos o miles de diplomas en un plazo acotado - sin caerse ni perder datos? Construimos un mecanismo de pruebas de carga para responderla. La primera versión de ese mecanismo, sin embargo, estaba midiendo una mentira, y tardamos en darnos cuenta exactamente por qué.

## La métrica de éxito equivocada

El diseño original asumía algo que parecía razonable: si encolamos N trabajos en Redis y, al terminar, la cola está vacía, entonces los N trabajos se procesaron con éxito. Había incluso una lógica de reintento (`nackRetry`) pensada para los que fallaran.

El problema es que esa métrica - "la cola llegó a cero" - solo prueba que cada trabajo fue *sacado* de la cola. No prueba que el trabajo se haya completado correctamente.

## Lo que realmente pasaba

Al investigar con más cuidado, encontramos que `MassiveGenerationService.processQueuedJob` capturaba sus propias excepciones internamente y retornaba con normalidad - es decir, **nunca relanzaba el error**. Esto significa que, desde el punto de vista de `QueueWorker`, el trabajo siempre se completaba sin problemas, incluso cuando la generación había fallado por completo. Confirmamos esto deliberadamente: provocamos un escenario donde el bucket de almacenamiento S3 no existía, el intento de guardar el PDF devolvía un 404, el worker lo registraba como `FAILED` en su propio log interno - y aun así reportaba al orquestador "completado y confirmado (ack)", con la cola en cero.

El mecanismo de reintento (`nackRetry`) nunca se activaba, porque la condición que lo dispara (una excepción propagada) nunca ocurría. Era, en la práctica, código muerto. Y el contador de la cola de mensajes fallidos (DLQ) marcaba permanentemente cero - no porque no hubiera fallos, sino porque nada escribía ahí nunca.

## Segunda capa: ni siquiera el PDF en S3 era prueba suficiente

Corregido ese primer nivel, apareció un segundo: que un PDF existiera en el almacenamiento tampoco probaba, por sí solo, que el negocio lo considerara "real", porque el paso de notificación al backend (el que marca el trámite como completado en la base de datos) también podía fallar en silencio - y de hecho fallaba, por el bug de hostname con guion bajo que describimos en [Un guion bajo rompió todas nuestras notificaciones](/#/blog/fallo-silencioso-docker-tomcat). Dos capas de "éxito aparente" que no correspondían a éxito real, apiladas una sobre la otra.

## Cómo se definió una verdad de referencia que sí sirve

La solución fue dejar de confiar en cualquier señal indirecta (cola vacía, logs, ausencia de excepciones) y medir el resultado real: **contar los PDFs que efectivamente existen en el almacenamiento**, identificados con un marcador de ejecución (*run ID*) incrustado en el código del estudiante de cada diploma de prueba, y cruzar ese conteo contra lo que el backend confirma haber guardado en su propia base de datos. Si ambos números no coinciden, hay un fallo real en algún punto del pipeline - sin importar lo que diga la cola.

Para ejecutar las pruebas contra los nodos reales de preproducción (que tenían Python 3.14 pero ni el paquete `redis` ni `redis-cli` disponibles, y donde instalar paquetes nuevos no era aceptable por política de infraestructura), se construyó un cliente RESP mínimo para Redis sin dependencias externas - suficiente para encolar trabajos y verificar su estado sin tocar el entorno más de lo necesario.

## Los números, una vez que la medición fue honesta

Con la métrica corregida, los resultados documentados fueron:

- ~5.3 segundos por diploma por hilo de procesamiento.
- Con 20 hilos (4 contenedores × 5 hilos, repartidos en los 2 nodos worker): ~3.8 diplomas/segundo ≈ 225/minuto.
- 500 diplomas: entre 2 y 4 minutos.
- 20.000 diplomas: aproximadamente 90 minutos.

Comparado contra el requisito de negocio (≤30 minutos para 500 diplomas, ≤1% de tasa de error), el sistema lo cumple con margen amplio - pero solo porque la medición finalmente reflejaba la realidad.

## Lo que quedó honestamente pendiente

El propio informe de resultados documenta, sin maquillar, lo que no se alcanzó a resolver: `nackRetry` sigue sin estar conectado a nivel de aplicación; toda la lógica de reintento vive hoy en el arnés de pruebas externo, no en el servicio mismo. Es deuda técnica reconocida explícitamente, no deuda técnica descubierta después por otra persona.

## La lección generalizable

Cualquier sistema asíncrono basado en colas tiene esta misma trampa esperando: es muy fácil construir una métrica de "éxito" que en realidad solo mide que un mensaje fue consumido, no que el trabajo detrás de ese mensaje se completó correctamente. Antes de confiar en una métrica de éxito, pregúntate qué pasaría si el *handler* capturara la excepción y siguiera como si nada - porque si la respuesta es "la métrica seguiría viéndose bien", entonces la métrica no sirve. La verdad de referencia tiene que venir del efecto final observable (un archivo que existe, un registro que se guardó), no del estado interno de la tubería que se supone lo produjo.
