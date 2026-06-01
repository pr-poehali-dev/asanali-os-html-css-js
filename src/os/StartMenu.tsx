import { useState, useEffect, useRef } from 'react';
import { osStore } from './store';
import { useOsStore } from './useOsStore';
import { APPS, getApp } from './apps';

type Props = { taskbarPos: string };

export default function StartMenu({ taskbarPos }: Props) {
  const state = useOsStore();
  const { settings } = state;
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'pinned' | 'all'>('pinned');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        osStore.closeStartMenu();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getPosition = (): React.CSSProperties => {
    switch (taskbarPos) {
      case 'bottom': return { bottom: 60, left: '50%', transform: 'translateX(-50%)' };
      case 'top':    return { top: 60, left: '50%', transform: 'translateX(-50%)' };
      case 'left':   return { left: 64, bottom: '10%' };
      case 'right':  return { right: 64, bottom: '10%' };
      default:       return { bottom: 60, left: '50%', transform: 'translateX(-50%)' };
    }
  };

  const filteredApps = search
    ? APPS.filter(a => a.title.toLowerCase().includes(search.toLowerCase()))
    : APPS;

  const pinnedStart = settings.pinnedStart;

  const openApp = (appId: string) => {
    const app = getApp(appId);
    if (app) { osStore.openWindow(app); osStore.closeStartMenu(); }
  };

  const layout = settings.startMenuLayout;

  const pinnedGrid = (
    <div className={`grid gap-2 ${layout === 'compact' ? 'grid-cols-5' : layout === 'list' ? 'grid-cols-1' : 'grid-cols-4'}`}>
      {pinnedStart.map(id => {
        const app = getApp(id);
        if (!app) return null;
        return layout === 'list' ? (
          <button
            key={id}
            onClick={() => openApp(id)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-all text-left w-full"
          >
            <span className="text-2xl">{app.icon}</span>
            <span className="text-sm text-white/90">{app.title}</span>
          </button>
        ) : (
          <button
            key={id}
            onClick={() => openApp(id)}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-white/10 transition-all"
          >
            <span className={layout === 'compact' ? 'text-xl' : 'text-3xl'}>{app.icon}</span>
            <span className="text-xs text-white/80 text-center leading-tight max-w-[60px] truncate">{app.title}</span>
          </button>
        );
      })}
    </div>
  );

  const allApps = filteredApps.map(app => (
    <button
      key={app.id}
      onClick={() => openApp(app.id)}
      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-all text-left w-full"
    >
      <span className="text-xl w-8 text-center">{app.icon}</span>
      <span className="text-sm text-white/90">{app.title}</span>
      <span className="text-xs text-white/30 ml-auto">{app.category}</span>
    </button>
  ));

  return (
    <div
      ref={ref}
      className="aos-start-menu"
      style={{ position: 'fixed', width: 620, maxHeight: '72vh', zIndex: 9500, ...getPosition() }}
    >
      <div className="p-5 flex flex-col gap-4 h-full">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-lg">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setActiveTab('all'); }}
            placeholder="Поиск приложений..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-white/30 outline-none"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
          />
        </div>

        {!search && (
          <div className="flex gap-1">
            <button
              className={`px-4 py-1.5 rounded-lg text-sm transition-all ${activeTab === 'pinned' ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white/80'}`}
              onClick={() => setActiveTab('pinned')}
            >Закреплённые</button>
            <button
              className={`px-4 py-1.5 rounded-lg text-sm transition-all ${activeTab === 'all' ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white/80'}`}
              onClick={() => setActiveTab('all')}
            >Все приложения</button>
          </div>
        )}

        {/* Content */}
        <div className="flex gap-4 flex-1 overflow-hidden min-h-0">
          {/* Left: pinned or all */}
          <div className="flex-1 overflow-y-auto">
            {search || activeTab === 'all' ? (
              <div className="flex flex-col gap-0.5">{allApps}</div>
            ) : (
              pinnedGrid
            )}
          </div>

          {/* Right: user info + quick actions */}
          <div className="w-44 flex flex-col gap-2 border-l border-white/08 pl-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xl" style={{ background: 'rgba(var(--aos-accent-rgb),0.3)' }}>
                👤
              </div>
              <div>
                <div className="text-sm text-white font-medium">{settings.userName}</div>
                <div className="text-xs text-white/40">Администратор</div>
              </div>
            </div>

            {[
              { icon: '⚙️', label: 'Параметры', id: 'settings' },
              { icon: '📁', label: 'Проводник', id: 'explorer' },
              { icon: '📝', label: 'Блокнот', id: 'notepad' },
              { icon: '🧮', label: 'Калькулятор', id: 'calculator' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => openApp(item.id)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-all text-left"
              >
                <span>{item.icon}</span>
                <span className="text-xs text-white/80">{item.label}</span>
              </button>
            ))}

            <div className="flex-1" />
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-500/20 transition-all text-left mt-auto"
              onClick={() => { if (confirm('Выключить AsanaliOS?')) location.reload(); }}
            >
              <span>⏻</span>
              <span className="text-xs text-white/80">Завершение</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
