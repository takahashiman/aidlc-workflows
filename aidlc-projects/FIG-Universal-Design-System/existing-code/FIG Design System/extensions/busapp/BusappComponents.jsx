/* eslint-disable */
// BusappComponents.jsx — atomic building blocks for the bus app UI kit
// Loaded via <script type="text/babel"> after React + Babel.

const { useState, useEffect, useRef, useCallback } = React;

// ────── Lucide icon helper ──────
function Icon({ name, size = 20, strokeWidth = 2, className = '', style = {} }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && window.lucide) {
      ref.current.innerHTML = '';
      const el = document.createElement('i');
      el.setAttribute('data-lucide', name);
      ref.current.appendChild(el);
      window.lucide.createIcons({ attrs: { width: size, height: size, 'stroke-width': strokeWidth } });
    }
  }, [name, size, strokeWidth]);
  return <span ref={ref} className={`busapp-icon ${className}`} style={{ display: 'inline-flex', width: size, height: size, ...style }} />;
}

// ────── Buttons ──────
function PrimaryButton({ children, icon, onClick, className = '', style = {} }) {
  return (
    <button
      onClick={onClick}
      className={`busapp-btn-primary ${className}`}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        background: '#2C6B5E', color: '#fff', padding: '14px 22px',
        borderRadius: 20, border: 'none', cursor: 'pointer',
        fontFamily: 'inherit', fontWeight: 700, fontSize: 16, letterSpacing: '0.02em',
        boxShadow: '0 8px 30px rgba(44,107,94,0.20)', transition: 'all 0.2s', width: '100%',
        ...style,
      }}
      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      {icon && <Icon name={icon} size={20} />}
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick, className = '', style = {} }) {
  return (
    <button
      onClick={onClick}
      className={`busapp-btn-secondary ${className}`}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: '#1E293B', color: '#fff', padding: '14px 22px',
        borderRadius: 16, border: 'none', cursor: 'pointer',
        fontFamily: 'inherit', fontWeight: 700, fontSize: 15, width: '100%',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// ────── Status pill ──────
function StatusPill({ status, delayMinutes, full = false }) {
  const map = {
    normal:    { bg: '#ECFDF5', fg: '#047857', icon: 'check-circle', label: '通常運行' },
    possible:  { bg: '#FFFBEB', fg: '#B45309', icon: 'clock',        label: '遅延の可能性' },
    delay:     { bg: '#FFFBEB', fg: '#B45309', icon: 'clock',        label: delayMinutes ? `約${delayMinutes}分遅延` : '遅延' },
    suspended: { bg: '#FEF2F2', fg: '#B91C1C', icon: 'x-circle',     label: '運休' },
    passed:    { bg: '#F1F5F9', fg: '#64748B', icon: 'check',        label: '通過済' },
  };
  const m = map[status] || map.normal;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '8px 14px', borderRadius: 9999,
      background: m.bg, color: m.fg,
      // 役割：状態表示ピル。短文・潰れ厳禁・全幅対応。
      font: 'var(--typography-status-pill)',
      letterSpacing: 'var(--tracking-wide)',
      width: full ? '100%' : 'auto', justifyContent: full ? 'center' : 'flex-start',
    }}>
      <Icon name={m.icon} size={16} />
      {m.label}
    </div>
  );
}

