'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2, MailCheck } from 'lucide-react';
import { forgotPassword } from '@/lib/api/auth';
import AuthFloatingInput from '@/shared/components/auth/AuthFloatingInput';
import { Button } from '@/shared/components/ui/button';

const schema = z.object({
  email: z.string().email('Ingresa un email válido'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage(): React.ReactElement {
  const [sent, setSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData): Promise<void> => {
    await forgotPassword(data.email);
    setSubmittedEmail(data.email);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40 dark:bg-background p-4">
        <div className="max-w-md w-full text-center space-y-6 p-8 bg-card text-card-foreground rounded-2xl shadow-lg border border-border">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full">
            <MailCheck className="size-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Revisa tu correo</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Si <strong className="text-foreground">{submittedEmail}</strong> está registrado,
            recibirás un enlace para restablecer tu contraseña en los próximos minutos.
          </p>
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 p-3 text-left">
            <span className="text-amber-600 dark:text-amber-300 text-sm leading-none mt-px">⚠</span>
            <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed m-0">
              <strong>¿No ves el correo?</strong> Revisa tu carpeta de <strong>spam o correo no deseado</strong>. El enlace expira en 1 hora.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline underline-offset-4"
          >
            <ArrowLeft size={14} />
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 dark:bg-background p-4">
      <div className="max-w-md w-full p-8 bg-card text-card-foreground rounded-2xl shadow-lg border border-border">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Volver
        </Link>

        <h1 className="text-2xl font-bold text-foreground mb-2">¿Olvidaste tu contraseña?</h1>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          Ingresa tu email y te enviaremos un enlace para restablecerla.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <AuthFloatingInput
                label="Email"
                type="email"
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                hasError={!!fieldState.error}
                errorText={fieldState.error?.message}
              />
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-base"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Enviando...
              </>
            ) : (
              'Enviar enlace'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
