'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import * as THREE from 'three'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Sun, 
  Layers, 
  Sparkles, 
  Sliders, 
  RotateCw, 
  Eye, 
  Play, 
  Pause, 
  TreePine, 
  Building2, 
  Zap, 
  ShieldCheck, 
  AlertTriangle,
  CheckCircle2,
  Compass,
  Clock,
  Maximize2,
  UploadCloud,
  FileCode2,
  Activity,
  Plus,
  Trash2,
  Info
} from 'lucide-react'
import { getSolarPosition, calculateSolarAccess } from '@/lib/solar/sun-position'
import { 
  StringConfiguration, 
  validateStringing, 
  DEFAULT_MODULE_SPEC, 
  DEFAULT_INVERTER_SPEC 
} from '@/lib/solar/stringing-validator'
import { SunPathChart } from './SunPathChart'

interface Obstacle3D {
  id: string
  type: 'TREE' | 'CHIMNEY' | 'HVAC' | 'SKYLIGHT'
  name: string
  x: number
  z: number
  height: number
  width: number
}

interface PlacedModule3D {
  id: string
  row: number
  col: number
  facet: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST'
  x: number
  y: number
  z: number
  isBlockedBySetback: boolean
  stringId: string // 'STRING_1' | 'STRING_2'
  isActive: boolean
}