// ────── Icon bubble ──────
function IconBubble({ icon, color = 'blue', size = 20, padding = 10 }) {
  const palettes = {
    blue:    { bg: '#DBEAFE', fg: '#1D4ED8' },
    teal:    { bg: 'rgba(44,107,94,0.10)', fg: '#2C6B5E' },
    emerald: { bg: 'rgba(16,185,129,0.10)', fg: '#047857' },
    amber:   { bg: '#FEF3C7', fg: '#B45309' },
    slate:   { bg: '#F1F5F9', fg: '#475569' },
  };
  const p = palettes[color] || palettes.blue;
  return (
    <div style={{
      background: p.bg, color: p.fg, padding,
      borderRadius: 12, display: 'inline-flex',
      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <Icon name={icon} size={size} />
    </div>
  );
}

// ────── Card ──────
function Card({ children, hoverable = true, style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB',
        padding: 16, transition: 'all 0.2s',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      onMouseEnter={(e) => hoverable && (e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,.1)')}
      onMouseLeave={(e) => hoverable && (e.currentTarget.style.boxShadow = 'none')}
    >
      {children}
    </div>
  );
}

// ────── Header ──────
function Header({ regionShort, onMenu, onRegion, title = 'バスアプリ' }) {
  return (
    <header style={{
      background: 'rgba(255,255,255,0.70)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      padding: '12px 16px',
      borderBottom: '1px solid rgba(255,255,255,0.60)',
      position: 'sticky', top: 0, zIndex: 20,
      boxShadow: '0 4px 30px rgba(0,0,0,0.03)',
      display: 'flex', alignItems: 'center',
    }}>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
        <button
          onClick={onMenu}
          style={{
            padding: 8, color: '#94A3B8', background: 'transparent',
            border: 'none', borderRadius: 9999, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center',
          }}
        >
          <Icon name="menu" size={24} />
        </button>
      </div>
      <h1 style={{
        fontSize: 18, fontWeight: 700, color: '#334155',
        letterSpacing: '-0.01em', whiteSpace: 'nowrap', margin: 0,
      }}>{title}</h1>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={onRegion}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '6px 10px', color: '#2C6B5E',
            background: 'transparent', border: 'none', cursor: 'pointer',
            borderRadius: 9999, fontWeight: 700, fontSize: 12,
          }}
        >
          <Icon name="map-pin" size={14} />
          <span>{regionShort}</span>
        </button>
      </div>
    </header>
  );
}

// ────── Segmented Tab bar ──────
function SegmentedTabs({ tabs, active, onChange, twoTone = false }) {
  return (
    <div style={{
      display: 'flex',
      background: 'rgba(226,232,240,0.50)',
      padding: 6,
      borderRadius: 16,
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      border: '1px solid rgba(226,232,240,0.50)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      {tabs.map((t) => {
        const isActive = t.value === active;
        const isPaymentActive = isActive && twoTone && t.value === 'payment';
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 6, padding: '14px 8px',
              borderRadius: 12, border: 'none', cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 13,
              fontWeight: isActive ? 700 : 500,
              transition: 'all 0.3s',
              background: isPaymentActive ? '#2C6B5E' : isActive ? '#fff' : 'transparent',
              color: isPaymentActive ? '#fff' : isActive ? '#2C6B5E' : '#64748B',
              boxShadow: isPaymentActive
                ? '0 4px 20px rgba(44,107,94,0.25)'
                : isActive
                  ? '0 2px 16px rgba(0,0,0,0.06)'
                  : 'none',
              transform: isActive ? 'scale(1)' : 'scale(0.95)',
            }}
          >
            <Icon name={t.icon} size={24} />
            <span style={{ letterSpacing: '0.02em' }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ────── Modal scaffold ──────
function Modal({ children, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.30)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        padding: 24,
        animation: 'busapp-fade-in 0.3s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 380, background: '#fff',
          borderRadius: 28, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          overflow: 'hidden', animation: 'busapp-modal-in 0.5s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ────── Sidebar drawer ──────
function Sidebar({ open, onClose, regionShort, onNavigate }) {
  if (!open) return null;
  const showTicket = regionShort === '京都';
  return (
    <React.Fragment>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(15,23,42,0.40)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          animation: 'busapp-fade-in 0.25s ease',
        }}
      />
      <aside style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
        width: 288, background: '#fff',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        display: 'flex', flexDirection: 'column',
        animation: 'busapp-slide-in 0.35s cubic-bezier(0.22,1,0.36,1)',
      }}>
        <div style={{
          padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid #F1F5F9',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: '#F1F5F9', padding: 8, borderRadius: 9999, color: '#475569' }}>
              <Icon name="user" size={24} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontWeight: 700, color: '#334155', fontSize: 14 }}>ゲストユーザー</h2>
              <p style={{ margin: 0, fontSize: 11, color: '#64748B' }}>アカウント未登録</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ padding: 8, background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', borderRadius: 9999 }}
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          <SidebarSection title="ACCOUNT">
            <SidebarRow icon="user" label="プロフィール" onClick={() => onNavigate('profile')} />
          </SidebarSection>

          {showTicket && (
            <SidebarSection title="サービス">
              <SidebarRow icon="ticket" label="定期券購入手続き" onClick={() => onNavigate('ticket')} />
            </SidebarSection>
          )}

          <SidebarSection title="設定">
            <SidebarRow
              icon="map-pin"
              label="地域設定"
              right={<span style={{ background: 'rgba(44,107,94,0.10)', color: '#2C6B5E', padding: '2px 8px', borderRadius: 9999, fontSize: 11, fontWeight: 700 }}>{regionShort}</span>}
              onClick={() => onNavigate('region')}
            />
            <SidebarRow icon="settings" label="アプリ設定" />
          </SidebarSection>
        </div>

        <div style={{ padding: 16, borderTop: '1px solid #F1F5F9' }}>
          <button style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: 12, color: '#EF4444', fontWeight: 500, fontSize: 14,
            background: 'transparent', border: 'none', borderRadius: 12, cursor: 'pointer',
            fontFamily: 'inherit',
          }}>
            <Icon name="log-out" size={20} />
            <span>ログアウト</span>
          </button>
        </div>
      </aside>
    </React.Fragment>
  );
}

