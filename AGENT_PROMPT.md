# AGENT PROMPT — Holobox Interactive Demo
# Pega esto completo en Claude Code para arrancar el proyecto

---

Read CLAUDE.md and DESIGN.md in the project root before writing any code.
Build a fullscreen interactive 3D demo app for a holobox display.

## Hardware target
- Windows 10, Intel i5-6500, Intel HD Graphics 530 (integrated, 1GB VRAM), 16GB RAM
- Display: 4K portrait (3840x2160), white background, native touch
- Browser: Chrome fullscreen
- Performance requirement: 30fps minimum with GLB model loaded

## Stack
React + Vite (no TypeScript). Three.js + @react-three/fiber + @react-three/drei. Pure CSS (no Tailwind). Deploy: Vercel.

## Project structure to create

```
holobox-demo/
├── public/
│   └── models/           ← empty, GLBs will be added manually
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── config/
│   │   └── client.js
│   ├── data/
│   │   ├── usecases.js
│   │   └── hotspots.js
│   ├── screens/
│   │   ├── Welcome.jsx
│   │   ├── Menu.jsx
│   │   └── Viewer.jsx
│   ├── components/
│   │   ├── ModelCanvas.jsx
│   │   ├── Hotspot.jsx
│   │   ├── SideButtons.jsx
│   │   ├── SlidePanel.jsx
│   │   └── Modal.jsx
│   └── styles/
│       └── design-system.css
├── index.html
├── vercel.json
├── CLAUDE.md
└── DESIGN.md
```

## Navigation
useState only — no React Router. Three screens: 'welcome' | 'menu' | 'viewer'.

## Design system (from DESIGN.md)

