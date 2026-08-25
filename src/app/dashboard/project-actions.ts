'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { SEC_CHECKLIST_TEMPLATES } from '@/lib/sec-compliance/catalog'
import { ComplianceStatus, TariffType } from '@prisma/client'

export async function createProjectAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('No autorizado')
  }

  const clientName = formData.get('clientName') as string
  const clientRut = formData.get('clientRut') as string
  const clientEmail = formData.get('clientEmail') as string
  const clientPhone = formData.get('clientPhone') as string
  const projectName = (formData.get('projectName') as string) || clientName
  const projectType = (formData.get('projectType') as string) || 'RESIDENTIAL'
  const configuration = (formData.get('configuration') as string) || 'ON_GRID'
  const comuna = (formData.get('comuna') as string) || 'Valdivia'
  const region = (formData.get('region') as string) || 'Los Ríos'
  const distributor = (formData.get('distributor') as string) || 'SAESA'
  const tariffType = (formData.get('tariffType') as string) || 'BT1'

  const coordsMap: Record<string, { lat: number; lng: number }> = {
    Valdivia: { lat: -39.8142, lng: -73.2459 },
    'Puerto Varas': { lat: -41.3195, lng: -72.9854 },
    'Puerto Montt': { lat: -41.4693, lng: -72.9424 },
    Osorno: { lat: -40.5739, lng: -73.1335 },
    Castro: { lat: -42.4721, lng: -73.7732 },
    Temuco: { lat: -38.7359, lng: -72.5904 },
  }

  const defaultCoords = coordsMap[comuna] || { lat: -39.8142, lng: -73.2459 }

  // 0. Ensure user exists in public.User table
  await prisma.user.upsert({
    where: { id: user.id },
    update: { email: user.email || '' },
    create: {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'Ingeniero SoldeRío',
      role: 'SENIOR_ENGINEER',
    },
  })

  // 1. Create Project with Location, Electrical Consumption, Weather baseline and SEC Compliance
  const project = await prisma.project.create({
    data: {
      userId: user.id,
      clientName,
      clientRut,
      clientEmail,
      clientPhone,
      projectName,
      projectType,
      configuration,
      status: 'DRAFT',
      inputsProgress: 25,
      location: {
        create: {
          comuna,
          region,
          distributor,
          latitude: defaultCoords.lat,
          longitude: defaultCoords.lng,
        },
      },
      consumption: {
        create: {
          tariffType: tariffType as TariffType,
          annualTotal: 4800,
          connectedPowerKw: projectType === 'RESIDENTIAL' ? 10 : 50,
          monthlyData: [
            { month: 'Ene', kwh: 380, costClp: 66500 },
            { month: 'Feb', kwh: 360, costClp: 63000 },
            { month: 'Mar', kwh: 390, costClp: 68250 },
            { month: 'Abr', kwh: 420, costClp: 73500 },
            { month: 'May', kwh: 480, costClp: 84000 },
            { month: 'Jun', kwh: 510, costClp: 89250 },
            { month: 'Jul', kwh: 520, costClp: 91000 },
            { month: 'Ago', kwh: 490, costClp: 85750 },
            { month: 'Sep', kwh: 430, costClp: 75250 },
            { month: 'Oct', kwh: 400, costClp: 70000 },
            { month: 'Nov', kwh: 370, costClp: 64750 },
            { month: 'Dic', kwh: 390, costClp: 68250 },
          ],
        },
      },
      weatherData: {
        create: {
          source: 'SOLCAST_API',
          annualGhiKwhM2: 1380.0,
          avgTempCelsius: 12.2,
          monthlySpecificYieldKwhKwp: [
            { month: 'Ene', hsp: 6.38 },
            { month: 'Feb', hsp: 5.89 },
            { month: 'Mar', hsp: 4.35 },
            { month: 'Abr', hsp: 2.73 },
            { month: 'May', hsp: 1.55 },
            { month: 'Jun', hsp: 1.17 },
            { month: 'Jul', hsp: 1.35 },
            { month: 'Ago', hsp: 2.19 },
            { month: 'Sep', hsp: 3.50 },
            { month: 'Oct', hsp: 4.77 },
            { month: 'Nov', hsp: 5.73 },
            { month: 'Dic', hsp: 5.87 },
          ],
        },
      },
      secCompliance: {
        create: {
          distributor,
          totalProgressPct: 0,
          items: {
            create: SEC_CHECKLIST_TEMPLATES.map((item) => ({
              stageNumber: item.stageNumber,
              code: item.code,
              title: item.title,
              description: item.description,
              status: 'PENDING',
            })),
          },
        },
      },
    },
  })

  revalidatePath('/dashboard')
  redirect(`/dashboard/projects/${project.id}`)
}

