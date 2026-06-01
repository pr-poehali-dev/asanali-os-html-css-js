// Settings panels: system, display, storage, activation, update, apps
import { osStore } from '../store';
import { useOsStore } from '../useOsStore';
import { Tab, SettingRow, Toggle } from './SettingsShared';

type Props = { tab: Tab };

export default function SettingsPanelSystem({ tab }: Props) {
  const state = useOsStore();
  const { settings } = state;

  const set = (patch: Parameters<typeof osStore.updateSettings>[0]) =>
    osStore.updateSettings(patch);

  const CPU_INFO = {
    name: navigator.hardwareConcurrency > 4 ? 'Intel Core i7-12700K' : 'AMD Ryzen 5 5600',
    cores: navigator.hardwareConcurrency || 8,
    threads: (navigator.hardwareConcurrency || 8) * 2,
    gpu: 'NVIDIA GeForce RTX 3070',
    vram: '8 ГБ GDDR6',
    storage: 'AsanaliOS Local Disk (SSD, 512 ГБ)',
  };

  // ─── СИСТЕМА ───
  if (tab === 'system') {
    return (
      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold mb-5">Система</h2>

        {/* Sound */}
        <div className="rounded-2xl p-5 mb-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <h3 className="text-base font-medium mb-4 text-white/80">🔊 Звук</h3>
          <SettingRow label="Звук включён">
            <Toggle value={settings.soundEnabled} onChange={v => set({ soundEnabled: v })} />
          </SettingRow>
          <SettingRow label="Громкость" desc={`${settings.soundVolume}%`}>
            <input
              type="range" min={0} max={100} value={settings.soundVolume}
              onChange={e => set({ soundVolume: +e.target.value })}
              disabled={!settings.soundEnabled} className="w-36"
            />
          </SettingRow>
          <SettingRow label="Устройство вывода">
            <select
              value={settings.audioOutput}
              onChange={e => set({ audioOutput: e.target.value })}
              className="text-sm rounded-xl px-3 py-2 outline-none"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <option value="default">По умолчанию</option>
              <option value="speakers">Динамики</option>
              <option value="headphones">Наушники</option>
              <option value="hdmi">HDMI (ТВ)</option>
              <option value="bluetooth">Bluetooth</option>
            </select>
          </SettingRow>
          <SettingRow label="Тест звука">
            <button className="aos-btn text-xs py-1 px-3" onClick={() => osStore.playSound('notify')}>
              🔔 Тест
            </button>
          </SettingRow>
        </div>

        {/* Performance */}
        <div className="rounded-2xl p-5 mb-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <h3 className="text-base font-medium mb-4 text-white/80">⚡ Производительность</h3>
          <SettingRow label="Анимации" desc="Плавные переходы окон">
            <Toggle value={settings.animationsEnabled} onChange={v => set({ animationsEnabled: v })} />
          </SettingRow>
          <SettingRow label="Размер шрифта системы" desc={`${settings.fontSize}px`}>
            <input
              type="range" min={11} max={20} value={settings.fontSize}
              onChange={e => set({ fontSize: +e.target.value })} className="w-36"
            />
          </SettingRow>
          <SettingRow label="Имя пользователя">
            <input
              value={settings.userName}
              onChange={e => set({ userName: e.target.value })}
              className="text-sm rounded-xl px-3 py-1.5 outline-none text-white"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', userSelect: 'text' }}
            />
          </SettingRow>
        </div>

        {/* System info */}
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <h3 className="text-base font-medium mb-4 text-white/80">ℹ️ Информация о системе</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {[
              ['Система',          'AsanaliOS v1.0.0'],
              ['Ядро',             'AsanaliOS Kernel 6.1.0'],
              ['Архитектура',      'x86_64'],
              ['Процессор',        CPU_INFO.name],
              ['Ядра процессора',  String(CPU_INFO.cores)],
              ['Потоки',           String(CPU_INFO.threads)],
              ['Видеокарта',       CPU_INFO.gpu],
              ['Видеопамять',      CPU_INFO.vram],
              ['Накопитель',       CPU_INFO.storage],
              ['ОЗУ',              '16 ГБ DDR5-5600'],
              ['Лицензия',         'AsanaliOS Pro'],
              ['Дата сборки',      '01.06.2025'],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col">
                <span className="text-xs text-white/35">{k}</span>
                <span className="text-sm text-white/80">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── ДИСПЛЕЙ ───
  if (tab === 'display') {
    return (
      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold mb-5">Дисплей</h2>
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {[
            { label: 'Разрешение',        value: `${window.screen.width} × ${window.screen.height}` },
            { label: 'Частота обновления', value: '60 Гц' },
            { label: 'Глубина цвета',      value: '32 бит (8 бит на канал)' },
            { label: 'Тип матрицы',        value: 'IPS WQHD' },
            { label: 'HDR',                value: 'Поддерживается' },
          ].map(item => (
            <SettingRow key={item.label} label={item.label}>
              <span className="text-sm text-white/60">{item.value}</span>
            </SettingRow>
          ))}
        </div>
      </div>
    );
  }

  // ─── ХРАНИЛИЩЕ ───
  if (tab === 'storage') {
    return (
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
              { label: 'Система',      size: '14.2 ГБ', color: '#6366f1', pct: 2.8 },
              { label: 'Приложения',   size: '22.1 ГБ', color: '#0ea5e9', pct: 4.3 },
              { label: 'Документы',    size: '3.4 ГБ',  color: '#22c55e', pct: 0.7 },
              { label: 'Медиа',        size: '6.8 ГБ',  color: '#f97316', pct: 1.3 },
              { label: 'Временные',    size: '1.8 ГБ',  color: '#64748b', pct: 0.3 },
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
            { name: 'Data Drive (D:)',           type: 'HDD SATA', size: '2 ТБ',   free: '1.4 ТБ',   icon: '🖴' },
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
    );
  }

  // ─── АКТИВАЦИЯ ───
  if (tab === 'activation') {
    return (
      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold mb-5">Активация</h2>
        <div
          className="rounded-2xl p-8 text-center mb-4"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(34,197,94,0.3)' }}
        >
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-green-400 mb-2">AsanaliOS активирована</h3>
          <p className="text-white/50 text-sm">Система активирована предоставленной лицензией от AsanaliOS</p>
          <div className="mt-6 p-4 rounded-xl text-left" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {[
              ['Продукт',            'AsanaliOS Pro'],
              ['Лицензия',           'ASNL-2025-PRO-XXXX-XXXX'],
              ['Тип',                'Бессрочная персональная лицензия'],
              ['Зарегистрировано на', settings.userName],
              ['Дата активации',     '01.06.2025'],
              ['Статус',             '✅ Активировано'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-1.5 border-b border-white/06 last:border-0">
                <span className="text-xs text-white/40">{k}</span>
                <span className="text-xs text-white/80">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── ОБНОВЛЕНИЯ ───
  if (tab === 'update') {
    return (
      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold mb-5">Центр обновлений</h2>
        <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-lg font-semibold mb-2">Система обновлена</h3>
          <p className="text-white/40 text-sm">Установлена последняя версия AsanaliOS 1.0.0</p>
          <p className="text-white/25 text-xs mt-2">
            Последняя проверка: {new Date().toLocaleDateString('ru')}
          </p>
          <button className="aos-btn mt-4" onClick={() => osStore.playSound('notify')}>
            🔄 Проверить обновления
          </button>
        </div>
      </div>
    );
  }

  // ─── ПРИЛОЖЕНИЯ ───
  if (tab === 'apps') {
    return (
      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold mb-5">Приложения</h2>
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {[
            { name: 'Блокнот',           size: '2.4 МБ',  icon: '📝' },
            { name: 'Калькулятор',       size: '1.8 МБ',  icon: '🧮' },
            { name: 'Asanalindex',       size: '148 МБ',  icon: '🌐' },
            { name: 'Paint',             size: '12.3 МБ', icon: '🎨' },
            { name: 'Проводник',         size: '8.1 МБ',  icon: '📁' },
            { name: 'Медиаплеер',        size: '32 МБ',   icon: '🎵' },
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
    );
  }

  return null;
}
