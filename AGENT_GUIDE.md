# HoloExperience — Agent Guide

## 1. Purpose

This file is the permanent operating guide for any coding agent working on the HoloExperience / Product Explorer repository.

Read this file before making changes.

Do not treat this document as a one-time prompt.

The repository should evolve incrementally from a working sales demo into a reusable product system.

---

# 2. Current Product Direction

## Product Family

**HoloExperience**

Interactive holographic experiences for products, brands and live events.

The current repository focuses on:

**Product Explorer**

The goal is to let users physically explore products through a holographic touchscreen experience.

---

# 3. Core Principle

> Shared platform underneath. Branded world on top.

Every experience must feel like entering the client or product brand.

The visible experience should never feel like a generic Playground template with a logo placed on top.

Brand-specific experiences may use different:

- typography
- colors
- layout
- motion
- UI treatment
- imagery
- content hierarchy
- interaction modules

The underlying technical system should remain reusable.

---

# 4. Current Repository Role

Repository:

`Playground-Studio-Pro/holobox-demo`

Current role:

**HoloExperience Product Explorer Demo**

Current stack:

- React
- Vite
- Three.js
- React Three Fiber
- Drei

Do not migrate frameworks.

Do not rebuild the application.

---

# 5. Current Architecture

Current top-level flow:

```text
Welcome
↓
Use Case Menu
↓
Viewer
```

Current viewer strategy:

```text
Generic Viewer
├── Manufacturing
├── Premium Drinks
└── Education

Branded Viewer
└── Fashion & Luxury
```

Fashion currently uses a dedicated branded viewer.

This is acceptable during discovery.

Do not force every use case into one universal UI before the reusable patterns are proven.

---

# 6. Experience Principle

Product exploration is the default state.

There should not be a redundant "Explore" mode.

When a product loads, the user should immediately be able to:

- rotate
- zoom
- inspect

Additional modules are added only when they create meaningful value.

Examples:

```text
Sneaker
- Hotspots
- Guided Tour
- Colorways
- More / QR

Watch
- Hotspots
- Guided Tour
- Variants
- More / QR

Engine
- Hotspots
- Guided Tour
- Exploded View
- Deep Zoom
- More / QR

Education
- Hotspots
- Mega Zoom
- Guided Focus
```

Do not force all products to use the same modules.

---

# 7. Branding Spaces

Every branded experience should define explicit branding surfaces.

## Primary Branding Surfaces

### Entry / Product Header

Should support:

- brand logo or wordmark
- product name
- tagline
- product family

### Viewer Environment

Should support:

- background treatment
- interface color palette
- typography
- overlays
- labels
- branded microcopy

### Product Navigation

Should support:

- multiple products within the same brand universe
- product switcher
- variant or colorway switcher

### Product Information

Should support:

- branded tone of voice
- product-specific technology language
- technical storytelling

### More / Mobile Handoff

Should support:

- branded QR
- product landing page
- CTA
- brand URL
- product URL

### Optional Media

Should support:

- guided tour
- product film
- campaign content

---

# 8. Fashion & Luxury Direction

Fashion & Luxury should become a branded product universe, not a single sneaker page.

Current brand:

**AERO/01**

Current product:

**AERO/01 Performance Runner**

Planned additional product:

**AERO/01 Watch**

The Fashion & Luxury viewer should support multiple products from the same brand universe.

Example:

```text
AERO/01
├── Performance Runner
└── Precision Watch
```

The product switcher should appear at the top of the experience.

The user should be able to switch GLB products without leaving the branded world.

---

# 9. Product Switcher

Add a product selector at the top of branded experiences.

Example:

```text
[ PERFORMANCE RUNNER ]   [ PRECISION WATCH ]
```

Requirements:

- visible but minimal
- touch-friendly
- clearly indicates active product
- changes the active GLB
- updates hotspots
- updates brand/product copy
- updates available modules
- does not require leaving the viewer

