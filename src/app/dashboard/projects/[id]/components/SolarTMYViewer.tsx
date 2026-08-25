'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Sun, 
  CloudSun, 
  Thermometer, 
  Compass, 
  Sparkles, 
  Layers, 
  Wind, 
  Activity, 
  CheckCircle2,
  ExternalLink,
  MapPin
} from 'lucide-react'
import { getSolarDataset, SolarDataSourceId } from '@/lib/solar/weather-engine'
import { sampleMinEnergiaSig } from '@/lib/solar/minenergia-sig'

interface Props {
  comunaName: string
}

export function SolarTMYViewer({ comunaName }: Props) {
  const [selectedSource, setSelectedSource] = useState<SolarDataSourceId>('MINENERGIA_SIG_1KM')
  const dataset = getSolarDataset(comunaName)
  const sigData = sampleMinEnergiaSig(dataset.lat, dataset.lng, comunaName)

  const activeSourceInfo = dataset.sourcesAvailable.find((s) => s.source === selectedSource) || dataset.sourcesAvailable[0]

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <Card className="rounded-2xl border-gray-100 shadow-sm bg-white overflow-hidden">
        <CardHeader className="pb-4 border-b border-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF8300]">
                <Sun className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-[#1F1F1F]">
                  Recurso Solar & Fuentes Meteorológicas TMY ({dataset.comuna})
                </CardTitle>
                <CardDescription className="text-xs text-gray-500 mt-0.5">
                  Latitud {dataset.lat}° • Longitud {dataset.lng}° • Elevación {dataset.elevationM} msnm • Resolución GeoTIFF 1 km
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 text-xs px-3 h-7">
                <Sparkles className="h-3 w-3 mr-1" /> GHI: {activeSourceInfo.annualGhi} kWh/m²/año
              </Badge>
              <a
                href="https://solar.minenergia.cl/sig"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-gray-500 hover:text-[#FF8300] flex items-center gap-1 font-medium ml-1"
              >
                Portal MinEnergía SIG <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Comparativa de Fuentes Satelitales */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Fuente de Radiación Satelital / Raster Seleccionada
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {dataset.sourcesAvailable.map((src) => {
                const isSelected = selectedSource === src.source
                return (
                  <div
                    key={src.source}
                    onClick={() => setSelectedSource(src.source)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#FF8300] bg-orange-50/40 ring-1 ring-[#FF8300]'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#1F1F1F] leading-tight">{src.name}</span>
                        {isSelected && (
                          <Badge className="bg-[#FF8300] text-white text-[9px] h-4 px-1.5 font-bold shrink-0 ml-1">Activo</Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                        {src.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-100/60 text-xs flex justify-between items-center">
                      <span className="text-[10px] text-gray-400">Resolución: {src.resolution}</span>
                      <strong className="text-gray-900 font-bold">{src.annualGhi} kWh/m²</strong>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Métricas Especializadas del Explorador Solar MinEnergía */}
          <div className="bg-gradient-to-r from-orange-50/30 via-white to-orange-50/20 p-4 rounded-2xl border border-orange-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1F1F1F] flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-[#FF8300]" /> Parámetros GeoTIFF MinEnergía SIG (Píxel 1 km²)
              </span>
              <span className="text-[10px] text-gray-500">
                Modelo Oficial CNE / MinEnergía Chile
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-gray-100">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Factor de Planta (Fijo)</span>
                <span className="text-base font-black text-emerald-600 block mt-0.5">{sigData.capacityFactorFixedPct}%</span>
                <span className="text-[10px] text-gray-500 block">{sigData.specificYieldFixedKwhKwp} kWh/kWp</span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-gray-100">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Factor Planta (1 Eje HSAT)</span>
                <span className="text-base font-black text-blue-600 block mt-0.5">{sigData.capacityFactorTrackingPct}%</span>
                <span className="text-[10px] text-gray-500 block">{sigData.specificYieldTrackingKwhKwp} kWh/kWp</span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-gray-100">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">DNI Anual (Directa)</span>
                <span className="text-base font-black text-amber-600 block mt-0.5">{sigData.annualDniKwhM2}</span>
                <span className="text-[10px] text-gray-500 block">kWh/m²/año</span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-gray-100">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Viento & Enfriamiento</span>
                <span className="text-base font-black text-gray-800 block mt-0.5">{sigData.avgWindSpeedMs} m/s</span>
                <span className="text-[10px] text-gray-500 block">Velocidad media anual</span>
              </div>
            </div>
          </div>

          {/* Resumen de Orientación Óptima */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50/60 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-orange-100 text-[#FF8300] flex items-center justify-center">
                <Compass className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Azimut Óptimo</span>
                <span className="text-sm font-bold text-[#1F1F1F]">0° Norte Geográfico</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Inclinación Anual Óptima</span>
                <span className="text-sm font-bold text-[#1F1F1F]">{dataset.optimalTiltDeg}° respecto al plano</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Thermometer className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Temp. Ambiente Media</span>
                <span className="text-sm font-bold text-[#1F1F1F]">{sigData.avgTempCelsius} °C (Zona Sur)</span>
              </div>
            </div>
          </div>

          {/* Tabla Mensual de Irradiancia y HSP */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Perfil Mensual de Irradiancia y Horas Sol Pico (HSP)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
              {dataset.monthlyResources.map((res) => (
                <div key={res.month} className="p-3 bg-white rounded-xl border border-gray-100 shadow-2xs text-center space-y-1">
                  <span className="font-bold text-xs text-[#1F1F1F] block">{res.month}</span>
                  <div className="py-1 bg-orange-50/50 rounded-lg">
                    <span className="text-[10px] text-gray-500 block">HSP Diario</span>
                    <span className="text-sm font-black text-[#FF8300] block">{res.hspDaily} h</span>
                  </div>
                  <span className="text-[10px] text-gray-400 block">
                    GHI: {res.ghiKwhM2} kWh/m²
                  </span>
                  <span className="text-[10px] text-gray-400 block">
                    Temp: {res.tempCelsius}°C
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
