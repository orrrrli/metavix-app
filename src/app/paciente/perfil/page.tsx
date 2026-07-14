import { PatientProfileControl } from '@/features/patient/perfil/components/PatientProfileControl';

export default function PerfilPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h2 className="text-3xl font-display font-bold" style={{ color: 'var(--text)' }}>Mi Perfil</h2>
        <p className="mt-1" style={{ color: 'var(--mut)' }}>Gestiona tu información clínica básica.</p>
      </div>
      <PatientProfileControl />
    </div>
  );
}
