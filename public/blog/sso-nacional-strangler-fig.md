# Integrar un SSO nacional sin romper el sistema legado

A mediados de 2026, el sistema de Diplomas Digitales de Bachiller tenía que empezar a aceptar inicios de sesión a través de **Ciudadanía Digital**, la identidad digital nacional que administra AGETIC (la agencia de gobierno electrónico de Bolivia). Hasta ese momento, el sistema tenía un único mecanismo de autenticación: usuario/contraseña, para roles internos como Directores de Unidad Educativa o Jefes de Legalización.

El requisito nuevo no reemplazaba ese login - lo sumaba, para roles ciudadanos (estudiantes y padres/tutores) que necesitan validar su identidad ante el Estado para hacer seguimiento a su propio trámite. Esto significaba sostener **dos mecanismos de autenticación simultáneos**, en producción, sin tocar el camino que ya funcionaba. El patrón clásico para esta situación es el *Strangler Fig*: construir lo nuevo alrededor de lo viejo, migrando gradualmente, sin un corte abrupto que arriesgue todo a la vez.

## Un solo contrato de sesión, dos orígenes de login

La primera decisión de diseño, y la que hizo posible todo lo demás, fue negarse a bifurcar la lógica de negocio según el origen del login. En vez de tener "rutas para usuarios legados" y "rutas para usuarios de Ciudadanía Digital" corriendo por caminos de código distintos, se estableció un único contrato: **un JWT interno HS256**, emitido por el backend, es la única fuente de verdad de sesión - sin importar si el usuario entró con contraseña o vía OAuth2 con AGETIC.

```
Login legado  (usuario/contraseña) ──┐
                                      ├──> JWT interno HS256 ──> resto del sistema
Login Ciudadanía Digital (OAuth2)  ──┘
```

El campo `auth_method` queda registrado en el token como metadato - útil para auditoría - pero **nunca se usa como condición en la lógica de negocio**. Ningún `if (auth_method == "CD") { ... }` dispersa por el código. Esto evita el error clásico de este tipo de migraciones: terminar con dos sistemas que, en la práctica, son dos aplicaciones distintas cosidas con un `if`.

## El flujo OAuth2 con AGETIC

El flujo de Ciudadanía Digital sigue el patrón estándar de *authorization code*: el usuario es redirigido a la plataforma de AGETIC, se autentica ahí (fuera de nuestro control y nuestra responsabilidad de credenciales), y vuelve con un código que el backend intercambia por un token - que luego se traduce al JWT interno único mencionado arriba.

Un detalle no trivial: algunas acciones críticas (por ejemplo, que un técnico distrital apruebe una validación) requieren un segundo factor - un *step-up challenge* contra Ciudadanía Digital, no solo contra el login inicial. Esto obliga a persistir una "acción pendiente" en `sessionStorage` del navegador **a través de una redirección completa a un proveedor de identidad externo y de vuelta** - el estado de la aplicación tiene que sobrevivir a que el usuario literalmente abandone la pestaña, vaya a otro dominio, y regrese. Es un problema de UX de OAuth2 subestimado: no basta con manejar el *happy path* del login inicial, hay que diseñar para que cualquier flujo de negocio pueda interrumpirse por una reautenticación externa en cualquier momento.

## Documentar lo que todavía es un mock

Una integración contra un sistema de gobierno externo rara vez está completamente disponible desde el primer día. AGETIC no exponía, al inicio del proyecto, todos los elementos necesarios para una integración completa (por ejemplo, el JWKS para validar firmas de tokens en modo estricto). En vez de bloquear el desarrollo esperando, se documentó explícitamente - en una serie de ADRs - qué partes del flujo estaban *mockeadas* y bajo qué condición exacta se debían activar en su forma real:

- Validación de firma del token de Ciudadanía Digital: mockeada mientras `cd.mock-mode=true`.
- Segundo factor (*step-up*): mockeado mientras `cd.step-up-mock=true`, sin verificación real del header `X-CD-Token`.
- El flujo de "Inicio de Trámite" quedó intencionalmente público (sin autenticación) en el entorno de demo, porque la red de AGETIC no era alcanzable desde ahí - con un checklist explícito de qué revertir antes de producción.

Este patrón - un ADR por cada supuesto simplificado, con su condición de reversión documentada - resultó ser más valioso que cualquier comentario en el código, porque sobrevive a quien escribió el mock original y le da a cualquiera que retome el proyecto una lista concreta de "esto no es real todavía" sin tener que adivinar leyendo la implementación.

## La lección generalizable

Integrar un sistema de identidad externo (nacional o no) en un sistema que ya tiene su propio login no es un problema de "agregar un botón de OAuth2" - es un problema de diseñar un contrato de sesión que no le importe de dónde vino la identidad. Si tu lógica de negocio necesita saber el origen del login para decidir qué hacer, probablemente tu migración va a terminar bifurcada. Y cuando la integración depende de un tercero que todavía no tiene todas las piezas listas, documentar los mocks como decisiones explícitas y reversibles - no como deuda técnica silenciosa - es lo que separa un *Strangler Fig* bien ejecutado de un sistema con dos mitades que nunca terminan de fusionarse.
