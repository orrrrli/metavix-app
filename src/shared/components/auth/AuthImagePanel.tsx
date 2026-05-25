import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface AuthImagePanelProps {
  imageSrc: string;
  imageAlt?: string;
  quote: string;
  author: string;
  authorRole: string;
  brandName?: string;
  brandHref?: string;
  logoNode?: React.ReactNode;
}

export default function AuthImagePanel({
  imageSrc,
  imageAlt = 'Auth background',
  quote,
  author,
  authorRole,
  brandName = 'Metavix',
  brandHref = '/',
  logoNode,
}: AuthImagePanelProps): React.ReactElement {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#1a1a1a',
        overflow: 'hidden',
      }}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        style={{ objectFit: 'cover', opacity: 0.55 }}
        priority
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(160deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.72) 100%)',
        }}
      />

      {/* Logo */}
      <div style={{ position: 'absolute', top: '28px', left: '28px', zIndex: 1 }}>
        <Link href={brandHref} style={{ textDecoration: 'none' }}>
          {logoNode ?? (
            <span
              style={{
                fontFamily: 'var(--font-display, system-ui, sans-serif)',
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '0.14em',
                color: 'white',
              }}
            >
              {brandName}
            </span>
          )}
        </Link>
      </div>

      {/* Quote */}
      <div
        style={{ position: 'absolute', bottom: '36px', left: '28px', right: '28px', zIndex: 1 }}
      >
        <p
          style={{
            fontFamily: 'var(--font-display, system-ui, sans-serif)',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'white',
            lineHeight: 1.35,
            margin: '0 0 16px',
          }}
        >
          &ldquo;{quote}&rdquo;
        </p>
        <p
          style={{
            fontFamily: 'var(--font-sans, system-ui, sans-serif)',
            fontSize: '1rem',
            fontWeight: 700,
            color: 'white',
            margin: 0,
          }}
        >
          {author}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-sans, system-ui, sans-serif)',
            fontSize: '0.875rem',
            color: 'rgba(255,255,255,0.6)',
            margin: '3px 0 0',
          }}
        >
          {authorRole}
        </p>
      </div>
    </div>
  );
}
