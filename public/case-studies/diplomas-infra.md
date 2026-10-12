# Infraestructura y Despliegue - Ansible

La parte menos visible del ecosistema Diplomas es, probablemente, la más decisiva para que funcione en producción: `diplomas-ansible`, el repositorio de infraestructura como código que aprovisiona y despliega los demás servicios (`diploma-backend`, `diploma_frontend`, `servicio-diploma`, `firma-digital-wrapper`) sobre un clúster real, sin intervención manual.

No es una capa cosmética sobre Docker Compose. Es agentless (solo SSH), multi-entorno desde el diseño, y resultado de reemplazar - de forma deliberada - un piloto de un solo nodo que funcionó para una demo pero no habría sobrevivido a producción.

## Arquitectura del clúster

![Clúster Ansible de 4 nodos: edge, worker 1, worker 2 y datos](/images/ansible-infra-topology.svg)

| Nodo | Rol | Servicios |
|------|-----|-----------|
| **datos** | Capa de datos con estado | PostgreSQL, PgBouncer (modo transacción), Redis (noeviction, AOF), MinIO/Silo (S3) |
| **worker 1 / worker 2** | Capa de aplicación sin estado | `diploma-backend`, `servicio-diploma`, `firma-digital-wrapper` - 4 contenedores por nodo |
| **edge** | Ingreso / gateway | nginx (TLS + SNI, balanceo round-robin sin sesiones pegajosas), Grafana, Prometheus, Dozzle, cAdvisor |
| **bastión** (fuera del inventario) | Control node | Donde se clona el repo y se ejecuta `ansible-playbook`, con acceso SSH a los otros 4 |

## Evolución: de un piloto a un clúster distribuido

| Fase | Hito |
|------|------|
| **Piloto** | Un único clúster en Huawei Cloud (`172.16.16.0/24`), suficiente para una demo pero sin separación de entornos. Esa configuración fue eliminada del repositorio el 24 de septiembre de 2026 al restructurar el proyecto. |
| **Refactor "solo entornos distribuidos"** | Se abandona el layout de clúster único a favor de una estructura `environments/<entorno>/` explícita, con secretos (`ansible-vault`) propios por entorno - nunca compartidos ni copiados entre preprod y producción. |
| **Preprod / QA (100.0.101.0/24)** | El gran salto: el clúster de 4 nodos descrito arriba, con roles `datos` / `worker` (×2) / `edge` claramente separados. |
| **Lifecycle completo** | Se agregan playbooks de teardown y los comandos `mise run up / down / reset` - levantar, bajar preservando datos, o reiniciar desde cero, de forma idempotente. |
| **Producción (Entel Cloud)** | Planificada sobre el mismo diseño, usando promoción de entornos por *tag* de git (`prod-YYYY-MM-DD`), nunca por rama - evita el clásico *drift* entre ramas de entorno que terminan divergiendo del código real. |

## Decisiones de diseño que vale la pena explicar

- **Agentless por SSH**, sin instalar nada permanente en los nodos gestionados - menor superficie de ataque, menos piezas que mantener actualizadas.
- **`mise`** fija la versión de Python y `ansible-core`, y envuelve los comandos largos de Ansible como tareas con nombre - reduce el "en mi máquina funciona" a nivel de tooling.
- **Promoción de entornos por *tag* de git, nunca por rama** - una rama por entorno es tentador al principio y garantiza *drift* a mediano plazo; un tag es un commit congelado, sin ambigüedad sobre qué versión corre dónde.
- **Un `ansible-vault` por entorno**, nunca reutilizado - si preprod se compromete, producción no hereda el mismo secreto.

## Lecciones de producción

**1. El almacenamiento de objetos cambió dos veces, por razones distintas.** Primero RustFS (alpha) no lograba inicializar un volumen vacío en los nodos reales. Se migró a MinIO - hasta que la comunidad archivó el proyecto y el único tag de imagen disponible resultó vulnerable a un CVE conocido (CVE-2025-62506); un tag aparentemente más nuevo ni siquiera tenía imagen publicada, solo código fuente. La solución final fue **Silo**, un fork compatible de MinIO. Tres decisiones de infraestructura en un año, cada una documentada con la razón exacta por la que la anterior dejó de ser viable - evaluar y reemplazar dependencias de infraestructura bajo restricciones operativas reales, no en el papel.

