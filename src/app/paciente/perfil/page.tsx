import { PatientProfileCard } from '@/features/patient/components/PatientProfileCard';

export default function PerfilPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h2 className="text-3xl font-display font-bold text-foreground">Mi Perfil</h2>
        <p className="text-muted-foreground mt-1">Gestiona tu información clínica básica.</p>
      </div>
      <PatientProfileCard />
    </div>
  );
}
