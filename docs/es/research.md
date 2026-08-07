# Investigación: Qué Hace Microsoft Power Apps y Dónde Está Su Valor

## 1. Qué Es Power Apps

Microsoft Power Apps es una plataforma de aplicaciones low-code dentro de la Power
Platform (Power Apps, Power Automate, Power BI, Power Pages, Copilot Studio). Ofrece un
entorno de desarrollo rápido para aplicaciones de negocio que se conectan a datos en
Microsoft Dataverse o en más de 1.000 fuentes externas (SharePoint, SQL Server,
Dynamics 365, Salesforce, entre otras).

Sus bloques de construcción principales:

| Componente | Qué ofrece |
|---|---|
| **Aplicaciones de lienzo (canvas)** | Constructor de UI de arrastrar y soltar: formularios, galerías y botones conectados a datos con fórmulas al estilo Excel (Power Fx). |
| **Aplicaciones basadas en modelo** | UI generada a partir del modelo de datos. Se definen tablas, relaciones, formularios, vistas y reglas de negocio en Dataverse; la aplicación (cuadrículas, formularios de detalle, paneles) se produce automáticamente. Es el modo más relevante para herramientas internas de tipo CRUD. |
| **Microsoft Dataverse** | La plataforma de datos administrada: tablas relacionales, seguridad a nivel de columna, reglas de negocio, validación en el servidor y auditoría de cambios integrada. |
| **Conectores** | Más de 1.000 conectores listos para sistemas de Microsoft y de terceros; conectores personalizados para APIs REST internas. |
| **Power Automate** | Motor de flujos de trabajo y automatización (aprobaciones, notificaciones, tareas programadas) que se integra con las aplicaciones. |
| **IA / Copilot** | Generación de aplicaciones por lenguaje natural y modelos de AI Builder incorporados en las aplicaciones. |

## 2. Las Capacidades Que Importan para Este Cliente

Las tres aplicaciones del cliente (cola de revisión KYC, panel de reembolsos, panel de
administración de feature flags) dependen de un subconjunto específico de la plataforma:

1. **Tablas de datos y vistas**: cuadrículas ordenables, filtrables y con búsqueda sobre
   registros de negocio (casos KYC, solicitudes de reembolso, flags).
2. **Formularios con validación**: creación y edición de registros con campos
   obligatorios, entradas tipadas y validación por reglas de negocio.
3. **Control de acceso basado en roles**: roles de seguridad de Dataverse integrados
   con Microsoft Entra ID. Un analista puede revisar, solo un líder de compliance puede
   aprobar, solo ingeniería puede alternar una flag de producción. En una fintech
   regulada esto es un requisito.
4. **Registro de auditoría**: la auditoría de Dataverse registra cada creación,
   actualización y eliminación con valores antiguos y nuevos por registro. Para KYC y
   reembolsos esto es un requisito de compliance.
5. **Flujos de trabajo y aprobaciones**: máquinas de estado (de pendiente a aprobado o
   rechazado) con notificaciones y escalamiento vía Power Automate.
6. **Plataforma administrada**: SSO, alojamiento, parches, copias de seguridad y
   disponibilidad son responsabilidad de Microsoft.

Las tres aplicaciones usan una porción pequeña de la plataforma. Todas siguen el mismo
patrón: tabla, formulario, acción restringida por rol, registro de auditoría. No parecen
usar los diferenciadores de cola larga, como el catálogo de conectores, el modo móvil
sin conexión o AI Builder.

## 3. Dónde Está el Valor

El valor de Power Apps está en el paquete, no en una única funcionalidad:

- **Velocidad hasta la primera versión**: una aplicación CRUD funcional en horas o
  días, sin ingenieros.
- **Desarrollo ciudadano**: personas no ingenieras (operaciones, compliance) pueden
  crear y modificar aplicaciones.
- **Gobernanza lista para usar**: SSO, RBAC, auditoría y certificaciones de compliance
  (SOC 2, ISO 27001) heredadas de la nube de Microsoft.
- **Cero propiedad de infraestructura**: sin servidores, despliegues ni guardias.

Sus debilidades documentadas, relevantes al evaluar un reemplazo:

- **Costo y complejidad de licenciamiento**: el plan Premium cuesta alrededor de
  20 USD/usuario/mes a precio de lista; los conectores premium, la capacidad de
  Dataverse y la acumulación por aplicación hacen que los costos reales sean difíciles
  de predecir.
- **Límites de delegación**: las consultas que un conector no puede delegar se evalúan
  en el cliente sobre un conjunto limitado de registros (500 a 2.000 filas), lo que
  produce resultados incorrectos a escala.
- **Modelo de datos y UX restringidos**: la lógica relacional compleja y la UX
  personalizada más allá de formularios sobre datos resultan difíciles.
- **Límites de solicitudes de API**: cuotas diarias de API por usuario ligadas al
  licenciamiento.
- **Dependencia del proveedor**: las aplicaciones, las fórmulas Power Fx y los datos de
  Dataverse no son portables.

## 4. Los Costos Ocultos de Reemplazar la Plataforma

