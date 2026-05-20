import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Activity, Stethoscope, Phone, Syringe, Target, Info } from "lucide-react";

interface TarjetaPerfilProps {
  perfil: {
    nombre_insulina: string;
    ric: number;
    factor_sensibilidad: number;
    glucosa_meta: number;
    nombre_medico: string;
    telefono_medico: string;
  } | null;
}

export function TarjetaPerfil({ perfil }: TarjetaPerfilProps) {
  if (!perfil) {
    return (
      <Card className="bg-gradient-to-br from-[#0c2d6e] to-[#1346a0] text-white shadow-md">
        <CardContent className="p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
          <Info className="h-8 w-8 mb-3 opacity-80" />
          <h3 className="text-xl font-display font-medium mb-1">Perfil no configurado</h3>
          <p className="text-blue-100 text-sm">Completa el formulario inferior para guardar tus datos.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-[#0c2d6e] to-[#1346a0] text-white shadow-md overflow-hidden relative">
      <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none">
        <Activity className="w-64 h-64" />
      </div>
      <CardHeader className="pb-2 border-b border-white/10">
        <CardTitle className="text-2xl font-display font-bold">Mi Resumen de Insulina</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <Syringe className="h-5 w-5 text-blue-200" />
              </div>
              <div>
                <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Tipo de Insulina</p>
                <p className="font-medium text-lg">{perfil.nombre_insulina || 'No especificada'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <Target className="h-5 w-5 text-blue-200" />
              </div>
              <div>
                <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Glucosa Meta</p>
                <p className="font-medium text-lg">{perfil.glucosa_meta} <span className="text-sm font-normal text-blue-100">mg/dL</span></p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold mb-1">RIC</p>
                <p className="font-bold text-2xl">{perfil.ric}</p>
                <p className="text-xs text-blue-100 mt-1">g/Unidad</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold mb-1">Factor S.</p>
                <p className="font-bold text-2xl">{perfil.factor_sensibilidad}</p>
                <p className="text-xs text-blue-100 mt-1">mg/dL</p>
              </div>
            </div>
            
            <div className="pt-2 flex items-center gap-4 text-sm text-blue-100 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <Stethoscope className="h-4 w-4 opacity-70" />
                <span>{perfil.nombre_medico || 'Sin médico asig.'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="h-4 w-4 opacity-70" />
                <span>{perfil.telefono_medico || 'Sin teléfono'}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
