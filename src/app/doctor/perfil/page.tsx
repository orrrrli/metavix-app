import { DoctorProfileControl } from '@/features/doctor/perfil/components/DoctorProfileControl';

export default function DoctorPerfilPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h2 className="text-3xl font-display font-bold text-foreground">Mi Perfil</h2>
        <p className="text-muted-foreground mt-1">Gestiona tu información profesional.</p>
      </div>
      <DoctorProfileControl />
    </div>
  );
}
