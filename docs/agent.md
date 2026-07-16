# Agent Guide

## Role

You are the implementation engineer.

Read this file before every task.

## Rules

-   Preserve working functionality.
-   Make incremental changes.
-   Do not rebuild.
-   Do not migrate frameworks.
-   Keep React + Vite + React Three Fiber.

## Product Principles

-   Shared platform underneath.
-   Branded world on top.
-   Physical-first UX.
-   Transparent permanent stage.
-   Product is always the hero.

## UI Principles

-   Floating interface.
-   Large touch targets.
-   Minimal UI.
-   Product-specific branding.
-   No permanent scene backgrounds.

## Architecture Rules

Do not hardcode product content into shared components.

Brand data belongs in configuration (usecases.js), not in viewer code.

Demo branding must be configuration-driven. Nike and Rolex are demo
assets defined in usecases.js. The viewer components (FashionViewer,
ModelCanvas, Modal) must read brand from product data — never from
hardcoded strings.

Reuse camera states for: - hotspot focus - next/previous - guided tour

## GLB Scene Rule

Never mutate the scene object returned by useGLTF directly.

useGLTF caches scene objects by URL. If scene.scale, scene.position, or
scene.rotation are modified on the cached object, the second visit to
the same model receives an already-transformed scene. Measuring a
pre-scaled scene produces a compounding (wrong) transform — the model
disappears or becomes miniature.

Always clone the scene before applying any transforms:

    const model = useMemo(() => gltf.scene.clone(true), [gltf.scene])

Normalize only the clone. Never touch gltf.scene.

## Workflow

1.  Read documentation.
2.  Inspect code.
3.  Explain implementation.
4.  Identify files.
5.  Implement.
6.  Build.
7.  Summarize changes.

## Demo Assets

Current demonstration products use recognizable consumer brands to
showcase the platform's capabilities.

Current demo set:

- Nike Performance Sneaker
- Rolex Luxury Watch

These brands are demonstration assets only.

The platform itself is completely brand-agnostic.

Any client brand should be able to replace these assets without changing
the underlying architecture.

## Branding Surfaces

Every branded experience defines explicit surfaces where brand identity
appears.

**Entry / Product Header** — brand logo or wordmark, product name, tagline,
product family.

**Viewer Environment** — background treatment, interface color palette,
typography, overlays, labels, branded microcopy.

**Product Navigation** — multiple products within the same brand universe,
product switcher, variant or colorway switcher.

**Product Information** — branded tone of voice, product-specific technology
language, technical storytelling.

**More / Mobile Handoff** — branded QR, product landing page, CTA, brand URL,
product URL.

**Optional Media** — guided tour, product film, campaign content.

## Per-Product Modules

Not all products expose the same modules. Add a module only when it creates
meaningful value for that product.

```
Sneaker   — hotspots · guided focus · hotspot next/prev · colorways · More/QR
Watch     — hotspots · guided focus · variants · More/QR
Engine    — hotspots · guided focus · exploded view · deep zoom · More/QR
Education — hotspots · mega zoom · guided focus
```

## Do Not Build

Do not build until a use case proves the need:

backend · CMS · authentication · analytics platform · AI · live connection ·
falso vivo · kiosk · hotspot editor · universal theme engine · multi-tenant
platform
