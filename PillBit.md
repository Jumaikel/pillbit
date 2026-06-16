# PillBit - Especificación Funcional

## 1. Descripción General

PillBit es una aplicación móvil diseñada para ayudar a los usuarios a gestionar sus medicamentos de manera sencilla, segura y accesible.

La aplicación permitirá registrar medicamentos, configurar recordatorios, controlar fechas de vencimiento y consultar información relevante sobre cada medicamento.

La primera versión funcionará completamente de forma local en el dispositivo móvil, sin necesidad de crear cuentas ni utilizar servicios en la nube.

---

# 2. Objetivo del Producto

Permitir que los usuarios administren correctamente sus medicamentos mediante:

* Registro organizado de medicamentos.
* Recordatorios automáticos de toma.
* Alertas de vencimiento.
* Consulta rápida de información relevante.
* Herramientas de accesibilidad para personas mayores.

---

# 3. Público Objetivo

## Usuarios Principales

* Adultos mayores.
* Personas con tratamientos médicos recurrentes.
* Personas que consumen múltiples medicamentos.
* Cuidadores de pacientes.

---

# 4. Requisitos Funcionales

## RF-001 Registro de Medicamentos

El sistema deberá permitir registrar medicamentos con la siguiente información:

### Información Obligatoria

* Nombre del medicamento.
* Dosis.
* Fecha de vencimiento.

### Información Opcional

* Presentación.
* Cantidad disponible.
* Notas personales.
* Fotografía.
* Información generada por IA.

---

## RF-002 Edición de Medicamentos

El sistema deberá permitir modificar cualquier información registrada de un medicamento.

---

## RF-003 Eliminación de Medicamentos

El sistema deberá permitir eliminar medicamentos registrados.

Antes de eliminar un medicamento se deberá solicitar confirmación al usuario.

---

## RF-004 Consulta de Medicamentos

El sistema deberá mostrar una lista de todos los medicamentos registrados.

Cada elemento deberá mostrar:

* Nombre.
* Dosis.
* Próxima toma.
* Estado de vencimiento.

---

## RF-005 Detalle de Medicamento

El sistema deberá mostrar una pantalla con toda la información registrada del medicamento.

La pantalla deberá incluir:

* Nombre.
* Dosis.
* Presentación.
* Cantidad disponible.
* Fecha de vencimiento.
* Notas.
* Fotografía.
* Información generada por IA.
* Recordatorios configurados.

---

## RF-006 Programación de Recordatorios

El usuario podrá configurar uno o varios horarios para cada medicamento.

Cada recordatorio deberá incluir:

* Hora.
* Estado activo o inactivo.

---

## RF-007 Notificaciones de Toma

El sistema deberá generar notificaciones locales cuando llegue la hora programada de un medicamento.

La notificación deberá contener:

* Nombre del medicamento.
* Dosis.
* Hora programada.

---

## RF-008 Registro de Consumo

Desde una notificación o desde la aplicación, el usuario podrá marcar un medicamento como:

* Tomado.
* Pospuesto.
* Omitido.

---

## RF-009 Historial de Consumo

El sistema deberá almacenar el historial de consumo de medicamentos.

Cada registro deberá contener:

* Medicamento.
* Fecha.
* Hora.
* Estado.

---

## RF-010 Control de Vencimiento

El sistema deberá monitorear automáticamente la fecha de vencimiento de los medicamentos.

---

## RF-011 Alertas de Vencimiento

El sistema deberá generar alertas automáticas:

* 30 días antes del vencimiento.
* 7 días antes del vencimiento.
* 1 día antes del vencimiento.
* El día del vencimiento.
* Después del vencimiento.

---

## RF-012 Medicamentos Vencidos

El sistema deberá mostrar una lista específica de medicamentos vencidos.

---

## RF-013 Cantidad Disponible

El sistema deberá permitir registrar la cantidad disponible de cada medicamento.

---

