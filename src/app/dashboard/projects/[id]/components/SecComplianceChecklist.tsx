'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileCheck, 
  FileText, 
  Zap, 
  Send, 
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { updateSecComplianceItemAction } from '@/app/dashboard/project-actions'
import { SEC_STAGES } from '@/lib/sec-compliance/catalog'
import { ComplianceStatus } from '@prisma/client'

interface SecItem {
  id: string
  stageNumber: number
  code: string
  title: string
  description: string | null
  status: ComplianceStatus
  documentUrl: string | null
  notes: string | null
  completedAt: Date | null
}

interface Props {
  projectId: string
  secCompliance: {
    id: string
    te4Folio: string | null
    distributor: string
    totalProgressPct: number
    items: SecItem[]
  } | null
}

export function SecComplianceChecklist({ projectId, secCompliance }: Props) {
  const [isPending, startTransition] = useTransition()
  const [expandedStage, setExpandedStage] = useState<number | null>(1)

  if (!secCompliance) {
    return (
      <div className="p-8 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
        No se ha inicializado el registro de cumplimiento SEC para este proyecto.
      </div>
    )
  }

  const items = secCompliance.items || []
  const progressPct = secCompliance.totalProgressPct

  const toggleStatus = (item: SecItem) => {
    const nextStatus: ComplianceStatus = 
      item.status === 'APPROVED' 
        ? 'PENDING' 
        : item.status === 'PENDING' 
        ? 'IN_PROGRESS' 
        : 'APPROVED'

    startTransition(async () => {
      await updateSecComplianceItemAction(item.id, projectId, nextStatus)
    })
  }

  const getStatusBadge = (status: ComplianceStatus) => {
    switch (status) {
      case 'APPROVED':
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 text-xs">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Aprobado / Listo
          </Badge>
        )
      case 'IN_PROGRESS':
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 text-xs">
            <Clock className="h-3 w-3 mr-1" /> En Trámite
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-gray-500 border-gray-200 text-xs">
            Pendiente
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Resumen de Cumplimiento & Folio TE4 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl border-gray-100 shadow-sm md:col-span-2 bg-gradient-to-r from-white to-orange-50/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-[#1F1F1F]">
                  Ruta de Tramitación SEC & Distribuidora ({secCompliance.distributor})
                </CardTitle>
                <CardDescription className="text-xs text-gray-500 mt-0.5">
                  Seguimiento normativo Ley 20.571 / 21.118 de Generación Distribuida (Net Billing)
                </CardDescription>
              </div>
              <span className="text-2xl font-black text-[#FF8300]">{progressPct}%</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={progressPct} className="h-2.5 bg-gray-100" />
            <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
              <span>5 Etapas Normativas</span>
              <span>
                {items.filter((i) => i.status === 'APPROVED').length} de {items.length} requisitos completados
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-100 shadow-sm flex flex-col justify-between p-5 bg-white">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Folio TE4 SEC</span>
              <FileCheck className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-lg font-bold text-[#1F1F1F]">
              {secCompliance.te4Folio || 'Sin Ingresar'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Trámite oficial ante la Superintendencia de Electricidad y Combustibles
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => alert(`Ficha Resumen TE4:\nProyecto ID: ${projectId}\nDistribuidora: ${secCompliance.distributor}\nProgreso: ${progressPct}%`)}
            className="w-full mt-3 rounded-xl border-orange-200 text-[#FF8300] hover:bg-orange-50 text-xs font-semibold"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Generar Ficha Resumen TE4
          </Button>
        </Card>
      </div>

      {/* 5 Etapas Detalladas */}
      <div className="space-y-4">
        {SEC_STAGES.map((stage) => {
          const stageItems = items.filter((i) => i.stageNumber === stage.stageNumber)
          const completedStageItems = stageItems.filter((i) => i.status === 'APPROVED').length
          const isExpanded = expandedStage === stage.stageNumber

          return (
            <div 
              key={stage.stageNumber} 
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all"
            >
              {/* Header Etapa */}
              <button
                type="button"
                onClick={() => setExpandedStage(isExpanded ? null : stage.stageNumber)}
                className="w-full flex items-center justify-between p-4 sm:px-6 hover:bg-gray-50/70 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                    completedStageItems === stageItems.length && stageItems.length > 0
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-orange-100 text-[#FF8300]'
                  }`}>
                    {completedStageItems === stageItems.length && stageItems.length > 0 ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      stage.stageNumber
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1F1F1F] text-sm sm:text-base">
                      {stage.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                      {stage.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-500 hidden sm:inline">
                    {completedStageItems}/{stageItems.length}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Items de la Etapa */}
              {isExpanded && (
                <div className="border-t border-gray-100 divide-y divide-gray-50 bg-gray-50/20 px-4 sm:px-6 py-2">
                  {stageItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id={item.id}
                          checked={item.status === 'APPROVED'}
                          onCheckedChange={() => toggleStatus(item)}
                          disabled={isPending}
                          className="mt-1 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 cursor-pointer"
                        />
                        <div>
                          <label 
                            htmlFor={item.id}
                            className="text-xs sm:text-sm font-medium text-[#1F1F1F] cursor-pointer hover:text-[#FF8300] transition-colors"
                          >
                            {item.title}
                          </label>
                          {item.description && (
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleStatus(item)}
                          disabled={isPending}
                          className="cursor-pointer"
                        >
                          {getStatusBadge(item.status)}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