interface Props {
  latitude: number
  longitude: number
  initialTiltDeg: number
  initialAzimuthDeg: number
  roofType: string
  isCoplanar: boolean
  onDesignChange: (result: {
    totalModules: number
    installedCapacityKwp: number
    shadingFactorPct: number
    solarAccessPct: number
    strings: StringConfiguration[]
    tiltDeg: number
    azimuthDeg: number
  }) => void
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

export function Scanifly3DStudio({
  latitude,
  longitude,
  initialTiltDeg,
  initialAzimuthDeg,
  roofType,
  isCoplanar,
  onDesignChange,
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null)

  // ================= ESTADOS DEL MODELO 3D & TECHUMBRE =================
  const [roofStyle, setRoofStyle] = useState<'GABLE' | 'HIP' | 'SHED' | 'FLAT'>('GABLE')
  const [buildingWidthM, setBuildingWidthM] = useState(10) // Ancho
  const [buildingLengthM, setBuildingLengthM] = useState(12) // Largo
  const [wallHeightM, setWallHeightM] = useState(3.2)
  const [tiltDeg, setTiltDeg] = useState(initialTiltDeg || 30)
  const [azimuthDeg, setAzimuthDeg] = useState(initialAzimuthDeg || 0) // 0 = Norte

  // ================= ESTADOS DE GRID DE PANELES & STRINGING =================
  const [panelOrientation, setPanelOrientation] = useState<'PORTRAIT' | 'LANDSCAPE'>('PORTRAIT')
  const [gridRows, setGridRows] = useState(3)
  const [gridCols, setGridCols] = useState(4)
  const [activeStringId, setActiveStringId] = useState<string>('STRING_1')

  const [strings, setStrings] = useState<StringConfiguration[]>([
    { id: 'STRING_1', name: 'String 1 (MPPT 1)', mpptIndex: 1, colorHex: '#2563eb', moduleCount: 8, moduleIndices: [] },
    { id: 'STRING_2', name: 'String 2 (MPPT 2)', mpptIndex: 2, colorHex: '#f97316', moduleCount: 4, moduleIndices: [] },
  ])

  // ================= OBSTÁCULOS 3D =================
  const [obstacles, setObstacles] = useState<Obstacle3D[]>([
    { id: 'OBS_TREE_1', type: 'TREE', name: 'Árbol Nativo (Noreste)', x: 4.5, z: 6.5, height: 7.5, width: 3.5 },
    { id: 'OBS_CHIMNEY_1', type: 'CHIMNEY', name: 'Chimenea Combustión Lenta', x: 1.2, z: 1.0, height: 1.6, width: 0.8 },
  ])

  // ================= SIMULACIÓN SOLAR EN TIEMPO REAL =================
  const [simMonthIdx, setSimMonthIdx] = useState(11) // Diciembre (Pico solar)
  const [simHour, setSimHour] = useState(13) // 13:00 hrs
  const [isAutoOrbit, setIsAutoOrbit] = useState(false)

  // Cálculo astronómico del Sol
  const currentSimDate = useMemo(() => {
    const d = new Date(2026, simMonthIdx, 21, simHour, 0, 0)
    return d
  }, [simMonthIdx, simHour])

  const sunVector = useMemo(() => {
    return getSolarPosition(currentSimDate, latitude, longitude)
  }, [currentSimDate, latitude, longitude])

  // Módulos calculados en la techumbre
  const placedModules = useMemo(() => {
    const modules: PlacedModule3D[] = []
    const moduleW = panelOrientation === 'PORTRAIT' ? 1.13 : 2.27
    const moduleH = panelOrientation === 'PORTRAIT' ? 2.27 : 1.13
    const spacing = 0.05

    let counter = 0
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        counter++
        // Distribuir en dos strings equitativamente
        const strId = counter <= Math.ceil((gridRows * gridCols) / 2) ? 'STRING_1' : 'STRING_2'

        // Check if near obstacle (simple setback check)
        const posX = (c - (gridCols - 1) / 2) * (moduleW + spacing)
        const posZ = (r - (gridRows - 1) / 2) * (moduleH + spacing)

        // Setback check from roof edges (0.6m margin)
        const isNearEdge = Math.abs(posX) > buildingWidthM / 2 - 0.6 || Math.abs(posZ) > buildingLengthM / 2 - 0.6

        modules.push({
          id: `MOD_${r}_${c}`,
          row: r,
          col: c,
          facet: 'NORTH',
          x: posX,
          y: 0,
          z: posZ,
          isBlockedBySetback: isNearEdge,
          stringId: strId,
          isActive: !isNearEdge,
        })
      }
    }
    return modules
  }, [gridRows, gridCols, panelOrientation, buildingWidthM, buildingLengthM])

  const activeModules = placedModules.filter((m) => m.isActive)
  const totalModuleCount = activeModules.length
  const installedCapacityKwp = Math.round(((totalModuleCount * DEFAULT_MODULE_SPEC.powerW) / 1000) * 100) / 100

  // Stringing Validation
  const string1Count = activeModules.filter((m) => m.stringId === 'STRING_1').length
  const string2Count = activeModules.filter((m) => m.stringId === 'STRING_2').length

  const updatedStrings: StringConfiguration[] = [
    { id: 'STRING_1', name: 'String 1 (MPPT 1)', mpptIndex: 1, colorHex: '#2563eb', moduleCount: string1Count, moduleIndices: [] },
    { id: 'STRING_2', name: 'String 2 (MPPT 2)', mpptIndex: 2, colorHex: '#f97316', moduleCount: string2Count, moduleIndices: [] },
  ]

  const stringingValidation = useMemo(() => {
    return validateStringing(updatedStrings, DEFAULT_MODULE_SPEC, DEFAULT_INVERTER_SPEC, -5, 65)
  }, [updatedStrings])

  // Estimación de sombreado según posición solar y obstáculos
  const shadingLossPct = useMemo(() => {
    let loss = 2.5 // Base loss
    if (obstacles.some((o) => o.type === 'TREE')) {
      loss += (sunVector.elevationDeg < 30 ? 8.5 : 3.0)
    }
    if (obstacles.some((o) => o.type === 'CHIMNEY')) {
      loss += 1.5
    }
    return Math.min(25, Math.round(loss * 10) / 10)
  }, [obstacles, sunVector.elevationDeg])

  const solarAccessInfo = useMemo(() => {
    return calculateSolarAccess(installedCapacityKwp * 1395, shadingLossPct, tiltDeg, azimuthDeg)
  }, [installedCapacityKwp, shadingLossPct, tiltDeg, azimuthDeg])

  // Notificar al Wizard
  useEffect(() => {
    onDesignChange({
      totalModules: totalModuleCount,
      installedCapacityKwp,
      shadingFactorPct: shadingLossPct,
      solarAccessPct: solarAccessInfo.solarAccessPct,
      strings: updatedStrings,
      tiltDeg,
      azimuthDeg,
    })
  }, [totalModuleCount, installedCapacityKwp, shadingLossPct, solarAccessInfo.solarAccessPct, tiltDeg, azimuthDeg])

  // ================= RENDERIZADO THREE.JS WEBGL =================
  useEffect(() => {
    if (!mountRef.current) return

    const container = mountRef.current
    const width = container.clientWidth
    const height = container.clientHeight || 400

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(sunVector.isDaylight ? 0x0f172a : 0x020617)

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(16, 14, 20)
    camera.lookAt(0, 2, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    // 2. Iluminación Ambiental y Luz Solar Direccional
    const ambientLight = new THREE.AmbientLight(0xffffff, sunVector.isDaylight ? 0.45 : 0.1)
    scene.add(ambientLight)

    const sunLight = new THREE.DirectionalLight(0xfffaed, sunVector.isDaylight ? 1.4 : 0.0)
    sunLight.castShadow = true
    sunLight.shadow.mapSize.width = 2048
    sunLight.shadow.mapSize.height = 2048
    sunLight.shadow.camera.near = 0.5
    sunLight.shadow.camera.far = 60
    sunLight.shadow.camera.left = -15
    sunLight.shadow.camera.right = 15
    sunLight.shadow.camera.top = 15
    sunLight.shadow.camera.bottom = -15

    // Position sun according to spherical azimuth & elevation
    const sunDistance = 30
    const elRad = (sunVector.elevationDeg * Math.PI) / 180
    const azRad = ((sunVector.azimuthDeg - 90) * Math.PI) / 180 // Align with Three.js axes

    sunLight.position.set(
      sunDistance * Math.cos(elRad) * Math.sin(azRad),
      Math.max(1, sunDistance * Math.sin(elRad)),
      sunDistance * Math.cos(elRad) * Math.cos(azRad)
    )
    scene.add(sunLight)

    // Helper Sun sphere
    if (sunVector.isDaylight) {
      const sunSphereGeo = new THREE.SphereGeometry(0.8, 16, 16)
      const sunSphereMat = new THREE.MeshBasicMaterial({ color: 0xffb703 })
      const sunMesh = new THREE.Mesh(sunSphereGeo, sunSphereMat)
      sunMesh.position.copy(sunLight.position)
      scene.add(sunMesh)
    }

    // 3. Terreno / Suelo
    const groundGeo = new THREE.PlaneGeometry(50, 50)
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85 })
    const groundMesh = new THREE.Mesh(groundGeo, groundMat)
    groundMesh.rotation.x = -Math.PI / 2
    groundMesh.position.y = 0
    groundMesh.receiveShadow = true
    scene.add(groundMesh)

    // Grid helper
    const grid = new THREE.GridHelper(40, 20, 0x475569, 0x334155)
    grid.position.y = 0.01
    scene.add(grid)

    // 4. Estructura de la Vivienda / Muros
    const wallGeo = new THREE.BoxGeometry(buildingWidthM, wallHeightM, buildingLengthM)
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 })
    const wallMesh = new THREE.Mesh(wallGeo, wallMat)
    wallMesh.position.y = wallHeightM / 2
    wallMesh.castShadow = true
    wallMesh.receiveShadow = true
    scene.add(wallMesh)

    // 5. Techumbre Paramétrica (Gable Roof)
    const roofRidgeHeight = (buildingWidthM / 2) * Math.tan((tiltDeg * Math.PI) / 180)
    const roofGeo = new THREE.ConeGeometry(buildingWidthM * 0.75, roofRidgeHeight + 1, 4)
    const roofMat = new THREE.MeshStandardMaterial({
      color: roofType === 'CLAY_TILE' ? 0x9a3412 : 0x475569,
      roughness: 0.6,
    })
    const roofMesh = new THREE.Mesh(roofGeo, roofMat)
    roofMesh.position.y = wallHeightM + roofRidgeHeight / 2
    roofMesh.rotation.y = Math.PI / 4 + (azimuthDeg * Math.PI) / 180
    roofMesh.castShadow = true
    roofMesh.receiveShadow = true
    scene.add(roofMesh)

    // 6. Módulos Solares en la Techumbre
    const modWidth = panelOrientation === 'PORTRAIT' ? 1.13 : 2.27
    const modHeight = panelOrientation === 'PORTRAIT' ? 2.27 : 1.13
    const panelGeo = new THREE.BoxGeometry(modWidth, 0.04, modHeight)

    placedModules.forEach((m) => {
      if (!m.isActive) return
      const panelMat = new THREE.MeshStandardMaterial({
        color: m.stringId === 'STRING_1' ? 0x1d4ed8 : 0xea580c, // Blue String 1, Orange String 2
        metalness: 0.6,
        roughness: 0.2,
      })
      const pMesh = new THREE.Mesh(panelGeo, panelMat)
      pMesh.position.set(m.x, wallHeightM + roofRidgeHeight * 0.7, m.z)
      pMesh.rotation.x = (tiltDeg * Math.PI) / 180 * 0.5
      pMesh.castShadow = true
      pMesh.receiveShadow = true
      scene.add(pMesh)
    })

    // 7. Obstáculos 3D (Árboles, Chimeneas)
    obstacles.forEach((obs) => {
      if (obs.type === 'TREE') {
        // Tronco
        const trunkGeo = new THREE.CylinderGeometry(0.3, 0.4, obs.height * 0.4, 8)
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f })
        const trunk = new THREE.Mesh(trunkGeo, trunkMat)
        trunk.position.set(obs.x, (obs.height * 0.4) / 2, obs.z)
        trunk.castShadow = true
        scene.add(trunk)

        // Copa follaje
        const foliageGeo = new THREE.SphereGeometry(obs.width / 2, 12, 12)
        const foliageMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 })
        const foliage = new THREE.Mesh(foliageGeo, foliageMat)
        foliage.position.set(obs.x, obs.height * 0.7, obs.z)
        foliage.castShadow = true
        scene.add(foliage)
      } else if (obs.type === 'CHIMNEY') {
        const chimGeo = new THREE.BoxGeometry(obs.width, obs.height, obs.width)
        const chimMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c })
        const chim = new THREE.Mesh(chimGeo, chimMat)
        chim.position.set(obs.x, wallHeightM + roofRidgeHeight + obs.height / 2, obs.z)
        chim.castShadow = true
        scene.add(chim)
      }
    })

    // 8. Animation Loop
    let animationFrameId: number
    let angle = 0

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      if (isAutoOrbit) {
        angle += 0.005
        camera.position.x = 22 * Math.cos(angle)
        camera.position.z = 22 * Math.sin(angle)
        camera.lookAt(0, 3, 0)
      }
      renderer.render(scene, camera)
    }
    animate()

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId)
      renderer.dispose()
    }
  }, [
    buildingWidthM,
    buildingLengthM,
    wallHeightM,
    tiltDeg,
    azimuthDeg,
    roofType,
    placedModules,
    obstacles,
    sunVector,
    isAutoOrbit,
    panelOrientation,
  ])

  // Handlers para agregar y remover obstáculos
  const handleAddTree = () => {
    const newTree: Obstacle3D = {
      id: `TREE_${Date.now()}`,
      type: 'TREE',
      name: 'Nuevo Árbol',
      x: -5.0,
      z: 5.0,
      height: 6.0,
      width: 3.0,
    }
    setObstacles([...obstacles, newTree])
  }

  const handleRemoveObstacle = (id: string) => {
    setObstacles(obstacles.filter((o) => o.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header del Estudio 3D */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF8300]">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#1F1F1F]">
                Estudio 3D de Techumbre, Sombras & Stringing (Scanifly Engine)
              </h3>
              <Badge className="bg-orange-50 text-[#FF8300] border-orange-200 text-[10px]">
                WebGL Three.js + SunCalc
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Simulación de sombras dinámicas en tiempo real, distancias de seguridad SEC y verificación de strings
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAutoOrbit(!isAutoOrbit)}
            className="rounded-xl text-xs border-gray-200 text-gray-700 h-9"
          >
            {isAutoOrbit ? <Pause className="h-3.5 w-3.5 mr-1" /> : <Play className="h-3.5 w-3.5 mr-1" />}
            {isAutoOrbit ? 'Pausar Rotación' : 'Rotar Cámara 3D'}
          </Button>
        </div>
      </div>

      {/* Grid Principal: Visor 3D + Controles Laterales */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Columna Izquierda: Visor 3D WebGL (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="rounded-[24px] border-gray-200 overflow-hidden bg-slate-950 relative shadow-md">
            {/* Overlay Superior de Métricas en Vivo */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10 pointer-events-none">
              <div className="flex gap-2">
                <Badge className="bg-black/70 text-white border-0 text-[11px] backdrop-blur-xs font-mono">
                  ☀️ Sol: Az {sunVector.azimuthDeg}° • El {sunVector.elevationDeg}°
                </Badge>
                <Badge className="bg-black/70 text-emerald-400 border-0 text-[11px] backdrop-blur-xs font-mono">
                  Potencia: {installedCapacityKwp} kWp ({totalModuleCount} paneles)
                </Badge>
              </div>

              <Badge className="bg-black/70 text-orange-400 border-0 text-[11px] backdrop-blur-xs font-mono">
                Sombreado: {shadingLossPct}%
              </Badge>
            </div>

            {/* Canvas 3D Three.js */}
            <div ref={mountRef} className="w-full h-96 select-none" />

            {/* Controles de Simulación Solar (Hora del día y Fecha) */}
            <div className="p-4 bg-slate-900/90 border-t border-slate-800 text-xs text-white space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#FF8300]" />
                  <span className="font-bold">Simulación de Sombras Diarias:</span>
                  <span className="font-black text-[#FF8300] text-sm">{simHour}:00 hrs</span>
                  <span className="text-gray-400">({MONTH_NAMES[simMonthIdx]})</span>
                </div>

                {/* Botones Rápidos de Solsticios */}
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSimMonthIdx(5)} // 21 Junio
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                      simMonthIdx === 5 ? 'bg-sky-500 text-white' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                    }`}
                  >
                    Solsticio Invierno (21 Jun)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimMonthIdx(8)} // 21 Septiembre
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                      simMonthIdx === 8 ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                    }`}
                  >
                    Equinoccio (21 Sep)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimMonthIdx(11)} // 21 Diciembre
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                      simMonthIdx === 11 ? 'bg-amber-500 text-white' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                    }`}
                  >
                    Solsticio Verano (21 Dic)
                  </button>
                </div>
              </div>

              {/* Slider de Hora del Día (06:00 a 20:00) */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="6"
                  max="20"
                  value={simHour}
                  onChange={(e) => setSimHour(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#FF8300]"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>06:00 (Amanecer)</span>
                  <span>13:00 (Cenit Solar)</span>
                  <span>20:00 (Atardecer)</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Carta Solar Estereográfica */}
          <SunPathChart
            latitude={latitude}
            longitude={longitude}
            currentSunPosition={sunVector}
            currentHour={simHour}
            currentMonth={MONTH_NAMES[simMonthIdx]}
          />
        </div>

        {/* Columna Derecha: Parámetros de Techumbre, Grid & Strings (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* 1. Geometría de Techumbre */}
          <Card className="rounded-2xl border-gray-100 shadow-sm bg-white p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-[#FF8300]" /> Dimensiones de la Techumbre
            </h4>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="space-y-1">
                <Label className="text-[11px] text-gray-500">Ancho (m)</Label>
                <Input
                  type="number"
                  value={buildingWidthM}
                  onChange={(e) => setBuildingWidthM(Math.max(4, Number(e.target.value)))}
                  className="h-8 rounded-lg text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] text-gray-500">Largo (m)</Label>
                <Input
                  type="number"
                  value={buildingLengthM}
                  onChange={(e) => setBuildingLengthM(Math.max(4, Number(e.target.value)))}
                  className="h-8 rounded-lg text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] text-gray-500">Inclinación (°)</Label>
                <Input
                  type="number"
                  value={tiltDeg}
                  onChange={(e) => setTiltDeg(Math.max(0, Math.min(60, Number(e.target.value))))}
                  className="h-8 rounded-lg text-xs font-bold text-[#FF8300]"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] text-gray-500">Azimut (° Norte=0)</Label>
                <Input
                  type="number"
                  value={azimuthDeg}
                  onChange={(e) => setAzimuthDeg(Number(e.target.value))}
                  className="h-8 rounded-lg text-xs"
                />
              </div>
            </div>
          </Card>

          {/* 2. Configuración del Arreglo (Grid) & Stringing */}
          <Card className="rounded-2xl border-gray-100 shadow-sm bg-white p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-[#FF8300]" /> Disposición & Strings Eléctricos
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPanelOrientation('PORTRAIT')}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold ${
                    panelOrientation === 'PORTRAIT'
                      ? 'bg-orange-50 text-[#FF8300] border-orange-200'
                      : 'bg-white text-gray-600 border-gray-200'
                  }`}
                >
                  Retrato (Vertical)
                </button>
                <button
                  type="button"
                  onClick={() => setPanelOrientation('LANDSCAPE')}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold ${
                    panelOrientation === 'LANDSCAPE'
                      ? 'bg-orange-50 text-[#FF8300] border-orange-200'
                      : 'bg-white text-gray-600 border-gray-200'
                  }`}
                >
                  Paisaje (Horizontal)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-[11px] text-gray-500">Filas (Rows)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={gridRows}
                    onChange={(e) => setGridRows(Math.max(1, Number(e.target.value)))}
                    className="h-8 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] text-gray-500">Columnas (Cols)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="15"
                    value={gridCols}
                    onChange={(e) => setGridCols(Math.max(1, Number(e.target.value)))}
                    className="h-8 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Desglose de Strings */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-700 flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> String 1 (MPPT 1):
                </span>
                <strong className="text-gray-900">{string1Count} paneles (~{((string1Count * 550)/1000).toFixed(2)} kWp)</strong>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-700 flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-500" /> String 2 (MPPT 2):
                </span>
                <strong className="text-gray-900">{string2Count} paneles (~{((string2Count * 550)/1000).toFixed(2)} kWp)</strong>
              </div>
            </div>

            {/* Validación Eléctrica SEC RIC N°09 */}
            <div className={`p-3 rounded-xl border text-xs space-y-1 ${
              stringingValidation.isValid ? 'bg-emerald-50/60 border-emerald-200' : 'bg-red-50/60 border-red-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1 text-gray-800">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Verificación Eléctrica SEC
                </span>
                <Badge className={stringingValidation.isValid ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}>
                  {stringingValidation.isValid ? 'Cumple RIC N°09' : 'Inconsistencia'}
                </Badge>
              </div>
              <p className="text-[10px] text-gray-600">
                Tensión Voc fría máxima: <strong>{stringingValidation.strings[0]?.vocColdV || 0}V</strong> (Límite: 1000V)
              </p>
            </div>
          </Card>

          {/* 3. Obstáculos 3D */}
          <Card className="rounded-2xl border-gray-100 shadow-sm bg-white p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <TreePine className="h-4 w-4 text-[#FF8300]" /> Obstáculos & Sombras
              </h4>
              <button
                type="button"
                onClick={handleAddTree}
                className="text-[11px] text-[#FF8300] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-3 w-3" /> Añadir Árbol
              </button>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {obstacles.map((obs) => (
                <div key={obs.id} className="flex justify-between items-center p-2 rounded-lg bg-gray-50 text-xs">
                  <div>
                    <strong className="text-gray-800 block text-[11px]">{obs.name}</strong>
                    <span className="text-[10px] text-gray-400">Altura: {obs.height}m • Diámetro: {obs.width}m</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveObstacle(obs.id)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
