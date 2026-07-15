# DESIGN.md — Holobox Interactive Demo
# Visual Design System · Playground Studio · Julio 2026

## Filosofía de diseño

**Todo flota sobre blanco.**
El holobox tiene fondo blanco — el UI nunca compite con el modelo 3D.
Los elementos de UI son glass translúcido con profundidad táctil 3D.
El modelo ES el héroe — el UI es el marco.

**Neo-Tactile sobre blanco.**
Inspirado en el estilo Neo-Tactile: superficies glass con highlight superior inset,
sombra inferior pronunciada, sensación de elevación física.
No dark mode. No colores saturados. Refinado, premium, tecnológico.

---

## Colores

```css
:root {
  /* Backgrounds */
  --bg-base:        #ffffff;
  --bg-surface:     rgba(255,255,255,0.85);
  --bg-elevated:    rgba(255,255,255,0.95);
  --bg-overlay:     rgba(255,255,255,0.75);

  /* Text */
  --text-primary:   rgba(0,0,0,0.82);
  --text-secondary: rgba(0,0,0,0.50);
  --text-tertiary:  rgba(0,0,0,0.28);
  --text-muted:     rgba(0,0,0,0.18);

  /* Borders */
  --border-subtle:  rgba(0,0,0,0.05);
  --border-mid:     rgba(0,0,0,0.08);
  --border-strong:  rgba(0,0,0,0.12);

  /* Accent — negro casi puro, elegante */
  --accent:         #1a1a1a;
  --accent-mid:     rgba(26,26,26,0.12);
  --accent-light:   rgba(26,26,26,0.06);

  /* Status */
  --color-success:  #0F6E56;
  --color-warning:  #B45309;
  --color-error:    #A32D2D;
  --bg-success:     rgba(15,110,86,0.08);
  --bg-warning:     rgba(180,83,9,0.08);
  --bg-error:       rgba(163,45,45,0.08);
}
```

---

## Tipografía

```html
<!-- En index.html <head> -->
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
```

| Uso | Fuente | Peso | Tamaño |
|---|---|---|---|
| Títulos hero (HOLOBOX) | Syne | 800 | 56–72px |
| Títulos de sección | Syne | 700 | 18–24px |
| Labels de categoría | Syne | 700 | 11–13px, uppercase, letter-spacing 0.08em |
| Body / descripciones | DM Sans | 400 | 13–15px |
| Labels de botón | DM Sans | 500 | 12–14px |
| Captions / metadata | DM Sans | 300 | 10–11px |

**Regla:** Syne para identidad y estructura. DM Sans para todo lo funcional.
**Mínimo:** 12px en cualquier texto visible.

---

## Sistema de botones — Glass 3D Tactile

### Botón primario (CTA pill)
```css
.btn-primary {
  background: linear-gradient(180deg, #ffffff 0%, #e8e8e8 100%);
  border: none;
  border-radius: 100px;
  padding: 15px 44px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: rgba(0,0,0,0.75);
  cursor: pointer;
  box-shadow:
    0 1px 0 rgba(255,255,255,1) inset,       /* highlight superior */
    0 -1px 0 rgba(0,0,0,0.07) inset,          /* sombra inferior inset */
    0 4px 16px rgba(0,0,0,0.10),              /* sombra drop */
    0 1px 3px rgba(0,0,0,0.07),
    0 0 0 1px rgba(0,0,0,0.05);              /* border sutil */
  transition: all 0.2s ease;
}
.btn-primary:hover {
  box-shadow:
    0 1px 0 rgba(255,255,255,1) inset,
    0 -1px 0 rgba(0,0,0,0.09) inset,
    0 8px 24px rgba(0,0,0,0.14),
    0 2px 6px rgba(0,0,0,0.09),
    0 0 0 1px rgba(0,0,0,0.06);
  transform: translateY(-1px);
}
.btn-primary:active {
  transform: scale(0.97);
  box-shadow:
    0 1px 0 rgba(255,255,255,1) inset,
    0 -1px 0 rgba(0,0,0,0.07) inset,
    0 2px 8px rgba(0,0,0,0.08),
    0 0 0 1px rgba(0,0,0,0.05);
}
```

### Botón ghost (laterales del viewer)
```css
.btn-ghost {
  background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(240,242,248,0.90) 100%);
  border: none;
  border-radius: 14px;
  padding: 12px;
  min-width: 64px;
  min-height: 60px; /* touch target mínimo */
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  font-weight: 500;
  color: rgba(0,0,0,0.55);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  box-shadow:
    0 1px 0 rgba(255,255,255,1) inset,
    0 -1px 0 rgba(0,0,0,0.06) inset,
    0 2px 8px rgba(0,0,0,0.08),
    0 0 0 1px rgba(0,0,0,0.04);
  transition: all 0.2s ease;
}
.btn-ghost:hover {
  color: rgba(0,0,0,0.75);
  box-shadow:
    0 1px 0 rgba(255,255,255,1) inset,
    0 -1px 0 rgba(0,0,0,0.08) inset,
    0 6px 16px rgba(0,0,0,0.12),
    0 0 0 1px rgba(0,0,0,0.05);
  transform: translateY(-1px);
}
.btn-ghost .icon { font-size: 18px; }
.btn-ghost .label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
```

---

## Cards de categoría (Menú)

