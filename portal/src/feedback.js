/**
 * FIG Core DS — Feedback Contract Helper
 * ============================================================
 * `semantic.css` §18 (haptic) / §19 (audio-cue) / §20 (feedback-contract)
 * のトークンを JS から消費するための薄いヘルパー。
 *
 * 設計原則:
 *   1. すべての feature detection 込み。SSR / 振動非対応 / 音声 OFF いずれも
 *      例外を投げず no-op で fallthrough する。
 *   2. CSS 変数を「唯一の真実」として扱い、JS はそれを読むだけ。
 *      duration / vibration pattern / audio id すべて CSS から取得。
 *   3. motion チャネルは CSS 側に委譲。本ヘルパーは haptic + audio のみ発火。
 *   4. `prefers-reduced-motion: reduce` 時は `--haptic-enabled: 0` が立ち、
 *      触覚も自動停止（前庭系障害への配慮）。
 *
 * 使い方:
 *   import { fireFeedback } from '/assets/js/feedback.js';
 *
 *   button.addEventListener('pointerdown', () => {
 *     fireFeedback(button);  // data-feedback 属性を読んで haptic + audio 発火
 *   });
 *
 * または:
 *   fireFeedback(null, { id: 'cta-fire' });
 * ============================================================ */

'use strict';

/** ルート要素から CSS 変数を取得（安全に） */
function readCssVar(name, fallback = '') {
  if (typeof document === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

/** "10, 50, 20" のような文字列を数値配列にパース */
function parseVibrationPattern(raw) {
  if (!raw) return null;
  const parts = String(raw).split(',').map(s => parseInt(s.trim(), 10));
  if (parts.some(n => Number.isNaN(n))) return null;
  return parts.length === 1 ? parts[0] : parts;
}

/** Feature detection */
const supportsVibration = () =>
  typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';

const supportsAudio = () =>
  typeof Audio !== 'undefined';

/** ヘルパー全体の有効状態（ユーザー設定で個別 OFF 可能） */
const state = {
  hapticEnabled: true,
  audioEnabled: false,  // 既定 OFF（CSS と同期）
};

/** 既定の Feedback ID → CSS 変数キーの対応表 */
const FEEDBACK_IDS = [
  'cta-fire',
  'cta-success',
  'cta-error',
  'toggle',
  'select',
  'nfc-touch',
];

/**
 * CSS 変数から token 値を取得。
 * @param {string} id     - feedback id ('cta-fire' 等)
 * @param {string} channel - 'motion' | 'haptic' | 'audio'
 * @returns {string} CSS 変数の生値（空文字列も含む）
 */
export function getFeedbackToken(id, channel) {
  if (!id || !channel) return '';
  return readCssVar(`--feedback-${id}-${channel}`);
}

/**
 * ユーザー設定から channel の有効/無効を切替。
 * CSS 側の --haptic-enabled / --audio-cue-enabled とは独立で、
 * JS 側のローカル設定として保持する（重ね合わせで決定）。
 */
export function setFeedbackChannel(channel, enabled) {
  if (channel === 'haptic') state.hapticEnabled = !!enabled;
  if (channel === 'audio') state.audioEnabled = !!enabled;
}

/**
 * CSS の --haptic-enabled / --audio-cue-enabled も加味した最終的な有効判定。
 * いずれか片方が 0 なら無効。
 */
function isChannelActive(channel) {
  if (channel === 'haptic') {
    if (!state.hapticEnabled) return false;
    if (!supportsVibration()) return false;
    const cssEnabled = parseInt(readCssVar('--haptic-enabled', '1'), 10);
    return cssEnabled !== 0;
  }
  if (channel === 'audio') {
    if (!state.audioEnabled) return false;
    if (!supportsAudio()) return false;
    const cssEnabled = parseInt(readCssVar('--audio-cue-enabled', '0'), 10);
    return cssEnabled !== 0;
  }
  return false;
}

/** 触覚を発火（feature detection 込み） */
function fireHaptic(id) {
  if (!isChannelActive('haptic')) return false;
  const raw = getFeedbackToken(id, 'haptic');
  if (!raw || raw === 'none') return false;
  const pattern = parseVibrationPattern(raw);
  if (pattern == null) return false;
  try {
    navigator.vibrate(pattern);
    return true;
  } catch {
    return false;
  }
}

/** 音声キャッシュ（同一 cue は使い回す） */
const audioCache = new Map();

function loadAudio(cueId) {
  if (audioCache.has(cueId)) return audioCache.get(cueId);
  // 実音ファイルは assets/audio/{cueId}.mp3 の規約を想定。
  // 本リポジトリには音源は未同梱（規約のみ提示）。
  const src = `/assets/audio/${cueId}.mp3`;
  const audio = new Audio(src);
  audio.preload = 'none';
  audioCache.set(cueId, audio);
  return audio;
}

/** 音声を発火（feature detection 込み） */
function fireAudio(id) {
  if (!isChannelActive('audio')) return false;
  const raw = getFeedbackToken(id, 'audio');
  if (!raw || raw === 'none') return false;
  // CSS の `"ui-tap"` を `ui-tap` に正規化
  const cueId = raw.replace(/^["']|["']$/g, '');
  if (!cueId) return false;
  try {
    const audio = loadAudio(cueId);
    audio.volume = parseFloat(readCssVar('--audio-cue-volume', '0.6')) || 0.6;
    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => { /* autoplay block 等は無視 */ });
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * フィードバック発火のメイン API。
 * @param {Element|null} element - data-feedback 属性を持つ要素（任意）
 * @param {object} [options]
 * @param {string} [options.id] - element がない場合の feedback id
 * @returns {{ haptic: boolean, audio: boolean }} 各チャネルが発火したか
 */
export function fireFeedback(element, options = {}) {
  const id = options.id || (element && element.dataset && element.dataset.feedback);
  if (!id) return { haptic: false, audio: false };

  return {
    haptic: fireHaptic(id),
    audio: fireAudio(id),
  };
}

/**
 * 単発 API: 任意の id を発火（属性経由でなく直接呼び出したい場合）
 */
export function fireById(id) {
  return fireFeedback(null, { id });
}

/**
 * 既知の feedback id 一覧（CSS 側と同期）
 */
export const KNOWN_FEEDBACK_IDS = Object.freeze([...FEEDBACK_IDS]);

/**
 * 自動アタッチ: data-feedback 属性を持つ要素に pointerdown ハンドラを付与。
 * SPA の動的要素には対応しないため、必要なら MutationObserver を別途実装。
 *
 *   import { autoAttach } from '/assets/js/feedback.js';
 *   autoAttach();  // DOMContentLoaded 後に呼ぶ
 */
export function autoAttach(root = document) {
  const targets = root.querySelectorAll('[data-feedback]');
  targets.forEach(el => {
    if (el.__figFeedbackAttached) return;
    el.__figFeedbackAttached = true;
    el.addEventListener('pointerdown', () => fireFeedback(el), { passive: true });
  });
  return targets.length;
}

/* 非 module 環境向け（preview/*.html から script src で読む用） */
if (typeof window !== 'undefined') {
  window.FIGFeedback = {
    fireFeedback,
    fireById,
    getFeedbackToken,
    setFeedbackChannel,
    autoAttach,
    KNOWN_FEEDBACK_IDS,
  };
}
