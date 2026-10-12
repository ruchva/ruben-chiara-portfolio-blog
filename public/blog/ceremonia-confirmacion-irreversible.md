# Diseñar fricción a propósito: ceremonias para acciones irreversibles

No todas las confirmaciones de UI deberían ser fáciles. Cuando un Director de Unidad Educativa "deriva" un lote de estudiantes hacia la siguiente etapa del trámite de diploma, está autorizando algo con peso legal real: ese lote entra a un flujo que termina, eventualmente, en una firma digital con validez jurídica. Un `confirm()` de una línea no le hace justicia a esa responsabilidad.

Esto llevó a diseñar - y documentar formalmente en un ADR - lo que terminamos llamando una "ceremonia de derivación": una secuencia de pantallas deliberadamente más lenta que una confirmación normal, con un respaldo en PDF inmutable como artefacto de cierre.

## El objetivo no es forense, es humano

La primera decisión de diseño, y la más importante, fue reencuadrar el propósito del PDF de respaldo. No se construyó como una pista de auditoría técnica pensada para un sistema forense - se construyó como un **artefacto de deliberación**: su función es que el Director *sienta* el peso de lo que está autorizando antes de autorizarlo, no solo que exista un registro después del hecho.

Eso se tradujo en una secuencia de UI concreta:

1. **Pantalla de magnitud**: antes que nada, el usuario ve cuántos estudiantes está a punto de derivar - un número grande, visible, sin forma de ignorarlo.
2. **Lista de revisión con scroll forzado**: el botón de confirmar permanece deshabilitado hasta que el usuario haya scrolleado la lista completa de estudiantes afectados. No hay atajo.
3. **Casilla de atestación explícita**: un checkbox que el usuario debe marcar activamente, con un texto que declara qué está autorizando - no una casilla premarcada.
4. **Confirmación final**, solo entonces habilitada.

Es fricción deliberada. Y es fricción que protege al usuario de sí mismo, no solo al sistema de errores del usuario.

## El PDF documenta el acto, no el estado actual

La segunda decisión importante: el PDF de respaldo captura **el acto de derivación en el momento en que ocurrió** - la lista exacta de estudiantes, el usuario que autorizó, la fecha - y es inmutable desde entonces. Si más adelante alguno de esos trámites se revierte o se corrige, el PDF original **no se regenera ni se actualiza**. Sigue representando, fielmente, lo que se autorizó aquel día. La inmutabilidad es la característica, no un descuido.

## El problema del hash circular (y cómo se evitó)

Para darle integridad verificable al PDF, se calcula un hash SHA-256 y se codifica en un código QR impreso en el propio documento, de modo que cualquiera pueda verificar que el PDF no fue alterado. Pero esto esconde una trampa: si el hash se calcula sobre los bytes finales del PDF, y el QR con ese hash se imprime *dentro* del mismo PDF, se genera una dependencia circular - el hash depende del contenido, pero el contenido (el QR) depende del hash.

La solución es calcular el hash sobre una **representación canónica del acto** (un JSON determinista con los datos de la derivación: estudiantes, usuario, timestamp) en lugar de sobre los bytes del PDF. El QR codifica el hash de esa representación canónica, no del archivo. El PDF es, entonces, una vista renderizada de un acto cuyo hash ya existía antes de que el PDF se generara - rompiendo el ciclo.

## Lo que decidimos NO construir

Quizás la parte más interesante de este diseño es lo que se descartó explícitamente. Se evaluó agregar una "prueba de inclusión Merkle" - un elemento de UI que sugiriera que el documento estaba anclado a alguna estructura de verificación pública más amplia, al estilo de un *notary log* distribuido. Se rechazó, y la razón quedó documentada sin rodeos: no existía ningún sistema de anclaje real detrás de esa idea, y mostrar un panel de "autenticidad" con datos inventados habría sido, directamente, un engaño - *security theater* que aparenta más garantías de las que el sistema realmente ofrece.

Es una decisión incómoda de tomar bajo presión de entrega, porque "agregar un ícono de verificación" es barato y se ve bien en una demo. Pero un sistema que maneja documentos con validez legal no se puede dar el lujo de mentir sobre sus propias garantías, ni siquiera visualmente.

## La lección generalizable

Cuando una acción en tu producto es difícil o imposible de revertir, la UI que la protege merece el mismo nivel de diseño que la lógica de negocio detrás de ella. Fricción deliberada, resúmenes de impacto antes de confirmar, e inmutabilidad real en los artefactos de auditoría no son "features nice-to-have" - son la diferencia entre un sistema que *parece* responsable y uno que lo es. Y cuando la tentación es mostrar una garantía de seguridad que no existe realmente, la respuesta correcta casi siempre es no mostrar nada, no inventar una.
