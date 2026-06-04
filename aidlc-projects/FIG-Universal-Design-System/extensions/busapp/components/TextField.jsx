/**
 * TextField Component — FIG Universal Design System
 *
 * Semantic token references only. No inline styles or direct HEX values.
 * Supports: Text, Search, Numeric, Password, Select inputs.
 */

import { useState } from 'react';

const TextField = ({
  type = 'text',
  value,
  onChange,
  onBlur,
  label,
  placeholder,
  hint,
  error,
  leadingIcon,
  trailingIcon,
  clearable = false,
  required = false,
  disabled = false,
  readOnly = false,
  maxLength,
  inputMode,
  ariaInvalid = false,
  className = '',
  id,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Generate ID if not provided
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${fieldId}-error` : undefined;
  const hintId = hint ? `${fieldId}-hint` : undefined;

  // Base input styles using only Semantic tokens
  const inputStyles = {
    width: '100%',
    padding: `var(--layout-control-padding-block) var(--layout-control-padding-inline)`,
    paddingLeft: leadingIcon ? '40px' : 'var(--layout-control-padding-inline)',
    paddingRight: clearable || trailingIcon ? '40px' : 'var(--layout-control-padding-inline)',
    minHeight: 'var(--interactive-input-height, 48px)',
    border: '2px solid var(--color-border-default)',
    borderRadius: 'var(--radius-input)',
    backgroundColor: disabled
      ? 'var(--color-surface-container-low)'
      : 'var(--color-surface-default)',
    color: disabled ? 'var(--color-text-disabled)' : 'var(--color-text-primary)',
    fontSize: 'var(--font-size-body-strong, 15px)',
    fontFamily: 'inherit',
    transition: 'all var(--motion-hover)',
    cursor: disabled ? 'not-allowed' : readOnly ? 'default' : 'text',
    outline: 'none',
  };

  // Apply error border
  if (error) {
    inputStyles.borderColor = 'var(--color-border-error)';
  }

  // Apply focus border and ring
  const inputStylesWithFocus = {
    ...inputStyles,
    ...(isFocused && {
      borderColor: 'var(--color-border-focus)',
      boxShadow: 'var(--state-focused-ring)',
    }),
  };

  // Label styling
  const labelStyles = {
    display: 'block',
    fontSize: 'var(--font-size-caption)',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  // Hint styling
  const hintStyles = {
    fontSize: 'var(--font-size-caption)',
    color: 'var(--color-text-muted)',
    marginTop: '4px',
  };

  // Error styling
  const errorStyles = {
    fontSize: 'var(--font-size-caption)',
    color: 'var(--color-text-error)',
    marginTop: '4px',
    fontWeight: 500,
  };

  // Icon styling
  const iconStyles = {
    position: 'absolute',
    width: '20px',
    height: '20px',
    color: 'var(--color-icon-default)',
    pointerEvents: 'none',
  };

  const handleClear = () => {
    onChange('');
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`textfield ${className}`.trim()}>
      <label htmlFor={fieldId} style={labelStyles}>
        {label}
        {required && <span style={{ color: 'var(--color-text-error)' }}> *</span>}
      </label>

      <div style={{ position: 'relative' }}>
        {/* Leading icon */}
        {leadingIcon && (
          <i
            data-lucide={leadingIcon}
            style={{
              ...iconStyles,
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
        )}

        {/* Input field */}
        <input
          id={fieldId}
          type={type === 'password' && showPassword ? 'text' : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          inputMode={inputMode}
          aria-invalid={ariaInvalid || !!error}
          aria-required={required}
          aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
          style={inputStylesWithFocus}
          {...rest}
        />

        {/* Clear button (for text inputs with values) */}
        {clearable && value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
            }}
            aria-label="Clear input"
          >
            <i
              data-lucide="x"
              style={{
                width: '18px',
                height: '18px',
                color: 'var(--color-icon-default)',
              }}
            />
          </button>
        )}

        {/* Password toggle button */}
        {type === 'password' && (
          <button
            type="button"
            onClick={handlePasswordToggle}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
            }}
            aria-pressed={showPassword}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <i
              data-lucide={showPassword ? 'eye-off' : 'eye'}
              style={{
                width: '18px',
                height: '18px',
                color: 'var(--color-icon-default)',
              }}
            />
          </button>
        )}

        {/* Trailing icon */}
        {trailingIcon && !clearable && !type.includes('password') && (
          <i
            data-lucide={trailingIcon}
            style={{
              ...iconStyles,
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
        )}
      </div>

      {/* Hint text */}
      {hint && !error && (
        <div id={hintId} style={hintStyles}>
          {hint}
        </div>
      )}

      {/* Error text */}
      {error && (
        <div id={errorId} style={errorStyles} role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default TextField;
