'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Navigation, Compass, Layers, Check, Search, Sparkles } from 'lucide-react'

interface Props {
  latitude: number
  longitude: number
  comunaName: string
  onChangeLocation: (lat: number, lng: number, comunaName: string) => void
}

const CHILEAN_HOTSPOTS = [
  { name: 'Valdivia (Isla Teja / Centro)', comuna: 'Valdivia', lat: -39.8142, lng: -73.2459, ghi: 1395 },
  { name: 'Puerto Varas (Costanera / Llanquihue)', comuna: 'Puerto Varas', lat: -41.3195, lng: -72.9854, ghi: 1335 },
  { name: 'Osorno (Centro / Francke)', comuna: 'Osorno', lat: -40.5739, lng: -73.1335, ghi: 1365 },
  { name: 'Puerto Montt (Pelluco / Alerce)', comuna: 'Puerto Montt', lat: -41.4693, lng: -72.9424, ghi: 1310 },
  { name: 'Temuco (Avenida Alemania / Labranza)', comuna: 'Temuco', lat: -38.7359, lng: -72.5904, ghi: 1485 },
  { name: 'Panguipulli (Lago Calafquén)', comuna: 'Panguipulli', lat: -39.6428, lng: -72.3333, ghi: 1370 },
  { name: 'Castro (Chiloé)', comuna: 'Castro', lat: -42.4721, lng: -73.7732, ghi: 1280 },
]

export function InteractiveLocationMap({
  latitude,
  longitude,
  comunaName,
  onChangeLocation,
}: Props) {
  const [latInput, setLatInput] = useState(latitude.toString())
  const [lngInput, setLngInput] = useState(longitude.toString())
  const [selectedPin, setSelectedPin] = useState<{ lat: number; lng: number }>({ lat: latitude, lng: longitude })

  const handleApplyCoordinates = (lat: number, lng: number, name?: string) => {
    setSelectedPin({ lat, lng })
    setLatInput(lat.toFixed(4))
    setLngInput(lng.toFixed(4))
    
    // Find closest comuna
    let bestComuna = name || comunaName
    if (!name) {
      if (lat < -41.0) bestComuna = 'Puerto Varas'
      else if (lat < -40.2) bestComuna = 'Osorno'
      else if (lat < -39.2) bestComuna = 'Valdivia'
      else bestComuna = 'Temuco'
    }
    onChangeLocation(lat, lng, bestComuna)
  }

  // Interactive map click handler on the visual map grid
  // Chile bounding box representation for the canvas
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width // 0 to 1 (West to East: -74.5 to -71.5)
    const y = (e.clientY - rect.top) / rect.height // 0 to 1 (North to South: -38.0 to -43.0)

    const calcLat = -38.0 - y * 5.0 // -38.0 to -43.0
    const calcLng = -74.5 + x * 3.0 // -74.5 to -71.5

    handleApplyCoordinates(Number(calcLat.toFixed(4)), Number(calcLng.toFixed(4)))
  }

  // Relative pin position on the map canvas
  const pinY = Math.max(5, Math.min(95, ((-selectedPin.lat - 38.0) / 5.0) * 100))
  const pinX = Math.max(5, Math.min(95, ((selectedPin.lng - -74.5) / 3.0) * 100))

  return (
    <div className="space-y-4">
      {/* Controles de Entrada Numérica de Coordenadas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100">
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-gray-700 flex items-center justify-between">
            <span>Latitud (° Sur)</span>
            <span className="text-[10px] text-gray-400 font-normal">Ej: -39.8142</span>
          </Label>
          <Input
            type="number"
            step="0.0001"
            value={latInput}
            onChange={(e) => {
              setLatInput(e.target.value)
              const val = parseFloat(e.target.value)
              if (!isNaN(val)) handleApplyCoordinates(val, parseFloat(lngInput) || -73.2459)
            }}
            className="h-9 text-xs font-bold rounded-xl bg-white border-gray-200"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold text-gray-700 flex items-center justify-between">
            <span>Longitud (° Oeste)</span>
            <span className="text-[10px] text-gray-400 font-normal">Ej: -73.2459</span>
          </Label>
          <Input
            type="number"
            step="0.0001"
            value={lngInput}
            onChange={(e) => {
              setLngInput(e.target.value)
              const val = parseFloat(e.target.value)
              if (!isNaN(val)) handleApplyCoordinates(parseFloat(latInput) || -39.8142, val)
            }}
            className="h-9 text-xs font-bold rounded-xl bg-white border-gray-200"
          />
        </div>
      </div>

      {/* Mapa Visual Interactivo (Zona Sur de Chile) */}
      <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-slate-900 shadow-inner h-64 select-none">
        {/* Capa de Mapa Geográfico / Satelital */}
        <div
          onClick={handleMapClick}
          className="absolute inset-0 cursor-crosshair bg-cover bg-center opacity-85 hover:opacity-100 transition-opacity"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.4), rgba(15, 23, 42, 0.9)), repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.05) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.05) 40px)`,
          }}
        >
          {/* Marcadores Topográficos de Ciudades Clave */}
          <div className="absolute top-4 left-6 text-[10px] text-gray-400 font-mono flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Explorador Solar MinEnergía SIG • Muestreo 1 km²
          </div>

          <div className="absolute bottom-3 left-4 text-[11px] text-white/70 bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-xs">
            📍 Haz clic en cualquier punto del mapa para fijar coordenadas
          </div>

          {/* Coordenadas en Vivo del Pin */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-full pointer-events-none transition-all duration-150"
            style={{ left: `${pinX}%`, top: `${pinY}%` }}
          >
            <div className="flex flex-col items-center">
              <div className="bg-[#FF8300] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-lg flex items-center gap-1 whitespace-nowrap mb-1">
                <MapPin className="h-3 w-3" /> {comunaName} ({selectedPin.lat.toFixed(2)}°, {selectedPin.lng.toFixed(2)}°)
              </div>
              <div className="h-4 w-4 text-[#FF8300]">
                <MapPin className="h-5 w-5 fill-[#FF8300] stroke-white stroke-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selector Rápido de Ubicaciones Comunes */}
      <div className="space-y-1.5">
        <Label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
          Ubicaciones Frecuentes Zona Sur
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {CHILEAN_HOTSPOTS.map((spot) => (
            <button
              key={spot.name}
              type="button"
              onClick={() => handleApplyCoordinates(spot.lat, spot.lng, spot.comuna)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                comunaName === spot.comuna
                  ? 'bg-orange-50 text-[#FF8300] border-orange-200 font-bold'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {spot.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
