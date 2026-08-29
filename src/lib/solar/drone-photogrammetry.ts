export interface DroneSurveyProject {
  id: string
  name: string
  createdAt: string
  droneModel: string // e.g. DJI Mavic 3 Enterprise / Phantom 4 RTK
  flightAltitudeM: number // e.g. 35m
  gsdCmPerPixel: number // e.g. 1.2 cm/px
  totalPhotos: number
  hasGcp: boolean // Ground Control Points
  status: 'READY' | 'PROCESSING' | 'PROCEDURAL_DEFAULT'
  meshUrl?: string // glTF / OBJ URL
  orthophotoUrl?: string
  dsmUrl?: string
}

export const SAMPLE_DRONE_SURVEYS: DroneSurveyProject[] = [
  {
    id: 'DRONE_VALDIVIA_ROOF_01',
    name: 'Levantamiento Aerofotogramétrico Residencial - Isla Teja',
    createdAt: '2026-08-15',
    droneModel: 'DJI Mavic 3 Enterprise RTK',
    flightAltitudeM: 32,
    gsdCmPerPixel: 0.95,
    totalPhotos: 84,
    hasGcp: true,
    status: 'PROCEDURAL_DEFAULT',
  },
  {
    id: 'DRONE_PUERTOVARAS_CI_02',
    name: 'Malla 3D Galpón Agrícola / Lechería - Llanquihue',
    createdAt: '2026-08-20',
    droneModel: 'DJI Matrice 300 RTK + P1',
    flightAltitudeM: 45,
    gsdCmPerPixel: 1.4,
    totalPhotos: 160,
    hasGcp: true,
    status: 'PROCEDURAL_DEFAULT',
  },
]