```css
.category-card {
  background: linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(238,241,250,0.80) 100%);
  border: none;
  border-radius: 20px;
  padding: 28px 16px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  box-shadow:
    0 1px 0 rgba(255,255,255,1) inset,
    0 -1px 0 rgba(0,0,0,0.04) inset,
    1px 0 0 rgba(255,255,255,0.7) inset,
    0 4px 16px rgba(0,0,0,0.08),
    0 1px 3px rgba(0,0,0,0.06),
    0 0 0 1px rgba(0,0,0,0.04);
  transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

/* Top highlight line */
.category-card::after {
  content: '';
  position: absolute;
  top: 0; left: 10%; right: 10%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent);
}

.category-card:hover {
  background: linear-gradient(160deg, #fff 0%, rgba(225,232,255,0.85) 100%);
  transform: translateY(-4px) scale(1.03);
  box-shadow:
    0 1px 0 rgba(255,255,255,1) inset,
    0 -1px 0 rgba(0,0,0,0.05) inset,
    1px 0 0 rgba(255,255,255,0.9) inset,
    0 12px 32px rgba(0,0,0,0.12),
    0 4px 10px rgba(0,0,0,0.08),
    0 0 0 1px rgba(0,0,0,0.05);
}

.category-card:active { transform: scale(0.97); }

.category-card .icon {
  font-size: 32px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.10));
}

.category-card .label {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: rgba(0,0,0,0.65);
  text-align: center;
  line-height: 1.3;
}

.category-card .sublabel {
  font-size: 10px;
  color: rgba(0,0,0,0.30);
  text-align: center;
  line-height: 1.4;
}
```

---

## Glass panels (slide-in, modals, headers)

```css
.glass-panel {
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 18px;
  box-shadow:
    0 1px 0 rgba(255,255,255,1) inset,
    0 8px 32px rgba(0,0,0,0.10),
    0 2px 6px rgba(0,0,0,0.06),
    0 0 0 1px rgba(0,0,0,0.05);
}
```

---

## Hotspots 3D

```css
.hotspot-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: rgba(0,0,0,0.08);
  border: 1.5px solid rgba(0,0,0,0.35);
  cursor: pointer;
  animation: hotspot-pulse 2.5s ease-in-out infinite;
}
.hotspot-dot::after {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%,-50%);
  width: 5px; height: 5px;
  border-radius: 50%;
  background: rgba(0,0,0,0.6);
}
@keyframes hotspot-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0.12); }
  50%       { box-shadow: 0 0 0 6px rgba(0,0,0,0); }
}
```

---

## Animaciones de transición

```css
/* Screen transitions */
.screen-enter {
  animation: screenIn 0.35s ease forwards;
}
@keyframes screenIn {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Card stagger */
.category-card {
  opacity: 0;
  transform: translateY(14px);
  animation: cardIn 0.4s ease forwards;
}
/* animation-delay: 0.05s * index por card */

@keyframes cardIn {
  to { opacity: 1; transform: translateY(0); }
}

/* Slide-in panel */
.side-panel {
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.side-panel.open {
  transform: translateX(0);
}

/* Modal */
.modal-backdrop {
  opacity: 0;
  transition: opacity 0.2s ease;
}
.modal-backdrop.show { opacity: 1; }

.modal-box {
  transform: scale(0.94);
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-backdrop.show .modal-box { transform: scale(1); }
```

---

## Drop shadow del modelo 3D

```jsx
// Elipse debajo del modelo — escala con el zoom
<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
  <planeGeometry args={[2, 1]} />
  <meshBasicMaterial
    color="#000000"
    transparent
    opacity={0.08}
  />
</mesh>
```

O en CSS si el modelo va como imagen/video:
```css
.model-shadow {
  width: 40%;
  height: 12px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(0,0,0,0.10) 0%, transparent 70%);
  margin: 0 auto;
}
```

---

## Layout del Viewer

```
┌─────────────────────────────────────────────────────┐
│ [← Back]         [Category Name]                    │  header 60px
├──────┬──────────────────────────────────┬───────────┤
│      │                                  │           │
│ 🔍   │                                  │  💬       │
│ 📋   │        3D MODEL FLOATING         │  📱       │
│ 🎨   │         + drop shadow            │  📩       │
│      │                                  │           │
│ 72px │         fullscreen canvas        │  72px     │
└──────┴──────────────────────────────────┴───────────┘
```

Botones laterales: 72px de ancho, full height, columna flex con gap.
Canvas 3D: ocupa el espacio restante.
Header: 60px, glass con backdrop-filter.

---

## Welcome screen

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                   [VIDEO BG]                        │
│            opacity: 0.35, object-fit: cover         │
│                                                     │
│                  LOGO / HOLOBOX                     │  Syne 800, 64px
│           Interactive 3D Experience Platform        │  DM Sans 300, 13px
│                                                     │
│              [  Explore Demo →  ]                   │  btn-primary
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Responsive / Fullscreen

La app siempre corre fullscreen en el holobox (portrait 4K).
En desarrollo en Mac se ve en el browser a tamaño normal.
Usar `vw/vh` y `dvh` para garantizar fullscreen real.

```css
.app {
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
  background: #ffffff;
}
```

---

## Fuentes de modelos 3D gratuitos

- **Sketchfab:** sketchfab.com — buscar GLB, filtrar free, CC Attribution
- **GrabCAD:** grabcad.com — modelos industriales, descargar como STEP → convertir en Blender
- **Poly Pizza:** poly.pizza — low-poly gratuitos
- **Kenney:** kenney.nl — assets de juego, algunos útiles

**Optimización:** Abrir en Blender → File > Import > GLB → seleccionar todo → Object > Apply All Transforms → File > Export > GLB con textura 1k, Draco compression ON

---

*Design System v1.0 · Holobox Demo · Playground Studio · Julio 2026*