The system should be data-driven.

Recommended structure:

```js
products: [
  {
    id: "runner",
    label: "Performance Runner",
    model: "/models/aero-runner-white.glb",
    hotspots: [...],
    modules: [...]
  },
  {
    id: "watch",
    label: "Precision Watch",
    model: "/models/aero-watch.glb",
    hotspots: [...],
    modules: [...]
  }
]
```

Do not hardcode product-specific UI logic inside shared components.

---

# 10. Avoid Product-Specific Hardcoding in Shared Components

Shared components should not contain AERO/01-specific arrays, copy or logic.

Avoid:

```js
const FASHION_TECHNOLOGIES = [...]
```

inside a shared `Modal.jsx`.

Instead, product content should live in product or use-case configuration.

Preferred:

```js
useCase.brand
useCase.products
useCase.more
useCase.modules
```

Example:

```js
{
  id: "fashion",
  brand: {
    name: "AERO/01",
    tagline: "ENGINEERED FOR MOVEMENT"
  },
  products: [...],
  more: {
    title: "...",
    technologies: [...],
    primaryCta: {...},
    secondaryCta: {...}
  }
}
```

Shared components should render supplied data.

They should not know which brand is active.

---

# 11. Hotspot Data Model

Hotspots should support rich product storytelling.

Recommended schema:

```js
{
  id,
  eyebrow,
  label,
  description,
  specs: [],
  position,
  camera: {
    position: [x, y, z],
    target: [x, y, z]
  }
}
```

Optional future fields:

```js
next
previous
media
```

Do not overengineer beyond the current use case.

---

# 12. Hotspot Focus Behavior

When a hotspot is selected:

1. Disable free auto-rotation.
2. Animate the camera to the hotspot's defined camera position.
3. Animate the orbit target to the hotspot's defined target.
4. Lock the camera at the focused position.
5. Show the hotspot content card.
6. Make the close button visually obvious.

The user should understand:

> I am now inside a focused product detail.

When the user closes the hotspot:

1. Close the content card.
2. Animate back to the default hero camera.
3. Restore normal product exploration.
4. Restore auto-rotation if appropriate.

Do not instantly teleport the camera.

Camera movement should feel intentional and premium.

---

# 13. Movement Between Hotspots

Preferred behavior:

```text
Tap hotspot
↓
Camera moves to focus
↓
Content appears
↓
User can:
- Close
- Go to Previous
- Go to Next
```

The system should support a guided sequential journey.

Recommended controls:

```text
← PREVIOUS     02 / 04     NEXT →
```

When Next or Previous is selected:

1. Keep the experience in focused mode.
2. Animate camera from the current focus to the next hotspot camera.
3. Update the hotspot content only after or during the camera transition.
4. Avoid returning to the hero camera between hotspots.

This creates a guided product tour without requiring a separate rendered video.

---

# 14. Guided Tour

The Tour module should eventually use the same hotspot camera system.

Recommended sequence:

```text
Hero Camera
↓
Hotspot 1
↓
Hotspot 2
↓
Hotspot 3
↓
Hotspot 4
↓
Final Hero Camera
```

This allows one camera system to power:

- manual hotspot focus
- previous / next navigation
- automated guided tour

Do not build separate camera logic for each feature.

Reuse the same camera states.

---

# 15. Camera Architecture

The current `ModelCanvas` owns OrbitControls.

Future camera focus behavior should remain controlled close to the 3D viewer.

Recommended concept:

```text
ModelCanvas
├── activeCameraState
├── heroCamera
├── focusCamera
└── transition logic
```

Possible implementation approach:

- store OrbitControls ref
- store camera ref
- interpolate camera position
- interpolate controls target
- temporarily disable user controls during transition
- re-enable controls only in hero/free mode

Do not introduce a heavy animation library unless necessary.

Use the existing Three.js render loop when practical.

---

# 16. Fashion & Luxury Product Set

## Product 1 — Performance Runner

