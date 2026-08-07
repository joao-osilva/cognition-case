# Investigación: Qué Hace Microsoft Power Apps y Dónde Está Su Valor

## 1. Qué Es Power Apps

Una plataforma low-code, parte de la Power Platform de Microsoft. Construye
aplicaciones de negocio sobre Dataverse o más de 1.000 fuentes de datos externas.

| Componente | Qué ofrece |
|---|---|
| **Aplicaciones de lienzo (canvas)** | Constructor de UI de arrastrar y soltar con fórmulas al estilo Excel (Power Fx). |
| **Aplicaciones basadas en modelo** | UI generada a partir del modelo de datos: defina tablas y reglas, obtenga cuadrículas, formularios y paneles. El modo usado para herramientas internas CRUD. |
| **Microsoft Dataverse** | Plataforma de datos administrada: tablas relacionales, seguridad por columna, validación, auditoría de cambios. |
| **Conectores** | Más de 1.000 integraciones listas; conectores personalizados para APIs internas. |
| **Power Automate** | Flujos de trabajo: aprobaciones, notificaciones, tareas programadas. |
| **IA / Copilot** | Generación de aplicaciones por lenguaje natural, modelos de AI Builder. |

## 2. Las Capacidades Que Usan las Tres Aplicaciones

1. **Cuadrículas de datos**: vistas ordenables y filtrables sobre casos KYC, reembolsos, flags.
2. **Formularios validados**: campos obligatorios, entradas tipadas, reglas de negocio.
3. **RBAC**: los analistas revisan, los líderes de compliance aprueban, ingeniería
   alterna flags. Obligatorio en una fintech regulada.
4. **Registro de auditoría**: cada cambio registrado con valores antiguos y nuevos.
   Obligatorio para KYC y reembolsos.
5. **Aprobaciones**: máquinas de estado pendiente / aprobado / rechazado con notificaciones.
6. **Conectores**: integraciones (proveedores de identidad, procesadores de pago) que
   el equipo no mantiene.
7. **Plataforma administrada**: SSO, alojamiento, parches y copias de seguridad son
   problema del proveedor.

El mismo patrón en las tres aplicaciones: tabla, formulario, acción restringida por
rol, registro de auditoría. El modo móvil sin conexión, AI Builder y el resto de la
plataforma quedan sin uso.

## 3. Dónde Está el Valor

El valor está en el paquete, no en una única funcionalidad:

- **Velocidad**: una aplicación CRUD funcional en horas o días, sin ingenieros.
- **Desarrollo ciudadano**: operaciones y compliance construyen sus propias aplicaciones.
- **Gobernanza**: SSO, RBAC, auditoría, SOC 2 / ISO 27001 heredados de Microsoft.
- **Integraciones mantenidas**: los conectores son configuración, no código que mantener.
- **Sin infraestructura**: sin servidores, despliegues ni guardias.

Las debilidades documentadas:

- **Licenciamiento**: ~20 USD/usuario/mes de lista, pero los conectores premium, la
  capacidad de Dataverse y la acumulación por aplicación hacen los costos reales
  difíciles de predecir.
- **Límites de delegación**: las consultas no delegables corren en el cliente sobre
  500 a 2.000 filas y devuelven resultados erróneos a escala.
- **UX restringida**: difícil ir más allá de formularios sobre datos.
- **Cuotas de API**: límites diarios de solicitudes por usuario.
- **Lock-in**: las aplicaciones, Power Fx y los datos de Dataverse no son portables.

## 4. Advertencia: el Precio Puede No Reflejar el Uso

El gasto en la plataforma suele reflejar la estructura del contrato, no el uso. A
precio de lista, 60 usuarios cuestan unos 14,4 mil USD/año, muy por debajo de los
250 mil USD informados. Comience con una auditoría de licencias. Compare construir con
el precio renegociado o un competidor más barato, no con el contrato actual.

## Fuentes

- Microsoft, "What is Power Apps?" - learn.microsoft.com/power-apps/powerapps-overview
- Microsoft, componentes de Power Apps (canvas, basado en modelo, Dataverse) - learn.microsoft.com/power-apps/maker
- Microsoft, precios de Power Apps - microsoft.com/power-platform/products/power-apps/pricing
- Microsoft, Guía de Licenciamiento de Power Platform (ago. 2025)
- Microsoft, auditoría de Dataverse - learn.microsoft.com/power-platform/admin/manage-dataverse-auditing
- TechTarget, "Top Microsoft Power Apps limitations"
- Conduct, "Power Apps limitations: when to move off low-code"
