/* eslint-disable */
// BusappApp.jsx — top-level state machine

function BusappApp() {
  const [route, setRoute] = useState(() => sessionStorage.getItem('busapp_route') || 'onboarding'); // onboarding | home | route-detail | region-settings
  const [regionId, setRegionId] = useState(() => sessionStorage.getItem('busapp_region') || 'kyoto');
  const [tab, setTab] = useState('route');
  const [allStates, setAllStates] = useState(false);
  const [cards, setCards] = useState([{ id: 'c0', from: null, to: null }]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeBus, setActiveBus] = useState(null);

  useEffect(() => { sessionStorage.setItem('busapp_route', route); }, [route]);
  useEffect(() => { sessionStorage.setItem('busapp_region', regionId); }, [regionId]);

  const region = getRegion(regionId);
  const showPayment = regionId === 'kyoto';

  const completeOnboarding = (rid) => {
    setRegionId(rid === 'skip' ? 'kyoto' : rid);
    setRoute('home');
  };

  const openRoute = (bus) => { setActiveBus(bus); setRoute('route-detail'); };

  if (route === 'onboarding') {
    return <OnboardingScreen onComplete={completeOnboarding} />;
  }

  if (route === 'route-detail') {
    return <RouteDetailScreen bus={activeBus} onBack={() => setRoute('home')} />;
  }

  if (route === 'region-settings') {
    return (
      <RegionSettingsScreen
        regionId={regionId}
        onPick={(id) => { setRegionId(id); if (id !== 'kyoto') setTab('route'); setRoute('home'); }}
        onBack={() => setRoute('home')}
      />
    );
  }

  // home
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        regionShort={region.short}
        onNavigate={(dest) => {
          setSidebarOpen(false);
          if (dest === 'region') setRoute('region-settings');
        }}
      />
      <Header
        regionShort={region.short}
        onMenu={() => setSidebarOpen(true)}
        onRegion={() => setRoute('region-settings')}
      />
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 96px', width: '100%', flex: 1, boxSizing: 'border-box' }}>
        {showPayment ? (
          <div style={{ marginBottom: 20 }}>
            <SegmentedTabs
              tabs={[
                { value: 'route',   label: '運行情報',   icon: 'route' },
                { value: 'payment', label: '乗車・決済', icon: 'credit-card' },
              ]}
              active={tab}
              onChange={setTab}
              twoTone
            />
          </div>
        ) : (
          <div style={{ marginBottom: 20 }}>
            <SegmentedTabs
              tabs={[{ value: 'route', label: '運行情報', icon: 'route' }]}
              active={tab}
              onChange={() => {}}
            />
          </div>
        )}

        {tab === 'route' ? (
          <RouteListView
            regionId={regionId}
            cards={cards}
            setCards={setCards}
            onOpenRoute={openRoute}
            allStates={allStates}
            onToggleStates={() => setAllStates((v) => !v)}
          />
        ) : (
          <PaymentView />
        )}
      </main>

      {tab === 'route' && (
        <button
          onClick={() => setAllStates((v) => !v)}
          style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 40,
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(30,41,59,0.90)', color: '#fff',
            padding: '14px 22px', borderRadius: 9999,
            border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            fontSize: 13, fontWeight: 700, letterSpacing: '0.05em',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Icon name="layout-template" size={18} />
          <span>{allStates ? '初期画面に戻る' : '全状態を確認する'}</span>
        </button>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<BusappApp />);
