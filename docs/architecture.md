# Architecture

## Stack

-   React
-   Vite
-   Three.js
-   React Three Fiber
-   Drei

## Current Structure

Welcome → Use Case Menu → Viewer

Fashion & Luxury uses a branded viewer (FashionViewer).

All other use cases use the generic Viewer.

## Modules

-   Product Switcher
-   ModelCanvas
-   Hotspots
-   Camera Focus
-   Guided Tour
-   More
-   Colorways

## Data

Use Case └── Products ├── Brand ├── GLB path ├── Hotspots ├── Colorways ├── Theme └── More

Brand data is per-product, not per-use-case. Each product carries its
own brand name. The viewer reads brand from the active product, not from
a shared use-case field. This allows multiple brands to appear within a
single use case category (e.g., Nike and Rolex both under Fashion &
Luxury).

## Camera

One camera system powers: - manual focus - previous/next - guided tour

## GLB Lifecycle

1.  useGLTF(path) loads the file on first request and caches the result
    by URL. Subsequent calls with the same URL return the same scene
    object reference from cache.

2.  The Model component clones the cached scene before applying any
    transforms: `gltf.scene.clone(true)`. This produces a new Three.js
    hierarchy that shares geometry and materials with the original but
    has independent transforms.

3.  The clone is reset to identity transforms (position, rotation, scale
    all set to zero/identity, matrixWorld updated) before measurement.

4.  Box3.setFromObject measures the reset clone and computes a uniform
    scale so the longest axis fits within 1.8 units. The clone is
    centered and scaled.

5.  The cached original scene (gltf.scene) is never mutated. This
    guarantees that returning to a previously-loaded model always starts
    normalization from a clean state.

## Product Switching

ModelCanvas receives modelPath as a prop from FashionViewer.

When modelPath changes:

-   checked and modelExists reset to false immediately.
-   A new HEAD request fires with a stale guard (previous response
    ignored if the path changed before it resolved).
-   The Canvas returns null until the check completes, then remounts
    cleanly.
-   Model is keyed by modelPath (key={modelPath}), so each path change
    forces a new Model instance. useMemo inside Model creates a fresh
    clone from the cached scene.

This sequence ensures every product switch starts with a clean clone and
a correct normalization — regardless of how many times the user switches
between the same products.

## Brand Logo System

`brand` in usecases.js carries three fields: `name`, `logo`, `logoAlt`.

`FashionViewer` renders `<BrandLogo brand={product.brand} />` in the header.

- If `brand.logo` is set, an `<img>` is rendered with `objectFit: contain`, max 120×32px.
- If the image fails to load (`onError`), the component falls back to `brand.name` text.
- If `brand.logo` is null/undefined, the text fallback renders immediately.

Placeholder SVG wordmarks live in `/public/brands/`. Replace with real PNGs by
updating the `logo` path in usecases.js — no viewer code changes required.

## UX

Permanent transparent viewer.

Temporary transitions may use opaque masks but disappear completely.

Left-side floating controls.

2-meter touchscreen optimized.

## Multi-Part Product Configuration

Some products consist of many independent GLB files assembled at runtime
rather than a single monolithic model (e.g. the Ferrari F2007, which has
21 part files).

Configuration pattern in `src/data/<product>.js`:

```js
export const PRODUCT = {
  id: 'ferrari-f2007',
  label: 'Ferrari F2007',
  basePath: '/models/automotive/ferrari-f2007/',
  parts: {
    body:       ['FerrariF2007_BODY5_HI.glb', 'FerrariF2007_BODY6_HI.glb'],
    aero:       ['FerrariF2007_FWING.glb', 'FerrariF2007_RWING.glb'],
    tires:      ['FerrariF2007_TireFL.glb', 'FerrariF2007_TireFR.glb',
                 'FerrariF2007_TireRL.glb', 'FerrariF2007_TireRR.glb'],
    suspension: ['FerrariF2007_SuspFL.glb', 'FerrariF2007_SuspFR.glb',
                 'FerrariF2007_SuspRL.glb', 'FerrariF2007_SuspRR.glb'],
    brakes:     ['FerrariF2007_BrakeFL.glb', 'FerrariF2007_BrakeFR.glb',
                 'FerrariF2007_BrakeRL.glb', 'FerrariF2007_BrakeRR.glb'],
    covers:     ['FerrariF2007_RCoverFL.glb', 'FerrariF2007_RCoverFR.glb',
                 'FerrariF2007_RCoverRL.glb', 'FerrariF2007_RCoverRR.glb'],
    steering:   ['FerrariF2007_Swheel.glb'],
  },
}
```

The viewer for multi-part products will load each GLB independently and
position parts in the same coordinate space. This allows selective
show/hide per group (e.g. hide covers to reveal brakes) without
re-loading files already in cache.

No viewer has been built for this format yet. The data files establish
the naming contract so the viewer can be implemented against a stable
manifest.
