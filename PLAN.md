# PLAN DE TRABAJO — Demo Holobox hoy
# Objetivo: demo funcional con 3 use cases en el holobox físico
# Playground Studio · Julio 2026

---

## Estado actual

- [ ] Proyecto scaffoldeado
- [ ] Modelos GLB conseguidos
- [ ] 3 pantallas funcionando (welcome, menu, viewer)
- [ ] Modelos cargando en Three.js
- [ ] Hotspots funcionando
- [ ] Corriendo en el holobox físico

---

## Bloque 1 — Scaffold y estructura (45 min)

### 1.1 Crear proyecto
```bash
npm create vite@latest holobox-demo -- --template react
cd holobox-demo
npm install three @react-three/fiber @react-three/drei
npm install
```

### 1.2 Estructura de carpetas
```
holobox-demo/
├── public/
│   └── models/           ← GLBs aquí
├── src/
│   ├── App.jsx           ← navegación principal (useState)
│   ├── App.css
│   ├── config/
│   │   └── client.js     ← config por cliente
│   ├── data/
│   │   └── usecases.js   ← definición de los 5 use cases
│   │   └── hotspots.js   ← hotspot data por use case
│   ├── screens/
│   │   ├── Welcome.jsx
│   │   ├── Menu.jsx
│   │   └── Viewer.jsx
│   ├── components/
│   │   ├── ModelCanvas.jsx    ← Three.js canvas
│   │   ├── Hotspot.jsx        ← punto 3D anclado al modelo
│   │   ├── SideButtons.jsx    ← columnas laterales
│   │   ├── SlidePanel.jsx     ← drawer lateral
│   │   └── Modal.jsx          ← overlay fullscreen
│   └── styles/
│       └── design-system.css  ← variables CSS del DESIGN.md
├── CLAUDE.md
├── DESIGN.md
├── vercel.json
└── index.html
```

### 1.3 index.html
- Agregar Google Fonts: Syne 600/700/800 + DM Sans 300/400/500
- Meta viewport correcto
- Background white en body

---

## Bloque 2 — Conseguir modelos GLB (30 min, paralelo)

Mientras el agente construye la app, tú consigues los modelos.

### Nike shoe (Fashion) — ya tienes referencia
- Sketchfab: Nike Air Zoom Pegasus 36 by quaz30
- Descargar GLB 5MB (textura 1k)
- Guardar como `/public/models/nike-shoe.glb`

### Motor / Engine (Manufactura)
- GrabCAD.com → buscar "engine" o "motor" → descargar
- Convertir a GLB en Blender si viene en otro formato
- Target: < 5MB, textura 1k
- Guardar como `/public/models/engine.glb`

### T-Rex (Education)
- Sketchfab → buscar "T-Rex skeleton" o "dinosaur" → free
- GLB directo o exportar desde Blender
- Guardar como `/public/models/trex.glb`

### Fallback si no consigues el modelo a tiempo
El Viewer tiene un placeholder box de Three.js con color del vertical.
La app funciona sin el GLB real — se ve menos impresionante pero demuestra el concepto.

---

## Bloque 3 — 3 pantallas (90 min)

### 3.1 App.jsx — navegación
```jsx
const [screen, setScreen] = useState('welcome')
const [selectedUseCase, setSelectedUseCase] = useState(null)

// welcome → menu → viewer
// viewer → menu (back)
// menu → welcome (back)
```

### 3.2 Welcome screen
- Fondo blanco
- Logo centrado (texto HOLOBOX en Syne 800 placeholder)
- Tagline
- CTA button → va a menu
- Video de fondo opcional (element `<video autoplay loop muted playsinline>`)

### 3.3 Menu screen
- Header con Back + título "Select Experience"
- Grid 2x2 de category cards
- 4 cards: Fashion, Manufactura, Drinks, Education (AI Avatar movido a app separada)
- Stagger animation al entrar
- Click → setSelectedUseCase + setScreen('viewer')

### 3.4 Viewer screen
- Header: Back button + nombre del use case
- 3 columnas: left buttons | canvas | right buttons
- Canvas con modelo GLB del use case seleccionado
- Drop shadow elipse debajo del modelo
- OrbitControls con touch

---

## Bloque 4 — Three.js y modelos (60 min)

### ModelCanvas.jsx
```jsx
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Stage } from '@react-three/drei'
import { Suspense } from 'react'

function Model({ path }) {
  const { scene } = useGLTF(path)
  return <primitive object={scene} />
}

export default function ModelCanvas({ modelPath }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 45 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      <Suspense fallback={null}>
        <Model path={modelPath} />
      </Suspense>
      <OrbitControls
        enablePan={false}
        minDistance={1.5}
        maxDistance={6}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  )
}
```

**Importante para Intel HD 530:**
- `antialias: true` — la GPU puede manejarlo a 4K
- NO usar `EnvironmentMap` con HDR — muy pesado para GPU integrada
- NO usar `postprocessing` de drei
- Usar `ambientLight` + max 2 `directionalLight` — sin más luces
- `autoRotate` para el efecto de flotación

