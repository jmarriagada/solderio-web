import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F8FA] px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl border-black/5 rounded-[24px]">
        <CardHeader className="space-y-2 text-center pb-8">
          <CardTitle className="text-3xl font-bold tracking-tight text-[#1F1F1F]">
            SoldeRío
          </CardTitle>
          <CardDescription className="text-base text-gray-500">
            Plataforma de Ingeniería y Diseño FV
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-[#1F1F1F]">
                Correo Electrónico
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="ingeniero@solderio.cl"
                required
                className="h-12 rounded-xl border-gray-200 focus:ring-[#FF8300] focus:border-[#FF8300]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-[#1F1F1F]">
                Contraseña
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="h-12 rounded-xl border-gray-200 focus:ring-[#FF8300] focus:border-[#FF8300]"
              />
            </div>

            {params?.error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                {params.error}
              </div>
            )}

            <Button 
              formAction={login} 
              className="w-full h-12 rounded-xl bg-[#FF8300] hover:bg-[#E67600] text-white font-semibold transition-all shadow-md cursor-pointer"
            >
              Iniciar Sesión
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
