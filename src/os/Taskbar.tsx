import { useState, useEffect } from 'react';
import { useOsStore } from './useOsStore';
import { osStore } from './store';
import { getApp, APPS } from './apps';
import StartMenu from './StartMenu';
import NotificationCenter from './NotificationCenter';

function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

  return (
    <div className="flex flex-col items-end justify-center cursor-default select-none px-3">
      <span className="text-white text-sm font-semibold leading-none">
        {pad(now.getHours())}:{pad(now.getMinutes())}:{pad(now.getSeconds())}
      </span>
      <span className="text-white/50 text-xs mt-0.5">
        {days[now.getDay()]}, {now.getDate()} {months[now.getMonth()]}
      </span>
    </div>
  );
}

function TaskbarIcon({ appId, label, isActive, onClick }: { appId: string; label: string; isActive: boolean; onClick: () => void }) {
  const app = getApp(appId);
  const { settings } = useOsStore();
  const showLabel = settings.taskbarGrouping === 'label';

  return (
    <div
      className={`taskbar-item ${isActive ? 'active' : ''} group`}
      onClick={onClick}
      title={label}
      style={{ minWidth: showLabel ? 'auto' : 44, padding: showLabel ? '6px 12px' : '6px' }}
    >
      <span className="text-xl leading-none">{app?.icon || '📦'}</span>
      {showLabel && <span className="text-xs text-white/80 max-w-[80px] truncate">{label}</span>}
      {isActive && <div className="taskbar-item-dot" />}
    </div>
  );
}

export default function Taskbar() {
  const state = useOsStore();
  const { settings, windows, startMenuOpen } = state;
  const [showNotif, setShowNotif] = useState(false);
  const pos = settings.taskbarPosition;

  const isVertical = pos === 'left' || pos === 'right';

  const barStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 9000,
    ...(pos === 'bottom' ? { bottom: 0, left: 0, right: 0, height: 52, flexDirection: 'row' } : {}),
    ...(pos === 'top'    ? { top: 0,    left: 0, right: 0, height: 52, flexDirection: 'row' } : {}),
    ...(pos === 'left'   ? { left: 0,   top: 0,  bottom: 0, width: 56, flexDirection: 'column' } : {}),
    ...(pos === 'right'  ? { right: 0,  top: 0,  bottom: 0, width: 56, flexDirection: 'column' } : {}),
    display: 'flex',
    alignItems: 'center',
  };

  const pinnedIds = settings.pinnedTaskbar;
  const openWindows = windows.filter(w => !pinnedIds.includes(w.appId));

  const handlePinnedClick = (appId: string) => {
    const open = windows.find(w => w.appId === appId);
    if (open) {
      if (open.isMinimized) {
        osStore.setState(s => ({ ...s, windows: s.windows.map(w => w.id === open.id ? { ...w, isMinimized: false } : w) }));
        osStore.focusWindow(open.id);
      } else if (open.isFocused) {
        osStore.minimizeWindow(open.id);
      } else {
        osStore.focusWindow(open.id);
      }
    } else {
      const app = getApp(appId);
      if (app) osStore.openWindow(app);
    }
  };

  const handleOpenClick = (winId: string, appId: string) => {
    const win = windows.find(w => w.id === winId);
    if (!win) return;
    if (win.isMinimized) {
      osStore.setState(s => ({ ...s, windows: s.windows.map(w => w.id === winId ? { ...w, isMinimized: false } : w) }));
      osStore.focusWindow(winId);
    } else if (win.isFocused) {
      osStore.minimizeWindow(winId);
    } else {
      osStore.focusWindow(winId);
    }
  };

  const startBtn = (
    <button
      className={`flex items-center justify-center rounded-xl transition-all duration-200 ${startMenuOpen ? 'bg-white/20' : 'hover:bg-white/10'}`}
      style={{ width: 40, height: 40, fontSize: 22, flexShrink: 0 }}
      onClick={() => osStore.toggleStartMenu()}
      title="Пуск"
    >
      <span>🚀</span>
    </button>
  );

  const centerItems = (
    <div className={`flex ${isVertical ? 'flex-col' : 'flex-row'} items-center gap-1 flex-1 ${isVertical ? 'justify-start mt-2' : 'justify-center'}`}>
      {startBtn}
      <div className={`flex ${isVertical ? 'flex-col' : 'flex-row'} gap-0.5`}>
        {pinnedIds.map(appId => {
          const win = windows.find(w => w.appId === appId);
          const app = getApp(appId);
          return (
            <TaskbarIcon
              key={appId}
              appId={appId}
              label={app?.title || appId}
              isActive={!!win && !win.isMinimized}
              onClick={() => handlePinnedClick(appId)}
            />
          );
        })}
        {openWindows.map(win => (
          <TaskbarIcon
            key={win.id}
            appId={win.appId}
            label={win.title}
            isActive={!win.isMinimized && win.isFocused}
            onClick={() => handleOpenClick(win.id, win.appId)}
          />
        ))}
      </div>
    </div>
  );

  const rightItems = (
    <div className={`flex ${isVertical ? 'flex-col' : 'flex-row'} items-center gap-1 px-2`}>
      <button
        className="taskbar-item text-lg relative"
        onClick={() => setShowNotif(v => !v)}
        title="Уведомления"
        style={{ minWidth: 40, height: 40 }}
      >
        🔔
        {state.notifications.filter(n => !n.read).length > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
        )}
      </button>
      {!isVertical && <Clock />}
      <button className="taskbar-item text-lg" style={{ minWidth: 40, height: 40 }} title="Сеть">🌐</button>
      <button className="taskbar-item text-lg" style={{ minWidth: 40, height: 40 }} title="Звук">🔊</button>
    </div>
  );

  return (
    <>
      <div className="aos-taskbar" style={barStyle}>
        {!isVertical ? (
          <>
            <div className="flex-1" />
            {centerItems}
            {rightItems}
          </>
        ) : (
          <>
            {centerItems}
            {rightItems}
          </>
        )}
      </div>

      {startMenuOpen && (
        <StartMenu taskbarPos={pos} />
      )}

      {showNotif && (
        <NotificationCenter onClose={() => setShowNotif(false)} taskbarPos={pos} />
      )}
    </>
  );
}
