/* eslint-disable */
// BusappScreens.jsx — full-screen compositions

const REGIONS = [
  { id: 'kyoto',   name: '京都府', short: '京都' },
  { id: 'hyogo',   name: '兵庫県', short: '兵庫' },
  { id: 'oita',    name: '大分県', short: '大分' },
  { id: 'okinawa', name: '沖縄県', short: '沖縄' },
];

const STOPS_BY_REGION = {
  kyoto:   ['京都駅前', '四条烏丸', '金閣寺', '清水寺', '銀閣寺', '伏見稲荷'],
  hyogo:   ['三宮駅前', '元町', '神戸駅前', '姫路駅前'],
  oita:    ['大分駅前', '別府駅前', '中津駅前'],
  okinawa: ['那覇バスターミナル', '国際通り', '首里城前', '美ら海水族館'],
};

const SAMPLE_BUSES = {
  kyoto: [
    { id: 'k1', name: '京都市営バス 205系統', route: '京都駅前 → 四条烏丸 → 金閣寺', status: 'normal',    eta: '5分', updated: '14:24' },
    { id: 'k2', name: '京都市営バス 100系統', route: '京都駅前 → 五条坂 → 清水寺',  status: 'delay', delayMinutes: 18, eta: '23分', updated: '14:18', message: '観光客の混雑により、大幅な遅延が発生しております。' },
    { id: 'k3', name: '京阪バス 南5系統',     route: '京都駅八条口 → 東福寺 → 伏見稲荷', status: 'normal', eta: '12分', updated: '14:25' },
    { id: 'k4', name: '京都バス 55系統',     route: '出町柳 → 銀閣寺道 → 銀閣寺',  status: 'possible', eta: '8分', updated: '14:22' },
  ],
  hyogo: [
    { id: 'h1', name: '神姫バス 三宮線', route: '三宮駅前 → 元町 → 神戸駅前', status: 'normal', eta: '7分', updated: '14:22' },
    { id: 'h2', name: '神姫バス 急行', route: '神戸駅前 → 姫路駅前',         status: 'delay', delayMinutes: 10, eta: '20分', updated: '14:20', message: '高速道路の混雑により遅延が発生しております。' },
  ],
  oita: [
    { id: 'o1', name: '大分バス 中央線', route: '大分駅前 → 別府駅前',  status: 'normal', eta: '15分', updated: '14:19' },
    { id: 'o2', name: '亀の井バス 北線', route: '別府駅前 → 中津駅前', status: 'suspended', updated: '14:10', message: '車両故障のため、運休しております。復旧まで今しばらくお待ちください。' },
  ],
  okinawa: [
    { id: 'k1', name: '那覇バス 1系統', route: '那覇バスターミナル → 国際通り → 首里城前', status: 'normal', eta: '4分', updated: '14:23' },
    { id: 'k2', name: '沖縄バス 観光路線', route: '那覇バスターミナル → 美ら海水族館',     status: 'delay', delayMinutes: 12, eta: '40分', updated: '14:15', message: 'イベント開催のため遅延が発生しております。' },
  ],
};

function getRegion(id) { return REGIONS.find(r => r.id === id) || REGIONS[0]; }

