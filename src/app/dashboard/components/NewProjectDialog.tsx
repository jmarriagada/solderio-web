'use client'

import { useState, useTransition } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Sun, Loader2, MapPin, Building, Home, Zap } from 'lucide-react'
import { createProjectAction } from '../project-actions'

export function NewProjectDialog() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [projectType, setProjectType] = useState<'RESIDENTIAL' | 'COMMERCIAL'>('RESIDENTIAL')
  const [configuration, setConfiguration] = useState<'ON_GRID' | 'OFF_GRID' | 'HYBRID'>('ON_GRID')

  async function handleSubmit(formData: FormData) {
    formData.append('projectType', projectType)
    formData.append('configuration', configuration)
    startTransition(async () => {
      await createProjectAction(formData)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-11 rounded-xl bg-[#FF8300] hover:bg-[#E67600] text-white shadow-sm shrink-0 cursor-pointer font-semibold">
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Proyecto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[620px] rounded-[24px] bg-white p-6 max-h-[90vh] overflow-y-auto shadow-2xl border-gray-100">
        <DialogHeader className="space-y-1 text-left pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center text-[#FF8300]">
              <Sun className="h-5 w-5" />
            </div>
            <DialogTitle className="text-xl font-bold text-[#1F1F1F]">
              Nuevo Proyecto Solar FV
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-gray-500">
            Ingresa los datos iniciales para comenzar el dimensionamiento y la ruta regulatoria SEC.
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-5 pt-2">
          {/* Segmento & Configuración */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                Segmento de Cliente
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setProjectType('RESIDENTIAL')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                    projectType === 'RESIDENTIAL'
                      ? 'border-[#FF8300] bg-orange-50/50 text-[#FF8300]'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Home className="h-4 w-4 mb-1" />
                  Residencial (&le;20kWp)
                </button>
                <button
                  type="button"
                  onClick={() => setProjectType('COMMERCIAL')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                    projectType === 'COMMERCIAL'
                      ? 'border-[#FF8300] bg-orange-50/50 text-[#FF8300]'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Building className="h-4 w-4 mb-1" />
                  C&I (&le;300kWp)
                </button>
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                Tipo de Sistema
              </Label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'ON_GRID', label: 'On-Grid' },
                  { id: 'HYBRID', label: 'Híbrido' },
                  { id: 'OFF_GRID', label: 'Off-Grid' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setConfiguration(item.id as any)}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                      configuration === item.id
                        ? 'border-[#FF8300] bg-orange-50/50 text-[#FF8300]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Datos del Cliente */}
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Datos del Cliente y Emplazamiento
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="clientName" className="text-xs font-medium text-gray-700">
                  Nombre del Cliente / Empresa *
                </Label>
                <Input
                  id="clientName"
                  name="clientName"
                  placeholder="ej: Agrícola Los Ríos SpA"
                  required
                  className="rounded-xl h-10 border-gray-200"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="clientRut" className="text-xs font-medium text-gray-700">
                  RUT Titular Empalme
                </Label>
                <Input
                  id="clientRut"
                  name="clientRut"
                  placeholder="76.123.456-7"
                  className="rounded-xl h-10 border-gray-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="clientEmail" className="text-xs font-medium text-gray-700">
                  Email de Contacto
                </Label>
                <Input
                  id="clientEmail"
                  name="clientEmail"
                  type="email"
                  placeholder="contacto@cliente.cl"
                  className="rounded-xl h-10 border-gray-200"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="clientPhone" className="text-xs font-medium text-gray-700">
                  Teléfono
                </Label>
                <Input
                  id="clientPhone"
                  name="clientPhone"
                  placeholder="+56 9 1234 5678"
                  className="rounded-xl h-10 border-gray-200"
                />
              </div>
            </div>
          </div>

          {/* Ubicación & Tarifa */}
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Ubicación y Tarifa Distribuidora
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="comuna" className="text-xs font-medium text-gray-700">
                  Comuna (Chile Sur)
                </Label>
                <select
                  id="comuna"
                  name="comuna"
                  defaultValue="Valdivia"
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

              <div className="space-y-1">
                <Label htmlFor="distributor" className="text-xs font-medium text-gray-700">
                  Distribuidora
                </Label>
                <select
                  id="distributor"
                  name="distributor"
                  defaultValue="SAESA"
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

              <div className="space-y-1">
                <Label htmlFor="tariffType" className="text-xs font-medium text-gray-700">
                  Tarifa Eléctrica
                </Label>
                <select
                  id="tariffType"
                  name="tariffType"
                  defaultValue="BT1"
                  className="w-full h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm focus:ring-[#FF8300] focus:border-[#FF8300]"
                >
                  <option value="BT1">BT1 (Residencial Simple)</option>
                  <option value="BT2">BT2 (Potencia Contratada)</option>
                  <option value="BT3">BT3 (Potencia Leída)</option>
                  <option value="BT4_3">BT4.3 (Horaria BT)</option>
                  <option value="AT3">AT3 (Media Tensión)</option>
                  <option value="AT4_3">AT4.3 (Horaria MT)</option>
                </select>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-xl border-gray-200"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-[#FF8300] hover:bg-[#E67600] text-white font-semibold shadow-md min-w-[140px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear & Abrir Mesa'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
