export const HOTSPOTS = {
  // ── AERO/01 sneaker — rich product story schema ──────────────────────────
  fashion: [
    {
      id: 'lockdown',
      eyebrow: '01',
      label: 'Adaptive Lockdown',
      description: 'Engineered lacing geometry distributes tension across the upper for a secure, personalized fit. Reinforced eyelets help stabilize the foot during high-impact movement.',
      specs: [
        'Multi-zone lacing system',
        'Reinforced eyelet construction',
        'Adjustable midfoot lockdown',
        'Dynamic fit support',
      ],
      position: [0.35, 0.48, 0.6],
    },
    {
      id: 'upper',
      eyebrow: '02',
      label: 'Engineered Performance Upper',
      description: 'Lightweight engineered mesh combines targeted ventilation with structured support. High-airflow zones improve breathability while reinforced areas provide stability where the foot needs it most.',
      specs: [
        'Lightweight engineered mesh',
        'Targeted ventilation zones',
        'Reinforced support structure',
        'Flexible forefoot construction',
      ],
      position: [0.50, 0.28, 0.5],
    },
    {
      id: 'cushioning',
      eyebrow: '03',
      label: 'Responsive Cushioning',
      description: 'A lightweight foam midsole is designed to absorb impact and provide responsive energy return through each stride, balancing soft cushioning with stable support.',
      specs: [
        'Lightweight foam construction',
        'Impact absorption',
        'Responsive energy return',
        'Heel-to-toe transition geometry',
      ],
      position: [-0.10, -0.22, 0.6],
    },
    {
      id: 'outsole',
      eyebrow: '04',
      label: 'High-Traction Outsole',
      description: 'Strategically placed rubber zones provide grip in high-contact areas while the segmented tread pattern supports natural movement and multidirectional traction.',
      specs: [
        'High-abrasion rubber zones',
        'Multidirectional traction pattern',
        'Flex grooves',
        'Durable high-contact construction',
      ],
      position: [0.05, -0.52, 0.5],
    },
  ],

  // ── Other use cases — original schema preserved ───────────────────────────
  manufactura: [
    {
      id: 'block',
      label: 'Bloque Motor',
      description: 'Aleación de aluminio de alta resistencia. Reduce el peso total en 28% vs hierro fundido.',
      position: [0, 0.2, 0.6],
    },
    {
      id: 'turbo',
      label: 'Turbocompresor',
      description: 'Turbina de geometría variable. Incrementa eficiencia termодинámica en 40% a baja RPM.',
      position: [0.5, 0.4, 0.4],
    },
    {
      id: 'injection',
      label: 'Inyección Directa',
      description: 'Sistema de inyección a 2.500 bar. Atomización perfecta del combustible para combustión limpia.',
      position: [-0.3, 0.5, 0.5],
    },
    {
      id: 'exhaust',
      label: 'Colector Escape',
      description: 'Diseño 4-2-1 para optimización de ondas de presión. Incremento de 12% en torque medio.',
      position: [0.1, -0.4, 0.4],
    },
  ],

  drinks: [
    {
      id: 'neck',
      label: 'Cuello',
      description: 'Cuello largo de cristal soplado artesanalmente. Diseño patentado que define la silueta de la marca.',
      position: [0, 0.7, 0.5],
    },
    {
      id: 'label',
      label: 'Etiqueta',
      description: 'Papel de algodón 100% con relieve en seco. Impresión en 7 tintas con foil dorado de 24k.',
      position: [0.3, 0.1, 0.6],
    },
    {
      id: 'base',
      label: 'Base',
      description: 'Fondo cóncavo de 8mm que aumenta la presión interna. Estabilidad superior en servicio formal.',
      position: [0.1, -0.6, 0.5],
    },
    {
      id: 'capsule',
      label: 'Cápsula',
      description: 'Cera de abeja con sello de origen. Protección UV para preservar el añejamiento en botella.',
      position: [-0.1, 0.85, 0.4],
    },
  ],

  education: [
    {
      id: 'skull',
      label: 'Cráneo',
      description: 'Medía hasta 1.5 metros de largo. Las cavidades nasales eran sorprendentemente pequeñas — el olfato era su sentido más agudo.',
      position: [0.1, 0.75, 0.5],
    },
    {
      id: 'jaw',
      label: 'Mandíbula',
      description: '60 dientes de hasta 20cm, reemplazados constantemente durante su vida. Fuerza de mordida: 35,000 Newtons.',
      position: [0.4, 0.5, 0.6],
    },
    {
      id: 'arms',
      label: 'Brazos',
      description: 'Solo 1 metro de largo en un cuerpo de 12 metros. Aún debatido: ¿para sujetar presas o para levantarse del suelo?',
      position: [0.5, 0.1, 0.5],
    },
    {
      id: 'legs',
      label: 'Patas Traseras',
      description: 'Musculatura equivalente al 50% de su masa corporal. Velocidad máxima estimada: 20-29 km/h.',
      position: [-0.1, -0.5, 0.5],
    },
  ],
}
