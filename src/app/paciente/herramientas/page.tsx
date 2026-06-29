"use client";

import Link from "next/link";
import {
  TrendingUp,
  Syringe,
  Scale,
  FlaskConical,
  Stethoscope,
  HeartPulse,
  Footprints,
  Target,
} from "lucide-react";

interface Tool {
  href: string;
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
  cta: string;
}

const TOOLS: Tool[] = [
  {
    href: "/paciente/herramientas/curvas-glucosa",
    title: "Curvas de glucosa",
    description: "Visualiza tus mediciones por comida y detecta patrones a lo largo del día.",
    Icon: TrendingUp,
    cta: "Ver curvas",
  },
  {
    href: "/paciente/herramientas/guia-insulina",
    title: "Guía de insulina",
    description: "Aprende a calcular tu dosis según el tipo de comida y tu glucosa actual.",
    Icon: Syringe,
    cta: "Abrir guía",
  },
  {
    href: "/paciente/herramientas/calculadora-imc",
    title: "Calculadora IMC",
    description: "Calcula tu Índice de Masa Corporal y da seguimiento a tu peso saludable.",
    Icon: Scale,
    cta: "Calcular IMC",
  },
  {
    href: "/paciente/herramientas/convertidor-hba1c",
    title: "Conversor HbA1c",
    description: "Convierte tu HbA1c a promedio estimado de glucosa y viceversa.",
    Icon: FlaskConical,
    cta: "Convertir",
  },
  {
    href: "/paciente/herramientas/riesgo-diabetes",
    title: "Riesgo de diabetes",
    description: "Evaluación rápida de factores de riesgo basada en tu información clínica.",
    Icon: Stethoscope,
    cta: "Evaluar riesgo",
  },
  {
    href: "/paciente/herramientas/riesgo-cardiovascular",
    title: "Riesgo cardiovascular",
    description: "Estima tu riesgo cardiovascular combinando presión, colesterol y otros datos.",
    Icon: HeartPulse,
    cta: "Evaluar riesgo",
  },
  {
    href: "/paciente/herramientas/neuropatia",
    title: "Detección de neuropatía",
    description: "Cuestionario clínico para identificar síntomas de neuropatía periférica.",
    Icon: Footprints,
    cta: "Iniciar test",
  },
  {
    href: "/paciente/herramientas/metas",
    title: "Mis metas",
    description: "Define y monitorea tus objetivos de glucosa, peso y hábitos saludables.",
    Icon: Target,
    cta: "Ver metas",
  },
];

export default function HerramientasIndexPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22, paddingBottom: 8 }}>
      <div>
        <h1
          style={{
            fontSize: 30,
            fontWeight: 800,
            color: "var(--text)",
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          Herramientas clínicas
        </h1>
        <p style={{ fontSize: 14, color: "var(--mut)", margin: "6px 0 0", maxWidth: 640 }}>
          Calculadoras, evaluadores y guías para ayudarte a tomar decisiones informadas junto a tu médico.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 14,
        }}
      >
        {TOOLS.map(({ href, title, description, Icon, cta }) => (
          <Link
            key={href}
            href={href}
            style={{
              background: "var(--card)",
              border: "1.5px solid var(--card-bd)",
              borderRadius: 18,
              padding: "22px 22px 18px",
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              transition: "transform .24s cubic-bezier(.2,.85,.25,1), border-color .24s, box-shadow .24s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.boxShadow = "0 12px 28px rgba(20,40,30,.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.borderColor = "var(--card-bd)";
              e.currentTarget.style.boxShadow = "";
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "var(--nav-active-bg)",
                color: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon className="size-5" />
            </div>
            <div style={{ flex: 1 }}>
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "var(--text)",
                  margin: "0 0 4px",
                  letterSpacing: "-0.01em",
                }}
              >
                {title}
              </h2>
              <p style={{ fontSize: 13, color: "var(--mut)", margin: 0, lineHeight: 1.5 }}>{description}</p>
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--accent)",
                marginTop: 4,
              }}
            >
              {cta} →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
