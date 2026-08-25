'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Building, Zap, Save, Loader2, CheckCircle2, Navigation } from 'lucide-react'
import { updateProjectLocationAction } from '@/app/dashboard/project-actions'

interface Props {
  projectId: string
  clientName: string
  clientRut?: string | null
  projectType?: string | null
  configuration?: string | null
  location?: {
    comuna?: string | null
    region?: string | null
    distributor?: string | null
    address?: string | null
    latitude?: any
    longitude?: any
  } | null
}

export function LocationTariffEditor({
  projectId,
  clientName,
  clientRut,
  projectType = 'RESIDENTIAL',
  configuration = 'ON_GRID',
  location,
}: Props) {
  const [isPending, startTransition] = useTransition()
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [selectedComuna, setSelectedComuna] = useState(location?.comuna || 'Valdivia')
  const [selectedDistributor, setSelectedDistributor] = useState(location?.distributor || 'SAESA')
  const [currentConfig, setCurrentConfig] = useState(configuration || 'ON_GRID')
  const [currentType, setCurrentType] = useState(projectType || 'RESIDENTIAL')

  const coordsMap: Record<string, { lat: number; lng: number; region: string }> = {
    Valdivia: { lat: -39.8142, lng: -73.2459, region: 'Los Ríos' },
    'Puerto Varas': { lat: -41.3195, lng: -72.9854, region: 'Los Lagos' },
    'Puerto Montt': { lat: -41.4693, lng: -72.9424, region: 'Los Lagos' },
    Osorno: { lat: -40.5739, lng: -73.1335, region: 'Los Lagos' },
    Castro: { lat: -42.4721, lng: -73.7732, region: 'Los Lagos' },
    Temuco: { lat: -38.7359, lng: -72.5904, region: 'La Araucanía' },
  }

  const handleComunaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setSelectedComuna(val)
  }

  const handleSubmit = (formData: FormData) => {
    formData.append('configuration', currentConfig)
    formData.append('projectType', currentType)
    const def = coordsMap[selectedComuna]
    if (def) {
      formData.set('region', def.region)
      if (!formData.get('latitude')) formData.set('latitude', def.lat.toString())
      if (!formData.get('longitude')) formData.set('longitude', def.lng.toString())
    }

    startTransition(async () => {
      await updateProjectLocationAction(projectId, formData)
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    })
  }

  const currentLat = location?.latitude ? Number(location.latitude) : coordsMap[selectedComuna]?.lat || -39.8142
  const currentLng = location?.longitude ? Number(location.longitude) : coordsMap[selectedComuna]?.lng || -73.2459

  return (
    <Card className="rounded-2xl border-gray-100 shadow-sm bg-white overflow-hidden">
      <CardHeader className="pb-4 border-b border-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF8300]">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-[#1F1F1F]">
                Emplazamiento Geográfico y Conexión a Red
              </CardTitle>
              <CardDescription className="text-xs text-gray-500 mt-0.5">
                Parámetros de ubicación para cálculo de irradiancia solar y normativa de distribuidora
              </CardDescription>
            </div>
          </div>
          {savedSuccess && (
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Cambios Guardados
            </Badge>
          )}
        </div>
      </CardHeader>

      <form action={handleSubmit}>
        <CardContent className="p-6 space-y-6">
          {/* Identificación del Cliente */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="clientName" className="text-xs font-semibold text-gray-700">
                Nombre del Cliente o Empresa
              </Label>
              <Input
                id="clientName"
                name="clientName"
                defaultValue={clientName}
                required
                className="h-10 rounded-xl border-gray-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="clientRut" className="text-xs font-semibold text-gray-700">
                RUT Titular del Empalme Eléctrico
              </Label>
              <Input
                id="clientRut"
                name="clientRut"
                defaultValue={clientRut || ''}
                placeholder="76.123.456-7"
                className="h-10 rounded-xl border-gray-200"
              />
            </div>
          </div>

          {/* Segmento & Configuración */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">
                Segmento de Proyecto
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentType('RESIDENTIAL')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    currentType === 'RESIDENTIAL'
                      ? 'border-[#FF8300] bg-orange-50/60 text-[#FF8300]'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Residencial (≤20 kWp)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentType('COMMERCIAL')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    currentType === 'COMMERCIAL'
                      ? 'border-[#FF8300] bg-orange-50/60 text-[#FF8300]'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  C&I (≤300 kWp)
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">
                Configuración Eléctrica
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'ON_GRID', label: 'On-Grid' },
                  { id: 'HYBRID', label: 'Híbrido' },
                  { id: 'OFF_GRID', label: 'Off-Grid' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCurrentConfig(item.id)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                      currentConfig === item.id
                        ? 'border-[#FF8300] bg-orange-50/60 text-[#FF8300]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ubicación & Coordenadas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="comuna" className="text-xs font-semibold text-gray-700">
                Comuna
              </Label>
              <select
                id="comuna"
                name="comuna"
                value={selectedComuna}
                onChange={handleComunaChange}
                className="w-full h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm focus:ring-[#FF8300] focus:border-[#FF8300]"
              >
                <option value="Valdivia">Valdivia (Los Ríos)</option>
                <option value="Puerto Varas">Puerto Varas (Los Lagos)</option>
                <option value="Puerto Montt">Puerto Montt (Los Lagos)</option>
                <option value="Osorno">Osorno (Los Lagos)</option>
                <option value="Castro">Castro (Chiloé)</option>
                <option value="Temuco">Temuco (La Araucanía)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="distributor" className="text-xs font-semibold text-gray-700">
                Distribuidora Eléctrica
              </Label>
              <select
                id="distributor"
                name="distributor"
                value={selectedDistributor}
                onChange={(e) => setSelectedDistributor(e.target.value)}
                className="w-full h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm focus:ring-[#FF8300] focus:border-[#FF8300]"
              >
                <option value="SAESA">SAESA</option>
                <option value="FRONTEL">FRONTEL</option>
                <option value="LUZ_OSORNO">Luz Osorno</option>
                <option value="CRELL">CRELL</option>
                <option value="CGE">CGE</option>
                <option value="ENEL">Enel Distribución</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address" className="text-xs font-semibold text-gray-700">
                Dirección / Sector
              </Label>
              <Input
                id="address"
                name="address"
                defaultValue={location?.address || ''}
                placeholder="ej: Camino Isla Teja Km 2.5"
                className="h-10 rounded-xl border-gray-200"
              />
            </div>
          </div>

          {/* Coordenadas GPS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/60 p-4 rounded-xl border border-gray-100">
            <div className="space-y-1">
              <Label htmlFor="latitude" className="text-xs font-medium text-gray-600 flex items-center gap-1">
                <Navigation className="h-3.5 w-3.5 text-gray-400" /> Latitud (Decimal)
              </Label>
              <Input
                id="latitude"
                name="latitude"
                type="number"
                step="0.0001"
                defaultValue={currentLat}
                className="h-9 rounded-lg bg-white border-gray-200 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="longitude" className="text-xs font-medium text-gray-600 flex items-center gap-1">
                <Navigation className="h-3.5 w-3.5 text-gray-400" /> Longitud (Decimal)
              </Label>
              <Input
                id="longitude"
                name="longitude"
                type="number"
                step="0.0001"
                defaultValue={currentLng}
                className="h-9 rounded-lg bg-white border-gray-200 text-xs"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-gray-50/50 px-6 py-4 border-t border-gray-100 flex justify-end">
          <Button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-[#FF8300] hover:bg-[#E67600] text-white font-semibold text-xs h-10 px-5 shadow-sm cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1.5" /> Guardar Parámetros de Ubicación
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
