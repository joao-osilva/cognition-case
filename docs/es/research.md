# Investigación: Qué hace Microsoft Power Apps y dónde reside su valor

## 1. Qué es Power Apps

Microsoft Power Apps es una plataforma de aplicaciones low-code, parte de la Power Platform
(Power Apps, Power Automate, Power BI, Power Pages, Copilot Studio). Ofrece un entorno de
desarrollo rápido para construir aplicaciones de negocio personalizadas que se conectan a
datos en Microsoft Dataverse o en más de 1.000 fuentes externas (SharePoint, SQL Server,
Dynamics 365, Salesforce, entre otras).

Sus bloques de construcción principales:

| Componente | Qué ofrece |
|---|---|
| **Canvas apps** | Constructor de UI drag-and-drop con control a nivel de píxel. "Empieza por la experiencia de usuario" — formularios, galerías y botones conectados a datos con fórmulas al estilo Excel (Power Fx). |
| **Model-driven apps** | UI generada automáticamente a partir del modelo de datos. Define tablas, relaciones, formularios, vistas y reglas de negocio en Dataverse; la aplicación (grillas, formularios de detalle, dashboards) se produce por ti. Este es el modo más relevante para herramientas internas de tipo CRUD. |
| **Microsoft Dataverse** | La plataforma de datos gestionada: tablas relacionales, seguridad a nivel de columna, reglas de negocio, validación en el servidor y auditoría de cambios integrada. |
| **Conectores** | Más de 1.000 conectores preconstruidos para sistemas de Microsoft y de terceros; conectores personalizados para APIs REST internas. |
| **Power Automate** | Motor de workflow/automatización — aprobaciones, notificaciones, tareas programadas — que se combina con las aplicaciones. |
| **IA / Copilot** | Generación de aplicaciones mediante lenguaje natural y modelos de AI Builder integrados en las aplicaciones. |

## 2. Las capacidades que importan para un equipo de herramientas internas de una fintech

Mapeando el valor de Power Apps a las tres aplicaciones del cliente (cola de revisión KYC,
dashboard de reembolsos, panel de administración de feature flags), las capacidades que hacen
el trabajo real son:

1. **Tablas de datos + vistas** — grillas ordenables, filtrables y con búsqueda sobre registros
   de negocio (casos KYC, solicitudes de reembolso, flags). Esta es la columna vertebral de toda
   herramienta interna.
2. **Formularios con validación** — crear/editar registros con campos obligatorios, entradas
   tipadas, desplegables y validación por reglas de negocio.
3. **Control de acceso basado en roles (RBAC)** — roles de seguridad de Dataverse + integración
   con Microsoft Entra ID (Azure AD). Un analista de KYC puede revisar; solo un líder de
   compliance puede aprobar; solo ingeniería puede alternar una flag de producción. En una
   fintech regulada esto es innegociable.
4. **Traza de auditoría** — la auditoría de Dataverse registra cada creación/actualización/
   eliminación y acceso de usuario, con historial de valor antiguo → valor nuevo por registro.
   Para KYC y reembolsos esto es un requisito de compliance, no un lujo.
5. **Workflow / aprobaciones** — máquinas de estado (pendiente → aprobado/rechazado) con
   notificaciones y escalamiento vía Power Automate.
6. **Plataforma gestionada** — SSO, hosting, parches, backups, adaptabilidad móvil y
   disponibilidad son problema de Microsoft, no del equipo.

Cabe destacar que las tres aplicaciones del cliente usan una porción pequeña de la plataforma:
todas son aplicaciones de tipo "tabla + formulario + acción restringida por rol + log de
auditoría". No parecen usar los diferenciadores de cola larga (más de 200 conectores, móvil
offline, AI Builder, citizen development a escala).

## 3. Dónde reside realmente el valor

**La verdadera propuesta de valor de Power Apps no es ninguna funcionalidad aislada — es:**

- **Velocidad hasta la primera versión**: una aplicación CRUD funcional en horas/días sin ingenieros.
- **Citizen development**: personas no ingenieras (operaciones, compliance) pueden construir y modificar aplicaciones.
- **Gobernanza lista para usar**: SSO, RBAC, auditoría y certificaciones de compliance
  (SOC 2, ISO 27001, etc.) heredadas de la nube de Microsoft.
- **Cero propiedad de infraestructura**: sin servidores, sin despliegues, sin guardias.

**Sus debilidades bien documentadas** (relevantes al evaluar un reemplazo):

- **Costo y complejidad de licenciamiento**: Premium cuesta ~US$ 20/usuario/mes de lista;
  los conectores premium, la capacidad de Dataverse y el apilamiento por aplicación hacen que
  los costos reales sean difíciles de predecir.
- **Límites de delegación**: las consultas que el conector no puede delegar se evalúan en el
  cliente sobre un conjunto limitado de registros (500–2.000 filas) — los resultados se vuelven
  silenciosamente incorrectos a escala.
- **Modelo de datos y UX restringidos**: la lógica relacional compleja, la UX personalizada y
  cualquier cosa más allá de "formularios sobre datos" se vuelve incómoda rápidamente.
- **Límites de solicitudes de API**: topes diarios de API por usuario ligados al licenciamiento.
- **Lock-in de proveedor**: las aplicaciones, las fórmulas (Power Fx) y los datos (Dataverse) no son portables.

## 4. Los costos ocultos de reemplazar la plataforma

El checklist de funcionalidades anterior subestima lo que "comprar" realmente adquiere. Cuatro
costos son fáciles de subestimar al proponer una alternativa interna:

