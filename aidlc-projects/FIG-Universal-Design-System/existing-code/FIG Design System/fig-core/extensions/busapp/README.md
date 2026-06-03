# UI Kit — バスアプリ (Bus Delay Info)

Click-thru mobile prototype recreating the core flows from the source app.

## Screens covered

1. **Onboarding** — splash + region picker (京都府 / 兵庫県 / 大分県 / 沖縄県, plus skip).
2. **Home — Operation Info (運行情報)** — header, segmented tab bar (Kyoto-only), stack of route cards with from/to selection and live-ish next-arrival display, FAB to toggle "all states" preview, sidebar drawer.
3. **Home — Ride & Pay (乗車・決済)** — Kyoto-only commuter pass with NFC tap simulation, three pass states, alighting summary modal, error modal.
4. **Route detail** — drill-down showing the full timetable & status timeline for a chosen bus.
5. **Region settings** — list-style page to switch active prefecture.

## How to interact

- Open `index.html`. The prototype boots into Onboarding on first load (state persists in `sessionStorage`).
- Pick a region → land on Home. Toggle the bottom-right FAB to see all card states (通常 / 遅延の可能性 / 遅延確定 / 通過済).
- Open the menu (top-left) for the sidebar → switch region or open settings.
- If you picked **京都府**, you'll see the second tab "乗車・決済" — tap into it, then tap the NFC circle to simulate boarding, tap again to alight.

## File layout

- `index.html` — entry point + React/Babel bootstrap.
- `BusappComponents.jsx` — atomic components (Button, StatusPill, Card, Header, Tabs, Sidebar, IconBubble, etc).
- `BusappScreens.jsx` — full-screen compositions (Onboarding, Home, Payment, RouteDetail, RegionSettings).
- `BusappApp.jsx` — top-level state machine + routing.
