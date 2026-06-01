import { useState, useRef, useCallback, useEffect } from 'react';
import { useOsStore } from './useOsStore';
import { osStore, FileItem } from './store';
import { getApp } from './apps';

type CtxMenu = { x: number; y: number; type: 'desktop' | 'icon'; item?: FileItem };

const WALLPAPERS = [
  { id: 'gradient', label: 'Aurora', class: 'wallpaper-aurora' },
  { id: 'sunset',   label: 'Sunset',  class: 'wallpaper-sunset' },
  { id: 'forest',   label: 'Forest',  class: 'wallpaper-forest' },
  { id: 'ocean',    label: 'Ocean',   class: 'wallpaper-ocean' },
  { id: 'minimal',  label: 'Minimal', class: 'wallpaper-minimal' },
];

export default function Desktop() {
  const state = useOsStore();
  const { settings, desktopItems } = state;
  const [ctxMenu, setCtxMenu] = useState<CtxMenu | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragOffset = useRef<{ ox: number; oy: number }>({ ox: 0, oy: 0 });
  const desktopRef = useRef<HTMLDivElement>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameVal, setRenameVal] = useState('');

  const wp = WALLPAPERS.find(w => w.id === settings.wallpaper) || WALLPAPERS[0];

  const openItem = useCallback((item: FileItem) => {
    if (item.type === 'shortcut' && item.targetAppId) {
      const app = getApp(item.targetAppId);
      if (app) osStore.openWindow(app);
    } else if (item.type === 'file') {
      const ext = item.ext?.toLowerCase();
      if (['txt', 'md', 'log', 'cfg', 'sys', 'dat'].includes(ext || '')) {
        osStore.openWindow({ id: 'notepad', title: item.name, icon: '📝', defaultWidth: 700, defaultHeight: 520, data: { fileId: item.id } });
      } else if (['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif'].includes(ext || '')) {
        osStore.openWindow({ id: 'photos', title: item.name, icon: '🖼️', defaultWidth: 820, defaultHeight: 560, data: { fileId: item.id } });
      }
    }
  }, []);

  const onIconMouseDown = (e: React.MouseEvent, item: FileItem) => {
    e.stopPropagation();
    if (e.button === 2) return;
    setSelected(item.id);
    dragOffset.current = { ox: e.clientX - (item.desktopX || 0), oy: e.clientY - (item.desktopY || 0) };
    setDraggingId(item.id);

    const onMove = (me: MouseEvent) => {
      const newX = Math.max(0, Math.min(window.innerWidth - 90, me.clientX - dragOffset.current.ox));
      const newY = Math.max(0, Math.min(window.innerHeight - 110, me.clientY - dragOffset.current.oy));
      osStore.updateDesktopItems(
        desktopItems.map(di => di.id === item.id ? { ...di, desktopX: newX, desktopY: newY } : di)
      );
    };
    const onUp = () => {
      setDraggingId(null);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const onDesktopMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setSelected(null);
    osStore.closeStartMenu();
    setCtxMenu(null);
  };

  const onDesktopCtx = (e: React.MouseEvent) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY, type: 'desktop' });
  };

  const onIconCtx = (e: React.MouseEvent, item: FileItem) => {
    e.preventDefault();
    e.stopPropagation();
    setSelected(item.id);
    setCtxMenu({ x: e.clientX, y: e.clientY, type: 'icon', item });
  };

  const closeCtx = () => setCtxMenu(null);

  const createTextFile = () => {
    const newFile: FileItem = {
      id: `desktop_txt_${Date.now()}`,
      name: 'Новый документ.txt',
      type: 'file',
      ext: 'txt',
      content: '',
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      size: 0,
      desktopX: ctxMenu?.x || 100,
      desktopY: ctxMenu?.y || 100,
    };
    osStore.updateDesktopItems([...desktopItems, newFile]);
    closeCtx();
  };

  const createFolder = () => {
    const newFolder: FileItem = {
      id: `desktop_folder_${Date.now()}`,
      name: 'Новая папка',
      type: 'folder',
      icon: '📁',
      children: [],
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      desktopX: ctxMenu?.x || 100,
      desktopY: ctxMenu?.y || 100,
    };
    osStore.updateDesktopItems([...desktopItems, newFolder]);
    closeCtx();
  };

  const startRename = (item: FileItem) => {
    setRenaming(item.id);
    setRenameVal(item.name);
    closeCtx();
  };

  const confirmRename = (id: string) => {
    if (renameVal.trim()) {
      osStore.updateDesktopItems(desktopItems.map(di => di.id === id ? { ...di, name: renameVal.trim() } : di));
    }
    setRenaming(null);
  };

  const deleteItem = (id: string) => {
    osStore.updateDesktopItems(desktopItems.filter(di => di.id !== id));
    closeCtx();
  };

  useEffect(() => {
    const handler = () => setCtxMenu(null);
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  const getItemIcon = (item: FileItem) => {
    if (item.icon) return item.icon;
    if (item.type === 'folder') return '📁';
    if (item.type === 'shortcut') return '🔗';
    const ext = item.ext?.toLowerCase();
    if (ext === 'txt' || ext === 'md') return '📝';
    if (['png','jpg','jpeg','svg','webp'].includes(ext || '')) return '🖼️';
    if (['mp3','wav','ogg'].includes(ext || '')) return '🎵';
    if (['mp4','webm'].includes(ext || '')) return '🎬';
    return '📄';
  };

  const taskbarH = 52;
  const desktopStyle: React.CSSProperties = {
    position: 'fixed',
    ...(settings.taskbarPosition === 'bottom' ? { top: 0, left: 0, right: 0, bottom: taskbarH } : {}),
    ...(settings.taskbarPosition === 'top'    ? { top: taskbarH, left: 0, right: 0, bottom: 0 } : {}),
    ...(settings.taskbarPosition === 'left'   ? { top: 0, left: taskbarH, right: 0, bottom: 0 } : {}),
    ...(settings.taskbarPosition === 'right'  ? { top: 0, left: 0, right: taskbarH, bottom: 0 } : {}),
    overflow: 'hidden',
  };

  return (
    <div
      ref={desktopRef}
      className={`${wp.class} relative`}
      style={desktopStyle}
      onMouseDown={onDesktopMouseDown}
      onContextMenu={onDesktopCtx}
    >
      {/* Wallpaper overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 60% at 20% 30%, rgba(56,189,248,0.10) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 70%, rgba(168,85,247,0.08) 0%, transparent 60%)'
      }} />

      {/* Desktop icons */}
      {desktopItems.map(item => (
        <div
          key={item.id}
          className={`desktop-icon absolute ${selected === item.id ? 'selected' : ''} ${draggingId === item.id ? 'opacity-70' : ''}`}
          style={{ left: item.desktopX || 20, top: item.desktopY || 20, zIndex: selected === item.id ? 50 : 1 }}
          onMouseDown={e => onIconMouseDown(e, item)}
          onDoubleClick={() => openItem(item)}
          onContextMenu={e => onIconCtx(e, item)}
        >
          <span className="text-4xl select-none">{getItemIcon(item)}</span>
          {renaming === item.id ? (
            <input
              autoFocus
              value={renameVal}
              onChange={e => setRenameVal(e.target.value)}
              onBlur={() => confirmRename(item.id)}
              onKeyDown={e => { if (e.key === 'Enter') confirmRename(item.id); if (e.key === 'Escape') setRenaming(null); }}
              className="desktop-icon-label bg-transparent border-none outline-none text-center text-xs text-white w-full"
              style={{ userSelect: 'text', background: 'rgba(var(--aos-accent-rgb),0.3)', borderRadius: 4, padding: '1px 4px' }}
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <span className="desktop-icon-label">{item.name}</span>
          )}
        </div>
      ))}

      {/* Context menu */}
      {ctxMenu && (
        <div
          className="aos-context-menu"
          style={{ position: 'fixed', left: ctxMenu.x, top: ctxMenu.y, zIndex: 9999 }}
          onClick={e => e.stopPropagation()}
        >
          {ctxMenu.type === 'desktop' ? (
            <>
              <div className="ctx-item" onClick={createTextFile}>📝 Новый текстовый файл</div>
              <div className="ctx-item" onClick={createFolder}>📁 Новая папка</div>
              <div className="ctx-separator" />
              <div className="ctx-item" onClick={() => { closeCtx(); osStore.openWindow({ id: 'settings', title: 'Параметры', icon: '⚙️', defaultWidth: 900, defaultHeight: 620 }); }}>⚙️ Параметры дисплея</div>
              <div className="ctx-item" onClick={() => { closeCtx(); osStore.openWindow({ id: 'settings', title: 'Параметры', icon: '⚙️', defaultWidth: 900, defaultHeight: 620, data: { tab: 'personalization' } }); }}>🎨 Персонализация</div>
              <div className="ctx-separator" />
              <div className="ctx-item" onClick={() => { closeCtx(); osStore.openWindow({ id: 'explorer', title: 'Проводник', icon: '📁', defaultWidth: 860, defaultHeight: 560 }); }}>📁 Открыть проводник</div>
            </>
          ) : (
            <>
              <div className="ctx-item" onClick={() => { if (ctxMenu.item) openItem(ctxMenu.item); closeCtx(); }}>▶️ Открыть</div>
              <div className="ctx-separator" />
              <div className="ctx-item" onClick={() => { if (ctxMenu.item) startRename(ctxMenu.item); }}>✏️ Переименовать</div>
              <div className="ctx-item danger" onClick={() => { if (ctxMenu.item) deleteItem(ctxMenu.item.id); }}>🗑️ Удалить</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}