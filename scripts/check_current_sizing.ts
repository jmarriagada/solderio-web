import { calculateSolarSizing } from "../src/lib/solar";

// Probaremos los 7 casos típicos con los parámetros propuestos
const testScenarios = [
  { label: "1. Hogar $80k On-Grid (Pto Varas)", comuna: "Puerto Varas", distributor: "saesa" as const, monthlyBill: 80000, prop: "residencial" as const, sys: "ongrid" as const, backup: "cargas_criticas" as const },
  { label: "2. Hogar $120k On-Grid (Pto Varas)", comuna: "Puerto Varas", distributor: "saesa" as const, monthlyBill: 120000, prop: "residencial" as const, sys: "ongrid" as const, backup: "cargas_criticas" as const },
  { label: "3. Parcela $250k On-Grid (Frutillar)", comuna: "Frutillar", distributor: "crell" as const, monthlyBill: 250000, prop: "residencial" as const, sys: "ongrid" as const, backup: "cargas_criticas" as const },
  { label: "4. Hogar $80k Híbrido Esencial (5kWh)", comuna: "Puerto Varas", distributor: "saesa" as const, monthlyBill: 80000, prop: "residencial" as const, sys: "hibrida" as const, backup: "cargas_criticas" as const },
  { label: "5. Hogar $120k Híbrido Esencial (5kWh)", comuna: "Puerto Varas", distributor: "saesa" as const, monthlyBill: 120000, prop: "residencial" as const, sys: "hibrida" as const, backup: "cargas_criticas" as const },
  { label: "6. Hogar $120k Híbrido Total (10kWh)", comuna: "Puerto Varas", distributor: "saesa" as const, monthlyBill: 120000, prop: "residencial" as const, sys: "hibrida" as const, backup: "total_casa" as const },
  { label: "7. Parcela $250k Híbrido Total (10kWh)", comuna: "Frutillar", distributor: "crell" as const, monthlyBill: 250000, prop: "residencial" as const, sys: "hibrida" as const, backup: "total_casa" as const },
  { label: "8. Cabaña $100k Off-Grid (Aislada)", comuna: "Puerto Varas", distributor: "saesa" as const, monthlyBill: 100000, prop: "residencial" as const, sys: "offgrid" as const, backup: "total_casa" as const },
  { label: "9. Comercial $450k On-Grid (Osorno)", comuna: "Osorno", distributor: "saesa" as const, monthlyBill: 450000, prop: "comercial" as const, sys: "ongrid" as const, backup: "cargas_criticas" as const },
  { label: "10. Lechería $1.5M On-Grid (La Unión)", comuna: "La Unión", distributor: "saesa" as const, monthlyBill: 1500000, prop: "agricola" as const, sys: "ongrid" as const, backup: "cargas_criticas" as const },
];

console.log("Probando calculateSolarSizing actual...");
for (const s of testScenarios) {
  const res = calculateSolarSizing({
    comuna: s.comuna,
    distributor: s.distributor,
    monthlyBillClp: s.monthlyBill,
    propertyType: s.prop,
    systemType: s.sys,
    backupPriority: s.backup === "total_casa" ? "hogar_completo" : "cargas_criticas",
  });
  console.log(`${s.label.padEnd(38)} | Pot: ${res.recommendedKwp.toFixed(1)} kWp | Bat: ${res.batteryKwh} kWh | Ahorro: $${Math.round(res.estimatedAnnualSavingsClp).toLocaleString("es-CL")} | Costo: $${((res.estimatedSystemCostNetoClp || 0)/1e6).toFixed(2)}M | Payback: ${res.paybackYears.toFixed(1)} años`);
}
