'use client'

import { useMemo } from 'react'
import { getAnnualSunPathCurves, SolarPositionVector } from '@/lib/solar/sun-position'
import { Badge } from '@/components/ui/badge'
import { Sun, Compass, Clock, Info } from 'lucide-react'

interface Props {
  latitude: number
  longitude: number
  currentSunPosition: SolarPositionVector
  currentHour: number
  currentMonth: string
}

export function SunPathChart({
  latitude,
  longitude,
  currentSunPosition,
  currentHour,
  currentMonth,
}: Props) {
  const curves = useMemo(() => getAnnualSunPathCurves(latitude, longitude), [latitude, longitude])

  // Chart dimensions in SVG coordinates
  // Azimuth X: 0° (North) to 360° -> mapped from 60° (East-North) to 300° (West-North)
  // Elevation Y: 0° (Horizon) to 90° (Zenith)
  const width = 540
  const height = 240
  const padLeft = 40
  const padRight = 20
  const padTop = 20
  const padBottom = 30

  const mapX = (azimuth: number) => {
    // We display azimuth from 45° to 315°
    const minAz = 45
    const maxAz = 315
    const clamped = Math.max(minAz, Math.min(maxAz, azimuth))
    return padLeft + ((clamped - minAz) / (maxAz - minAz)) * (width - padLeft - padRight)
  }

  const mapY = (elevation: number) => {
    // 0° to 90°
    const clamped = Math.max(0, Math.min(90, elevation))
    return height - padBottom - (clamped / 90) * (height - padTop - padBottom)
  }

  // Active Sun Marker coordinates
  const sunMarkerX = mapX(currentSunPosition.azimuthDeg)
  const sunMarkerY = mapY(currentSunPosition.elevationDeg)

  return (
    <div className="space-y-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-[#FF8300]" />
          <span className="text-xs font-bold text-[#1F1F1F]">Carta Solar de Trayectoria (Cilindro Solar)</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] bg-orange-50/50 text-[#FF8300] border-orange-200">
            <Sun className="h-3 w-3 mr-1" /> Azimut: {currentSunPosition.azimuthDeg}° • Elevación: {currentSunPosition.elevationDeg}°
          </Badge>
        </div>
      </div>

      {/* SVG Stereographic Solar Chart */}
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto bg-slate-950 rounded-xl">
          {/* Grid lines: Elevation (15°, 30°, 45°, 60°, 75°) */}
          {[15, 30, 45, 60, 75].map((el) => {
            const y = mapY(el)
            return (
              <g key={el}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#334155"
                  strokeDasharray="3 3"
                  strokeWidth="0.8"
                />
                <text x={padLeft - 6} y={y + 3} fill="#64748b" fontSize="8" textAnchor="end">
                  {el}°
                </text>
              </g>
            )
          })}

          {/* Grid lines: Azimuth (90° Este, 180° Norte/Sur, 270° Oeste) */}
          {[
            { az: 90, label: '90° (E)' },
            { az: 135, label: '135° (NE)' },
            { az: 180, label: '180° (N/S)' },
            { az: 225, label: '225° (NO)' },
            { az: 270, label: '270° (O)' },
          ].map((item) => {
            const x = mapX(item.az)
            return (
              <g key={item.az}>
                <line
                  x1={x}
                  y1={padTop}
                  x2={x}
                  y2={height - padBottom}
                  stroke="#334155"
                  strokeDasharray="3 3"
                  strokeWidth="0.8"
                />
                <text x={x} y={height - padBottom + 14} fill="#94a3b8" fontSize="8" textAnchor="middle">
                  {item.label}
                </text>
              </g>
            )
          })}

          {/* Sun Path Season Curves */}
          {curves.map((curve, idx) => {
            if (curve.points.length === 0) return null
            const pathD = curve.points
              .map((p, i) => `${i === 0 ? 'M' : 'L'} ${mapX(p.azimuthDeg)} ${mapY(p.elevationDeg)}`)
              .join(' ')

            const colors = ['#38bdf8', '#4ade80', '#fbbf24'] // Blue winter, Green equinox, Yellow summer

            return (
              <g key={curve.seasonName}>
                <path
                  d={pathD}
                  fill="none"
                  stroke={colors[idx]}
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="opacity-80 hover:opacity-100 transition-opacity"
                />
                {/* Hour labels on curve */}
                {curve.points
                  .filter((p) => [8, 12, 16].includes(p.hour))
                  .map((p) => (
                    <circle
                      key={p.hour}
                      cx={mapX(p.azimuthDeg)}
                      cy={mapY(p.elevationDeg)}
                      r="2.5"
                      fill={colors[idx]}
                    />
                  ))}
              </g>
            )
          })}

          {/* Current Active Sun Position Marker */}
          {currentSunPosition.isDaylight && (
            <g transform={`translate(${sunMarkerX}, ${sunMarkerY})`}>
              <circle r="9" fill="#FF8300" fillOpacity="0.3" className="animate-ping" />
              <circle r="5" fill="#FF8300" stroke="#ffffff" strokeWidth="1.5" />
              <text x="8" y="-4" fill="#fbbf24" fontSize="9" fontWeight="bold">
                {currentHour}:00 ({currentMonth})
              </text>
            </g>
          )}

          {/* Base Horizon Line */}
          <line
            x1={padLeft}
            y1={height - padBottom}
            x2={width - padRight}
            y2={height - padBottom}
            stroke="#94a3b8"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between text-[10px] text-gray-500 pt-1">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#fbbf24]" /> 21 Dic (Verano)
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#4ade80]" /> 21 Sep/Mar (Equinoccio)
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#38bdf8]" /> 21 Jun (Invierno)
          </span>
        </div>
        <span className="text-gray-400">Modelo Solar PSA / NREL SPA</span>
      </div>
    </div>
  )
}