function SidebarSection({ title, children }) {
  return (
    <div style={{ padding: '8px 16px' }}>
      <h3 style={{
        fontSize: 11, fontWeight: 700, color: '#94A3B8',
        textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, marginTop: 0,
      }}>{title}</h3>
      <div>{children}</div>
    </div>
  );
}

function SidebarRow({ icon, label, right, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: 12, borderRadius: 12, color: '#334155', background: 'transparent',
        border: 'none', cursor: 'pointer', transition: 'background 0.15s',
        fontFamily: 'inherit',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ color: '#94A3B8', display: 'inline-flex' }}><Icon name={icon} size={20} /></span>
        <span style={{ fontWeight: 500, fontSize: 14 }}>{label}</span>
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#CBD5E1' }}>
        {right}
        <Icon name="chevron-right" size={16} />
      </span>
    </button>
  );
}

// ────── Stop selector input ──────
function StopSelectInput({ value, placeholder, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'left',
        background: '#fff', border: '2px solid #E2E8F0',
        borderRadius: 12, padding: '12px 16px',
        fontFamily: 'inherit', fontSize: 15, fontWeight: 500,
        color: value ? '#111827' : '#94A3B8', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}
    >
      <span>{value || placeholder}</span>
      <Icon name="chevron-down" size={18} style={{ color: '#94A3B8' }} />
    </button>
  );
}

// ────── Stop picker overlay ──────
function StopPickerOverlay({ open, title, stops, onPick, onClose }) {
  if (!open) return null;
  return (
    <Modal onClose={onClose}>
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1E293B' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
            <Icon name="x" size={20} />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 320, overflowY: 'auto' }}>
          {stops.map((s) => (
            <button
              key={s}
              onClick={() => { onPick(s); onClose(); }}
              style={{
                textAlign: 'left', padding: '12px 14px', borderRadius: 12,
                background: 'transparent', border: '1px solid #F1F5F9',
                fontFamily: 'inherit', fontSize: 14, fontWeight: 500, color: '#334155',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <Icon name="map-pin" size={16} style={{ color: '#94A3B8' }} />
              {s}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}

Object.assign(window, {
  Icon, PrimaryButton, SecondaryButton,
  StatusPill, IconBubble, Card,
  Header, SegmentedTabs, Modal,
  Sidebar, SidebarSection, SidebarRow,
  StopSelectInput, StopPickerOverlay,
});
