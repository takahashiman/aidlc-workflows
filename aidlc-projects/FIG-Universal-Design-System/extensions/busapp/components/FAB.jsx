/**
 * FAB (Floating Action Button) Component — FIG Universal Design System
 *
 * Floating action button with semantic token references.
 * Fixed positioning, z-index management, and accessibility features.
 */

const FAB = ({
  icon,
  onClick,
  label,
  disabled = false,
  position = 'bottom-right',
  size = 'default',
}) => {
  // Size mapping to Semantic tokens
  const sizeMap = {
    default: 'var(--interactive-fab-size, 56px)',
    large: 'var(--interactive-fab-size-large, 64px)',
  };

  // Position mapping
  const positionMap = {
    'bottom-right': { bottom: '24px', right: '24px' },
    'bottom-left': { bottom: '24px', left: '24px' },
    'bottom-center': { bottom: '24px', left: '50%', transform: 'translateX(-50%)' },
  };

  const fabSize = sizeMap[size];

  const styles = {
    position: 'fixed',
    ...positionMap[position],
    width: fabSize,
    height: fabSize,
    borderRadius: '50%',
    backgroundColor: 'var(--color-surface-brand)',
    color: 'var(--color-text-onBrand)',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--surface-elevation-floating)',
    zIndex: 'var(--z-fab, 40)',
    transition: 'all var(--motion-hover)',
    opacity: disabled ? 'var(--state-disabled-opacity)' : 1,
    minHeight: 'var(--a11y-touch-target, 44px)',
  };

  return (
    <button
      style={styles}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-disabled={disabled}
      aria-label={label}
      className="fab"
      title={label}
    >
      <i
        data-lucide={icon}
        style={{
          display: 'inline-flex',
          width: size === 'large' ? '28px' : '24px',
          height: size === 'large' ? '28px' : '24px',
          strokeWidth: 2,
        }}
      />
    </button>
  );
};

export default FAB;
