# Evaluación

_La evaluación completa (lo que el prototipo replicó, lo que no pudo y lo que cerrar la
brecha exigiría en costo de construcción, carga de mantenimiento, implicaciones de
seguridad y costo de oportunidad) se está escribiendo en la próxima fase. Dos partes ya
están listas: los criterios contra los que se construyó el prototipo y los costos
ocultos que cualquier reemplazo debe considerar._

## Qué Se Propuso Demostrar el Prototipo

Para probar si el equipo podría construir esto internamente con Devin, el prototipo
replica el núcleo de capacidades identificado en la investigación, aplicado a las tres
aplicaciones:

- [x] Cuadrícula de datos con filtrado y búsqueda para cada aplicación (cola KYC,
      reembolsos, flags)
- [x] Formularios con validación para acciones que cambian estado (aprobar o rechazar
      KYC, procesar reembolso, alternar o crear flag)
- [x] Control de acceso basado en roles (viewer, approver, admin) restringiendo esas
      acciones, aplicado en el servidor
- [x] Un registro de auditoría que captura quién hizo qué, cuándo, con valores antes y
      después
- [x] Desplegado y compartible (Vercel)

Fuera del alcance de un prototipo de dos horas: SSO real, una base de datos de
producción con copias de seguridad, el ecosistema de conectores, el desarrollo
ciudadano y la certificación de compliance. Estas exclusiones son deliberadas y se
cotizan más abajo y en la recomendación.

## Los Costos Ocultos de Reemplazar la Plataforma

Cinco costos son fáciles de subestimar al proponer una alternativa interna:

1. **La autenticación y la autorización son un compromiso permanente de ingeniería.**
   SSO, gestión de sesiones y modelos de roles vienen integrados con la plataforma vía
   Entra ID. Reconstruirlos y mantenerlos de forma segura en una fintech regulada es un
   trabajo continuo significativo, incluso con proveedores gestionados (Auth0, Clerk,
   WorkOS) o bibliotecas.
2. **Los conectores son un producto, no una funcionalidad.** Una plataforma interna
   tendría que construir y mantener cada integración a mano o adoptar una capa de
   integración (Composio, Merge, Paragon), lo que reintroduce una factura de proveedor
   y aún deja código de unión que mantener.
3. **El desarrollo ciudadano quita costo al equipo de ingeniería.** Con la plataforma,
   usuarios no técnicos crean y modifican sus propias aplicaciones dentro de límites
   definidos por los administradores. Una solución interna convierte cada nueva
   herramienta y cada cambio en un ticket de ingeniería. Esta sobrecarga continua es el
   mayor costo oculto de construir.
4. **El pronóstico de demanda es la variable decisiva.** Si la demanda se mantiene en
   aproximadamente estas tres aplicaciones, o crece hasta unas diez aplicaciones CRUD
   similares, una solución interna simple mantenida dentro del alcance del equipo
   actual es plausible. Si la demanda sigue creciendo, la plataforma necesita dueños
   dedicados, y de uno a tres ingenieros a más de 200 mil USD por año superan
   rápidamente el costo actual de la licencia, antes de contar el costo de
   oportunidad.
5. **Construir sigue significando comprar u hospedar las piezas.** Replicar las
   capacidades de la plataforma involucra motores de workflow (Temporal, Inngest),
   plataformas de integración y autenticación gestionada, cada uno con su propia
   factura. La ruta open-source (Temporal, Keycloak, n8n autohospedados) cambia esas
   suscripciones por una factura de nube mayor más las horas de ingeniería para
   operar, parchear y actualizar la infraestructura. Construir nunca es una opción con
   cero proveedores y cero infraestructura.

Una evaluación completa también debe comparar plataformas alternativas (Retool,
Appsmith, Budibase, ToolJet) cuyos precios pueden ajustarse mejor a la escala del
equipo. Reemplazar al proveedor y construir internamente no son las únicas opciones;
cambiar a un proveedor más barato puede superar a ambas.
