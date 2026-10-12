# Por qué eliminamos WebSocket en favor de polling

En el sistema de emisión de Diplomas Digitales de Bachiller necesitábamos mostrarle al usuario el progreso de operaciones largas: la firma masiva de un lote de diplomas, la generación de cientos de PDFs, el empaquetado de un ZIP para distrital. La primera solución, desde las primeras versiones del frontend, fue la obvia: WebSocket con STOMP, un canal `/topic/firma-progress/{username}` que el backend empujaba en tiempo real.

Funcionó bien… en desarrollo. En producción, detrás de la red de una institución de gobierno, se rompió de dos maneras distintas, y cada una enseña algo distinto sobre desplegar WebSocket en infraestructura que no controlas por completo.

## Problema 1: el proxy corporativo no entendía `Upgrade`

WebSocket empieza como una petición HTTP normal que negocia un cambio de protocolo con el header `Connection: Upgrade` / `Upgrade: websocket`. Muchos proxies corporativos y balanceadores de capa 7 - configurados para HTTP/HTTPS tradicional - no reenvían ese header, o lo descartan activamente por políticas de seguridad perimetral. El resultado no es un error claro: la conexión simplemente nunca se establece, o cae silenciosamente después del *handshake*, dejando al cliente sin manera de saber si el job sigue corriendo o ya terminó.

## Problema 2: el balanceador round-robin no tiene sesiones pegajosas

El segundo problema apareció al escalar horizontalmente. Nuestro backend corre en más de una instancia (dos nodos `worker` en el clúster provisionado con Ansible), detrás de un balanceador que reparte peticiones en *round-robin*, sin afinidad de sesión (*sticky sessions*). STOMP, por defecto, mantiene el estado de las suscripciones en memoria dentro de la instancia que originó la conexión. Si el progreso de un job se publica desde la instancia A pero el navegador terminó conectado (o reconectado tras un corte) a la instancia B, el mensaje nunca llega: se publicó en un broker en memoria que el cliente no está escuchando.

Ninguno de los dos problemas es un bug de código - son propiedades de la infraestructura real que WebSocket, tal como lo usábamos, no toleraba.

## La solución: volver a algo más simple

Documentamos la decisión en un ADR explícito (ADR-0012) y la resumimos así: el estado del progreso ya vive en Redis (porque los workers necesitan persistirlo de todos modos para sobrevivir a reinicios). Si el estado ya es persistente y compartido entre instancias, no hace falta un canal push dedicado - basta con que el cliente lo consulte.

```
GET /v2/jobs/{jobId}
```

El frontend reemplazó la suscripción STOMP por un hook (`useProgresoJob`) que hace polling cada 3 segundos mientras el job está en curso, y se detiene al recibir un estado terminal (`COMPLETED`, `FAILED`, `PARTIAL`). La experiencia de usuario pierde algo de inmediatez - en el peor caso hay 3 segundos de retraso - pero gana algo mucho más valioso: funciona igual sin importar cuántas instancias haya, detrás de cualquier proxy, sin necesidad de sesiones pegajosas ni de un broker de mensajes adicional.

## La lección generalizable

WebSocket es la herramienta correcta cuando la latencia importa de verdad (chat, colaboración en tiempo real, trading). Para *progreso de un job en segundo plano*, donde el usuario tolera perfectamente unos segundos de retraso, el polling contra un estado persistente es casi siempre más robusto en infraestructura real - menos piezas móviles, sin afinidad de sesión, sin sorpresas de proxies corporativos. La pregunta que vale la pena hacerse antes de elegir WebSocket no es "¿se puede hacer en tiempo real?" sino "¿el caso de uso *necesita* tiempo real, o solo necesita eventualmente estar actualizado?".

Si la respuesta es la segunda, probablemente no necesitas WebSocket - necesitas un buen lugar donde guardar el estado.
