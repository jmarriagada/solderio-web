'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Sparkles, 
  Layers, 
  Workflow,
  Sliders
} from 'lucide-react'
import { SolarDesignWizard } from './SolarDesignWizard'

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
  return (
    <div className="space-y-6">
      {/* Flagship Guided Wizard Experience */}
      <SolarDesignWizard project={project} />
    </div>
  )
}
