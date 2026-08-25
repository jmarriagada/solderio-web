import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { LayoutDashboard, Sun, Settings, LogOut, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { logout } from './actions'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen bg-[#F7F8FA] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Sun className="h-6 w-6 text-[#FF8300] mr-2" />
          <span className="text-lg font-bold tracking-tight text-[#1F1F1F]">SoldeRío Hub</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link href="/dashboard" className="flex items-center px-3 py-2.5 rounded-xl bg-orange-50 text-[#FF8300] font-medium transition-colors">
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Proyectos
          </Link>
          <Link href="/dashboard/templates" className="flex items-center px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <FileText className="h-5 w-5 mr-3" />
            Plantillas
          </Link>
          <Link href="/dashboard/settings" className="flex items-center px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <Settings className="h-5 w-5 mr-3" />
            Configuración
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center px-3 py-2 mb-2">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">{user.email}</span>
              <span className="text-xs text-gray-500">Ingeniero</span>
            </div>
          </div>
          <form action={logout}>
            <Button type="submit" variant="ghost" className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl">
              <LogOut className="h-5 w-5 mr-3" />
              Cerrar Sesión
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