// ────── Onboarding ──────
function OnboardingScreen({ onComplete }) {
  const [picked, setPicked] = useState(null);
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', padding: 24, paddingTop: 60 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'linear-gradient(135deg,#2C6B5E,#1F5347)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(44,107,94,0.25)',
        }}>
          <Icon name="bus" size={28} style={{ color: '#fff' }} />
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#1E293B', letterSpacing: '-0.02em' }}>バスアプリ</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', letterSpacing: '0.15em' }}>BUS DELAY INFO</div>
        </div>
      </div>

      <h2 style={{ fontSize: 26, fontWeight: 800, color: '#1E293B', letterSpacing: '-0.015em', margin: 0, lineHeight: 1.25 }}>
        ようこそ
      </h2>
      <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7, marginTop: 8, marginBottom: 24 }}>
        ご利用の地域を選択してください。<br />リアルタイムのバス遅延情報をお届けします。
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {REGIONS.map((r) => (
          <button
            key={r.id}
            onClick={() => setPicked(r.id)}
            style={{
              padding: 16, borderRadius: 16,
              background: picked === r.id ? '#2C6B5E' : '#fff',
              color: picked === r.id ? '#fff' : '#334155',
              border: picked === r.id ? '2px solid #2C6B5E' : '2px solid #E2E8F0',
              fontFamily: 'inherit', fontSize: 16, fontWeight: 700,
              cursor: 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Icon name="map-pin" size={18} style={{ color: picked === r.id ? '#fff' : '#94A3B8' }} />
              {r.name}
            </span>
            {picked === r.id && <Icon name="check" size={18} />}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PrimaryButton
          onClick={() => picked && onComplete(picked)}
          style={{ opacity: picked ? 1 : 0.5, cursor: picked ? 'pointer' : 'not-allowed' }}
        >
          はじめる
        </PrimaryButton>
        <button
          onClick={() => onComplete('skip')}
          style={{ background: 'transparent', border: 'none', color: '#94A3B8', fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', padding: 8 }}
        >
          スキップ
        </button>
      </div>
    </div>
  );
}

// ────── Route Card ──────
function RouteCard({ regionId, card, onChange, onOpen, onDelete }) {
  const [pickerOpen, setPickerOpen] = useState(null); // 'from' | 'to'
  const stops = STOPS_BY_REGION[regionId] || [];
  const buses = SAMPLE_BUSES[regionId] || [];
  const matched = card.from && card.to ? buses[0] : null;

  return (
    <Card hoverable={false}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <IconBubble icon="route" color="teal" size={18} padding={9} />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>ルート設定</span>
        </div>
        {card.from && (
          <button onClick={onDelete} style={{ background: 'transparent', border: 'none', color: '#CBD5E1', cursor: 'pointer' }}>
            <Icon name="x" size={18} />
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: matched ? 14 : 0 }}>
        <StopSelectInput
          value={card.from}
          placeholder="乗車地を選択"
          onClick={() => setPickerOpen('from')}
        />
        <div style={{ textAlign: 'center', color: '#94A3B8' }}>
          <Icon name="arrow-down" size={16} />
        </div>
        <StopSelectInput
          value={card.to}
          placeholder="降車地を選択"
          onClick={() => setPickerOpen('to')}
        />
      </div>

      {matched && (
        <div
          onClick={() => onOpen(matched)}
          style={{
            marginTop: 14, padding: 14, borderRadius: 14,
            background: 'linear-gradient(135deg,#F8FAFC 0%, #F1F5F9 100%)',
            border: '1px solid #E2E8F0', cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
            <IconBubble icon="bus" color="blue" size={18} padding={9} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', lineHeight: 1.35 }}>{matched.name}</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 4, display: 'flex', gap: 4, alignItems: 'flex-start' }}>
                <Icon name="map-pin" size={13} style={{ marginTop: 2, color: '#94A3B8' }} />
                <span>{matched.route}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                font: 'var(--typography-eyebrow)',
                color: '#94A3B8',
              }}>あと</div>
              <div style={{
                // 役割：到着時刻（残り時間）。等幅 + 視認性最優先。
                font: 'var(--typography-arrival-time)',
                fontVariantNumeric: 'var(--font-variant-numeric)',
                color: '#2C6B5E',
                letterSpacing: 'var(--tracking-tight)',
              }}>{matched.eta || '—'}</div>
            </div>
          </div>
          <StatusPill status={matched.status} delayMinutes={matched.delayMinutes} />
          {matched.message && (
            <div style={{
              marginTop: 10, padding: 10, borderRadius: 10,
              background: '#fff', display: 'flex', gap: 8,
              fontSize: 12, color: '#475569', lineHeight: 1.6,
            }}>
              <Icon name="info" size={14} style={{ color: '#94A3B8', flexShrink: 0, marginTop: 2 }} />
              <span>{matched.message}</span>
            </div>
          )}
        </div>
      )}

      <StopPickerOverlay
        open={pickerOpen === 'from'}
        title="乗車地を選択"
        stops={stops}
        onPick={(s) => onChange({ ...card, from: s })}
        onClose={() => setPickerOpen(null)}
      />
      <StopPickerOverlay
        open={pickerOpen === 'to'}
        title="降車地を選択"
        stops={stops}
        onPick={(s) => onChange({ ...card, to: s })}
        onClose={() => setPickerOpen(null)}
      />
    </Card>
  );
}

// ────── Home — Routes tab ──────
function RouteListView({ regionId, cards, setCards, onOpenRoute, allStates, onToggleStates }) {
  const stops = STOPS_BY_REGION[regionId] || [];
  const allCardStates = [
    { id: 'p-normal',  from: stops[0], to: stops[1], _fakeStatus: 'normal',    _eta: '5分'  },
    { id: 'p-poss',    from: stops[1], to: stops[2], _fakeStatus: 'possible',  _eta: '8分'  },
    { id: 'p-delay',   from: stops[0], to: stops[2], _fakeStatus: 'delay', _delay: 15, _eta: '23分' },
    { id: 'p-passed',  from: stops[2], to: stops[0], _fakeStatus: 'passed',    _eta: '—'   },
  ];
  const list = allStates ? allCardStates : cards;

  const updateCard = (idx, next) => {
    setCards((prev) => {
      const arr = [...prev]; arr[idx] = next;
      // append blank if last has both stops
      const last = arr[arr.length - 1];
      if (last.from && last.to && arr.length < 6) {
        arr.push({ id: `c-${Date.now()}`, from: null, to: null });
      }
      return arr;
    });
  };
  const deleteCard = (idx) => {
    setCards((prev) => prev.length > 1 ? prev.filter((_, i) => i !== idx) : [{ id: `c-${Date.now()}`, from: null, to: null }]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'relative' }}>
      <div style={{ position: 'absolute', top: 40, left: 40, width: 220, height: 220, background: 'rgba(255,255,255,0.4)', borderRadius: 9999, filter: 'blur(60px)', zIndex: -1, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 80, right: 40, width: 240, height: 240, background: 'rgba(44,107,94,0.05)', borderRadius: 9999, filter: 'blur(60px)', zIndex: -1, pointerEvents: 'none' }} />

      {list.map((card, idx) => (
        allStates ? (
          <FakeStateCard key={card.id} card={card} onOpen={onOpenRoute} regionId={regionId} />
        ) : (
          <RouteCard
            key={card.id}
            regionId={regionId}
            card={card}
            onChange={(next) => updateCard(idx, next)}
            onDelete={() => deleteCard(idx)}
            onOpen={onOpenRoute}
          />
        )
      ))}
    </div>
  );
}

function FakeStateCard({ card, onOpen, regionId }) {
  const buses = SAMPLE_BUSES[regionId] || [];
  const fake = {
    id: card.id,
    name: buses[0]?.name || 'バス路線',
    route: `${card.from} → ${card.to}`,
    status: card._fakeStatus,
    delayMinutes: card._delay,
    eta: card._eta,
    message: card._fakeStatus === 'delay' ? '混雑により遅延が発生しております。' : null,
  };
  return (
    <Card hoverable={false}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <IconBubble icon="route" color="teal" size={18} padding={9} />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>{card.from} → {card.to}</span>
        </div>
      </div>
      <div onClick={() => onOpen(fake)} style={{ padding: 14, borderRadius: 14, background: '#F8FAFC', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
          <IconBubble icon="bus" color="blue" size={18} padding={9} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>{fake.name}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ font: 'var(--typography-eyebrow)', color: '#94A3B8' }}>あと</div>
            <div style={{
              font: 'var(--typography-arrival-time)',
              fontVariantNumeric: 'var(--font-variant-numeric)',
              color: '#2C6B5E',
              letterSpacing: 'var(--tracking-tight)',
            }}>{fake.eta}</div>
          </div>
        </div>
        <StatusPill status={fake.status} delayMinutes={fake.delayMinutes} />
      </div>
    </Card>
  );
}

// ────── Payment View (Kyoto only) ──────
function PaymentView() {
  const [device, setDevice] = useState('iphone');
  const [state, setState] = useState('idle'); // idle | boarding | alighting | error | expired
  const [boardingTime, setBoardingTime] = useState(null);
  const [alightingTime, setAlightingTime] = useState(null);
  const [flash, setFlash] = useState(false);
  const longTimer = useRef(null);

  const doFlash = useCallback(() => {
    setFlash(true);
    setTimeout(() => setFlash(false), 380);
  }, []);
  const onTap = () => {
    if (state === 'idle') { doFlash(); setBoardingTime(new Date()); setState('boarding'); }
    else if (state === 'boarding') { doFlash(); setAlightingTime(new Date()); setState('alighting'); }
  };
  const onPointerDown = () => {
    if (state === 'idle' || state === 'boarding') {
      longTimer.current = setTimeout(() => { doFlash(); setState('error'); }, 800);
    }
  };
  const onPointerUp = () => { if (longTimer.current) clearTimeout(longTimer.current); };
  const reset = () => { setState('idle'); setBoardingTime(null); setAlightingTime(null); };
  const fmt = (d) => d ? `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}` : '';

  const headerProps = state === 'boarding'
    ? { bg: 'rgba(16,185,129,0.15)', bd: 'rgba(52,211,153,0.30)', fg: '#047857', icon: 'bus', label: '乗車中' }
    : state === 'expired'
      ? { bg: 'rgba(203,213,225,0.20)', bd: 'rgba(203,213,225,0.40)', fg: '#64748B', icon: 'shield-off', label: '有効期限切れ' }
      : { bg: 'rgba(44,107,94,0.10)', bd: 'rgba(44,107,94,0.20)', fg: '#2C6B5E', icon: 'shield-check', label: '定期券 有効（乗車前）' };

  const passGrad = state === 'boarding' ? 'linear-gradient(135deg,#10B981,#059669,#0F766E)'
    : state === 'expired' ? 'linear-gradient(135deg,#94A3B8,#64748B,#475569)'
    : 'linear-gradient(135deg,#2C6B5E,#34796A,#1F5347)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, position: 'relative', userSelect: 'none' }}>
      {flash && <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#fff', opacity: 0.6, pointerEvents: 'none', animation: 'busapp-fade-quick 0.4s ease' }} />}

      {/* Header pill */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        padding: '12px 18px', borderRadius: 20,
        background: headerProps.bg, border: `1px solid ${headerProps.bd}`,
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      }}>
        <Icon name={headerProps.icon} size={20} style={{ color: headerProps.fg }} />
        <span style={{ fontSize: 15, fontWeight: 700, color: headerProps.fg, letterSpacing: '0.02em' }}>{headerProps.label}</span>
        {state === 'boarding' && <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 9999, background: '#34D399', marginLeft: 4, animation: 'busapp-breathe 2s infinite' }} />}
      </div>

      {/* Pass card */}
      <div style={{
        position: 'relative', overflow: 'hidden', padding: state === 'boarding' ? 20 : 24,
        borderRadius: 28, color: '#fff',
        background: passGrad,
        boxShadow: state === 'expired' ? '0 20px 50px rgba(100,116,139,0.20)' : '0 20px 50px rgba(44,107,94,0.25)',
        border: '1px solid rgba(255,255,255,0.15)',
      }}>
        <div style={{ position: 'absolute', top: -48, right: -48, width: 192, height: 192, background: 'rgba(255,255,255,0.08)', borderRadius: 9999, filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: -32, left: -32, width: 144, height: 144, background: 'rgba(255,255,255,0.05)', borderRadius: 9999, filter: 'blur(40px)' }} />
        {state === 'expired' && (
          <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.20)', padding: '4px 12px', borderRadius: 9999, zIndex: 2 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.80)', letterSpacing: '0.1em' }}>期限切れ</span>
          </div>
        )}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: state === 'boarding' ? 8 : 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.7)' }}>
            <Icon name="arrow-left-right" size={14} />
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em' }}>区間</span>
          </div>
          <div style={{ fontSize: state === 'boarding' ? 24 : 30, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            渋谷駅 <span style={{ color: 'rgba(255,255,255,0.6)', margin: '0 4px' }}>↔</span> 六本木駅
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="calendar-days" size={14} style={{ color: 'rgba(255,255,255,0.6)' }} />
              <span style={{
                fontSize: 14, fontWeight: 600,
                color: state === 'expired' ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.9)',
                textDecoration: state === 'expired' ? 'line-through' : 'none',
              }}>{state === 'expired' ? '2025.03.31 まで' : '2026.05.30 まで'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="hash" size={12} style={{ color: 'rgba(255,255,255,0.4)' }} />
              <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.5)' }}>ID: 12345678</span>
            </div>
          </div>
          {state === 'boarding' && boardingTime && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'rgba(255,255,255,0.15)', borderRadius: 14,
              padding: '10px 14px', backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.10)', marginTop: 4,
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon name="clock" size={14} style={{ color: 'rgba(255,255,255,0.7)' }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{fmt(boardingTime)}</span>
              </span>
              <span style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.2)' }} />
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon name="map-pin" size={14} style={{ color: 'rgba(255,255,255,0.7)' }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>渋谷駅前</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Expired CTA */}
      {state === 'expired' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ borderRadius: 20, background: 'rgba(254,243,199,0.80)', border: '1px solid rgba(253,230,138,0.60)', padding: 14, display: 'flex', gap: 10 }}>
            <Icon name="alert-triangle" size={20} style={{ color: '#F59E0B', flexShrink: 0, marginTop: 2 }} />
            <p style={{ margin: 0, fontSize: 13, color: '#92400E', fontWeight: 600, lineHeight: 1.5 }}>
              定期券の有効期限が切れています。NFC乗車をご利用いただくには、定期券を更新してください。
            </p>
          </div>
          <PrimaryButton icon="refresh-cw" onClick={() => setState('idle')}>継続購入する</PrimaryButton>
        </div>
      )}

      {/* Device toggle */}
      {(state === 'idle' || state === 'boarding') && (
        <SegmentedTabs
          tabs={[
            { value: 'iphone',  label: 'iPhone',  icon: 'apple' },
            { value: 'android', label: 'Android', icon: 'monitor-smartphone' },
          ]}
          active={device}
          onChange={setDevice}
        />
      )}

      {/* NFC tap area */}
      {(state === 'idle' || state === 'boarding') && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', gap: 18 }}>
          <div
            style={{ position: 'relative', width: 220, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            onClick={onTap}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: 9999, border: `2px solid ${state === 'boarding' ? 'rgba(52,211,153,0.30)' : 'rgba(44,107,94,0.30)'}`, animation: 'busapp-pulse 2.4s ease-out infinite' }} />
            <div style={{ position: 'absolute', width: 220, height: 220, borderRadius: 9999, border: `2px solid ${state === 'boarding' ? 'rgba(52,211,153,0.20)' : 'rgba(44,107,94,0.20)'}`, animation: 'busapp-pulse 2.4s ease-out infinite 0.8s' }} />
            <div style={{
              width: 112, height: 112, borderRadius: 9999,
              background: state === 'boarding' ? 'linear-gradient(135deg,#10B981,#0F766E)' : 'linear-gradient(135deg,#2C6B5E,#1F5347)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 10px 25px -3px rgba(0,0,0,0.20)', position: 'relative', zIndex: 1,
            }}>
              <Icon name={device === 'iphone' ? 'smartphone' : 'nfc'} size={48} style={{ color: '#fff' }} />
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#334155', letterSpacing: '0.02em' }}>
              {state === 'boarding' ? '降車時にもう一度タッチ' : device === 'iphone' ? '端末の先端を近づけてください' : '端末の背面をかざしてください'}
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94A3B8', fontWeight: 500 }}>
              {state === 'boarding' ? '降車タッチ待機中...' : '読み取り待機中...'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748B' }}>
            <Icon name="info" size={14} />
            <span>スマホケースに厚みがあると反応しない場合があります</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px 16px' }}>
            <span style={{ fontSize: 11, color: 'rgba(148,163,184,0.7)' }}>※ タップで乗降シミュレート</span>
            <span style={{ fontSize: 11, color: 'rgba(148,163,184,0.7)' }}>※ 長押しでエラー</span>
            <button onClick={() => setState('expired')} style={{ background: 'transparent', border: 'none', fontSize: 11, color: 'rgba(148,163,184,0.7)', textDecoration: 'underline', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>※ 期限切れを確認</button>
          </div>
        </div>
      )}

      {/* Idle warn */}
      {state === 'idle' && (
        <div style={{ borderRadius: 20, background: 'rgba(254,243,199,0.80)', border: '1px solid rgba(253,230,138,0.60)', padding: 18, display: 'flex', gap: 12 }}>
          <Icon name="alert-triangle" size={20} style={{ color: '#F59E0B', flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#92400E' }}>NFC設定を確認してください</p>
            <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(146,64,14,0.80)', lineHeight: 1.5 }}>ケースを外すか、位置を調整してください</p>
          </div>
        </div>
      )}

      {/* Modals */}
      {state === 'alighting' && (
        <Modal onClose={reset}>
          <div style={{ padding: '40px 24px 24px', textAlign: 'center', background: 'linear-gradient(180deg,#ECFDF5,#fff)' }}>
            <div style={{ width: 80, height: 80, borderRadius: 9999, background: 'linear-gradient(135deg,#34D399,#059669)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px -3px rgba(0,0,0,0.20)', marginBottom: 18 }}>
              <Icon name="check" size={40} strokeWidth={3} style={{ color: '#fff' }} />
            </div>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1E293B', letterSpacing: '0.02em' }}>ありがとうございました</p>
          </div>
          <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 16, background: 'rgba(236,253,245,0.80)', borderRadius: 20, border: '1px solid #D1FAE5' }}>
              <Icon name="circle-dollar-sign" size={24} style={{ color: '#059669' }} />
              <span style={{
                font: 'var(--typography-fare-amount)',
                fontVariantNumeric: 'var(--font-variant-numeric)',
                color: '#047857',
                letterSpacing: 'var(--tracking-tight)',
              }}>¥210</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <SummaryRow label="乗車" name="渋谷駅前" time={fmt(boardingTime)} color="teal" />
              <div style={{ marginLeft: 15, width: 1, height: 16, background: '#E2E8F0' }} />
              <SummaryRow label="降車" name="六本木ヒルズ" time={fmt(alightingTime)} color="emerald" />
            </div>
            <SecondaryButton onClick={reset}>閉じる</SecondaryButton>
          </div>
        </Modal>
      )}

      {state === 'error' && (
        <Modal onClose={() => setState('idle')}>
          <div style={{ padding: '40px 24px 16px', textAlign: 'center', background: 'linear-gradient(180deg,#FFF7ED,#fff)' }}>
            <div style={{ width: 80, height: 80, borderRadius: 9999, background: 'linear-gradient(135deg,#FDBA74,#F97316)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px -3px rgba(0,0,0,0.20)', marginBottom: 18, animation: 'busapp-shake 0.6s 0.3s ease' }}>
              <Icon name="x" size={40} strokeWidth={3} style={{ color: '#fff' }} />
            </div>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1E293B', letterSpacing: '0.02em' }}>読み取りに失敗しました</p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94A3B8', fontWeight: 500 }}>もう一度お試しください</p>
          </div>
          <div style={{ padding: '8px 24px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ borderRadius: 20, background: 'rgba(255,247,237,0.80)', border: '1px solid rgba(254,215,170,0.50)', padding: 14, display: 'flex', gap: 10 }}>
              <Icon name="info" size={16} style={{ color: '#FB923C', flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ margin: 0, fontSize: 13, color: 'rgba(154,52,18,0.90)', fontWeight: 600 }}>端末の位置を調整してください</p>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'rgba(194,65,12,0.60)', lineHeight: 1.5 }}>ケースを外すか、読み取り部分に直接当ててみてください。</p>
              </div>
            </div>
            <PrimaryButton icon="rotate-ccw" onClick={() => setState('idle')} style={{ background: '#F97316', boxShadow: '0 8px 30px rgba(249,115,22,0.20)' }}>もう一度試す</PrimaryButton>
          </div>
        </Modal>
      )}
    </div>
  );
}