Current modules:

- free exploration
- four technical hotspots
- guided focus
- hotspot next / previous
- three GLB colorways
- More / QR

## Product 2 — Precision Watch

Planned modules:

- free exploration
- technical hotspots
- guided focus
- product variants if assets are available
- More / QR

Suggested watch hotspots:

- Case Construction
- Crown / Controls
- Dial / Display
- Strap / Material

Exact copy should be defined when the GLB is selected.

---

# 17. Sneaker Assets Required

Minimum assets:

1. Three sneaker GLB files.
2. One current AERO/01 wordmark or text treatment.
3. Four hotspot definitions.
4. One landing page.
5. One QR destination.
6. Optional premium product film later.

No Blender requirement for V1.

Use multiple GLB files for colorways.

---

# 18. Watch Assets Required

Minimum assets:

1. One watch GLB.
2. Four hotspot definitions.
3. Product name.
4. Product tagline.
5. Product landing URL.

Optional:

- multiple watch variants
- premium product film

---

# 19. QR and Landing Pages

QR codes must be functional.

Do not use decorative QR illustrations for sales-ready experiences.

The QR should lead to a real local, staging or production URL.

The landing page should be:

- mobile-first
- product-specific
- brand-specific
- extremely simple
- fast to load

The purpose is to demonstrate mobile handoff.

---

# 20. Shared Components

Reusable interaction patterns should become shared components only when proven.

Potential shared modules:

```text
ProductSwitcher
VariantSwitcher
HotspotFocus
HotspotNavigation
GuidedTour
MorePanel
QrHandoff
```

Do not extract components merely to reduce line count.

Extract when behavior is genuinely reused.

---

# 21. Development Philosophy

## Demo First

Build what helps sell.

## Product Minded

Reuse proven modules.

## No Unnecessary Refactors

Do not clean code solely for elegance while active features are being defined.

## Preserve Working Functionality

Do not break other use cases.

## Small Controlled Changes

Prefer incremental commits.

---

# 22. Current Priority

Current development focus:

**Fashion & Luxury Product System**

Immediate sequence:

1. Move AERO/01-specific content out of shared modal logic.
2. Add top-level product switcher.
3. Prepare Fashion & Luxury for sneaker + watch.
4. Add hotspot camera states.
5. Add hotspot focus transitions.
6. Add Previous / Next hotspot navigation.
7. Reuse hotspot camera states for Guided Tour.
8. Make QR functional.
9. Add mobile landing page.

---

# 23. Definition of Done — Current Sprint

The current Fashion & Luxury system is successful when:

- AERO/01 feels like a distinct branded world.
- The user can switch between sneaker and watch.
- Each product loads its own GLB and hotspot data.
- Clicking a hotspot moves to a deliberate fixed camera angle.
- The user understands they are in focus mode.
- Closing focus returns to the hero product view.
- The user can move directly between hotspots.
- The experience can later reuse the same camera states for a guided tour.
- AERO/01-specific content is stored in product configuration, not shared UI components.
- The QR links to a real landing page.
- Other use cases remain functional.

---

# 24. Do Not Build Yet

Do not build:

- backend
- CMS
- authentication
- analytics platform
- AI
- live connection
- falso vivo
- kiosk
- hotspot editor
- universal theme engine
- multi-tenant platform

---

# 25. Agent Workflow

Before modifying code:

1. Read this file.
2. Inspect the current repository.
3. Identify the current task.
4. Identify affected files.
5. Preserve unrelated functionality.
6. Implement the smallest clean solution.
7. Commit with a clear message.

When receiving a new task, the task prompt can be short.

Example:

> Read `AGENT_GUIDE.md`.
> Current task: implement hotspot camera focus and next/previous navigation for the Fashion & Luxury viewer.

This guide provides the persistent context.

---

# 26. Current Working Principle

> Build compelling branded experiences first.

> Extract the reusable product system from the patterns that prove useful.
