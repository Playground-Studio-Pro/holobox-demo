export const USE_CASES = [
  {
    id: 'fashion',
    label: 'Fashion & Luxury',
    emoji: '👗',
    sub: 'Sneakers · Watches · Apparel',
    // Primary model — the working GLB. ModelCanvas falls back to placeholder if absent.
    model: '/models/nike-shoe.glb',
    color: '#f0ede8',
    placeholderColor: '#c8b8a8',
    // AERO/01 brand identity — only used by FashionViewer
    brand: {
      name: 'AERO/01',
      product: 'PERFORMANCE RUNNER',
      tagline: 'ENGINEERED FOR MOVEMENT',
    },
    // Three GLB colorways. Only the first one currently exists.
    // Add GLB files to /public/models/ to unlock additional colorways.
    colorways: [
      { id: 'original', label: 'Original', color: '#c8b4a0', path: '/models/nike-shoe.glb' },
      { id: 'black',    label: 'Black',    color: '#1a1a1a', path: '/models/sneaker-black.glb' },
      { id: 'accent',   label: 'Accent',   color: '#d64f2a', path: '/models/sneaker-accent.glb' },
    ],
  },
  {
    id: 'manufactura',
    label: 'Manufactura',
    emoji: '⚙️',
    sub: 'Engine · Turbine · Machinery',
    model: '/models/engine.glb',
    color: '#e8edf0',
    placeholderColor: '#8a9aaa',
  },
  {
    id: 'drinks',
    label: 'Premium Drinks',
    emoji: '🥃',
    sub: 'Spirits · Wine · Consumer',
    model: '/models/bottle.glb',
    color: '#f0ece8',
    placeholderColor: '#b8926a',
  },
  {
    id: 'education',
    label: 'Education & Discovery',
    emoji: '🦕',
    sub: 'Dinosaurs · Anatomy · Space',
    model: '/models/trex.glb',
    color: '#e8f0eb',
    placeholderColor: '#8aaa8a',
  },
]
