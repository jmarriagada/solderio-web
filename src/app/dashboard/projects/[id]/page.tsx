import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  MapPin, 
  Sun, 
  Battery, 
  Zap, 
  ShieldCheck, 
  Printer
} from 'lucide-react'
import { WorkspaceClientView } from './components/WorkspaceClientView'

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

      {/* Main Interactive Workspace */}
      <WorkspaceClientView project={project as any} />
    </div>
  )
}
