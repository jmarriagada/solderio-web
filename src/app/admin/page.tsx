import { AdminDashboardView } from "@/components/admin/AdminDashboardView";

export const metadata = {
  title: "Panel de Control CRM & Leads | SoldeRío SpA",
  description: "Dashboard administrativo técnico-comercial para gestión de cotizaciones y proyectos solares.",
};

export default function AdminPage() {
  return (
    <main className="w-full min-h-screen bg-[#141414] text-white">
      <AdminDashboardView />
    </main>
  );
}
