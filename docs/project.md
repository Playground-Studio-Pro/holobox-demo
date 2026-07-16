# HoloExperience Project

## Vision

HoloExperience is a platform for interactive holographic product
experiences running inside physical Holobox installations.

## Product Family

### HoloExperience

Interactive Product Explorer for: - Trade shows - Retail - Museums -
Brand activations - Education - Manufacturing

### HoloHost (future)

AI avatar platform for: - Concierge - Reception - Sales - Customer
support - Event host

## Core Principle

Shared platform underneath. Branded world on top.

Every experience must feel like entering the client's brand.

## Physical First

The Holobox itself is part of the experience.

The software never replaces the physical stage.

Permanent viewer background is transparent.

## Current Demo Brands

The platform is brand-agnostic. The following are demonstration assets
used to help clients immediately understand how the Product Explorer
adapts to recognizable brand identities.

Nike
- Performance Sneaker

Rolex
- Luxury Watch

Any client brand can replace these assets without changing the shared
viewer architecture. Brand data lives entirely in configuration.

## Current Goal

Build a sales-ready Product Explorer before expanding into AI and
HoloHost.

## Shared Experience Framework

Not every project uses every stage. Skip stages that add no value.

```
Idle → Attract → Engage → Experience → Conversation / Interaction
→ CTA → Lead / QR / Next Step → Reset
```

## Key Strategic Risks

1. **Selling hardware instead of outcomes.** Position as "we create interactive
   holographic experiences" — not "we rent holographic displays."

2. **Building too many weak demos.** One polished demo creates more value than
   several incomplete experiences.

3. **3D as a gimmick.** A rotating object is not enough. The experience must
   reveal, explain, transform, animate, compare or extend.

4. **Overbuilding the platform.** Do not delay sales waiting for perfect
   architecture. Build reusable modules when use cases prove their value.

5. **Sales team confusion.** Give the team clear products, clear use cases,
   clear client triggers, clear discovery questions, and clear demo scripts.

## Definition of Success

The project is successful when:

1. A salesperson can explain the product without Miguel being present.
2. A client immediately recognizes at least one relevant application.
3. The Holobox demonstrates multiple use cases.
4. New client projects reuse existing modules without rebuilding.
5. A demo can evolve into a paid deployment without rebuilding everything.
6. Playground is perceived as an experiential technology partner, not a
   hardware rental company.

## Automotive Demo — Ferrari F2007

Multi-part 3D model: 21 independent GLB files.

Asset path: `/public/models/automotive/ferrari-f2007/`

Configuration: `src/data/ferrariF2007.js`

Parts grouped by functional category:

| Group      | Files |
|-----------|-------|
| body      | BODY5\_HI, BODY6\_HI |
| aero      | FWING, RWING |
| tires     | TireFL, TireFR, TireRL, TireRR |
| suspension| SuspFL, SuspFR, SuspRL, SuspRR |
| brakes    | BrakeFL, BrakeFR, BrakeRL, BrakeRR |
| covers    | RCoverFL, RCoverFR, RCoverRL, RCoverRR |
| steering  | Swheel |

The viewer for this product has not been built yet. The data file
defines the part manifest only — no hotspots, no cameras, no exploded
positions.