Cinco costos son fáciles de subestimar al proponer una alternativa interna:

1. **La autenticación y la autorización son un compromiso permanente de ingeniería.**
   El SSO, la gestión de sesiones y los modelos de roles vienen integrados en Power
   Apps vía Entra ID. Reconstruirlos y mantenerlos seguros en una fintech regulada es
   un trabajo continuo significativo, incluso con proveedores administrados (Auth0,
   Clerk, WorkOS) o bibliotecas.
2. **Los conectores son un producto, no una funcionalidad.** Una plataforma interna
   tendría que construir y mantener cada integración manualmente o adoptar una capa de
   integración (Composio, Merge, Paragon), lo que reintroduce una factura de proveedor
   y aún deja código de integración por mantener.
3. **El desarrollo ciudadano traslada el costo fuera del equipo de ingeniería.** Con
   Power Apps, usuarios no técnicos crean y modifican sus propias aplicaciones dentro
   de límites definidos por los administradores. Una solución interna convierte cada
   nueva herramienta y cada cambio en un ticket de ingeniería. Esa sobrecarga continua
   es el mayor costo oculto de construir.
4. **El pronóstico de demanda es la variable decisiva.** Si la demanda se mantiene en
   aproximadamente estas tres aplicaciones, o crece hasta unas diez aplicaciones CRUD
   similares, una solución interna simple mantenida dentro del alcance del equipo
   actual es plausible. Si la demanda sigue creciendo, la plataforma necesitará
   responsables dedicados, y de uno a tres ingenieros a más de 200 mil USD por año
   cada uno superan rápidamente el costo actual de la licencia, antes de contar el
   costo de oportunidad.
5. **Construir sigue implicando comprar o alojar las piezas.** Replicar las capacidades
   de la plataforma requiere motores de workflow (Temporal, Inngest), plataformas de
   integración y autenticación administrada, cada uno con su propia factura. La ruta de
   código abierto (Temporal, Keycloak, n8n autoalojados) cambia esas suscripciones por
   una factura de nube mayor, más las horas de ingeniería para operar, parchear y
   actualizar la infraestructura. Construir nunca es una opción con cero proveedores y
   cero infraestructura.

Una evaluación completa también debe comparar plataformas alternativas (Retool,
Appsmith, Budibase, ToolJet), cuyos precios pueden ajustarse mejor a la escala del
cliente. Reemplazar al proveedor y construir internamente no son las únicas opciones;
cambiar a un proveedor más barato puede superar a ambas.

## 5. Interpretando el Gasto Anual de 250 Mil USD

A precio de lista, 60 ingenieros a 20 USD/usuario/mes suman unos 14,4 mil USD al año,
muy por debajo de 250 mil USD. Un gasto de 250 mil USD implica alguna combinación de
licenciamiento para toda la organización, complementos de capacidad de Dataverse,
conectores premium, licenciamiento de Power Automate, entornos administrados o un
contrato empresarial que incluye consultoría. Dos implicaciones:

1. La primera pregunta al cliente debe ser una auditoría de licencias. Pueden tener
   licencias en exceso para tres aplicaciones internas, independientemente de la
   decisión de construir o comprar.
2. Cualquier alternativa interna debe compararse con el precio renegociado de Power
   Apps, o con un competidor más barato de 10 a 50 USD/usuario/mes, no con los 250 mil
   USD actuales.

## 6. Qué Debe Demostrar un Prototipo

Para probar si el equipo podría construir esto internamente con Devin, el prototipo debe
replicar el núcleo de capacidades de la sección 2, aplicado a las tres aplicaciones del
cliente:

- [ ] Cuadrícula de datos con filtro y búsqueda para cada aplicación (cola KYC,
      reembolsos, flags)
- [ ] Formularios con validación para acciones que cambian el estado (aprobar o
      rechazar KYC, procesar reembolso, alternar o crear flag)
- [ ] Control de acceso basado en roles (visualizador, aprobador, admin) restringiendo
      esas acciones
- [ ] Un registro de auditoría que capture quién hizo qué, cuándo, con valores antes y
      después
- [ ] Desplegado y compartible (Vercel)

Fuera del alcance de un prototipo de dos horas, y señalado en la evaluación: SSO real,
una base de datos de producción con copias de seguridad, el ecosistema de conectores,
el desarrollo ciudadano y la certificación de compliance.

## Fuentes

- Microsoft, "What is Power Apps?" - learn.microsoft.com/power-apps/powerapps-overview
- Microsoft, componentes de Power Apps (canvas, basado en modelo, Dataverse) - learn.microsoft.com/power-apps/maker
- Microsoft, precios de Power Apps - microsoft.com/power-platform/products/power-apps/pricing
- Microsoft, Guía de Licenciamiento de Power Platform (ago. 2025)
- Microsoft, auditoría de Dataverse - learn.microsoft.com/power-platform/admin/manage-dataverse-auditing
- TechTarget, "Top Microsoft Power Apps limitations"
- Conduct, "Power Apps limitations: when to move off low-code"
