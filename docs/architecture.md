# Architecture

## Stack

-   React
-   Vite
-   Three.js
-   React Three Fiber
-   Drei

## Current Structure

Welcome → Use Case Menu → Viewer

Fashion & Luxury uses a branded viewer.

## Modules

-   Product Switcher
-   ModelCanvas
-   Hotspots
-   Camera Focus
-   Guided Tour
-   More
-   Colorways

## Data

Use Case └── Brand └── Products ├── GLB ├── Hotspots ├── Theme └── More

## Camera

One camera system powers: - manual focus - previous/next - guided tour

## UX

Permanent transparent viewer.

Temporary transitions may use opaque masks but disappear completely.

Left-side floating controls.

2-meter touchscreen optimized.
