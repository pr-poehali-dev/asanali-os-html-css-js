import { useState } from 'react';
import { useOsStore } from '../useOsStore';
import { osStore } from '../store';

type Tab = 'system' | 'personalization' | 'storage' | 'activation' | 'network' | 'bluetooth' | 'accounts' | 'time' | 'privacy' | 'update' | 'apps' | 'display' | 'accessibility';

const TABS: { id: Tab; icon: string; label: string }[] = [
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

const ACCENT_COLORS = [
  '#0ea5e9','#6366f1','#8b5cf6','#ec4899','#ef4444',
  '#f97316','#eab308','#22c55e','#14b8a6','#64748b',
  '#06b6d4','#84cc16','#f43f5e','#a855f7','#3b82f6',
];

const WALLPAPERS = [
  { id: 'gradient', label: 'Aurora', emoji: '🌌' },
  { id: 'sunset',   label: 'Sunset', emoji: '🌅' },
  { id: 'forest',   label: 'Forest', emoji: '🌲' },
  { id: 'ocean',    label: 'Ocean',  emoji: '🌊' },
  { id: 'minimal',  label: 'Minimal', emoji: '⬛' },
];

function SettingRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
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

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      className="relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0"
      style={{ background: value ? 'var(--aos-accent)' : 'rgba(255,255,255,0.15)' }}>
      <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200"
        style={{ left: value ? 'calc(100% - 22px)' : '2px' }} />
    </button>
  );
}

