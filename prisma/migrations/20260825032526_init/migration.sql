-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SENIOR_ENGINEER', 'DESIGNER', 'VIEWER');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'UNDER_REVIEW', 'QUOTED', 'APPROVED', 'IN_CONSTRUCTION', 'COMPLETED');

-- CreateEnum
CREATE TYPE "SystemType" AS ENUM ('ON_GRID', 'OFF_GRID', 'HYBRID');

-- CreateEnum
CREATE TYPE "StructureType" AS ENUM ('ASPHALT_SHINGLE', 'CLAY_TILE', 'CORRUGATED_FIBER_CEMENT', 'CONCRETE_FLAT', 'METAL_SEAM', 'GROUND_MOUNT', 'CARPORT');

-- CreateEnum
CREATE TYPE "TariffType" AS ENUM ('BT1', 'BT1_ECO', 'BT2', 'BT3', 'BT4_1', 'BT4_2', 'BT4_3', 'BT5', 'TRAT', 'TRAT2', 'TRAT3', 'AT2', 'AT3', 'AT4_1', 'AT4_2', 'AT4_3', 'AT5', 'LIBRE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'DESIGNER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "clientName" TEXT NOT NULL,
    "clientRut" TEXT,
    "clientEmail" TEXT,
    "clientPhone" TEXT,
    "projectName" TEXT,
    "projectType" TEXT,
    "configuration" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'DRAFT',
    "inputsProgress" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectLocation" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "address" TEXT,
    "comuna" TEXT,
    "region" TEXT,
    "distributor" TEXT NOT NULL DEFAULT 'SAESA',
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,
    "altitudeM" DECIMAL(8,2),
    "geom" geometry(Point, 4326),

    CONSTRAINT "ProjectLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScaniflyImport" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "totalRoofArea" DECIMAL(10,2),
    "usableRoofArea" DECIMAL(10,2),
    "pitchDegrees" DECIMAL(5,2),
    "azimuthDegrees" DECIMAL(5,2),
    "solarAccessPct" DECIMAL(5,2),
    "timeOfShadeFactor" DECIMAL(5,2) DEFAULT 0.0,
    "maxPanelsAllowed" INTEGER,
    "roofSegmentsData" JSONB,
    "model3dObjUrl" TEXT,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScaniflyImport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectricalConsumption" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "tariffType" "TariffType" NOT NULL DEFAULT 'BT1',
    "isFreeMarket" BOOLEAN NOT NULL DEFAULT false,
    "connectedPowerKw" DECIMAL(10,2),
    "peakPowerKw" DECIMAL(10,2),
    "annualTotal" DECIMAL(12,2),
    "monthlyData" JSONB,
    "monthlyPeakDemandKw" JSONB,
    "monthlyBillsClp" JSONB,
    "extractedViaOcr" BOOLEAN NOT NULL DEFAULT false,
    "ocrRawMetadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ElectricalConsumption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectWeatherData" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'SOLCAST_API',
    "annualGhiKwhM2" DECIMAL(10,2),
    "annualDniKwhM2" DECIMAL(10,2),
    "annualDhiKwhM2" DECIMAL(10,2),
    "avgTempCelsius" DECIMAL(5,2),
    "monthlyGhiKwhM2" JSONB,
    "monthlySpecificYieldKwhKwp" JSONB,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectWeatherData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentCatalog" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "nominalPowerW" DECIMAL(10,2),
    "efficiencyPct" DECIMAL(5,2),
    "voltageRangeV" TEXT,
    "baseCostClp" DECIMAL(12,2) NOT NULL,
    "baseCostUsd" DECIMAL(10,2) NOT NULL,
    "defaultMarginPct" DECIMAL(5,2) NOT NULL DEFAULT 25.0,
    "secCertified" BOOLEAN NOT NULL DEFAULT true,
    "secCertificateCode" TEXT,
    "datasheetUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EquipmentCatalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MountingStructure" (
    "id" TEXT NOT NULL,
    "structureType" "StructureType" NOT NULL,
    "description" TEXT NOT NULL,
    "defaultTiltDeg" DECIMAL(5,2) NOT NULL,
    "powerDensityWpM2" DECIMAL(6,2) NOT NULL,
    "costPerWpUsd" DECIMAL(6,4) NOT NULL,
    "costPerPanelUsd" DECIMAL(8,2) NOT NULL,
    "hardwareSpec" TEXT NOT NULL,

    CONSTRAINT "MountingStructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectScenario" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "scenarioName" TEXT NOT NULL,
    "systemType" "SystemType" NOT NULL DEFAULT 'ON_GRID',
    "systemSizeKw" DECIMAL(10,2),
    "installedCapacityKwp" DECIMAL(10,2) NOT NULL,
    "numPanels" INTEGER NOT NULL,
    "inverterPowerKw" DECIMAL(10,2) NOT NULL,
    "batteryCapacityKwh" DECIMAL(10,2) DEFAULT 0.0,
    "annualGenerationKwh" DECIMAL(12,2) NOT NULL,
    "selfConsumptionPct" DECIMAL(5,2) NOT NULL,
    "gridInjectionPct" DECIMAL(5,2) NOT NULL,
    "capexClp" DECIMAL(14,2) NOT NULL,
    "opexAnnualClp" DECIMAL(12,2) NOT NULL,
    "firstYearSavingsClp" DECIMAL(12,2) NOT NULL,
    "simplePaybackYears" DECIMAL(5,2) NOT NULL,
    "dynamicPaybackYears" DECIMAL(5,2) NOT NULL,
    "npv25yClp" DECIMAL(14,2) NOT NULL,
    "irrPct" DECIMAL(5,2) NOT NULL,
    "lcoeClpKwh" DECIMAL(10,2) NOT NULL,
    "selectedForProposal" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectScenario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectLocation_projectId_key" ON "ProjectLocation"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "ScaniflyImport_projectId_key" ON "ScaniflyImport"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "ElectricalConsumption_projectId_key" ON "ElectricalConsumption"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectWeatherData_projectId_key" ON "ProjectWeatherData"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "MountingStructure_structureType_key" ON "MountingStructure"("structureType");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectLocation" ADD CONSTRAINT "ProjectLocation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScaniflyImport" ADD CONSTRAINT "ScaniflyImport_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectricalConsumption" ADD CONSTRAINT "ElectricalConsumption_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectWeatherData" ADD CONSTRAINT "ProjectWeatherData_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectScenario" ADD CONSTRAINT "ProjectScenario_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
