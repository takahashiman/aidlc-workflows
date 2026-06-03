/**
 * Card Component — FIG Universal Design System
 *
 * Semantic token references only. No inline styles or direct HEX values.
 */

const Card = ({
  variant = 'default',     // 'default' | 'interactive' | 'floating' | 'hero'
  children,
  onClick,
  padding = 'md',          // 'sm' | 'md' | 'lg'
  as = 'div',
  className = '',
  ariaLabel,
  ...rest
}) => {
  // Padding mapping to Semantic tokens
  const paddingMap = {
    sm: 'var(--layout-card-padding-compact)',   // 12px
    md: 'var(--layout-card-padding)',            // 16px
    lg: 'var(--layout-card-padding-loose)',      // 24px
  };

  // Base styles using only Semantic tokens
  const baseStyles = {
    backgroundColor: 'var(--color-surface-default)',
    borderRadius: 'var(--radius-card)',
    padding: paddingMap[padding],
    border: '1px solid var(--color-border-card)',
    boxShadow: 'var(--surface-elevation-card)',
  };

  // Variant-specific overrides
  const variantStyles = {
    default: {},
    interactive: {
      cursor: 'pointer',
      transition: 'all var(--motion-hover)',
    },
    floating: {
      boxShadow: 'var(--surface-elevation-floating)',
    },
    hero: {
      backgroundColor: 'var(--color-surface-brand-vivid)',
      borderRadius: 'var(--radius-card-hero)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      boxShadow: 'var(--surface-elevation-modal)',
      margin: 'var(--isolation-around)',
    },
  };

  // Build className string for hover/active states
  let classNames = `card card--${variant} ${className}`;
  if (variant === 'interactive') {
    classNames += ' card--interactive';
  }

  // Determine element type
  const Element = as;

  return (
    <Element
      className={classNames}
      style={{ ...baseStyles, ...variantStyles[variant] }}
      onClick={variant === 'interactive' ? onClick : undefined}
      aria-label={ariaLabel}
      {...rest}
    >
      {children}
    </Element>
  );
};

export default Card;
