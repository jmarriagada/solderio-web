'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { SEC_CHECKLIST_TEMPLATES } from '@/lib/sec-compliance/catalog'
import { ComplianceStatus } from '@prisma/client'

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

  // Default coordinates based on chosen southern Chile comuna
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

  // 1. Create Project with Location, Electrical Consumption and Weather baseline
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
      inputsProgress: 15,
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
          tariffType: tariffType as any,
          annualTotal: 4800, // 400 kWh/month standard baseline
          connectedPowerKw: projectType === 'RESIDENTIAL' ? 10 : 50,
          monthlyData: [
            { month: 'Ene', kwh: 380, costClp: 65000 },
            { month: 'Feb', kwh: 360, costClp: 62000 },
            { month: 'Mar', kwh: 390, costClp: 67000 },
            { month: 'Abr', kwh: 420, costClp: 72000 },
            { month: 'May', kwh: 480, costClp: 82000 },
            { month: 'Jun', kwh: 510, costClp: 87000 },
            { month: 'Jul', kwh: 520, costClp: 89000 },
            { month: 'Ago', kwh: 490, costClp: 84000 },
            { month: 'Sep', kwh: 430, costClp: 74000 },
            { month: 'Oct', kwh: 400, costClp: 69000 },
            { month: 'Nov', kwh: 370, costClp: 63000 },
            { month: 'Dic', kwh: 390, costClp: 67000 },
          ],
        },
      },
      weatherData: {
        create: {
          source: 'SOLCAST_API',
          annualGhiKwhM2: 1350.5,
          avgTempCelsius: 11.8,
          monthlySpecificYieldKwhKwp: [
            { month: 'Ene', hsp: 5.8 },
            { month: 'Feb', hsp: 5.1 },
            { month: 'Mar', hsp: 4.2 },
            { month: 'Abr', hsp: 2.8 },
            { month: 'May', hsp: 1.8 },
            { month: 'Jun', hsp: 1.4 },
            { month: 'Jul', hsp: 1.6 },
            { month: 'Ago', hsp: 2.3 },
            { month: 'Sep', hsp: 3.4 },
            { month: 'Oct', hsp: 4.5 },
            { month: 'Nov', hsp: 5.4 },
            { month: 'Dic', hsp: 5.9 },
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

  // Recalculate progress for the project's SEC compliance
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
