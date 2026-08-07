# Evaluación

## 1. Contexto

El prototipo se construyó en aproximadamente dos horas con Devin. Objetivo: replicar
el núcleo de capacidades que las tres aplicaciones usan en la plataforma (cuadrículas,
formularios validados, RBAC, registro de auditoría), no un sistema de producción. Está
desplegado en Vercel y es compartible.

## 2. Qué Se Replicó, Qué No, y la Brecha

Replicado:

- Cuadrículas de datos con filtrado y búsqueda (cola KYC, reembolsos, flags)
- Formularios validados para acciones que cambian estado
- RBAC (viewer, approver, admin), aplicado en el servidor
- Registro de auditoría: quién hizo qué, cuándo, con valores antes y después
- Desplegado y compartible

No replicado, y qué exigiría cerrar cada brecha:

| Brecha | Qué exige |
|---|---|
| **SSO real** | Proveedor gestionado (Auth0, Clerk, WorkOS). Días para integrar, dependencia permanente. |
| **Base de datos persistente** | Postgres más migraciones, copias de seguridad, retención. Días para configurar, operación continua. |
| **Conectores** | Integraciones hechas a mano o una capa de integración (Composio, Merge, Paragon). La brecha más difícil: trabajo continuo en cualquier caso. |
| **Desarrollo ciudadano** | No se puede cerrar. Cada nueva herramienta y cada cambio se convierte en un ticket de ingeniería. |
| **Certificación de compliance** | Heredada de las decisiones de infraestructura; meses de auditoría si se exige certificación. |

## 3. Dimensiones de Evaluación

**Costo de construcción.** Horas de ingeniería primero: convertir el prototipo en un
sistema de producción (SSO, base de datos, integraciones, pruebas) toma semanas de
tiempo sénior, no horas. Y construir sigue significando comprar: motores de workflow
(Temporal, Inngest), autenticación gestionada y capas de integración tienen cada uno
su factura. Autohospedar los equivalentes open-source (Temporal, Keycloak, n8n) cambia
suscripciones por gasto de nube. No existe una opción con cero proveedores.

**Carga de mantenimiento.** Los conectores son un producto, no una funcionalidad;
alguien debe mantener cada integración funcionando a medida que cambian las APIs de
terceros. La infraestructura autohospedada agrega parches, actualizaciones y guardias.

**Implicaciones de seguridad.** La autenticación y la autorización son un compromiso
permanente. La autenticación (SSO, sesiones, MFA) y la autorización (modelos de roles,
verificaciones de permisos en cada acción) vienen con la plataforma hoy y pasarían a
ser responsabilidad del equipo. En una fintech regulada, lo mismo aplica a las
obligaciones de auditoría y compliance.

**Costo de oportunidad.** El desarrollo ciudadano desaparece: operaciones y compliance
dejan de construir sus propias aplicaciones y abren tickets. El pronóstico de demanda
define la escala: de tres a diez aplicaciones CRUD, el equipo actual lo absorbe; más
allá, de uno a tres ingenieros dedicados a más de 200 mil USD superan el costo de la
licencia antes de contar el costo de oportunidad.

## 4. Capex vs. Opex

Cómo se distribuyen las dimensiones entre costo único y recurrente:

| Dimensión | Capex (único) | Opex (recurrente) |
|---|---|---|
| **Costo de construcción** | Construcción inicial: semanas de ingeniería sénior para endurecer el prototipo | Suscripciones de herramientas o gasto de nube para equivalentes autohospedados |
| **Carga de mantenimiento** | - | Mantenimiento de integraciones, parches, actualizaciones, guardias |
| **Seguridad** | Integración de SSO y autorización | Revisiones de acceso, parches de dependencias, trabajo de auditoría y compliance |
| **Costo de oportunidad** | Funcionalidades no entregadas durante la construcción inicial | Cada cambio de herramienta como ticket de ingeniería; 1 a 3 ingenieros dedicados (200 mil USD+ cada uno) si la demanda crece |

Comprar invierte el perfil: capex casi cero, una sola línea de opex (la licencia), y
el proveedor carga con el mantenimiento y la seguridad.
