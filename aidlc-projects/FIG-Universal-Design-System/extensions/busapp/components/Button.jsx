/**
 * Button Component — FIG Universal Design System
 *
 * Semantic token references only. No inline styles or direct HEX values.
 */

const Button = ({
  children,
  icon,
  iconPosition = 'leading',
  onClick,
  disabled = false,
  loading = false,
  fullWidth = true,
  type = 'button',
  variant = 'primary',
  ariaLabel,
  className = '',
  ...rest
}) => {
  // Variant-specific styles using only Semantic tokens
  const variantStyles = {
    primary: {
      backgroundColor: 'var(--color-surface-brand)',
      color: 'var(--color-text-onBrand)',
      borderRadius: 'var(--radius-cta)',
      minHeight: 'var(--interactive-primary-min-height)',
    },
    secondary: {
      backgroundColor: 'var(--color-surface-inverse)',
      color: 'var(--color-text-inverse)',
      borderRadius: 'var(--radius-button)',
      minHeight: 'var(--interactive-secondary-min-height)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-text-brand)',
      borderRadius: 'var(--radius-cta)',
      minHeight: 'var(--interactive-compact-min-height)',
    },
    destructive: {
      backgroundColor: 'var(--color-surface-error)',
      color: 'var(--color-text-inverse)',
      borderRadius: 'var(--radius-button)',
      minHeight: 'var(--interactive-secondary-min-height)',
    },
  };

  // Base styles
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: 'var(--layout-control-padding-block) var(--layout-control-padding-inline)',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit',
    fontWeight: 700,
    fontSize: 'var(--font-size-body-strong, 15px)',
    transition: 'all var(--motion-hover)',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 'var(--state-disabled-opacity)' : 1,
    ...variantStyles[variant],
  };

  // Icon component
  const IconComponent = icon ? (
    <i
      data-lucide={icon}
      style={{
        display: 'inline-flex',
        width: '18px',
        height: '18px',
        flexShrink: 0,
      }}
    />
  ) : null;

  // Content with icon positioning
  const content = (
    <>
      {iconPosition === 'leading' && IconComponent}
      {loading ? (
        <span style={{ opacity: 0.5 }}>
          {children}
          <span
            style={{
              display: 'inline-block',
              marginLeft: '6px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: '2px solid currentColor',
              borderTopColor: 'transparent',
              animation: 'spin 1s linear infinite',
            }}
          />
        </span>
      ) : (
        children
      )}
      {iconPosition === 'trailing' && IconComponent}
    </>
  );

  return (
    <button
      type={type}
      style={baseStyles}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled}
      aria-disabled={disabled}
      aria-busy={loading}
      aria-label={ariaLabel}
      className={`button button--${variant} ${className}`.trim()}
      {...rest}
    >
      {content}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
};

export default Button;