### Fallback / placeholder
Si el GLB no existe en `/public/models/`:
```jsx
function PlaceholderModel({ color = '#888' }) {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}
```

---

## Bloque 5 — Hotspots (45 min)

### Hotspot.jsx
Los hotspots son puntos en coordenadas 3D que se proyectan a 2D usando `useThree`.

```jsx
import { useThree } from '@react-three/fiber'
import { Vector3 } from 'three'

export function Hotspot({ position, label, onClick }) {
  const { camera, size } = useThree()

  // Project 3D position to screen 2D
  const vector = new Vector3(...position)
  vector.project(camera)

  const x = (vector.x * 0.5 + 0.5) * size.width
  const y = (-(vector.y * 0.5) + 0.5) * size.height

  return (
    <div
      className="hotspot-dot"
      style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)' }}
      onClick={() => onClick(label)}
    />
  )
}
```

### Definición de hotspots (/src/data/hotspots.js)
```js
export const HOTSPOTS = {
  fashion: [
    { id: 'upper', label: 'Flyknit upper', description: 'Malla de ingeniería con zonas de soporte específicas.', position: [0.2, 0.8, 0.3] },
    { id: 'sole',  label: 'React foam',   description: '30% más ligera que la espuma convencional.',         position: [0.1, 0.2, 0.4] },
    { id: 'air',   label: 'Zoom Air',     description: 'Cámara de aire presurizado para amortiguación.',     position: [-0.1, 0.1, 0.5] },
  ],
  manufactura: [
    { id: 'engine', label: 'Motor principal', description: '4 cilindros, 2.0L, 180hp.', position: [0, 0.3, 0.5] },
    { id: 'turbo',  label: 'Turbocompresor',  description: 'Aumenta la eficiencia en 40%.',  position: [0.3, 0.4, 0.3] },
  ],
  education: [
    { id: 'skull', label: 'Cráneo', description: 'El cráneo del T-Rex medía hasta 1.5 metros de largo.', position: [0, 0.9, 0.2] },
    { id: 'jaw',   label: 'Mandíbula', description: '60 dientes de hasta 20cm, reemplazados constantemente.', position: [0.2, 0.7, 0.4] },
  ],
}
```

---

## Bloque 6 — Panels y Modals (30 min)

### SlidePanel.jsx
- Posición: `absolute right-0 top-0 bottom-0 width-320px`
- Entra desde la derecha: `transform: translateX(100%)` → `translateX(0)`
- Contenido: título, descripción, botones CTA
- Botón cerrar top-right

### Modal.jsx
- Backdrop: `fixed inset-0 bg-white/75 backdrop-blur-md`
- Modal box: glass card centrado, max-width 420px
- Tipos: 'qr' | 'quote' | 'video'
- QR: imagen de QR placeholder + URL
- Quote: formulario simple (nombre, empresa, email)
- Video: video embed o placeholder

---

## Bloque 7 — Testing en holobox (30 min)

### Preparar el holobox
1. Abrir Chrome en el holobox
2. Navegar a `http://[IP-DEL-MAC]:5173` (misma red local)
3. O hacer deploy a Vercel y abrir la URL

### Hacer Chrome fullscreen en Windows
```
F11 o tecla fullscreen
```

### Verificar en holobox
- [ ] Fondo blanco correcto (no negro)
- [ ] Touch funciona en las cards
- [ ] Touch funciona en los botones laterales
- [ ] OrbitControls responde a touch (drag + pinch)
- [ ] Framerate aceptable (30fps+) con modelo cargado
- [ ] Texto legible desde 1 metro de distancia
- [ ] Hotspots son fáciles de tocar (60x60px mínimo)

---

## Orden de prioridad si el tiempo es limitado

**MVP mínimo para demo:**
1. ✅ Welcome screen con CTA
2. ✅ Menu con 5 cards
3. ✅ Viewer con UN modelo (Fashion — Nike shoe)
4. ✅ OrbitControls funcionando
5. ✅ 2-3 hotspots con tooltip

**Segunda prioridad:**
6. Slide-in panel al tocar hotspot
7. Segundo modelo (Manufactura)
8. Tercer modelo (Education)

**Tercera prioridad:**
9. Modal con QR
10. Auto-rotate desactivado al tocar (reactivar al soltar)
11. Animaciones de transición pulidas

---

## Comandos para el agente

```bash
# Crear proyecto
npm create vite@latest holobox-demo -- --template react && cd holobox-demo

# Instalar dependencias
npm install three @react-three/fiber @react-three/drei

# Dev server
npm run dev

# Build
npm run build

# Deploy
vercel deploy --prod
```

---

## vercel.json
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

---

*Plan de trabajo v1.0 · Holobox Demo · Playground Studio · Julio 2026*
*Hardware target: Intel i5-6500, Intel HD 530, 16GB RAM, Windows 10, Chrome*