**2. Nombres de servicio con guion bajo rompieron Tomcat, en todos los servicios Java a la vez.** `diploma_backend`, `servicio_diploma_1`, `firma_digital_wrapper` - tres servicios con nombres igual de descriptivos, igual de inválidos según RFC 1123. El resultado: el 100% de las llamadas HTTP entre contenedores fallaba con `400`, sin una sola línea en los logs de aplicación. [El detalle completo está en el blog](/#/blog/fallo-silencioso-docker-tomcat) - aquí la lección de infraestructura es que se corrigió con `networks.aliases` explícitos en guion medio, sin tocar el código de las aplicaciones.

**3. Los healthchecks mentían, de dos formas distintas.** Spring Security protege `/actuator/**` y devuelve `403`, no `200` - un healthcheck que solo acepta `200` da un falso negativo permanente. Por separado, el arranque de Spring Boot (~48s) superaba la ventana de reintentos del healthcheck, así que Ansible abandonaba el despliegue segundos antes de que el contenedor realmente estuviera listo. Ambos se corrigieron ajustando el criterio de éxito y la ventana de espera - no el código de la aplicación.

**4. El tamaño de memoria se decidió observando fallos reales, no adivinando.** `servicio-diploma` (que usa Batik para renderizar SVG→PDF) necesitaba 1GB, no 512MB - se confirmó midiendo *garbage collection thrashing* al 85-90% de uso con hilos colgados y trabajos de Redis atascados permanentemente. Grafana necesitaba 512MB, no 256MB, tras *timeouts* de dashboard con CPU al 236% y, crucialmente, **sin ningún OOMKill que lo señalara** - degradación silenciosa, el tipo de fallo más difícil de diagnosticar porque no deja una alarma obvia.

**5. El disco "de 50GB" tenía 24GB reales disponibles.** Los nodos cloud anunciaban 50GB, pero el volumen lógico raíz era de 24GB sobre un *physical volume* de 48GB, con el resto sin asignar. Se resolvió con un playbook idempotente (`preflight-disk.yml`) que usa `community.general.lvol` con `size: +100%FREE`. Por separado, PGDATA y los datos de MinIO vivían en una partición `/opt` subdimensionada mientras `/var` (160GB) estaba casi vacío - un `df -h` que, a primera vista, no mostraba el problema real.

**6. Las reglas de precedencia de variables de Ansible no son intuitivas, y dos veces costaron caro.** Un `vars_files` con una ruta templada por una variable de host (`envs/{{ deploy_env }}/x.vault.yml`) no resuelve de forma confiable por host cuando el archivo requiere desencriptado de vault - se abandonó en favor de la carga nativa por `group_vars/<grupo>/` según el directorio de inventario. Por separado, un `group_vars/` en la raíz del repo se carga para **todos** los playbooks como "variable de playbook", que tiene **mayor** precedencia que el `group_vars/` del inventario - esto hizo que `setup-docker.yml` en preprod intentara desencriptar, en silencio, el vault del piloto ya eliminado.

Otras lecciones documentadas en el repositorio (28 en total, en `CLAUDE.md`): pérdida silenciosa de datos por confirmar una cola como vacía sin verificar el resultado real (ver [el post sobre pruebas de carga](/#/blog/pruebas-de-carga-que-mienten)), credenciales compartidas entre grupos de Ansible vía `hostvars` sin duplicarlas, un endpoint de OpenTelemetry hardcodeado que inundaba los logs cuando el colector no estaba disponible, y un nombre de usuario SSH literal (`rubenchiara`) hardcodeado en ~60 referencias que rompió en el momento exacto en que preprod pasó a usar un usuario de despliegue distinto - un recordatorio de que templar variables de conexión importa incluso cuando, por ahora, solo hay un desarrollador.

## Ciclo de vida, no solo despliegue

El repositorio no modela únicamente "desplegar" - modela el ciclo de vida completo:

- `mise run up` - levanta el entorno completo.
- `mise run down` - lo baja preservando los datos.
- `mise run reset` - destructivo, vuelve a cero.
- `--skip-tags up` - renderiza configuración sin aplicar cambios (*dry run*).
- variantes `:offline` que omiten los chequeos de registro cuando Nexus o Docker Hub no son alcanzables.

Esa separación explícita entre "apagar" y "destruir" parece un detalle menor hasta que alguien ejecuta el comando equivocado un viernes por la tarde.
