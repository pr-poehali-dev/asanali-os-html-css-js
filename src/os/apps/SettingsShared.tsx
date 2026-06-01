// Shared types, constants and primitive UI components for Settings

export type Tab =
  | 'system'
  | 'personalization'
  | 'storage'
  | 'activation'
  | 'network'
  | 'bluetooth'
  | 'accounts'
  | 'time'
  | 'privacy'
  | 'update'
  | 'apps'
  | 'display'
  | 'accessibility';

export const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'system',          icon: '💻', label: 'Система' },
  { id: 'display',         icon: '🖥️', label: 'Дисплей' },
  { id: 'personalization', icon: '🎨', label: 'Персонализация' },
  { id: 'apps',            icon: '📦', label: 'Приложения' },
  { id: 'accounts',        icon: '👤', label: 'Учётные записи' },
  { id: 'bluetooth',       icon: '📡', label: 'Bluetooth' },
  { id: 'network',         icon: '🌐', label: 'Сеть' },
  { id: 'time',            icon: '🕐', label: 'Время и язык' },
  { id: 'privacy',         icon: '🔒', label: 'Конфиденциальность' },
  { id: 'accessibility',   icon: '♿', label: 'Специальные возможности' },
  { id: 'update',          icon: '🔄', label: 'Центр обновлений' },
  { id: 'storage',         icon: '💾', label: 'Хранилище' },
  { id: 'activation',      icon: '✅', label: 'Активация' },
];

export const ACCENT_COLORS = [
  '#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#14b8a6', '#64748b',
  '#06b6d4', '#84cc16', '#f43f5e', '#a855f7', '#3b82f6',
];

export const WALLPAPERS = [
  { id: 'gradient', label: 'Aurora', emoji: '🌌' },
  { id: 'sunset',   label: 'Sunset', emoji: '🌅' },
  { id: 'forest',   label: 'Forest', emoji: '🌲' },
  { id: 'ocean',    label: 'Ocean',  emoji: '🌊' },
  { id: 'minimal',  label: 'Minimal', emoji: '⬛' },
];

export function SettingRow({
  label,
  desc,
  children,
}: {
  label: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-white/06 last:border-0">
      <div>
        <div className="text-sm text-white/90">{label}</div>
        {desc && <div className="text-xs text-white/40 mt-0.5">{desc}</div>}
      </div>
      <div className="ml-4 flex-shrink-0">{children}</div>
    </div>
  );
}

export function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0"
      style={{ background: value ? 'var(--aos-accent)' : 'rgba(255,255,255,0.15)' }}
    >
      <div
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200"
        style={{ left: value ? 'calc(100% - 22px)' : '2px' }}
      />
    </button>
  );
}
