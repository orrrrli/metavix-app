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
import { Button } from '@/shared/components/ui/button';

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
      <div className="max-w-md w-full text-center space-y-6 p-8 bg-card text-card-foreground rounded-2xl shadow-lg border border-border">
        <AlertCircle className="size-12 text-red-400 dark:text-red-300 mx-auto" />
        <h1 className="text-2xl font-bold text-foreground">Enlace inválido</h1>
        <p className="text-sm text-muted-foreground">Este enlace de restablecimiento no es válido.</p>
        <Link href="/forgot-password" className="text-sm font-semibold text-primary underline underline-offset-4">
          Solicitar uno nuevo
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="max-w-md w-full text-center space-y-6 p-8 bg-card text-card-foreground rounded-2xl shadow-lg border border-border">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full">
          <ShieldCheck className="size-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Contraseña actualizada</h1>
        <p className="text-sm text-muted-foreground">
          Tu contraseña fue restablecida correctamente. Redirigiendo al inicio de sesión...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full p-8 bg-card text-card-foreground rounded-2xl shadow-lg border border-border">
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        Volver
      </Link>

      <h1 className="text-2xl font-bold text-foreground mb-2">Nueva contraseña</h1>
      <p className="text-sm text-muted-foreground mb-8">Elige una contraseña segura de al menos 8 caracteres.</p>

      {apiError && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-200 border border-red-200 dark:border-red-900/50 px-3.5 py-2.5 text-sm font-medium mb-4">
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
                  className="bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border-none cursor-pointer flex p-1.5 rounded-md"
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
                  className="bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border-none cursor-pointer flex p-1.5 rounded-md"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 text-base"
        >
          {isSubmitting ? (
            <><Loader2 size={16} className="animate-spin mr-2" />Guardando...</>
          ) : (
            'Restablecer contraseña'
          )}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage(): React.ReactElement {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 dark:bg-background p-4">
      <Suspense fallback={<div className="max-w-md w-full p-8 bg-card rounded-2xl shadow-lg border border-border" />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
