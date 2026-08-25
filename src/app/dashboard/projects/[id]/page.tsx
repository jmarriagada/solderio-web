import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  MapPin, 
  Sun, 
  Battery, 
  Zap, 
  FileText, 
  Layers, 
  Calculator, 
  ShieldCheck, 
  Download,
  Building,
  Home,
  CheckCircle2,
  Clock
} from 'lucide-react'
import { SecComplianceChecklist } from './components/SecComplianceChecklist'
import { ScenariosTab } from './components/ScenariosTab'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProjectWorkspacePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      location: true,
      consumption: true,
      weatherData: true,
      secCompliance: {
        include: {
          items: {
            orderBy: [{ stageNumber: 'asc' }, { code: 'asc' }],
          },
        },
      },
    },
  })

  if (!project) {
    notFound()
  }

  const annualKwh = Number(project.consumption?.annualTotal || 4800)
  const connectedKw = Number(project.consumption?.connectedPowerKw || 10)
  const monthlyData = (project.consumption?.monthlyData as Array<{ month: string; kwh: number; costClp: number }>) || []
  const comuna = project.location?.comuna || 'Valdivia'
  const distributor = project.location?.distributor || 'SAESA'

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Breadcrumb & Top Actions */}
      <div className="flex items-center justify-between">
        <Link 
          href="/dashboard"
          className="inline-flex items-center text-xs font-medium text-gray-500 hover:text-[#FF8300] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Volver a Proyectos
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-xl border-gray-200 text-xs font-medium">
            <Download className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
            Exportar Propuesta PDF
          </Button>
        </div>
      </div>

      {/* Workspace Header */}
      <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-[#1F1F1F]">
                {project.clientName}
              </h1>
              <Badge variant="secondary" className="rounded-md font-normal bg-orange-50 text-[#FF8300] border-orange-100">
                {project.projectType === 'RESIDENTIAL' ? 'Residencial (≤20 kWp)' : 'Comercial e Industrial (≤300 kWp)'}
              </Badge>
              {project.configuration === 'HYBRID' ? (
                <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700">
                  <Battery className="h-3 w-3 mr-1" /> Híbrido
                </Badge>
              ) : project.configuration === 'OFF_GRID' ? (
                <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                  <Zap className="h-3 w-3 mr-1" /> Off-Grid
                </Badge>
              ) : (
                <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                  <Sun className="h-3 w-3 mr-1" /> On-Grid Net Billing
                </Badge>
              )}
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-3 flex-wrap">
              <span className="flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
                {comuna}, {project.location?.region || 'Los Ríos'}
              </span>
              <span>•</span>
              <span>Distribuidora: <strong className="text-gray-700">{distributor}</strong></span>
              {project.clientRut && (
                <>
                  <span>•</span>
                  <span>RUT: {project.clientRut}</span>
                </>
              )}
            </p>
          </div>

          {/* Mini Status Box */}
          <div className="flex items-center gap-3 bg-gray-50/80 p-3 rounded-2xl border border-gray-100 shrink-0">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                Progreso SEC
              </span>
              <span className="text-sm font-black text-[#FF8300]">
                {project.secCompliance?.totalProgressPct || 0}%
              </span>
            </div>
            <div className="h-8 w-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF8300]">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Tabs */}
      <Tabs defaultValue="sec" className="space-y-6">
        <TabsList className="bg-white p-1 rounded-2xl border border-gray-100 shadow-sm h-12 inline-flex">
          <TabsTrigger 
            value="sec" 
            className="rounded-xl data-[state=active]:bg-orange-50 data-[state=active]:text-[#FF8300] font-semibold text-xs px-4"
          >
            <ShieldCheck className="h-4 w-4 mr-2" />
            ⚡ Tramitación SEC & Distribuidora
          </TabsTrigger>
          <TabsTrigger 
            value="scenarios" 
            className="rounded-xl data-[state=active]:bg-orange-50 data-[state=active]:text-[#FF8300] font-semibold text-xs px-4"
          >
            <Calculator className="h-4 w-4 mr-2" />
            ☀️ 4 Escenarios de Dimensionamiento
          </TabsTrigger>
          <TabsTrigger 
            value="consumption" 
            className="rounded-xl data-[state=active]:bg-orange-50 data-[state=active]:text-[#FF8300] font-semibold text-xs px-4"
          >
            <Zap className="h-4 w-4 mr-2" />
            📊 Consumo & Tarifa ({project.consumption?.tariffType || 'BT1'})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: SEC Compliance */}
        <TabsContent value="sec" className="focus-visible:ring-0">
          <SecComplianceChecklist 
            projectId={project.id} 
            secCompliance={project.secCompliance as any} 
          />
        </TabsContent>

        {/* Tab 2: 4 Scenarios */}
        <TabsContent value="scenarios" className="focus-visible:ring-0">
          <ScenariosTab 
            annualConsumptionKwh={annualKwh}
            connectedPowerKw={connectedKw}
            comuna={comuna}
            distributor={distributor}
          />
        </TabsContent>

        {/* Tab 3: Consumption */}
        <TabsContent value="consumption" className="focus-visible:ring-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#1F1F1F]">
                  Perfil de Consumo Eléctrico Anual
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Tarifa {project.consumption?.tariffType || 'BT1'} • Distribuidora {distributor}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 block">Total Anual</span>
                <span className="text-xl font-black text-[#1F1F1F]">
                  {annualKwh.toLocaleString('es-CL')} kWh
                </span>
              </div>
            </div>

            {/* Monthly Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {monthlyData.map((m) => (
                <div key={m.month} className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                  <span className="text-xs font-bold text-gray-700 block">{m.month}</span>
                  <span className="text-sm font-black text-[#FF8300] block mt-1">{m.kwh} kWh</span>
                  <span className="text-[11px] text-gray-500 block">${m.costClp.toLocaleString('es-CL')}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