## RF-014 Alerta de Cantidad Baja

Cuando la cantidad disponible alcance un umbral definido por el usuario, el sistema deberá generar una notificación.

---

## RF-015 Fotografía del Medicamento

El sistema deberá permitir asociar una fotografía a cada medicamento.

La fotografía podrá obtenerse desde:

* Cámara.
* Galería del dispositivo.

---

## RF-016 Información Generada por IA

El sistema deberá permitir generar automáticamente información educativa sobre un medicamento.

La información generada deberá incluir:

* Descripción.
* Usos comunes.
* Contraindicaciones.
* Efectos secundarios.
* Advertencias.
* Interacciones relevantes.

La información deberá almacenarse localmente junto al medicamento.

---

## RF-017 Consulta de Información Generada por IA

El usuario podrá consultar la información generada por IA desde la pantalla de detalle del medicamento.

---

# 5. Requisitos de Accesibilidad

## RA-001 Tamaño de Texto

La aplicación deberá permitir seleccionar:

* Tamaño normal.
* Tamaño grande.
* Tamaño extra grande.

---

## RA-002 Alto Contraste

La aplicación deberá ofrecer un modo de alto contraste para mejorar la legibilidad.

---

## RA-003 Botones Grandes

Todos los controles interactivos deberán tener un tamaño mínimo adecuado para facilitar su uso por adultos mayores.

---

## RA-004 Entrada por Voz

La aplicación deberá permitir completar formularios utilizando reconocimiento de voz.

---

## RA-005 Lectura por Voz

La aplicación deberá poder leer información relevante utilizando síntesis de voz.

---

## RA-006 Notificaciones por Voz

La aplicación deberá permitir reproducir recordatorios mediante voz.

---

# 6. Requisitos de Usabilidad

## RU-001 Simplicidad

Las funciones más utilizadas deberán estar disponibles desde la pantalla principal.

---

## RU-002 Navegación

El usuario deberá poder acceder a cualquier función principal en un máximo de tres interacciones.

---

## RU-003 Claridad Visual

Todas las acciones importantes deberán estar acompañadas por texto descriptivo.

No se permitirá el uso exclusivo de iconos para acciones críticas.

---

## RU-004 Estados Visuales

Los medicamentos deberán utilizar indicadores visuales para representar su estado:

### Normal

Medicamento vigente.

### Próximo a vencer

Medicamento cercano a su fecha de vencimiento.

### Vencido

Medicamento vencido.

---

# 7. Requisitos de Almacenamiento

## RD-001 Persistencia Local

Toda la información deberá almacenarse localmente en el dispositivo.

---

## RD-002 Funcionamiento Sin Internet

La aplicación deberá funcionar completamente sin conexión a internet, excepto para la generación opcional de información mediante IA.

---

## RD-003 Conservación de Datos

Los datos deberán mantenerse disponibles entre sesiones de uso.

---

# 8. Restricciones

* No existirán cuentas de usuario.
* No existirá backend.
* No existirá sincronización en la nube.
* Toda la información permanecerá en el dispositivo.
* La información generada por IA tendrá carácter informativo y educativo.
* La aplicación no sustituye el criterio médico profesional.

---

# 9. Pantallas Requeridas

1. Pantalla Principal.
2. Lista de Medicamentos.
3. Crear Medicamento.
4. Editar Medicamento.
5. Detalle de Medicamento.
6. Medicamentos Próximos a Vencer.
7. Medicamentos Vencidos.
8. Historial de Consumo.
9. Configuración.
10. Accesibilidad.

---

# 10. Criterios de Éxito

La aplicación será considerada funcional cuando permita:

* Registrar medicamentos.
* Programar recordatorios.
* Generar notificaciones locales.
* Detectar vencimientos.
* Mostrar información educativa generada por IA.
* Registrar historial de consumo.
* Operar completamente sin backend.
* Ser utilizable por adultos mayores sin asistencia técnica.