Background always white (#ffffff). Everything glass on white. Never dark backgrounds.

Fonts — add to index.html head:
```html
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
```

CSS variables in design-system.css:
```css
:root {
  --bg-base: #ffffff;
  --bg-surface: rgba(255,255,255,0.85);
  --text-primary: rgba(0,0,0,0.82);
  --text-secondary: rgba(0,0,0,0.50);
  --text-tertiary: rgba(0,0,0,0.28);
  --border-subtle: rgba(0,0,0,0.05);
  --border-mid: rgba(0,0,0,0.08);
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #ffffff; font-family: 'DM Sans', sans-serif; overflow: hidden; width: 100vw; height: 100dvh; }
.app { width: 100vw; height: 100dvh; background: #ffffff; overflow: hidden; position: relative; }
```

Glass button — primary CTA:
```css
.btn-primary {
  background: linear-gradient(180deg, #ffffff 0%, #e8e8e8 100%);
  border: none; border-radius: 100px; padding: 15px 44px;
  font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
  color: rgba(0,0,0,0.75); cursor: pointer;
  box-shadow: 0 1px 0 rgba(255,255,255,1) inset, 0 -1px 0 rgba(0,0,0,0.07) inset, 0 4px 16px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.05);
  transition: all 0.2s ease;
}
.btn-primary:hover { transform: translateY(-1px); }
.btn-primary:active { transform: scale(0.97); }
```

Ghost button — viewer side buttons:
```css
.btn-ghost {
  background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(240,242,248,0.90) 100%);
  border: none; border-radius: 14px; padding: 12px;
  min-width: 64px; min-height: 64px;
  font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 500;
  color: rgba(0,0,0,0.55); cursor: pointer;
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  box-shadow: 0 1px 0 rgba(255,255,255,1) inset, 0 -1px 0 rgba(0,0,0,0.06) inset, 0 2px 8px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04);
  transition: all 0.2s ease;
}
.btn-ghost:hover { transform: translateY(-1px); color: rgba(0,0,0,0.75); }
```

Category card:
```css
.category-card {
  background: linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(238,241,250,0.80) 100%);
  border: none; border-radius: 20px; padding: 28px 16px 24px;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  cursor: pointer; position: relative; overflow: hidden;
  box-shadow: 0 1px 0 rgba(255,255,255,1) inset, 0 -1px 0 rgba(0,0,0,0.04) inset, 0 4px 16px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04);
  transition: all 0.28s cubic-bezier(0.34,1.56,0.64,1);
  opacity: 0; transform: translateY(14px);
  animation: cardIn 0.4s ease forwards;
}
.category-card::after { content:''; position:absolute; top:0; left:10%; right:10%; height:1px; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.95),transparent); }
.category-card:hover { transform: translateY(-4px) scale(1.03); }
.category-card:active { transform: scale(0.97); }
@keyframes cardIn { to { opacity:1; transform:translateY(0); } }
```

## Screen 1 — Welcome

Fullscreen white. Centered vertically.
- Optional video background: `<video autoplay loop muted playsinline>` with opacity 0.35, position absolute, object-fit cover, z-index 0
- Logo: text "HOLOBOX" in Syne 800, 64px, letter-spacing 0.12em, z-index 1
- Tagline: "Interactive 3D Experience Platform" in DM Sans 300, 13px, color rgba(0,0,0,0.35)
- CTA: .btn-primary "Explore Demo →" → setScreen('menu')

## Screen 2 — Menu

Header (60px, glass backdrop-filter blur): Back button left | "Select Experience" title center (Syne 700 15px).
Grid 3x2 of category cards below.

Use cases data in /src/data/usecases.js:
```js
export const USE_CASES = [
  { id: 'fashion',     label: 'Fashion & Luxury',       emoji: '👗', sub: 'Sneakers · Watches · Apparel', model: '/models/nike-shoe.glb',  color: '#f0ede8' },
  { id: 'manufactura', label: 'Manufactura',             emoji: '⚙️', sub: 'Engine · Turbine · Machinery', model: '/models/engine.glb',     color: '#e8edf0' },
  { id: 'drinks',      label: 'Premium Drinks',          emoji: '🥃', sub: 'Spirits · Wine · Consumer',    model: '/models/bottle.glb',     color: '#f0ece8' },
  { id: 'education',   label: 'Education & Discovery',   emoji: '🦕', sub: 'Dinosaurs · Anatomy · Space',  model: '/models/trex.glb',       color: '#e8f0eb' },
  { id: 'avatar',      label: 'AI Avatar Kiosk',         emoji: '🤖', sub: 'Interactive host · Voice AI',  model: null,                     color: '#e8ecf5' },
]
```

Cards stagger: animation-delay of 0.05s * index.
Click card → setSelectedUseCase(usecase) + setScreen('viewer').

## Screen 3 — Viewer

Header same as menu. Back → setScreen('menu').
Layout: 3 columns — [72px left] [flex-1 canvas] [72px right].

Left buttons (content):
```jsx
[{ icon: '🔍', label: 'Detail' }, { icon: '📋', label: 'Specs' }, { icon: '🎨', label: 'Colors' }]
```

Right buttons (conversion):
```jsx
[{ icon: '💬', label: 'Info' }, { icon: '📱', label: 'QR' }, { icon: '📩', label: 'Quote' }]
```

Button click → open SlidePanel with relevant content OR open Modal for QR/Quote.

## ModelCanvas.jsx — CRITICAL performance rules for Intel HD 530

```jsx
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'
import { Suspense, useEffect } from 'react'

function Model({ path }) {
  const { scene } = useGLTF(path)
  return <primitive object={scene} dispose={null} />
}

function PlaceholderModel({ color }) {
  return (
    <mesh>
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      <meshStandardMaterial color={color || '#cccccc'} />
    </mesh>
  )
}

export default function ModelCanvas({ modelPath, placeholderColor }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
        dpr={[1, 1.5]}
        frameloop="demand"
      >
        {/* Minimal lighting for Intel HD 530 */}
        <ambientLight intensity={1.0} />
        <directionalLight position={[3, 5, 3]} intensity={0.8} />
        <directionalLight position={[-3, 2, -3]} intensity={0.3} />

        <Suspense fallback={null}>
          {modelPath ? (
            <Model path={modelPath} />
          ) : (
            <PlaceholderModel color={placeholderColor} />
          )}
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={1.5}
          maxDistance={6}
          autoRotate
          autoRotateSpeed={0.8}
          touches={{ ONE: 1, TWO: 2 }}
        />
      </Canvas>

      {/* Drop shadow */}
      <div style={{
        position: 'absolute', bottom: '10%', left: '50%',
        transform: 'translateX(-50%)',
        width: '200px', height: '16px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(0,0,0,0.10) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
    </div>
  )
}
```

NEVER use: EnvironmentMap, SSAO, bloom, heavy postprocessing, HDR textures.
ALWAYS use: `dpr={[1, 1.5]}` to limit pixel ratio, `frameloop="demand"` for battery/performance.

## SlidePanel.jsx

Slides in from right, 320px wide, glass.
Props: `open`, `onClose`, `title`, `description`, `cta`.

```css
.slide-panel {
  position: absolute; top: 0; right: 0; bottom: 0; width: 320px;
  background: rgba(255,255,255,0.92); backdrop-filter: blur(20px);
  border-left: 1px solid rgba(0,0,0,0.06);
  padding: 28px 20px; z-index: 10;
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
}
.slide-panel.open { transform: translateX(0); }
```

## Modal.jsx

Fullscreen overlay for QR and Quote.
Types: 'qr' | 'quote'.

QR modal: show a large QR placeholder + URL text + "Scan with your phone".
Quote modal: name field + company field + email field + submit button.

```css
.modal-backdrop {
  position: fixed; inset: 0; z-index: 50;
  background: rgba(255,255,255,0.80); backdrop-filter: blur(12px);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 0.2s ease;
}
.modal-backdrop.show { opacity: 1; }
.modal-box {
  background: rgba(255,255,255,0.95); border-radius: 24px;
  padding: 36px; max-width: 420px; width: 90%;
  box-shadow: 0 1px 0 rgba(255,255,255,1) inset, 0 24px 64px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.06);
  transform: scale(0.94); transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
}
.modal-backdrop.show .modal-box { transform: scale(1); }
```

## vercel.json
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

## After scaffolding

Run:
```bash
npm install
npm run dev
```

App should load at localhost:5173 showing the white welcome screen with HOLOBOX text and CTA button.
Do not ask for clarification. Build everything now. Make reasonable decisions.
If a GLB model file doesn't exist at its path, use PlaceholderModel with the use case color.
