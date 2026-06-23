# PillBit - Design System & UI/UX Standards

## Objetivo

Este documento define los estándares visuales, de accesibilidad, diseño y experiencia de usuario para PillBit.

La aplicación debe transmitir:

- Confianza
- Seguridad
- Claridad
- Simplicidad
- Modernidad
- Accesibilidad para adultos mayores

---

# Principios de Diseño

## 1. Mobile First

Toda pantalla debe diseñarse primero para dispositivos móviles.

Requisitos:

- Soporte desde 320px hasta tablets.
- Layouts fluidos.
- Evitar tamaños fijos.
- Utilizar constraints responsivos.
- Mantener consistencia entre Android e iOS.

---

## 2. Simplicidad

La aplicación debe minimizar la carga cognitiva.

Reglas:

- Máximo una acción principal por pantalla.
- Evitar interfaces saturadas.
- Utilizar lenguaje simple.
- Reducir pasos innecesarios.

---

## 3. Accesibilidad

La aplicación debe cumplir WCAG AA como mínimo.

Requisitos:

- Contraste adecuado.
- Soporte para escalado de texto.
- Áreas táctiles mínimas de 48x48 dp.
- Compatible con lectores de pantalla.
- Navegación intuitiva.

---

## 4. Consistencia

Todos los componentes deben utilizar el Design System.

No crear variantes visuales sin justificación.

---

# Paleta de Colores

## Light Theme

### Brand Colors

| Token | Color |
|---------|---------|
| Primary | #24C9EA |
| Primary Light | #7FD6EA |
| Primary Container | #D6EDFB |
| Secondary | #C6CDF8 |
| Accent | #FED7EE |

### Backgrounds

| Token | Color |
|---------|---------|
| Background | #F8FCFE |
| Surface | #FFFFFF |
| Surface Variant | #EEF8FC |
| Card Background | #FFFFFF |

### Text

| Token | Color |
|---------|---------|
| Text Primary | #123043 |
| Text Secondary | #5D7482 |
| Disabled | #A6B4BE |

### Status

| Token | Color |
|---------|---------|
| Success | #34C759 |
| Warning | #FFB020 |
| Error | #F04438 |
| Info | #24C9EA |

---

## Dark Theme

### Brand Colors

| Token | Color |
|---------|---------|
| Primary | #24C9EA |
| Primary Container | #1B6F83 |
| Secondary | #C6CDF8 |
| Accent | #FED7EE |

### Backgrounds

| Token | Color |
|---------|---------|
| Background | #0B1720 |
| Surface | #122330 |
| Surface Variant | #193241 |
| Card Background | #17303F |

### Text

| Token | Color |
|---------|---------|
| Text Primary | #F5FAFC |
| Text Secondary | #C2D3DD |
| Disabled | #6E8592 |

---

# Tipografía

## Fuente Principal

- Inter
- SF Pro (iOS)
- Roboto (Android)

Fallback:

- System Sans Serif

---

## Escala Tipográfica

| Uso | Tamaño |
|------|------|
| Display | 32 |
| H1 | 28 |
| H2 | 24 |
| H3 | 20 |
| Body Large | 18 |
| Body | 16 |
| Body Small | 14 |
| Caption | 12 |

---

# Espaciado

Base Unit: 8px

Escala:

- 4
- 8
- 12
- 16
- 24
- 32
- 48
- 64

Nunca usar valores arbitrarios.

---

# Bordes

## Radius

Small: 8

Medium: 12

Large: 16

Extra Large: 24

Cards principales:

16

Botones:

12

---

# Elevación

Utilizar elevación mínima.

Preferir:

- Color
- Contraste
- Espaciado

antes que sombras agresivas.

---

# Componentes

## Botón Primario

- Fondo Primary
- Texto blanco
- Altura mínima 48dp
- Radius 12

## Botón Secundario

- Outline
- Border Primary
- Fondo transparente

## Cards

- Radius 16
- Padding 16
- Sombra suave

---

# Estados de Medicamentos

## Vigente

Color:

#34C759

## Próximo a vencer

Color:

#FFB020

## Vencido

Color:

#F04438

## Información IA

Color:

#C6CDF8

---

# Navegación

## Bottom Navigation

Máximo:

5 elementos

Elementos sugeridos:

- Inicio
- Medicamentos
- Historial
- Alertas
- Configuración

---

# Responsive Design

## Teléfonos pequeños

320–360 px

Reducir padding horizontal.

## Teléfonos estándar

375–430 px

Diseño base.

## Tablets

Utilizar:

- Master Detail
- Paneles adaptativos

---

# Accesibilidad

## Texto

Permitir:

- Normal
- Grande
- Extra Grande

## Contraste

Mantener WCAG AA.

## Targets

Mínimo:

48x48 dp

## Screen Readers

Todos los elementos interactivos deben tener:

- Label
- Hint
- Role

---

# Animaciones

Duración:

- 150 ms
- 200 ms
- 300 ms

Utilizar curvas suaves.

Evitar animaciones excesivas.

---

# Buenas Prácticas Flutter

## Material 3

Utilizar Material Design 3 como base.

## Temas

Todo color debe provenir del Theme.

Prohibido:

- Colores hardcodeados en widgets.

## Componentización

Crear componentes reutilizables.

Ejemplos:

- AppButton
- AppCard
- AppTextField
- MedicationCard
- StatusBadge

---

# Buenas Prácticas UX

- Confirmar acciones destructivas.
- Mostrar estados vacíos amigables.
- Proveer feedback inmediato.
- Utilizar skeleton loaders.
- Mantener consistencia visual.

---

# Objetivo Final

PillBit debe sentirse como una aplicación:

- Moderna
- Premium
- Accesible
- Confiable
- Limpia
- Fácil para adultos mayores
- Nativa tanto en Android como en iOS
