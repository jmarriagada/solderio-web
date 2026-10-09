import { calculateSolarSizing } from "../src/lib/solar";

const res = calculateSolarSizing({
  comuna: "Puerto Varas",
  distributor: "saesa",
  monthlyBillClp: 210000,
  propertyType: "residencial",
  systemType: "offgrid",
  backupPriority: "hogar_completo",
});

console.log("=== CASO IMAGEN USUARIO ($210k Off-Grid Puerto Varas) ===");
console.log("Potencia:", res.recommendedKwp, "kWp | Modulos:", res.panelsCount);
console.log("Inversor:", res.inverterKw, "kW | Bateria:", res.batteryKwh, "kWh");
console.log("Costo Neto: $" + ((res.estimatedSystemCostNetoClp || 0) / 1e6).toFixed(3) + "M | Costo IVA: $" + ((res.estimatedSystemCostIvaClp || 0) / 1e6).toFixed(3) + "M");
console.log("Ahorro Anual: $" + Math.round(res.estimatedAnnualSavingsClp).toLocaleString("es-CL"));
console.log("Payback:", res.paybackYears.toFixed(1), "anos");