1. **La autenticación no es trivial.** SSO, gestión de sesiones, modelos de roles/permisos y su
   mantenimiento continuo (parches de seguridad, revisiones de acceso, offboarding) vienen
   integrados y listos en Power Apps vía Entra ID. Reconstruir esto desde cero — y mantenerlo
   seguro en una fintech regulada — es un compromiso de ingeniería significativo y permanente,
   incluso con bibliotecas como NextAuth/Auth.js o proveedores gestionados (Auth0, Clerk, WorkOS).
2. **Los conectores son un producto, no una funcionalidad.** Power Apps incluye más de 1.000
   conectores mantenidos. Una plataforma interna tendría que construir y mantener cada
   integración a mano o adoptar una capa de integración (p. ej. Composio, Merge, Paragon) — lo
   que reintroduce una factura de proveedor y aún deja código de pegamento que mantener. Si las
   herramientas del cliente necesitan muchas integraciones de terceros, solo esto ya hace difícil
   justificar la reconstrucción.
3. **El citizen development traslada el TCO fuera del equipo de ingeniería.** Que usuarios no
   técnicos construyan/modifiquen sus propias aplicaciones — dentro de guardrails y límites
   definidos por los administradores para toda la empresa — significa que las herramientas
   internas no hacen fila detrás del trabajo de producto. Una solución interna convierte cada
   nueva herramienta y cada cambio en un ticket de ingeniería; ese overhead continuo es el mayor
   costo oculto de "construir".
4. **La previsión de demanda es la variable decisiva.** Si estas 3 aplicaciones son
   prácticamente todo (o un crecimiento hasta ~10 aplicaciones CRUD similares), una solución
   interna simple mantenida dentro del alcance del equipo existente es plausible. Si la demanda
   de nuevas aplicaciones internas probablemente siga creciendo, la plataforma necesita dueños
   dedicados — y 1–3 FTEs a US$ 200 mil+/año cada uno superan rápidamente el costo actual de la
   licencia, antes de contar el costo de oportunidad.
5. **"Construir" sigue significando comprar (u hospedar) las piezas.** Replicar las capacidades
   de Power Apps internamente casi inevitablemente incorpora otras plataformas — motores de
   workflow duraderos (p. ej. Temporal, Inngest), plataformas de conectores/integración
   (p. ej. Composio), authn/authz gestionados (p. ej. Auth0, Clerk, WorkOS) — cada una con su
   propia factura que debe descontarse del ahorro de licencias. La ruta open-source (Temporal
   auto-hospedado, Keycloak, n8n, etc.) cambia esas suscripciones por una factura de nube mayor
   más las horas de ingeniería para montar la infraestructura y mantenerla parcheada, monitoreada
   y actualizada. De cualquier forma, "construir" nunca es una opción con cero proveedores y cero
   infraestructura.

Una evaluación completa también debe comparar **plataformas alternativas** (Retool, Appsmith,
Budibase, ToolJet, etc.) cuyos precios pueden alinearse mejor con la escala y el uso del cliente —
"reemplazar al proveedor" y "construir internamente" no son las únicas dos opciones; "cambiar a
un proveedor más barato" puede superar a ambas.

## 5. La pregunta de los US$ 250 mil/año

A precio de lista, 60 ingenieros × US$ 20/usuario/mes ≈ **US$ 14,4 mil/año** — ni cerca de
US$ 250 mil. Un gasto anual de US$ 250 mil implica alguna combinación de: licenciamiento para
toda la organización (todos los empleados, no solo ingenieros), add-ons de almacenamiento/
capacidad de Dataverse, conectores premium, licenciamiento de Power Automate, entornos
gestionados y/o un acuerdo enterprise que incluye consultoría. Dos implicaciones:

1. La oportunidad de ahorro es real, pero la primera pregunta al cliente debería ser una
   auditoría de licencias — pueden estar sobre-licenciados para tres aplicaciones internas,
   independientemente de construir o comprar.
2. Cualquier alternativa interna debe compararse con el precio *renegociado* de Power Apps
   (o un competidor más barato como Retool a ~US$ 10–50/usuario/mes), no con los US$ 250 mil actuales.

## 6. Qué debe demostrar un prototipo

Para probar con credibilidad "¿podríamos construir esto internamente con Devin?", el prototipo
debe replicar el núcleo de capacidades identificado en el §2, aplicado a las tres aplicaciones
reales del cliente:

- [ ] Grilla de datos con filtrado/búsqueda para cada aplicación (cola KYC, reembolsos, flags)
- [ ] Formularios con validación para acciones que cambian estado (aprobar/rechazar KYC,
      procesar reembolso, alternar/crear flag)
- [ ] Control de acceso basado en roles (visualizador / aprobador / admin) restringiendo esas acciones
- [ ] Un log de auditoría que capture quién hizo qué, cuándo, con valores antes/después
- [ ] Desplegado y compartible (Vercel), demostrando que la historia de "cero infra" es alcanzable

Fuera de alcance para un prototipo de 2 horas (y señalado honestamente en la evaluación): SSO
real (Entra ID/Okta), una base de datos de producción con backups, el ecosistema de conectores,
citizen development (no ingenieros modificando aplicaciones) y certificación de compliance.

## Fuentes

- Microsoft, "What is Power Apps?" — learn.microsoft.com/power-apps/powerapps-overview
- Microsoft, Power Apps components (canvas, model-driven, Dataverse) — learn.microsoft.com/power-apps/maker
- Microsoft, Power Apps pricing — microsoft.com/power-platform/products/power-apps/pricing
- Microsoft, Power Platform Licensing Guide (ago 2025)
- Microsoft, Dataverse auditing — learn.microsoft.com/power-platform/admin/manage-dataverse-auditing
- TechTarget, "Top Microsoft Power Apps limitations"
- Conduct, "Power Apps limitations: when to move off low-code"
