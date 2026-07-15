# CLAUDE.md — Holobox Interactive Demo
# Playground Studio · Julio 2026

## Qué es este proyecto

App web fullscreen que corre en el browser del holobox (Windows 10, Chrome fullscreen).
Muestra un hub de demos 3D interactivos para diferentes verticales de industria.
El holobox es una pantalla LCD transparente de 65"+ con fondo blanco — los modelos flotan visualmente.
Touch nativo en pantalla. Resolución 4K (3840x2160).

## Objetivo del día

Tener un demo funcional con al menos 3 use cases corriendo en el holobox físico:
- Fashion & Luxury (Nike shoe GLB)
- Manufactura (motor/turbina GLB)
- Education & Discovery (T-Rex GLB)

## Hardware del holobox

- **Máquina:** ELSKY QM3600
- **OS:** Windows 10 Pro 22H2
- **CPU:** Intel Core i5-6500 @ 3.2GHz, 4 cores
- **RAM:** 16GB Samsung DDR4 2667MHz
- **GPU:** Intel HD Graphics 530 (1GB VRAM, integrada — NO dedicada)
- **Display:** 3840x2160 (4K), orientación portrait
- **Touch:** HID touch screen nativo ✅
- **Cámara:** HK 4K Webcam K80 (USB)
- **Micrófonos:** USB Audio Device, HK Webcam mic, HK USB REF (usar este último)
- **Bocinas:** USB Audio Device
- **Red:** Ethernet activo (172.16.9.10) + WiFi 6 AX200 disponible
- **Zona horaria:** ⚠️ UTC+1 (Madrid) — cambiar a UTC-6 (CDMX) antes de producción

## Restricciones técnicas críticas

- GPU integrada Intel HD 530 — NO usar Three.js con modelos pesados o muchas luces
- GLB máximo 5MB por modelo, textura 1k
- Sin postprocessing ni shaders complejos — framerate primero
- Browser: Chrome en modo kiosk fullscreen
- Touch targets mínimo 60x60px — pantalla grande, dedos grandes
- Fondo siempre blanco o transparente — NUNCA negro o dark

## Stack técnico

- React + Vite (no TypeScript)
- Three.js + @react-three/fiber + @react-three/drei
- OrbitControls para rotate/zoom con touch
- Raycasting para hotspots anclados al modelo 3D
- CSS puro para UI (no Tailwind)
- Deploy: Vercel

## Estructura de navegación

3 pantallas, navegación por useState (sin React Router, sin page reload):

```
'welcome' → 'menu' → 'viewer'
```

- **welcome:** logo + tagline + CTA button, video de fondo reemplazable
- **menu:** grid 3x2 de cards glass, 5 use cases (sin Real Estate — proyecto separado)
- **viewer:** modelo 3D + hotspots + botones laterales + modals

## Use cases del menú (5 en total)

| ID | Label | Emoji | Subtitle | Contenido |
|---|---|---|---|---|
| fashion | Fashion & Luxury | 👗 | Sneakers · Watches · Apparel | GLB — Nike shoe, Rolex |
| manufactura | Manufactura | ⚙️ | Engine · Turbine · Machinery | GLB — motor, turbina |
| drinks | Premium Drinks | 🥃 | Spirits · Wine · Consumer | GLB — botella premium |
| education | Education & Discovery | 🦕 | Dinosaurs · Anatomy · Space | GLB — T-Rex, planetas |
| avatar | AI Avatar Kiosk | 🤖 | Interactive host · Voice AI | Componente separado |

Real Estate es proyecto independiente — NO incluir en este menú.

## Viewer — pantalla 3D

Layout de 3 columnas:

```
[Left buttons] [3D Model centered + floating] [Right buttons]
```

**Botones izquierda (contenido):**
- 🔍 Detail
- 📋 Specs  
- 🎨 Colors / Variants

**Botones derecha (conversión):**
- 💬 Info
- 📱 QR
- 📩 Quote

**Interacción 3D:**
- OrbitControls: drag para rotar, pinch para zoom, doble tap para reset
- Hotspots: puntos pulsantes anclados a la superficie del modelo
- Tap hotspot → tooltip → tap de nuevo → slide-in panel desde la derecha
- Botón Quote / QR → modal fullscreen

**Drop shadow:**
Elipse difuminada debajo del modelo para efecto de flotación.
`background: radial-gradient(ellipse, rgba(0,0,0,0.10) 0%, transparent 70%)`

## Patrones de interacción (cascada)

1. **Tooltip** — aparece al tocar hotspot. Nombre del componente. CSS puro, rápido.
2. **Slide-in panel** — drawer desde la derecha. Modelo sigue visible a la izquierda. Título + descripción + CTA buttons.
3. **Modal** — fullscreen overlay. Para video, QR code, formulario de contacto.

## Modelos 3D

Ubicación: `/public/models/`

| Archivo | Use case | Fuente |
|---|---|---|
| nike-shoe.glb | Fashion | Sketchfab (CC Attribution, quaz30) |
| motor.glb | Manufactura | GrabCAD |
| trex.glb | Education | Sketchfab / free |
| rolex.glb | Luxury | Sketchfab |
| bottle.glb | Drinks | Sketchfab |

Si el modelo no existe aún, usar un placeholder box de Three.js con el color del vertical.

## Hotspot data por use case

Definidos en `/src/data/hotspots.js` — array de objetos con:
```js
{
  id: 'sole',
  label: 'React foam',
  description: '30% más ligera que la espuma convencional.',
  position: [x, y, z], // coordenadas en el espacio 3D
  cta: { label: 'Ver specs', url: '#' }
}
```

## Configuración por cliente

Todo lo que cambia por cliente vive en `/src/config/client.js`:
```js
export const CLIENT = {
  name: 'Demo — Playground Studio',
  logo: null, // path a imagen o null para texto
  tagline: 'Interactive 3D Experience Platform',
  bgVideo: null, // path a video de fondo en home o null
  accentColor: '#1a1a1a',
}
```

## Comandos

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Deploy
vercel deploy --prod
```

## Lo que NO hacer

- NO usar fondos oscuros o negros en ninguna pantalla
- NO cargar modelos GLB mayores a 5MB
- NO usar postprocessing de Three.js (EnvironmentMap pesado, SSAO, bloom)
- NO usar React Router — solo useState
- NO TypeScript
- NO Tailwind — CSS puro con variables CSS
- NO font-size menores a 12px en UI — pantalla grande, distancia de visualización
- NO touch targets menores a 60x60px
- NO requerir internet para la demo — los modelos deben estar en /public/models/

## Performance target

- First load: < 3 segundos en la máquina del holobox
- FPS con modelo en pantalla: 30fps mínimo en Intel HD 530
- Transición entre pantallas: < 300ms
