'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2, MailCheck } from 'lucide-react';
import { forgotPassword } from '@/lib/api/auth';
import AuthFloatingInput from '@/shared/components/auth/AuthFloatingInput';

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
      <div className="min-h-screen flex items-center justify-center bg-[#f2f2f2] p-4">
        <div className="max-w-md w-full text-center space-y-6 p-8 bg-white rounded-2xl shadow-lg border border-black/5">
          <div className="inline-flex items-center justify-center p-4 bg-teal-50 rounded-full">
            <MailCheck className="size-10 text-teal-500" />
          </div>
          <h1 className="text-2xl font-bold text-[#101010]">Revisa tu correo</h1>
          <p className="text-sm text-black/50 leading-relaxed">
            Si <strong className="text-black/70">{submittedEmail}</strong> está registrado,
            recibirás un enlace para restablecer tu contraseña en los próximos minutos.
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', borderRadius: '8px', background: '#fffbeb', border: '1px solid #fcd34d', padding: '12px 16px', textAlign: 'left' }}>
            <span style={{ color: '#d97706', fontSize: '14px', lineHeight: 1, marginTop: '1px' }}>⚠</span>
            <p style={{ fontSize: '12px', color: '#92400e', lineHeight: '1.5', margin: 0 }}>
              <strong>¿No ves el correo?</strong> Revisa tu carpeta de <strong>spam o correo no deseado</strong>. El enlace expira en 1 hora.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-500 underline underline-offset-4"
          >
            <ArrowLeft size={14} />
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2f2f2] p-4">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg border border-black/5">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-black/40 hover:text-black/70 transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Volver
        </Link>

        <h1 className="text-2xl font-bold text-[#101010] mb-2">¿Olvidaste tu contraseña?</h1>
        <p className="text-sm text-black/45 mb-8 leading-relaxed">
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
              <>
                <Loader2 size={16} className="animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar enlace'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
