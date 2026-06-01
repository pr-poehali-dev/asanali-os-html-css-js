// Settings panels: personalization, accounts, network, bluetooth, time, privacy, accessibility
import { osStore } from '../store';
import { useOsStore } from '../useOsStore';
import { Tab, SettingRow, Toggle, ACCENT_COLORS, WALLPAPERS } from './SettingsShared';

type Props = { tab: Tab };

export default function SettingsPanelPersonalization({ tab }: Props) {
  const state = useOsStore();
  const { settings } = state;

  const set = (patch: Parameters<typeof osStore.updateSettings>[0]) =>
    osStore.updateSettings(patch);

  // ─── ПЕРСОНАЛИЗАЦИЯ ───
  if (tab === 'personalization') {
    return (
      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold mb-5">Персонализация</h2>

        {/* Wallpaper */}
        <div className="rounded-2xl p-5 mb-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <h3 className="text-base font-medium mb-4 text-white/80">🖼️ Обои</h3>
          <div className="grid grid-cols-5 gap-2">
            {WALLPAPERS.map(w => (
              <button
                key={w.id}
                onClick={() => set({ wallpaper: w.id })}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${settings.wallpaper === w.id ? 'ring-2 bg-white/10' : 'hover:bg-white/08'}`}
                style={{ '--tw-ring-color': 'var(--aos-accent)' } as React.CSSProperties}
              >
                <span className="text-3xl">{w.emoji}</span>
                <span className="text-xs text-white/70">{w.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Accent */}
        <div className="rounded-2xl p-5 mb-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <h3 className="text-base font-medium mb-4 text-white/80">🎨 Акцентный цвет</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {ACCENT_COLORS.map(c => (
              <button
                key={c}
                onClick={() => {
                  set({ accentColor: c });
                  document.documentElement.style.setProperty('--aos-accent', c);
                }}
                className={`w-9 h-9 rounded-xl transition-all hover:scale-110 ${settings.accentColor === c ? 'ring-2 ring-white scale-110' : ''}`}
                style={{ background: c }}
              />
            ))}
            <input
              type="color"
              value={settings.accentColor}
              onChange={e => {
                set({ accentColor: e.target.value });
                document.documentElement.style.setProperty('--aos-accent', e.target.value);
              }}
              className="w-9 h-9 rounded-xl cursor-pointer border-0 p-0.5"
              style={{ background: 'rgba(255,255,255,0.08)' }}
              title="Свой цвет"
            />
          </div>
        </div>

        {/* Taskbar */}
        <div className="rounded-2xl p-5 mb-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <h3 className="text-base font-medium mb-4 text-white/80">📌 Панель задач</h3>
          <SettingRow label="Расположение">
            <select
              value={settings.taskbarPosition}
              onChange={e => set({ taskbarPosition: e.target.value as 'bottom' | 'top' | 'left' | 'right' })}
              className="text-sm rounded-xl px-3 py-2 outline-none"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <option value="bottom">Снизу</option>
              <option value="top">Сверху</option>
              <option value="left">Слева</option>
              <option value="right">Справа</option>
            </select>
          </SettingRow>
          <SettingRow label="Группировка окон">
            <select
              value={settings.taskbarGrouping}
              onChange={e => set({ taskbarGrouping: e.target.value as 'icon' | 'label' })}
              className="text-sm rounded-xl px-3 py-2 outline-none"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <option value="icon">Только иконки</option>
              <option value="label">Иконки с подписями</option>
            </select>
          </SettingRow>
        </div>

        {/* Start Menu */}
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <h3 className="text-base font-medium mb-4 text-white/80">🚀 Меню Пуск</h3>
          <SettingRow label="Макет">
            <div className="flex rounded-xl overflow-hidden border border-white/12">
              {[
                { id: 'grid',    label: '⊞ Сетка' },
                { id: 'list',    label: '☰ Список' },
                { id: 'compact', label: '· · ·' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => set({ startMenuLayout: opt.id as 'grid' | 'list' | 'compact' })}
                  className={`px-4 py-2 text-xs transition-all ${settings.startMenuLayout === opt.id ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white/80'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </SettingRow>
        </div>
      </div>
    );
  }

  // ─── УЧЁТНЫЕ ЗАПИСИ ───
  if (tab === 'accounts') {
    return (
      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold mb-5">Учётные записи</h2>
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-4xl"
              style={{ background: 'rgba(var(--aos-accent-rgb),0.2)' }}
            >
              👤
            </div>
            <div>
              <div className="text-lg font-semibold">{settings.userName}</div>
              <div className="text-sm text-white/40">Администратор · AsanaliOS Pro</div>
            </div>
          </div>
          <SettingRow label="Имя пользователя">
            <input
              value={settings.userName}
              onChange={e => set({ userName: e.target.value })}
              className="text-sm rounded-xl px-3 py-1.5 outline-none text-white"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', userSelect: 'text' }}
            />
          </SettingRow>
        </div>
      </div>
    );
  }

  // ─── СЕТЬ ───
  if (tab === 'network') {
    return (
      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold mb-5">Сеть</h2>
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <SettingRow label="Wi-Fi" desc="AsanaliNet_5G">
            <Toggle value={true} onChange={() => {}} />
          </SettingRow>
          <SettingRow label="Ethernet" desc="Не подключён">
            <Toggle value={false} onChange={() => {}} />
          </SettingRow>
          <SettingRow label="VPN" desc="Не настроен">
            <button className="aos-btn text-xs py-1 px-3">Настроить</button>
          </SettingRow>
        </div>
      </div>
    );
  }

  // ─── BLUETOOTH ───
  if (tab === 'bluetooth') {
    return (
      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold mb-5">Bluetooth</h2>
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <SettingRow label="Bluetooth">
            <Toggle value={true} onChange={() => {}} />
          </SettingRow>
          <div className="mt-4">
            <div className="text-xs text-white/30 mb-2">Устройства поблизости</div>
            {['AirPods Pro', 'Logitech MX', 'Samsung Galaxy S24'].map(d => (
              <div key={d} className="flex items-center justify-between py-2 border-b border-white/06 last:border-0">
                <span className="text-sm text-white/70">📡 {d}</span>
                <button className="aos-btn text-xs py-0.5 px-2">Подключить</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── ВРЕМЯ ───
  if (tab === 'time') {
    return (
      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold mb-5">Время и язык</h2>
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <SettingRow label="Текущее время">
            <span className="text-sm text-white/60">{new Date().toLocaleString('ru')}</span>
          </SettingRow>
          <SettingRow label="Часовой пояс">
            <span className="text-sm text-white/60">UTC+5 (Астана, Алматы)</span>
          </SettingRow>
          <SettingRow label="Язык">
            <select
              value={settings.language}
              onChange={e => set({ language: e.target.value })}
              className="text-sm rounded-xl px-3 py-2 outline-none"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <option value="ru">Русский</option>
              <option value="kz">Қазақша</option>
              <option value="en">English</option>
            </select>
          </SettingRow>
        </div>
      </div>
    );
  }

  // ─── КОНФИДЕНЦИАЛЬНОСТЬ ───
  if (tab === 'privacy') {
    return (
      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold mb-5">Конфиденциальность</h2>
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {['Диагностические данные', 'Реклама на основе интересов', 'Расположение', 'Камера', 'Микрофон'].map(item => (
            <SettingRow key={item} label={item}>
              <Toggle value={false} onChange={() => {}} />
            </SettingRow>
          ))}
        </div>
      </div>
    );
  }

  // ─── СПЕЦИАЛЬНЫЕ ВОЗМОЖНОСТИ ───
  if (tab === 'accessibility') {
    return (
      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold mb-5">Специальные возможности</h2>
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <SettingRow label="Высокий контраст">
            <Toggle value={false} onChange={() => {}} />
          </SettingRow>
          <SettingRow label="Экранный диктор">
            <Toggle value={false} onChange={() => {}} />
          </SettingRow>
          <SettingRow label="Залипание клавиш">
            <Toggle value={false} onChange={() => {}} />
          </SettingRow>
          <SettingRow label="Размер шрифта" desc={`${settings.fontSize}px`}>
            <input
              type="range" min={11} max={20} value={settings.fontSize}
              onChange={e => set({ fontSize: +e.target.value })} className="w-36"
            />
          </SettingRow>
        </div>
      </div>
    );
  }

  return null;
}
