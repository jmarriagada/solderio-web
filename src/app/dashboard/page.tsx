import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { Search, MapPin, Battery, FileText, Sun, Zap, CheckCircle2, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { prisma } from '@/lib/prisma'
import { NewProjectDialog } from './components/NewProjectDialog'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { 
      location: true,
      secCompliance: true,
    }
  })

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1F1F1F]">Proyectos FV</h1>
          <p className="text-gray-500 mt-1">Mesa de ingeniería, dimensionamiento y tramitación SEC.</p>
        </div>
        <NewProjectDialog />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input 
            placeholder="Buscar por cliente, RUT o comuna..." 
            className="pl-10 border-0 shadow-none focus-visible:ring-0 bg-transparent h-10"
          />
        </div>
        <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
        <div className="hidden sm:flex gap-2">
          <Button variant="outline" className="rounded-xl border-gray-200 text-xs h-9">Todos</Button>
          <Button variant="ghost" className="rounded-xl text-gray-500 text-xs h-9">Residencial</Button>
          <Button variant="ghost" className="rounded-xl text-gray-500 text-xs h-9">C&I</Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-gray-600 py-4 pl-6">Cliente / Proyecto</TableHead>
              <TableHead className="font-semibold text-gray-600">Ubicación & Red</TableHead>
              <TableHead className="font-semibold text-gray-600">Configuración</TableHead>
              <TableHead className="font-semibold text-gray-600">Estado SEC</TableHead>
              <TableHead className="font-semibold text-gray-600 text-right pr-6">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Sun className="h-8 w-8 text-orange-300 animate-pulse" />
                    <p className="font-medium text-gray-700">No hay proyectos creados aún</p>
                    <p className="text-xs text-gray-400">Haz clic en "+ Nuevo Proyecto" para registrar tu primer cliente.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id} className="hover:bg-orange-50/30 transition-colors group">
                  <TableCell className="py-4 pl-6">
                    <Link href={`/dashboard/projects/${project.id}`} className="block">
                      <p className="font-semibold text-[#1F1F1F] group-hover:text-[#FF8300] transition-colors">{project.clientName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {project.projectType === 'RESIDENTIAL' ? 'Residencial (≤20 kWp)' : 'Comercial e Industrial (≤300 kWp)'}
                        {project.clientRut && ` • ${project.clientRut}`}
                      </p>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-4 w-4 mr-1.5 text-gray-400 shrink-0" />
                      <span>{project.location?.comuna || 'Valdivia'}</span>
                      <span className="text-xs text-gray-400 ml-1.5">({project.location?.distributor || 'SAESA'})</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-gray-600 text-sm">
                      {project.configuration === 'HYBRID' ? (
                        <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700">
                          <Battery className="h-3.5 w-3.5 mr-1" /> Híbrido
                        </Badge>
                      ) : project.configuration === 'OFF_GRID' ? (
                        <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                          <Zap className="h-3.5 w-3.5 mr-1" /> Off-Grid
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                          <Sun className="h-3.5 w-3.5 mr-1" /> On-Grid (Net Billing)
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-gray-700">
                          TE4 / Conexión: {project.secCompliance?.totalProgressPct || 0}%
                        </span>
                      </div>
                      <div className="h-1.5 w-28 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#FF8300] rounded-full transition-all" 
                          style={{ width: `${project.secCompliance?.totalProgressPct || 0}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Link 
                      href={`/dashboard/projects/${project.id}`}
                      className="inline-flex items-center justify-center h-8 px-3 rounded-lg text-xs font-medium bg-gray-50 hover:bg-[#FF8300] hover:text-white transition-all text-gray-700"
                    >
                      Abrir Mesa
                      <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