export async function updateSecComplianceItemAction(
  itemId: string,
  projectId: string,
  newStatus: ComplianceStatus,
  notes?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('No autorizado')
  }

  await prisma.secComplianceItem.update({
    where: { id: itemId },
    data: {
      status: newStatus,
      notes: notes || undefined,
      completedAt: newStatus === 'APPROVED' ? new Date() : null,
    },
  })

  // Recalculate progress
  const sec = await prisma.secCompliance.findUnique({
    where: { projectId },
    include: { items: true },
  })

  if (sec) {
    const totalItems = sec.items.length
    const approvedItems = sec.items.filter((i) => i.status === 'APPROVED' || i.status === 'NOT_APPLICABLE').length
    const progress = totalItems > 0 ? Math.round((approvedItems / totalItems) * 100) : 0

    await prisma.secCompliance.update({
      where: { projectId },
      data: { totalProgressPct: progress },
    })
  }

  revalidatePath(`/dashboard/projects/${projectId}`)
}

export async function updateProjectLocationAction(
  projectId: string, 
  data: FormData | {
    clientName?: string
    clientRut?: string | null
    configuration?: string | null
    projectType?: string | null
    comuna?: string | null
    region?: string | null
    distributor?: string | null
    address?: string | null
    latitude?: number | null
    longitude?: number | null
  }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('No autorizado')
  }

  let comuna: string | undefined
  let region: string | undefined
  let distributor: string | undefined
  let address: string | undefined
  let lat: number | undefined
  let lng: number | undefined
  let clientName: string | undefined
  let clientRut: string | undefined
  let configuration: string | undefined
  let projectType: string | undefined

  if (data instanceof FormData) {
    comuna = (data.get('comuna') as string) || undefined
    region = (data.get('region') as string) || undefined
    distributor = (data.get('distributor') as string) || undefined
    address = (data.get('address') as string) || undefined
    lat = parseFloat(data.get('latitude') as string)
    lng = parseFloat(data.get('longitude') as string)
    clientName = (data.get('clientName') as string) || undefined
    clientRut = (data.get('clientRut') as string) || undefined
    configuration = (data.get('configuration') as string) || undefined
    projectType = (data.get('projectType') as string) || undefined
  } else {
    comuna = data.comuna || undefined
    region = data.region || undefined
    distributor = data.distributor || undefined
    address = data.address || undefined
    lat = data.latitude ?? undefined
    lng = data.longitude ?? undefined
    clientName = data.clientName || undefined
    clientRut = data.clientRut || undefined
    configuration = data.configuration || undefined
    projectType = data.projectType || undefined
  }

  const validLat = lat !== undefined && !isNaN(lat) ? lat : undefined
  const validLng = lng !== undefined && !isNaN(lng) ? lng : undefined

  await prisma.project.update({
    where: { id: projectId },
      data: {
        clientName: clientName || undefined,
        clientRut: clientRut || undefined,
        configuration: configuration || undefined,
        projectType: projectType || undefined,
        location: {
          upsert: {
            create: {
              comuna,
              region,
              distributor,
              address,
              latitude: validLat ?? -39.8142,
              longitude: validLng ?? -73.2459,
            },
            update: {
              comuna,
              region,
              distributor,
              address,
              latitude: validLat,
              longitude: validLng,
            },
          },
        },
      },
    })

  revalidatePath(`/dashboard/projects/${projectId}`)
  revalidatePath('/dashboard')
}

export async function updateProjectConsumptionAction(
  projectId: string, 
  tariffType: string,
  connectedPowerKw: number,
  monthlyData: Array<{ month: string; kwh: number; costClp: number }>
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('No autorizado')
  }

  const annualTotal = monthlyData.reduce((acc, curr) => acc + (Number(curr.kwh) || 0), 0)

  await prisma.electricalConsumption.upsert({
    where: { projectId },
    create: {
      projectId,
      tariffType: tariffType as TariffType,
      connectedPowerKw,
      annualTotal,
      monthlyData,
    },
    update: {
      tariffType: tariffType as TariffType,
      connectedPowerKw,
      annualTotal,
      monthlyData,
    },
  })

  revalidatePath(`/dashboard/projects/${projectId}`)
}
