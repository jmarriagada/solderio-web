'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ShieldCheck, 
  Calculator, 
  Zap, 
  Sun, 
  MapPin, 
  BarChart3, 
  FileText, 
  Sliders,
  DollarSign
} from 'lucide-react'
import { LocationTariffEditor } from './LocationTariffEditor'
import { ConsumptionEditor } from './ConsumptionEditor'
import { SolarTMYViewer } from './SolarTMYViewer'
import { SizingEngineTab } from './SizingEngineTab'
import { FinancialAnalysisTab } from './FinancialAnalysisTab'
import { ProjectReportsTab } from './ProjectReportsTab'
import { SecComplianceChecklist } from './SecComplianceChecklist'
import { computeSolarScenarios } from '@/lib/solar/sizing-engine'
import { MonthlyConsumptionRecord, SizingScenarioResult } from '@/lib/solar/solar-types'

interface Props {
  project: {
    id: string
    clientName: string
    clientRut: string | null
    projectType: string | null
    configuration: string | null
    status: string
    location: {
      comuna: string | null
      region: string | null
      distributor: string | null
      address: string | null
      latitude: any
      longitude: any
    } | null
    consumption: {
      tariffType: string
      annualTotal: any
      connectedPowerKw: any
      monthlyData: any
    } | null
    secCompliance: any
  }
}

export function WorkspaceClientView({ project }: Props) {
  const [activeTab, setActiveTab] = useState('scenarios')

  const comunaName = project.location?.comuna || 'Valdivia'
  const distributorName = project.location?.distributor || 'SAESA'
  const annualKwh = Number(project.consumption?.annualTotal || 4800)
  const monthlyData = (project.consumption?.monthlyData as MonthlyConsumptionRecord[]) || []

  // Compute default active scenario (Net Billing Óptimo)
  const initialScenarios = computeSolarScenarios({
    annualConsumptionKwh: annualKwh,
    monthlyConsumption: monthlyData,
    comunaName,
    distributorName,
  })

  const [selectedScenario, setSelectedScenario] = useState<SizingScenarioResult>(initialScenarios[1])

  return (
    <div className="space-y-6">
      {/* Workspace Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="overflow-x-auto pb-1">
          <TabsList className="bg-white p-1 rounded-2xl border border-gray-100 shadow-sm h-12 inline-flex min-w-full sm:min-w-0">
            <TabsTrigger 
              value="scenarios" 
              className="rounded-xl data-[state=active]:bg-orange-50 data-[state=active]:text-[#FF8300] font-semibold text-xs px-3.5"
            >
              <Calculator className="h-4 w-4 mr-1.5" />
              ☀️ 4 Escenarios FV
            </TabsTrigger>

            <TabsTrigger 
              value="consumption" 
              className="rounded-xl data-[state=active]:bg-orange-50 data-[state=active]:text-[#FF8300] font-semibold text-xs px-3.5"
            >
              <Zap className="h-4 w-4 mr-1.5" />
              📊 Consumo & Tarifa
            </TabsTrigger>

            <TabsTrigger 
              value="weather" 
              className="rounded-xl data-[state=active]:bg-orange-50 data-[state=active]:text-[#FF8300] font-semibold text-xs px-3.5"
            >
              <Sun className="h-4 w-4 mr-1.5" />
              🌤️ Recurso TMY
            </TabsTrigger>

            <TabsTrigger 
              value="financial" 
              className="rounded-xl data-[state=active]:bg-orange-50 data-[state=active]:text-[#FF8300] font-semibold text-xs px-3.5"
            >
              <BarChart3 className="h-4 w-4 mr-1.5" />
              💰 Finanzas 25 Años
            </TabsTrigger>

            <TabsTrigger 
              value="sec" 
              className="rounded-xl data-[state=active]:bg-orange-50 data-[state=active]:text-[#FF8300] font-semibold text-xs px-3.5"
            >
              <ShieldCheck className="h-4 w-4 mr-1.5" />
              ⚡ Trámite SEC ({project.secCompliance?.totalProgressPct || 0}%)
            </TabsTrigger>

            <TabsTrigger 
              value="reports" 
              className="rounded-xl data-[state=active]:bg-orange-50 data-[state=active]:text-[#FF8300] font-semibold text-xs px-3.5"
            >
              <FileText className="h-4 w-4 mr-1.5" />
              📄 Reportes & PDF
            </TabsTrigger>

            <TabsTrigger 
              value="location" 
              className="rounded-xl data-[state=active]:bg-orange-50 data-[state=active]:text-[#FF8300] font-semibold text-xs px-3.5"
            >
              <MapPin className="h-4 w-4 mr-1.5" />
              📍 Emplazamiento
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: 4 Escenarios de Dimensionamiento */}
        <TabsContent value="scenarios" className="focus-visible:ring-0">
          <SizingEngineTab
            annualConsumptionKwh={annualKwh}
            monthlyConsumption={monthlyData}
            comunaName={comunaName}
            distributorName={distributorName}
            onSelectScenario={(sc) => setSelectedScenario(sc)}
          />
        </TabsContent>

        {/* Tab 2: Consumo Eléctrico */}
        <TabsContent value="consumption" className="focus-visible:ring-0">
          <ConsumptionEditor
            projectId={project.id}
            initialTariffType={project.consumption?.tariffType}
            initialConnectedPowerKw={Number(project.consumption?.connectedPowerKw) || 10}
            initialMonthlyData={monthlyData}
            distributorName={distributorName}
          />
        </TabsContent>

        {/* Tab 3: Recurso Solar TMY */}
        <TabsContent value="weather" className="focus-visible:ring-0">
          <SolarTMYViewer comunaName={comunaName} />
        </TabsContent>

        {/* Tab 4: Evaluación Financiera */}
        <TabsContent value="financial" className="focus-visible:ring-0">
          <FinancialAnalysisTab
            scenario={selectedScenario}
            distributorName={distributorName}
          />
        </TabsContent>

        {/* Tab 5: Tramitación SEC */}
        <TabsContent value="sec" className="focus-visible:ring-0">
          <SecComplianceChecklist
            projectId={project.id}
            secCompliance={project.secCompliance}
          />
        </TabsContent>

        {/* Tab 6: Reportes */}
        <TabsContent value="reports" className="focus-visible:ring-0">
          <ProjectReportsTab
            clientName={project.clientName}
            clientRut={project.clientRut}
            comunaName={comunaName}
            distributorName={distributorName}
            scenario={selectedScenario}
            annualConsumptionKwh={annualKwh}
          />
        </TabsContent>

        {/* Tab 7: Ubicación & Emplazamiento */}
        <TabsContent value="location" className="focus-visible:ring-0">
          <LocationTariffEditor
            projectId={project.id}
            clientName={project.clientName}
            clientRut={project.clientRut}
            projectType={project.projectType}
            configuration={project.configuration}
            location={project.location}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
