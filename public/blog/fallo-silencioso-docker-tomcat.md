# Un guion bajo rompió todas nuestras notificaciones

Este es, probablemente, el bug más barato de causa y más caro de encontrar que tuvimos en todo el proyecto de Diplomas Digitales. Una decisión de nombrado trivial - cómo llamar a un servicio en `docker-compose.yml` - dejó rotas, durante semanas, las notificaciones entre el worker de generación de PDFs y el backend. Y lo peor: no había una sola línea en los logs de la aplicación que lo delatara.

## El síntoma

Mientras construíamos el mecanismo de pruebas de carga (ver ["La cola está vacía" no es éxito](/#/blog/pruebas-de-carga-que-mienten)), notamos que el backend nunca recibía confirmación de que un diploma se había generado - a pesar de que el PDF sí aparecía, correctamente, en el bucket de almacenamiento S3. El worker (`servicio-diploma`) hacía una llamada HTTP POST de vuelta al backend para avisar "este lote terminó, aquí está el resultado", y esa llamada fallaba. Siempre. El 100% de las veces.

## La investigación

Lo primero que revisamos fue, por supuesto, los logs de la aplicación Spring Boot del backend. No había nada - ni un intento de petición, ni un error, ni una traza. Como si la petición nunca hubiera llegado.

Y en efecto, nunca llegó a Spring. El nombre del servicio en `docker-compose.yml` era `diploma_backend` (con guion bajo), y Docker usa ese nombre como *hostname* DNS interno de la red del compose. El worker llamaba a `http://diploma_backend:3000/...` - una URL perfectamente válida desde el punto de vista de DNS.

El problema es el **RFC 1123**, que define qué caracteres son válidos en un *hostname*: letras, dígitos y guion medio (`-`). El guion bajo (`_`) no está permitido. Tomcat, el servidor embebido de Spring Boot, valida el header `Host` de cada petición HTTP entrante contra esa norma - y lo hace en el **conector HTTP**, antes de que la petición llegue a cualquier filtro, interceptor o controlador de Spring. Una petición con un `Host` inválido se rechaza con un `400 Bad Request` directamente en la capa de transporte.

Esto explica por qué no había nada en los logs de la aplicación: la petición nunca entró a la aplicación. Rechazada en la puerta, sin que el framework tuviera oportunidad de registrar nada.

## El alcance real del bug

Una vez identificada la causa, buscamos el mismo patrón en el resto de los servicios con nombres igual de descriptivos pero igual de inválidos: `servicio_diploma_1`, `firma_digital_wrapper`. El bug no afectaba solo a una notificación - afectaba a **toda** comunicación inter-contenedor que dependiera de esos hostnames: confirmaciones de firma, de impresión, de certificación. Un error de nombrado, multiplicado por cada integración entre servicios.

## La solución

En Ansible (que es quien hoy provisiona estos contenedores en el clúster real), se definieron alias de red explícitos con guion medio para cada servicio:

```yaml
networks:
  diplomas-net:
    aliases:
      - diploma-backend
      - servicio-diploma
      - firma-digital-wrapper
```

Y se actualizaron las URLs internas de cada servicio para apuntar a esos alias, no al nombre del contenedor.

## La lección generalizable

Cualquier servicio Java detrás de un servidor embebido tipo Tomcat (o Jetty, con reglas similares) puede sufrir este mismo fallo si corre en Docker Compose o Kubernetes con nombres de servicio que no respeten RFC 1123 - y el síntoma siempre va a ser confuso, porque el rechazo ocurre antes de que tu código, tus logs y tu framework tengan oportunidad de enterarse. Dos aprendizajes concretos:

1. **Nombra tus servicios de infraestructura con guion medio, nunca con guion bajo**, incluso si "se ve mejor" o es más consistente con convenciones de variables de otros lenguajes.
2. **Cuando una integración HTTP falla al 100% sin dejar rastro en los logs de la aplicación**, sospecha de la capa de transporte antes que del código: TLS, proxies, y validación de `Host` a nivel de servidor son candidatos comunes que fallan *antes* de que tu aplicación se entere de que existió una petición.
