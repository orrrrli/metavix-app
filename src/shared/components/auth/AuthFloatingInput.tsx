'use client';

import React, { useState } from 'react';

interface AuthFloatingInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  suffix?: React.ReactNode;
  hasError?: boolean;
  errorText?: string;
  required?: boolean;
  readOnly?: boolean;
  accentColor?: string;
}

export default function AuthFloatingInput({
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  suffix,
  hasError = false,
  errorText,
  required = false,
  readOnly = false,
  accentColor = '#00BFA5',
}: AuthFloatingInputProps): React.ReactElement {
  const [focused, setFocused] = useState(false);
  const isFloating = focused || value.length > 0;

  const borderColor = hasError
    ? 'rgba(239,68,68,0.6)'
    : readOnly
      ? 'rgba(0,0,0,0.08)'
      : focused
        ? accentColor
        : 'rgba(0,0,0,0.12)';

  return (
    <div>
    <div
      style={{
        position: 'relative',
        height: '54px',
        border: `1px solid ${borderColor}`,
        borderRadius: '10px',
        background: readOnly ? '#f0f0f0' : focused ? 'white' : '#fafafa',
        boxShadow:
          focused && !readOnly ? `0 0 0 3px ${accentColor}1F` : 'none',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease',
        boxSizing: 'border-box',
      }}
    >
      <label
        style={{
          position: 'absolute',
          left: '16px',
          top: isFloating ? '8px' : '50%',
          transform: isFloating ? 'none' : 'translateY(-50%)',
          fontSize: isFloating ? '0.75rem' : '1rem',
          lineHeight: 1,
          color: focused ? accentColor : 'rgba(0,0,0,0.4)',
          transition: 'top 0.15s ease, font-size 0.15s ease, color 0.15s ease',
          pointerEvents: 'none',
          fontFamily: 'var(--font-sans, system-ui, sans-serif)',
          fontWeight: 400,
        }}
      >
        {label}
        {required && <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>}
      </label>

      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={(e) => {
          if (!readOnly) onChange(e.target.value);
        }}
        onFocus={() => {
          if (!readOnly) setFocused(true);
        }}
        onBlur={() => {
          setFocused(false);
          onBlur?.();
        }}
        style={{
          position: 'absolute',
          left: '16px',
          right: suffix ? '44px' : '16px',
          bottom: '9px',
          height: '20px',
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontSize: '1rem',
          fontFamily: 'var(--font-sans, system-ui, sans-serif)',
          color: '#101010',
          padding: 0,
        }}
      />

      {suffix && (
        <div
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {suffix}
        </div>
      )}
    </div>
    {errorText && (
      <p style={{
        margin: '4px 0 0 4px',
        fontSize: '0.75rem',
        color: '#d42020',
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
      }}>
        {errorText}
      </p>
    )}
    </div>
  );
}
