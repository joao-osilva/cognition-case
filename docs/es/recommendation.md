# Recomendación

**Renegocie o reemplace el contrato primero. Construya solo si eso falla, o cuando la
demanda de herramientas internas supere tres aplicaciones.**

## 1. Situación

El equipo de ingeniería paga 250 mil USD/año por una plataforma que ejecuta tres
aplicaciones CRUD. A precio de lista, 60 usuarios cuestan unos 14,4 mil USD/año. El
prototipo demuestra que el núcleo de capacidades es replicable en horas. El costo real
de construir es la propiedad: SSO, base de datos, mantenimiento de conectores,
compliance y la pérdida del desarrollo ciudadano.

## 2. Las Opciones

| Opción | Costo anual | Esfuerzo de ingeniería | Riesgo | Personalización |
|---|---|---|---|---|
| Renegociar el contrato | Bueno: el precio de lista es ~14,4 mil USD; incluso 3x eso queda muy por debajo del valor actual | Bueno: ninguno | Bueno: nada cambia operativamente | Malo: las restricciones permanecen |
| Migrar a un proveedor más barato (Retool, Appsmith, Budibase) | Bueno: rango de 20-40 mil USD/año para este tamaño | Regular: semanas de migración para tres aplicaciones pequeñas | Regular: nuevo lock-in, mejores condiciones de salida | Regular: más flexible, todavía una plataforma |
| Construir internamente | Regular: suscripciones de herramientas ahora; 200 mil USD+ por ingeniero dedicado si la demanda crece | Malo: semanas de endurecimiento, luego mantenimiento permanente | Regular: la seguridad y el compliance pasan a ser problema del equipo | Bueno: control total |

## 3. Razonamiento

- Prueba de commodity: las herramientas internas CRUD no diferencian el negocio. La
  capacidad commodity tiende a comprar.
- TCO honesto: las estimaciones de construcción de herramientas internas se exceden de
  2,5 a 3x. Compare el costo de tres años de construcción con el precio corregido de la
  licencia, no con el contrato actual. Construir solo gana contra el número inflado.
- No existe la construcción pura: auth, base de datos y capas de integración igual se
  comprarían. La elección real es qué conjunto de proveedores poseer.
- El desarrollo ciudadano se pierde: hoy operaciones y compliance entregan sus
  propios cambios; internamente, cada cambio se convierte en un ticket de ingeniería.
- Dónde encaja Devin: el prototipo tomó dos horas, y el trabajo posterior tiene la
  misma forma de tarea bien delimitada. Construir se vuelve más barato, pero los
  costos de propiedad permanecen.

## 4. Qué Cambiaría la Decisión

- La auditoría falla: el gasto no puede acercarse al precio de lista.
- La demanda crece: un roadmap de diez o más herramientas internas justifica la
  propiedad dedicada.
- La personalización se vuelve una restricción: los límites de delegación o los techos
  de UX bloquean los flujos de trabajo.
- El compliance exige un control de los datos que el proveedor no puede ofrecer.

## 5. Próximos Pasos

1. Auditoría de licencias y uso: una semana, finanzas más un ingeniero.
2. Cotizaciones de dos plataformas competidoras, la misma semana.
3. Punto de decisión: un total renegociado por debajo de unos 50 mil USD/año significa
   comprar, y la cuestión se cierra por un año.
4. De lo contrario, un piloto de construcción de cuatro semanas con Devin: endurecer la
   aplicación de KYC de extremo a extremo, incluyendo SSO y persistencia, y volver a
   medir la línea de costo antes de comprometerse con las otras dos.