function SummaryRow({ label, name, time, color }) {
  const palette = color === 'teal' ? { bg: 'rgba(44,107,94,0.10)', fg: '#2C6B5E' } : { bg: 'rgba(16,185,129,0.10)', fg: '#059669' };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 32, height: 32, borderRadius: 9999, background: palette.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name="map-pin" size={16} style={{ color: palette.fg }} />
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>{label}</p>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#334155' }}>
          {name} <span style={{ marginLeft: 8, color: '#94A3B8', fontWeight: 500 }}>{time}</span>
        </p>
      </div>
    </div>
  );
}

// ────── Route Detail ──────
function RouteDetailScreen({ bus, onBack }) {
  const stops = ['出発停留所', '中間停留所 1', '中間停留所 2', bus?.route?.split(' → ').pop() || '到着停留所'];
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: 'rgba(255,255,255,0.70)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.60)', position: 'sticky', top: 0, zIndex: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer', padding: 8 }}>
          <Icon name="chevron-left" size={24} />
        </button>
        <h1 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#334155' }}>路線詳細</h1>
      </header>
      <main style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card hoverable={false}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
            <IconBubble icon="bus" color="blue" size={20} />
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1E293B', lineHeight: 1.4 }}>{bus?.name || 'バス路線'}</h2>
              <p style={{ margin: '6px 0 0', fontSize: 12, color: '#64748B' }}>{bus?.route}</p>
            </div>
          </div>
          <StatusPill status={bus?.status || 'normal'} delayMinutes={bus?.delayMinutes} full />
          {bus?.message && (
            <div style={{ marginTop: 12, padding: 12, borderRadius: 12, background: '#F8FAFC', display: 'flex', gap: 10 }}>
              <Icon name="info" size={16} style={{ color: '#94A3B8', flexShrink: 0, marginTop: 2 }} />
              <p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.6 }}>{bus.message}</p>
            </div>
          )}
        </Card>

        <Card hoverable={false}>
          <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14 }}>停車順</h3>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {stops.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', paddingBottom: 14 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 14, height: 14, borderRadius: 9999, background: i === 0 ? '#2C6B5E' : '#fff', border: '2px solid #2C6B5E' }} />
                  {i < stops.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 28, background: '#E2E8F0' }} />}
                </div>
                <div style={{ paddingTop: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>{s}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'var(--font-mono, ui-monospace)' }}>{`${14 + i * 5}:${String(Math.floor(Math.random()*60)).padStart(2,'0')}`}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card hoverable={false}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Icon name="bell" size={20} style={{ color: '#94A3B8' }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>接近通知</div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>5分前に通知を受け取る</div>
              </div>
            </div>
            <button style={{ width: 44, height: 26, borderRadius: 9999, background: '#2C6B5E', border: 'none', position: 'relative', cursor: 'pointer' }}>
              <span style={{ position: 'absolute', top: 3, right: 3, width: 20, height: 20, borderRadius: 9999, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
            </button>
          </div>
        </Card>

        <p style={{ margin: 0, fontSize: 11, color: '#94A3B8', textAlign: 'center' }}>更新時刻: 2026/03/11 {bus?.updated || '14:23'}</p>
      </main>
    </div>
  );
}

// ────── Region Settings ──────
function RegionSettingsScreen({ regionId, onPick, onBack }) {
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: 'rgba(255,255,255,0.70)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.60)', position: 'sticky', top: 0, zIndex: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer', padding: 8 }}>
          <Icon name="chevron-left" size={24} />
        </button>
        <h1 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#334155' }}>地域設定</h1>
      </header>
      <main style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p style={{ margin: '0 4px 8px', fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>
          ご利用の地域を選択してください。選択した地域のバス路線情報のみが表示されます。
        </p>
        {REGIONS.map((r) => (
          <button
            key={r.id}
            onClick={() => onPick(r.id)}
            style={{
              padding: 16, borderRadius: 16,
              background: regionId === r.id ? 'rgba(44,107,94,0.10)' : '#fff',
              color: '#334155',
              border: regionId === r.id ? '2px solid #2C6B5E' : '2px solid #E2E8F0',
              fontFamily: 'inherit', fontSize: 15, fontWeight: 600,
              cursor: 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Icon name="map-pin" size={18} style={{ color: regionId === r.id ? '#2C6B5E' : '#94A3B8' }} />
              {r.name}
            </span>
            {regionId === r.id && <Icon name="check" size={18} style={{ color: '#2C6B5E' }} />}
          </button>
        ))}
      </main>
    </div>
  );
}

Object.assign(window, {
  REGIONS, getRegion, OnboardingScreen,
  RouteListView, PaymentView, RouteDetailScreen, RegionSettingsScreen,
});
