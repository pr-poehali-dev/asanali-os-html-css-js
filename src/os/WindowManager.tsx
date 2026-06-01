import { useRef, useEffect, useCallback, useState } from 'react';
import { useOsStore } from './useOsStore';
import { osStore, WindowState } from './store';
import AppRenderer from './AppRenderer';

function OsWindow({ win }: { win: WindowState }) {
  const state = useOsStore();
  const { settings } = state;
  const dragRef = useRef<{ ox: number; oy: number } | null>(null);
  const resizeRef = useRef<{ ox: number; oy: number; ow: number; oh: number } | null>(null);
  const [opening, setOpening] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setOpening(false), 300);
    return () => clearTimeout(t);
  }, []);

  const isBottom = settings.taskbarPosition === 'bottom';
  const TASKBAR_H = 52;

  const onTitleMouseDown = useCallback((e: React.MouseEvent) => {
    if (win.isMaximized) return;
    if ((e.target as HTMLElement).closest('.win-btn')) return;
    e.preventDefault();
    dragRef.current = { ox: e.clientX - win.x, oy: e.clientY - win.y };
    osStore.focusWindow(win.id);

    const onMove = (me: MouseEvent) => {
      if (!dragRef.current) return;
      const newX = Math.max(0, Math.min(window.innerWidth - 200, me.clientX - dragRef.current.ox));
      const newY = Math.max(0, Math.min(window.innerHeight - TASKBAR_H - 30, me.clientY - dragRef.current.oy));
      osStore.updateWindowPos(win.id, newX, newY);
    };
    const onUp = () => { dragRef.current = null; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [win]);

  const onResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resizeRef.current = { ox: e.clientX, oy: e.clientY, ow: win.width, oh: win.height };
    const onMove = (me: MouseEvent) => {
      if (!resizeRef.current) return;
      const nw = Math.max(300, resizeRef.current.ow + me.clientX - resizeRef.current.ox);
      const nh = Math.max(200, resizeRef.current.oh + me.clientY - resizeRef.current.oy);
      osStore.updateWindowSize(win.id, nw, nh);
    };
    const onUp = () => { resizeRef.current = null; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [win.width, win.height, win.id]);

  const style: React.CSSProperties = win.isMaximized
    ? {
        position: 'fixed',
        left: settings.taskbarPosition === 'left' ? TASKBAR_H : 0,
        top: settings.taskbarPosition === 'top' ? TASKBAR_H : 0,
        right: settings.taskbarPosition === 'right' ? TASKBAR_H : 0,
        bottom: isBottom ? TASKBAR_H : 0,
        width: 'auto',
        height: 'auto',
        borderRadius: 0,
        zIndex: win.zIndex,
        transition: settings.animationsEnabled ? 'all 0.25s cubic-bezier(0.4,0,0.2,1)' : 'none',
      }
    : {
        position: 'fixed',
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
        transition: settings.animationsEnabled ? 'box-shadow 0.2s, border-color 0.2s' : 'none',
      };

  if (win.isMinimized) return null;

  return (
    <div
      className={`aos-window ${win.isFocused ? 'focused' : ''} ${opening ? 'opening' : ''}`}
      style={style}
      onMouseDown={() => osStore.focusWindow(win.id)}
    >
      {/* Title Bar */}
      <div
        className={`aos-titlebar select-none`}
        onMouseDown={onTitleMouseDown}
        onDoubleClick={() => osStore.maximizeWindow(win.id)}
      >
        <div className="flex items-center gap-2 mr-3">
          <button className="win-btn win-btn-close" onClick={() => osStore.closeWindow(win.id)} title="Закрыть">✕</button>
          <button className="win-btn win-btn-min" onClick={() => osStore.minimizeWindow(win.id)} title="Свернуть">−</button>
          <button className="win-btn win-btn-max" onClick={() => osStore.maximizeWindow(win.id)} title="Развернуть">⬜</button>
        </div>
        <span className="text-2xl mr-2 select-none">{win.icon}</span>
        <span className="text-sm font-medium text-white/80 truncate flex-1">{win.title}</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AppRenderer win={win} />
      </div>

      {/* Resize handle */}
      {!win.isMaximized && (
        <div
          style={{ position: 'absolute', right: 0, bottom: 0, width: 20, height: 20, cursor: 'nwse-resize', zIndex: 10 }}
          onMouseDown={onResizeMouseDown}
        />
      )}
    </div>
  );
}

export default function WindowManager() {
  const { windows } = useOsStore();
  return (
    <>
      {windows.map(win => <OsWindow key={win.id} win={win} />)}
    </>
  );
}
