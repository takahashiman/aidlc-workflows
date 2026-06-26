/**
 * UiState — クライアント UI 状態（FDQ9=A / BR-STATE-1/2/3）
 * profile / coreVersionLabel を URL(query) + localStorage で同期。
 * 解決順序: URL > localStorage > 既定（既定 profile = admin / BR-UX-3）。
 * 機密・個人情報は保存しない（UI 設定のみ / BR-STATE-3）。
 */
const LS_KEY = 'fig-portal-ui';
const PROFILES = ['admin', 'consumer', 'terminal', 'signage'];
const DEFAULTS = { profile: 'admin' };

function readLS() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { return {}; }
}
function writeLS(state) {
  try { localStorage.setItem(LS_KEY, JSON.stringify({ profile: state.profile })); } catch { /* private mode 等は無視 */ }
}
function readQuery() {
  const q = new URLSearchParams(location.hash.split('?')[1] || '');
  const out = {};
  if (q.has('profile')) out.profile = q.get('profile');
  return out;
}

export const ui = {
  profile: DEFAULTS.profile,
  coreVersionLabel: 'core@local',

  /** URL > localStorage > 既定 で初期化（BR-STATE-2） */
  init() {
    const ls = readLS();
    const url = readQuery();
    const p = url.profile || ls.profile || DEFAULTS.profile;
    this.profile = PROFILES.includes(p) ? p : DEFAULTS.profile;
    this.apply();
    return this;
  },

  /** 取込版ラベル（表示専用・pin ではない / BR-ROLL-4） */
  setVersionLabel(label) { if (label) this.coreVersionLabel = label; },

  /** body へ .fig-profile-* を適用 */
  apply() {
    const body = document.body;
    PROFILES.forEach(p => body.classList.remove('fig-profile-' + p));
    body.classList.add('fig-profile-' + this.profile);
  },

  /** プロファイル変更 → 適用 + 永続化 + URL 反映（共有可能 / BR-STATE-1） */
  setProfile(profile) {
    if (!PROFILES.includes(profile)) return;
    this.profile = profile;
    this.apply();
    writeLS(this);
    this.syncUrl();
    window.dispatchEvent(new CustomEvent('ui:profile-changed', { detail: { profile } }));
  },

  /** 現在 route のクエリへ profile を反映（共有リンクで同一表示・BR-STATE-1） */
  syncUrl() {
    const [path, qs] = location.hash.replace(/^#/, '').split('?');
    const q = new URLSearchParams(qs || '');
    if (this.profile === DEFAULTS.profile) q.delete('profile'); else q.set('profile', this.profile);
    const query = q.toString();
    const next = '#' + path + (query ? '?' + query : '');
    if (next !== location.hash) history.replaceState(null, '', next);
  },

  profiles: PROFILES,
};
