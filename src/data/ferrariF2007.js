const BASE = '/models/automotive/ferrari-f2007/'

export const FERRARI_F2007 = {
  id: 'ferrari-f2007',
  label: 'Ferrari F2007',
  basePath: BASE,
  parts: {
    body: [
      BASE + 'FerrariF2007_BODY5_HI.glb',
      BASE + 'FerrariF2007_BODY6_HI.glb',
    ],
    aero: [
      BASE + 'FerrariF2007_FWING.glb',
      BASE + 'FerrariF2007_RWING.glb',
    ],
    tires: [
      BASE + 'FerrariF2007_TireFL.glb',
      BASE + 'FerrariF2007_TireFR.glb',
      BASE + 'FerrariF2007_TireRL.glb',
      BASE + 'FerrariF2007_TireRR.glb',
    ],
    suspension: [
      BASE + 'FerrariF2007_SuspFL.glb',
      BASE + 'FerrariF2007_SuspFR.glb',
      BASE + 'FerrariF2007_SuspRL.glb',
      BASE + 'FerrariF2007_SuspRR.glb',
    ],
    brakes: [
      BASE + 'FerrariF2007_BrakeFL.glb',
      BASE + 'FerrariF2007_BrakeFR.glb',
      BASE + 'FerrariF2007_BrakeRL.glb',
      BASE + 'FerrariF2007_BrakeRR.glb',
    ],
    covers: [
      BASE + 'FerrariF2007_RCoverFL.glb',
      BASE + 'FerrariF2007_RCoverFR.glb',
      BASE + 'FerrariF2007_RCoverRL.glb',
      BASE + 'FerrariF2007_RCoverRR.glb',
    ],
    steering: [
      BASE + 'FerrariF2007_Swheel.glb',
    ],
  },
}

// Flat parts list for MultiPartModel — generic format { id, label, path, group, defaultVisible }
export const FERRARI_F2007_PARTS = Object.entries(FERRARI_F2007.parts).flatMap(
  ([group, paths]) =>
    paths.map((path, i) => ({
      id: `${group}_${i}`,
      label: path.split('/').pop().replace('.glb', ''),
      path,
      group,
      defaultVisible: true,
    }))
)
