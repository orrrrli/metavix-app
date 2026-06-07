'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Eye, EyeOff, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { resetPassword } from '@/lib/api/auth';
import AuthFloatingInput from '@/shared/components/auth/AuthFloatingInput';

const schema = z
  .object({
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Las contraseñas no coinciden',
    path: ['confirm'],
  });

type FormData = z.infer<typeof schema>;

function ResetPasswordForm(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData): Promise<void> => {
    setApiError(null);
    try {
      await resetPassword(token, data.password);
      setDone(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Ocurrió un error. Intenta de nuevo.');
    }
  };

  if (!token) {
    return (
      <div className="max-w-md w-full text-center space-y-6 p-8 bg-white rounded-2xl shadow-lg border border-black/5">
        <AlertCircle className="size-12 text-red-400 mx-auto" />
        <h1 className="text-2xl font-bold text-[#101010]">Enlace inválido</h1>
        <p className="text-sm text-black/45">Este enlace de restablecimiento no es válido.</p>
        <Link href="/forgot-password" className="text-sm font-semibold text-teal-500 underline underline-offset-4">
          Solicitar uno nuevo
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="max-w-md w-full text-center space-y-6 p-8 bg-white rounded-2xl shadow-lg border border-black/5">
        <div className="inline-flex items-center justify-center p-4 bg-teal-50 rounded-full">
          <ShieldCheck className="size-10 text-teal-500" />
        </div>
        <h1 className="text-2xl font-bold text-[#101010]">Contraseña actualizada</h1>
        <p className="text-sm text-black/45">
          Tu contraseña fue restablecida correctamente. Redirigiendo al inicio de sesión...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg border border-black/5">
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-sm text-black/40 hover:text-black/70 transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        Volver
      </Link>

      <h1 className="text-2xl font-bold text-[#101010] mb-2">Nueva contraseña</h1>
      <p className="text-sm text-black/45 mb-8">Elige una contraseña segura de al menos 8 caracteres.</p>

      {apiError && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '0.875rem',
            fontWeight: 500,
            background: 'rgba(247,45,45,0.08)',
            color: '#d42020',
            border: '1px solid rgba(247,45,45,0.2)',
            marginBottom: '16px',
          }}
        >
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <AuthFloatingInput
              label="Nueva contraseña"
              type={showPassword ? 'text' : 'password'}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              hasError={!!fieldState.error}
              errorText={fieldState.error?.message}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{ background: 'rgba(0,0,0,0.05)', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.45)', display: 'flex', padding: '5px', borderRadius: '6px' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
          )}
        />

        <Controller
          name="confirm"
          control={control}
          render={({ field, fieldState }) => (
            <AuthFloatingInput
              label="Confirmar contraseña"
              type={showConfirm ? 'text' : 'password'}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              hasError={!!fieldState.error}
              errorText={fieldState.error?.message}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  style={{ background: 'rgba(0,0,0,0.05)', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.45)', display: 'flex', padding: '5px', borderRadius: '6px' }}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
          )}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '13px 24px',
            fontSize: '1rem',
            fontWeight: 700,
            color: 'white',
            background: isSubmitting ? '#00BFA580' : '#00BFA5',
            border: 'none',
            borderRadius: '9999px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s ease',
          }}
        >
          {isSubmitting ? (
            <><Loader2 size={16} className="animate-spin" />Guardando...</>
          ) : (
            'Restablecer contraseña'
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage(): React.ReactElement {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2f2f2] p-4">
      <Suspense fallback={<div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg" />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
