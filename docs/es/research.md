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

## 2. Las Capacidades Que Importan para el Equipo de Ingeniería

Las tres aplicaciones (cola de revisión KYC, panel de reembolsos, panel de
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
6. **Conectores**: las herramientas internas rara vez funcionan aisladas. Las colas
   KYC leen de proveedores de verificación de identidad, los paneles de reembolsos se
   comunican con procesadores de pago. El catálogo de conectores mantenido por el
   proveedor mantiene esas integraciones fuera del código del equipo.
7. **Plataforma administrada**: SSO, alojamiento, parches, copias de seguridad y
   disponibilidad son responsabilidad del proveedor.

Las tres aplicaciones siguen el mismo patrón central: tabla, formulario, acción
restringida por rol, registro de auditoría, con integraciones en los bordes. No parecen
usar los demás diferenciadores de la plataforma, como el modo móvil sin conexión o
AI Builder.

## 3. Dónde Está el Valor

El valor de la plataforma está en el paquete, no en una única funcionalidad:

- **Velocidad hasta la primera versión**: una aplicación CRUD funcional en horas o
  días, sin ingenieros.
- **Desarrollo ciudadano**: personas no ingenieras (operaciones, compliance) pueden
  crear y modificar aplicaciones.
- **Gobernanza lista para usar**: SSO, RBAC, auditoría y certificaciones de compliance
  (SOC 2, ISO 27001) heredadas de la nube de Microsoft.
- **Un ecosistema de integraciones mantenido**: más de 1.000 conectores que el
  proveedor mantiene funcionando a medida que cambian las APIs de terceros, de modo
  que las integraciones son configuración y no código que el equipo debe mantener.
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

## 4. Una Advertencia Sobre el Gasto Actual: el Precio Puede No Reflejar el Uso

Lo que un equipo paga por una plataforma suele reflejar cómo se estructuró el
contrato, no cómo se usa la plataforma: asientos, complementos de capacidad,
conectores premium y contratos empresariales con servicios agregados. El uso
equivalente a tres aplicaciones puede estar dentro de un contrato cotizado para mucho
más. Como referencia, a precio de lista de Power Apps, 60 ingenieros a
20 USD/usuario/mes suman unos 14,4 mil USD al año, un orden de magnitud por debajo del
gasto informado de 250 mil USD.

Dos implicaciones:

1. Comenzar con una auditoría de licencias y de uso, independientemente de la decisión
   de construir o comprar.
2. Comparar cualquier alternativa interna con el precio renegociado de la plataforma,
   o con un competidor más barato de 10 a 50 USD/usuario/mes, no con el contrato
   actual.

## Fuentes

- Microsoft, "What is Power Apps?" - learn.microsoft.com/power-apps/powerapps-overview
- Microsoft, componentes de Power Apps (canvas, basado en modelo, Dataverse) - learn.microsoft.com/power-apps/maker
- Microsoft, precios de Power Apps - microsoft.com/power-platform/products/power-apps/pricing
- Microsoft, Guía de Licenciamiento de Power Platform (ago. 2025)
- Microsoft, auditoría de Dataverse - learn.microsoft.com/power-platform/admin/manage-dataverse-auditing
- TechTarget, "Top Microsoft Power Apps limitations"
- Conduct, "Power Apps limitations: when to move off low-code"