export default function Settings({ data }: { data?: { tab?: Tab } }) {
  const state = useOsStore();
  const { settings } = state;
  const [tab, setTab] = useState<Tab>(data?.tab || 'system');

  const set = (patch: Parameters<typeof osStore.updateSettings>[0]) => osStore.updateSettings(patch);

  const CPU_INFO = {
    name: navigator.hardwareConcurrency > 4 ? 'Intel Core i7-12700K' : 'AMD Ryzen 5 5600',
    cores: navigator.hardwareConcurrency || 8,
    threads: (navigator.hardwareConcurrency || 8) * 2,
    gpu: 'NVIDIA GeForce RTX 3070',
    vram: '8 ГБ GDDR6',
    storage: 'AsanaliOS Local Disk (SSD, 512 ГБ)',
  };

  return (
    <div className="flex h-full text-white">
      {/* Sidebar */}
      <div className="w-56 border-r border-white/08 p-3 flex flex-col gap-0.5 overflow-y-auto flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="px-3 py-2 text-xs font-semibold text-white/30 uppercase tracking-wide">Параметры</div>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`settings-nav-item ${tab === t.id ? 'active' : ''}`}>
            <span className="text-lg">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* ─── СИСТЕМА ─── */}
        {tab === 'system' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold mb-5">Система</h2>

            {/* Sound */}
            <div className="rounded-2xl p-5 mb-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <h3 className="text-base font-medium mb-4 text-white/80">🔊 Звук</h3>
              <SettingRow label="Звук включён">
                <Toggle value={settings.soundEnabled} onChange={v => set({ soundEnabled: v })} />
              </SettingRow>
              <SettingRow label="Громкость" desc={`${settings.soundVolume}%`}>
                <input type="range" min={0} max={100} value={settings.soundVolume}
                  onChange={e => set({ soundVolume: +e.target.value })}
                  disabled={!settings.soundEnabled} className="w-36" />
              </SettingRow>
              <SettingRow label="Устройство вывода">
                <select value={settings.audioOutput} onChange={e => set({ audioOutput: e.target.value })}
                  className="text-sm rounded-xl px-3 py-2 outline-none"
                  style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <option value="default">По умолчанию</option>
                  <option value="speakers">Динамики</option>
                  <option value="headphones">Наушники</option>
                  <option value="hdmi">HDMI (ТВ)</option>
                  <option value="bluetooth">Bluetooth</option>
                </select>
              </SettingRow>
              <SettingRow label="Тест звука">
                <button className="aos-btn text-xs py-1 px-3" onClick={() => osStore.playSound('notify')}>🔔 Тест</button>
              </SettingRow>
            </div>

            {/* Misc */}
            <div className="rounded-2xl p-5 mb-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <h3 className="text-base font-medium mb-4 text-white/80">⚡ Производительность</h3>
              <SettingRow label="Анимации" desc="Плавные переходы окон">
                <Toggle value={settings.animationsEnabled} onChange={v => set({ animationsEnabled: v })} />
              </SettingRow>
              <SettingRow label="Размер шрифта системы" desc={`${settings.fontSize}px`}>
                <input type="range" min={11} max={20} value={settings.fontSize}
                  onChange={e => set({ fontSize: +e.target.value })} className="w-36" />
              </SettingRow>
              <SettingRow label="Имя пользователя">
                <input value={settings.userName} onChange={e => set({ userName: e.target.value })}
                  className="text-sm rounded-xl px-3 py-1.5 outline-none text-white"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', userSelect: 'text' }} />
              </SettingRow>
            </div>

            {/* System info */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <h3 className="text-base font-medium mb-4 text-white/80">ℹ️ Информация о системе</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {[
                  ['Система', 'AsanaliOS v1.0.0'],
                  ['Ядро', 'AsanaliOS Kernel 6.1.0'],
                  ['Архитектура', 'x86_64'],
                  ['Процессор', CPU_INFO.name],
                  ['Ядра процессора', String(CPU_INFO.cores)],
                  ['Потоки', String(CPU_INFO.threads)],
                  ['Видеокарта', CPU_INFO.gpu],
                  ['Видеопамять', CPU_INFO.vram],
                  ['Накопитель', CPU_INFO.storage],
                  ['ОЗУ', '16 ГБ DDR5-5600'],
                  ['Лицензия', 'AsanaliOS Pro'],
                  ['Дата сборки', '01.06.2025'],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-col">
                    <span className="text-xs text-white/35">{k}</span>
                    <span className="text-sm text-white/80">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── ПЕРСОНАЛИЗАЦИЯ ─── */}
        {tab === 'personalization' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold mb-5">Персонализация</h2>

            {/* Wallpaper */}
            <div className="rounded-2xl p-5 mb-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <h3 className="text-base font-medium mb-4 text-white/80">🖼️ Обои</h3>
              <div className="grid grid-cols-5 gap-2">
                {WALLPAPERS.map(w => (
                  <button key={w.id} onClick={() => set({ wallpaper: w.id })}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${settings.wallpaper === w.id ? 'ring-2 bg-white/10' : 'hover:bg-white/08'}`}
                    style={{ '--tw-ring-color': 'var(--aos-accent)' } as React.CSSProperties}>
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
                  <button key={c} onClick={() => { set({ accentColor: c }); document.documentElement.style.setProperty('--aos-accent', c); }}
                    className={`w-9 h-9 rounded-xl transition-all hover:scale-110 ${settings.accentColor === c ? 'ring-2 ring-white scale-110' : ''}`}
                    style={{ background: c }} />
                ))}
                <input type="color" value={settings.accentColor}
                  onChange={e => { set({ accentColor: e.target.value }); document.documentElement.style.setProperty('--aos-accent', e.target.value); }}
                  className="w-9 h-9 rounded-xl cursor-pointer border-0 p-0.5"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                  title="Свой цвет" />
              </div>
            </div>

            {/* Taskbar */}
            <div className="rounded-2xl p-5 mb-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <h3 className="text-base font-medium mb-4 text-white/80">📌 Панель задач</h3>
              <SettingRow label="Расположение">
                <select value={settings.taskbarPosition}
                  onChange={e => set({ taskbarPosition: e.target.value as 'bottom'|'top'|'left'|'right' })}
                  className="text-sm rounded-xl px-3 py-2 outline-none"
                  style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <option value="bottom">Снизу</option>
                  <option value="top">Сверху</option>
                  <option value="left">Слева</option>
                  <option value="right">Справа</option>
                </select>
              </SettingRow>
              <SettingRow label="Группировка окон">
                <select value={settings.taskbarGrouping}
                  onChange={e => set({ taskbarGrouping: e.target.value as 'icon'|'label' })}
                  className="text-sm rounded-xl px-3 py-2 outline-none"
                  style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)' }}>
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
                    { id: 'grid', label: '⊞ Сетка' },
                    { id: 'list', label: '☰ Список' },
                    { id: 'compact', label: '· · ·' },
                  ].map(opt => (
                    <button key={opt.id} onClick={() => set({ startMenuLayout: opt.id as 'grid'|'list'|'compact' })}
                      className={`px-4 py-2 text-xs transition-all ${settings.startMenuLayout === opt.id ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white/80'}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </SettingRow>
            </div>
          </div>
        )}

        {/* ─── ХРАНИЛИЩЕ ─── */}
        {tab === 'storage' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold mb-5">Хранилище</h2>
            <div className="rounded-2xl p-5 mb-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <h3 className="text-base font-medium mb-4 text-white/80">💾 AsanaliOS Local Disk (C:)</h3>
              <div className="mb-4">
                <div className="flex justify-between text-xs text-white/50 mb-2">
                  <span>Использовано: 48.3 ГБ</span>
                  <span>Свободно: 463.7 ГБ</span>
                  <span>Всего: 512 ГБ</span>
                </div>
                <div className="h-4 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.10)' }}>
                  <div className="h-full rounded-full" style={{ width: '9.4%', background: 'var(--aos-accent)' }} />
                </div>
              </div>
              <div className="grid gap-2">
                {[
                  { label: 'Система', size: '14.2 ГБ', color: '#6366f1', pct: 2.8 },
                  { label: 'Приложения', size: '22.1 ГБ', color: '#0ea5e9', pct: 4.3 },
                  { label: 'Документы', size: '3.4 ГБ', color: '#22c55e', pct: 0.7 },
                  { label: 'Медиа', size: '6.8 ГБ', color: '#f97316', pct: 1.3 },
                  { label: 'Временные', size: '1.8 ГБ', color: '#64748b', pct: 0.3 },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: item.color }} />
                    <span className="text-sm text-white/70 flex-1">{item.label}</span>
                    <div className="w-32 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-full rounded-full" style={{ width: `${item.pct * 10}%`, background: item.color }} />
                    </div>
                    <span className="text-xs text-white/40 w-16 text-right">{item.size}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <h3 className="text-base font-medium mb-3 text-white/80">Диски</h3>
              {[
                { name: 'AsanaliOS Local Disk (C:)', type: 'SSD NVMe', size: '512 ГБ', free: '463.7 ГБ', icon: '💽' },
                { name: 'Data Drive (D:)',           type: 'HDD SATA', size: '2 ТБ',   free: '1.4 ТБ',  icon: '🖴' },
              ].map(disk => (
                <div key={disk.name} className="flex items-center gap-4 py-3 border-b border-white/06 last:border-0">
                  <span className="text-3xl">{disk.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm text-white/90">{disk.name}</div>
                    <div className="text-xs text-white/40">{disk.type} · {disk.size}</div>
                  </div>
                  <div className="text-xs text-white/50">Свободно: {disk.free}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── АКТИВАЦИЯ ─── */}
        {tab === 'activation' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold mb-5">Активация</h2>
            <div className="rounded-2xl p-8 text-center mb-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-green-400 mb-2">AsanaliOS активирована</h3>
              <p className="text-white/50 text-sm">Система активирована предоставленной лицензией от AsanaliOS</p>
              <div className="mt-6 p-4 rounded-xl text-left" style={{ background: 'rgba(255,255,255,0.04)' }}>
                {[
                  ['Продукт', 'AsanaliOS Pro'],
                  ['Лицензия', 'ASNL-2025-PRO-XXXX-XXXX'],
                  ['Тип', 'Бессрочная персональная лицензия'],
                  ['Зарегистрировано на', settings.userName],
                  ['Дата активации', '01.06.2025'],
                  ['Статус', '✅ Активировано'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1.5 border-b border-white/06 last:border-0">
                    <span className="text-xs text-white/40">{k}</span>
                    <span className="text-xs text-white/80">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── ДИСПЛЕЙ ─── */}
        {tab === 'display' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold mb-5">Дисплей</h2>
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)' }}>
              {[
                { label: 'Разрешение', value: `${window.screen.width} × ${window.screen.height}` },
                { label: 'Частота обновления', value: '60 Гц' },
                { label: 'Глубина цвета', value: '32 бит (8 бит на канал)' },
                { label: 'Тип матрицы', value: 'IPS WQHD' },
                { label: 'HDR', value: 'Поддерживается' },
              ].map(([label, value]) => (
                <SettingRow key={label as string} label={label as string}>
                  <span className="text-sm text-white/60">{value as string}</span>
                </SettingRow>
              ))}
            </div>
          </div>
        )}

        {/* ─── СЕТЬ ─── */}
        {tab === 'network' && (
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
        )}

        {/* ─── BLUETOOTH ─── */}
        {tab === 'bluetooth' && (
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
        )}

        {/* ─── УЧЁТНЫЕ ЗАПИСИ ─── */}
        {tab === 'accounts' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold mb-5">Учётные записи</h2>
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-4xl"
                  style={{ background: 'rgba(var(--aos-accent-rgb),0.2)' }}>👤</div>
                <div>
                  <div className="text-lg font-semibold">{settings.userName}</div>
                  <div className="text-sm text-white/40">Администратор · AsanaliOS Pro</div>
                </div>
              </div>
              <SettingRow label="Имя пользователя">
                <input value={settings.userName} onChange={e => set({ userName: e.target.value })}
                  className="text-sm rounded-xl px-3 py-1.5 outline-none text-white"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', userSelect: 'text' }} />
              </SettingRow>
            </div>
          </div>
        )}

        {/* ─── ВРЕМЯ ─── */}
        {tab === 'time' && (
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
                <select value={settings.language} onChange={e => set({ language: e.target.value })}
                  className="text-sm rounded-xl px-3 py-2 outline-none"
                  style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <option value="ru">Русский</option>
                  <option value="kz">Қазақша</option>
                  <option value="en">English</option>
                </select>
              </SettingRow>
            </div>
          </div>
        )}

        {/* ─── КОНФИДЕНЦИАЛЬНОСТЬ ─── */}
        {tab === 'privacy' && (
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
        )}

        {/* ─── СПЕЦ.ВОЗМОЖНОСТИ ─── */}
        {tab === 'accessibility' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold mb-5">Специальные возможности</h2>
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <SettingRow label="Высокий контраст"><Toggle value={false} onChange={() => {}} /></SettingRow>
              <SettingRow label="Экранный диктор"><Toggle value={false} onChange={() => {}} /></SettingRow>
              <SettingRow label="Залипание клавиш"><Toggle value={false} onChange={() => {}} /></SettingRow>
              <SettingRow label="Размер шрифта" desc={`${settings.fontSize}px`}>
                <input type="range" min={11} max={20} value={settings.fontSize}
                  onChange={e => set({ fontSize: +e.target.value })} className="w-36" />
              </SettingRow>
            </div>
          </div>
        )}

        {/* ─── ОБНОВЛЕНИЯ ─── */}
        {tab === 'update' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold mb-5">Центр обновлений</h2>
            <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-lg font-semibold mb-2">Система обновлена</h3>
              <p className="text-white/40 text-sm">Установлена последняя версия AsanaliOS 1.0.0</p>
              <p className="text-white/25 text-xs mt-2">Последняя проверка: {new Date().toLocaleDateString('ru')}</p>
              <button className="aos-btn mt-4" onClick={() => osStore.playSound('notify')}>🔄 Проверить обновления</button>
            </div>
          </div>
        )}

        {/* ─── ПРИЛОЖЕНИЯ ─── */}
        {tab === 'apps' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold mb-5">Приложения</h2>
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)' }}>
              {[
                { name: 'Блокнот', size: '2.4 МБ', icon: '📝' },
                { name: 'Калькулятор', size: '1.8 МБ', icon: '🧮' },
                { name: 'Asanalindex', size: '148 МБ', icon: '🌐' },
                { name: 'Paint', size: '12.3 МБ', icon: '🎨' },
                { name: 'Проводник', size: '8.1 МБ', icon: '📁' },
                { name: 'Медиаплеер', size: '32 МБ', icon: '🎵' },
                { name: 'Visual Studio Code', size: '340 МБ', icon: '💙' },
              ].map(app => (
                <div key={app.name} className="flex items-center gap-3 py-2.5 border-b border-white/06 last:border-0">
                  <span className="text-2xl">{app.icon}</span>
                  <span className="flex-1 text-sm text-white/80">{app.name}</span>
                  <span className="text-xs text-white/35">{app.size}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
