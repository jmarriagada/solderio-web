"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Zap, 
  TrendingUp, 
  Calendar, 
  Search, 
  Filter, 
  PhoneCall, 
  Mail, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  ShieldCheck, 
  RefreshCw,
  Sun,
  Battery,
  MapPin,
  ExternalLink
} from "lucide-react";
import { LeadSubmission } from "@/types/cotizacion";

export function AdminDashboardView() {
  const [leads, setLeads] = useState<LeadSubmission[]>([]);
  const [stats, setStats] = useState<any>({
    totalLeads: 0,
    totalKwp: 0,
    totalEstimatedSavingsAnnual: 0,
    leadsNuevos: 0,
    leadsVisita: 0,
    leadsCerrados: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("TODOS");
  const [selectedLead, setSelectedLead] = useState<LeadSubmission | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads");
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads || []);
        setStats(data.stats || {});
      }
    } catch (err) {
      console.error("Error cargando leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateLeadStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: newStatus as any } : l))
        );
        if (selectedLead?.id === id) {
          setSelectedLead((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
      }
    } catch (err) {
      console.error("Error actualizando status:", err);
    }
  };

  const filteredLeads = leads.filter((l) => {
    const matchesStatus = selectedStatus === "TODOS" || l.status === selectedStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      l.formData.fullName.toLowerCase().includes(q) ||
      l.formData.whatsapp.includes(q) ||
      l.formData.email.toLowerCase().includes(q) ||
      l.formData.comuna.toLowerCase().includes(q) ||
      l.id.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NUEVO":
        return <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30">NUEVO</span>;
      case "VISITA_AGENDADA":
        return <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30">VISITA AGENDADA</span>;
      case "PRESUPUESTO_ENVIADO":
        return <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-purple-500/20 text-purple-400 border border-purple-500/30">PRESUPUESTO</span>;
      case "CERRADO":
        return <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">CERRADO / GANADO</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-white/10 text-white/70">EN REVISIÓN</span>;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-white">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#FF8300] bg-[#FF8300]/10 px-3 py-1 rounded-full border border-[#FF8300]/20">
              SoldeRío CRM v1.0
            </span>
            <span className="text-xs text-white/40 font-mono">Macrozona Sur</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-light text-white mt-2">
            Panel de Gestión Comercial & Ingeniería
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchLeads}
            disabled={loading}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-light text-white transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Actualizar</span>
          </button>
          <Link
            href="/cotizacion"
            target="_blank"
            className="px-5 py-2 rounded-full bg-[#FF8300] hover:bg-[#e07400] text-xs font-light text-white transition-colors flex items-center gap-2 shadow-md cursor-pointer"
          >
            <span>Abrir Cotizador</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="p-6 rounded-[24px] bg-[#1F1F1F] border border-white/10 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/50 font-mono uppercase">Total Cotizaciones</span>
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-light font-mono text-white mb-1">
            {stats.totalLeads}
          </div>
          <span className="text-[11px] text-emerald-400 font-light">
            {stats.leadsNuevos} pendientes de contacto
          </span>
        </div>

        <div className="p-6 rounded-[24px] bg-[#1F1F1F] border border-white/10 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/50 font-mono uppercase">Potencia Pipeline</span>
            <Sun className="w-5 h-5 text-[#FF8300]" />
          </div>
          <div className="text-3xl font-light font-mono text-[#FF8300] mb-1">
            {stats.totalKwp} <span className="text-base text-white/50">kWp</span>
          </div>
          <span className="text-[11px] text-white/40 font-light">Capacidad técnica cotizada</span>
        </div>

        <div className="p-6 rounded-[24px] bg-[#1F1F1F] border border-white/10 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/50 font-mono uppercase">Ahorro Clientes / Año</span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-light font-mono text-emerald-400 mb-1">
            {formatCurrency(stats.totalEstimatedSavingsAnnual)}
          </div>
          <span className="text-[11px] text-white/40 font-light">Impacto económico anual</span>
        </div>

        <div className="p-6 rounded-[24px] bg-[#1F1F1F] border border-white/10 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/50 font-mono uppercase">Visitas en Terreno</span>
            <Calendar className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-light font-mono text-purple-400 mb-1">
            {stats.leadsVisita}
          </div>
          <span className="text-[11px] text-white/40 font-light">Ingenieros SEC asignados</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Buscar por cliente, WhatsApp, comuna o ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-black/40 border border-white/15 text-white placeholder:text-white/40 text-xs font-light focus:outline-none focus:border-[#FF8300] transition-all"
          />
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {["TODOS", "NUEVO", "VISITA_AGENDADA", "PRESUPUESTO_ENVIADO", "CERRADO"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-4 py-1.5 rounded-full text-xs font-light transition-all cursor-pointer ${
                selectedStatus === st
                  ? "bg-white text-black font-normal shadow-sm"
                  : "bg-white/5 text-white/60 hover:text-white border border-white/5"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Leads Table */}
      <div className="bg-[#1F1F1F] rounded-[24px] border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/30 text-[11px] font-mono text-white/50 uppercase tracking-wider">
                <th className="py-4 px-6">ID / Fecha</th>
                <th className="py-4 px-6">Cliente & Contacto</th>
                <th className="py-4 px-6">Ubicación</th>
                <th className="py-4 px-6">Gasto / Mes</th>
                <th className="py-4 px-6">Pre-Dimensionamiento</th>
                <th className="py-4 px-6">Estado</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs font-light">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-white/[0.03] transition-colors cursor-pointer"
                  onClick={() => setSelectedLead(lead)}
                >
                  <td className="py-4 px-6 font-mono text-white/80">
                    <div className="text-[#FF8300] font-medium">{lead.id}</div>
                    <div className="text-[10px] text-white/40">
                      {new Date(lead.createdAt).toLocaleDateString("es-CL")}
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="text-white font-normal text-sm">{lead.formData.fullName}</div>
                    <div className="text-white/50 text-[11px] font-mono">{lead.formData.whatsapp}</div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="text-white capitalize flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#FF8300]" />
                      <span>{lead.formData.comuna}</span>
                    </div>
                    <div className="text-[11px] text-white/40 uppercase">{lead.formData.propertyType}</div>
                  </td>

                  <td className="py-4 px-6 font-mono text-emerald-400">
                    {formatCurrency(lead.formData.monthlyBillClp)}
                    <span className="text-[10px] text-white/40 block uppercase">{lead.formData.distributor}</span>
                  </td>

                  <td className="py-4 px-6">
                    <div className="text-white font-mono font-medium">
                      {lead.sizingResult?.recommendedKwp} kWp • {lead.sizingResult?.panelsCount} paneles
                    </div>
                    <div className="text-[11px] text-white/50">
                      {lead.sizingResult?.batteryKwh > 0 ? `${lead.sizingResult.batteryKwh} kWh LiFePO4` : "On-Grid Net Billing"}
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    {getStatusBadge(lead.status)}
                  </td>

                  <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`https://wa.me/${lead.formData.whatsapp.replace(/[^0-9]/g, "")}?text=Hola%20${encodeURIComponent(lead.formData.fullName)},%20te%20contacto%20de%20SoldeR%C3%ADo%20respecto%20a%20tu%20cotizaci%C3%B3n%20solar%20(${lead.id}).`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors"
                        title="Abrir WhatsApp"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="p-2 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-colors"
                        title="Ver Detalles"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLeads.length === 0 && (
            <div className="text-center py-16 text-white/40 text-xs font-light">
              No se encontraron cotizaciones con los filtros actuales.
            </div>
          )}
        </div>
      </div>

      {/* Lead Details Modal / Drawer */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1A1A1A] border border-white/10 rounded-[28px] max-w-2xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#FF8300]">{selectedLead.id}</span>
                    {getStatusBadge(selectedLead.status)}
                  </div>
                  <h2 className="text-xl font-normal text-white mt-1">
                    {selectedLead.formData.fullName}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Status Changer Buttons */}
              <div className="mb-6">
                <span className="text-xs text-white/50 block mb-2 font-mono uppercase">Cambiar Estado del Lead:</span>
                <div className="flex flex-wrap gap-2">
                  {["NUEVO", "VISITA_AGENDADA", "PRESUPUESTO_ENVIADO", "CERRADO"].map((st) => (
                    <button
                      key={st}
                      onClick={() => updateLeadStatus(selectedLead.id, st)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-light transition-all cursor-pointer ${
                        selectedLead.status === st
                          ? "bg-[#FF8300] text-white font-normal"
                          : "bg-white/5 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                  <span className="text-[11px] text-white/40 uppercase block mb-1">Gasto & Distribuidora</span>
                  <div className="text-base font-mono font-medium text-emerald-400">
                    {formatCurrency(selectedLead.formData.monthlyBillClp)}
                  </div>
                  <div className="text-xs text-white/60 capitalize">
                    {selectedLead.formData.distributor} • {selectedLead.formData.hasPhases}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                  <span className="text-[11px] text-white/40 uppercase block mb-1">Potencia Sugerida</span>
                  <div className="text-base font-mono font-medium text-[#FF8300]">
                    {selectedLead.sizingResult?.recommendedKwp} kWp
                  </div>
                  <div className="text-xs text-white/60">
                    {selectedLead.sizingResult?.panelsCount} paneles TOPCon 580W
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                  <span className="text-[11px] text-white/40 uppercase block mb-1">Baterías LiFePO4</span>
                  <div className="text-base font-mono font-medium text-white">
                    {selectedLead.sizingResult?.batteryKwh > 0 ? `${selectedLead.sizingResult.batteryKwh} kWh` : "Sin batería"}
                  </div>
                  <div className="text-xs text-white/60 uppercase">{selectedLead.formData.systemType}</div>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                  <span className="text-[11px] text-white/40 uppercase block mb-1">Retorno de Inversión</span>
                  <div className="text-base font-mono font-medium text-white">
                    {selectedLead.sizingResult?.paybackYears} años
                  </div>
                  <div className="text-xs text-emerald-400">
                    {formatCurrency(selectedLead.sizingResult?.estimatedAnnualSavingsClp)} / año
                  </div>
                </div>
              </div>

              {/* Direct Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <a
                  href={`https://wa.me/${selectedLead.formData.whatsapp.replace(/[^0-9]/g, "")}?text=Hola%20${encodeURIComponent(selectedLead.formData.fullName)},%20te%20contacto%20de%20SoldeR%C3%ADo%20respecto%20a%20tu%20cotizaci%C3%B3n%20solar%20(${selectedLead.id}).`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-light text-center transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Contactar por WhatsApp</span>
                </a>
                <a
                  href={`mailto:${selectedLead.formData.email}?subject=Propuesta%20Solar%20SoldeR%C3%ADo%20(${selectedLead.id})`}
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-light transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
