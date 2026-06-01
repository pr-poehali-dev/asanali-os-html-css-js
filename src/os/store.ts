/* eslint-disable @typescript-eslint/no-explicit-any */

export type WindowState = {
  id: string;
  appId: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  zIndex: number;
  data?: any;
};

export type FileItem = {
  id: string;
  name: string;
  type: 'file' | 'folder' | 'shortcut';
  ext?: string;
  content?: string;
  children?: FileItem[];
  parentId?: string;
  createdAt: number;
  modifiedAt: number;
  size?: number;
  mimeType?: string;
  blobUrl?: string;
  targetAppId?: string;
  icon?: string;
  desktopX?: number;
  desktopY?: number;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  icon: string;
  time: number;
  read: boolean;
};

export type OsSettings = {
  accentColor: string;
  wallpaper: string;
  wallpaperColor: string;
  taskbarPosition: 'bottom' | 'top' | 'left' | 'right';
  taskbarGrouping: 'icon' | 'label';
  startMenuLayout: 'grid' | 'list' | 'compact';
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  soundVolume: number;
  audioOutput: string;
  fontSize: number;
  animationsEnabled: boolean;
  pinnedTaskbar: string[];
  pinnedStart: string[];
  userName: string;
  language: string;
};

export type OsState = {
  windows: WindowState[];
  activeWindowId: string | null;
  zCounter: number;
  startMenuOpen: boolean;
  notifications: Notification[];
  settings: OsSettings;
  fileSystem: FileItem[];
  desktopItems: FileItem[];
  clipboard: FileItem | null;
  searchQuery: string;
};

const defaultSettings: OsSettings = {
  accentColor: '#0ea5e9',
  wallpaper: 'gradient',
  wallpaperColor: '',
  taskbarPosition: 'bottom',
  taskbarGrouping: 'icon',
  startMenuLayout: 'grid',
  theme: 'dark',
  soundEnabled: true,
  soundVolume: 80,
  audioOutput: 'default',
  fontSize: 14,
  animationsEnabled: true,
  pinnedTaskbar: ['explorer', 'notepad', 'calculator', 'browser', 'paint', 'mediaplayer'],
  pinnedStart: ['notepad', 'calculator', 'browser', 'paint', 'explorer', 'settings', 'mediaplayer', 'photos'],
  userName: 'Asanali',
  language: 'ru',
};

const defaultFS: FileItem[] = [
  {
    id: 'root',
    name: 'AsanaliOS Local Disk (C:)',
    type: 'folder',
    createdAt: Date.now() - 86400000 * 30,
    modifiedAt: Date.now(),
    children: [
      {
        id: 'system',
        name: 'AsanaliOS System',
        type: 'folder',
        parentId: 'root',
        createdAt: Date.now() - 86400000 * 30,
        modifiedAt: Date.now(),
        children: [
          { id: 'sys1', name: 'kernel.sys', type: 'file', ext: 'sys', parentId: 'system', content: 'AsanaliOS Kernel v1.0', createdAt: Date.now() - 86400000 * 30, modifiedAt: Date.now(), size: 2048 },
          { id: 'sys2', name: 'drivers.sys', type: 'file', ext: 'sys', parentId: 'system', content: 'Hardware Drivers', createdAt: Date.now() - 86400000 * 29, modifiedAt: Date.now(), size: 4096 },
          { id: 'sys3', name: 'registry.dat', type: 'file', ext: 'dat', parentId: 'system', content: '{}', createdAt: Date.now() - 86400000 * 28, modifiedAt: Date.now(), size: 1024 },
          { id: 'sys4', name: 'boot.cfg', type: 'file', ext: 'cfg', parentId: 'system', content: 'boot_delay=0\ntheme=dark', createdAt: Date.now() - 86400000 * 25, modifiedAt: Date.now(), size: 256 },
        ],
      },
      {
        id: 'users',
        name: 'Users',
        type: 'folder',
        parentId: 'root',
        createdAt: Date.now() - 86400000 * 30,
        modifiedAt: Date.now(),
        children: [
          {
            id: 'user_asanali',
            name: 'Asanali',
            type: 'folder',
            parentId: 'users',
            createdAt: Date.now() - 86400000 * 30,
            modifiedAt: Date.now(),
            children: [
              { id: 'docs', name: 'Documents', type: 'folder', parentId: 'user_asanali', createdAt: Date.now() - 86400000 * 20, modifiedAt: Date.now(), children: [
                { id: 'doc1', name: 'Привет AsanaliOS.txt', type: 'file', ext: 'txt', parentId: 'docs', content: 'Добро пожаловать в AsanaliOS!\n\nЭта система создана для тебя. Наслаждайся!', createdAt: Date.now() - 86400000 * 5, modifiedAt: Date.now(), size: 120 },
              ]},
              { id: 'downloads', name: 'Downloads', type: 'folder', parentId: 'user_asanali', createdAt: Date.now() - 86400000 * 20, modifiedAt: Date.now(), children: [] },
              { id: 'pictures', name: 'Pictures', type: 'folder', parentId: 'user_asanali', createdAt: Date.now() - 86400000 * 20, modifiedAt: Date.now(), children: [] },
              { id: 'music', name: 'Music', type: 'folder', parentId: 'user_asanali', createdAt: Date.now() - 86400000 * 20, modifiedAt: Date.now(), children: [] },
              { id: 'videos', name: 'Videos', type: 'folder', parentId: 'user_asanali', createdAt: Date.now() - 86400000 * 20, modifiedAt: Date.now(), children: [] },
            ],
          },
        ],
      },
      {
        id: 'program_files',
        name: 'Program Files',
        type: 'folder',
        parentId: 'root',
        createdAt: Date.now() - 86400000 * 30,
        modifiedAt: Date.now(),
        children: [
          { id: 'pf1', name: 'Asanalindex', type: 'folder', parentId: 'program_files', createdAt: Date.now() - 86400000 * 10, modifiedAt: Date.now(), children: [] },
          { id: 'pf2', name: 'AsanaliOS Paint', type: 'folder', parentId: 'program_files', createdAt: Date.now() - 86400000 * 10, modifiedAt: Date.now(), children: [] },
          { id: 'pf3', name: 'Notepad', type: 'folder', parentId: 'program_files', createdAt: Date.now() - 86400000 * 10, modifiedAt: Date.now(), children: [] },
        ],
      },
      {
        id: 'temp',
        name: 'Temp',
        type: 'folder',
        parentId: 'root',
        createdAt: Date.now() - 86400000 * 15,
        modifiedAt: Date.now(),
        children: [],
      },
    ],
  },
];

const defaultDesktop: FileItem[] = [
  { id: 'd_computer', name: 'Этот компьютер', type: 'shortcut', targetAppId: 'explorer', icon: '💻', createdAt: Date.now(), modifiedAt: Date.now(), desktopX: 20, desktopY: 20 },
  { id: 'd_recycle', name: 'Корзина', type: 'shortcut', targetAppId: 'recycle', icon: '🗑️', createdAt: Date.now(), modifiedAt: Date.now(), desktopX: 20, desktopY: 110 },
  { id: 'd_notepad', name: 'Блокнот', type: 'shortcut', targetAppId: 'notepad', icon: '📝', createdAt: Date.now(), modifiedAt: Date.now(), desktopX: 20, desktopY: 200 },
];

function loadState(): Partial<OsState> {
  try {
    const saved = localStorage.getItem('asanalios_state');
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return {};
}

function saveState(state: Partial<OsState>) {
  try {
    localStorage.setItem('asanalios_state', JSON.stringify({
      settings: state.settings,
      fileSystem: state.fileSystem,
      desktopItems: state.desktopItems,
    }));
  } catch { /* ignore */ }
}

type Listener = () => void;

class OsStore {
  private state: OsState;
  private listeners: Set<Listener> = new Set();

  constructor() {
    const saved = loadState();
    this.state = {
      windows: [],
      activeWindowId: null,
      zCounter: 100,
      startMenuOpen: false,
      notifications: [],
      settings: { ...defaultSettings, ...(saved.settings || {}) },
      fileSystem: saved.fileSystem || defaultFS,
      desktopItems: saved.desktopItems || defaultDesktop,
      clipboard: null,
      searchQuery: '',
    };
  }

  getState(): OsState { return this.state; }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() { this.listeners.forEach(l => l()); }

  setState(updater: (prev: OsState) => OsState) {
    this.state = updater(this.state);
    this.notify();
  }

  openWindow(app: { id: string; title: string; icon: string; defaultWidth?: number; defaultHeight?: number; data?: any }) {
    const existing = this.state.windows.find(w => w.appId === app.id && !w.data);
    if (existing && !app.data) {
      this.focusWindow(existing.id);
      if (existing.isMinimized) {
        this.setState(s => ({ ...s, windows: s.windows.map(w => w.id === existing.id ? { ...w, isMinimized: false } : w) }));
      }
      return;
    }

    const w = app.defaultWidth || 800;
    const h = app.defaultHeight || 600;
    const x = Math.max(60, Math.floor((window.innerWidth - w) / 2) + Math.random() * 40 - 20);
    const y = Math.max(30, Math.floor((window.innerHeight - h - 48) / 2) + Math.random() * 40 - 20);

    const newWin: WindowState = {
      id: `${app.id}_${Date.now()}`,
      appId: app.id,
      title: app.title,
      icon: app.icon,
      x, y, width: w, height: h,
      isMinimized: false,
      isMaximized: false,
      isFocused: true,
      zIndex: this.state.zCounter + 1,
      data: app.data,
    };

    this.setState(s => ({
      ...s,
      windows: [...s.windows.map(win => ({ ...win, isFocused: false })), newWin],
      activeWindowId: newWin.id,
      zCounter: s.zCounter + 1,
      startMenuOpen: false,
    }));

    this.playSound('open');
  }

  closeWindow(id: string) {
    this.playSound('close');
    this.setState(s => {
      const remaining = s.windows.filter(w => w.id !== id);
      const last = remaining.filter(w => !w.isMinimized).sort((a, b) => b.zIndex - a.zIndex)[0];
      return { ...s, windows: remaining, activeWindowId: last?.id || null };
    });
  }

  focusWindow(id: string) {
    this.setState(s => ({
      ...s,
      windows: s.windows.map(w => ({
        ...w,
        isFocused: w.id === id,
        zIndex: w.id === id ? s.zCounter + 1 : w.zIndex,
      })),
      activeWindowId: id,
      zCounter: s.zCounter + 1,
    }));
  }

  minimizeWindow(id: string) {
    this.setState(s => {
      const remaining = s.windows.filter(w => w.id !== id && !w.isMinimized).sort((a, b) => b.zIndex - a.zIndex);
      return {
        ...s,
        windows: s.windows.map(w => w.id === id ? { ...w, isMinimized: true, isFocused: false } : w),
        activeWindowId: remaining[0]?.id || null,
      };
    });
  }

  maximizeWindow(id: string) {
    this.setState(s => ({
      ...s,
      windows: s.windows.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w),
    }));
  }

  updateWindowPos(id: string, x: number, y: number) {
    this.setState(s => ({
      ...s,
      windows: s.windows.map(w => w.id === id ? { ...w, x, y } : w),
    }));
  }

  updateWindowSize(id: string, width: number, height: number) {
    this.setState(s => ({
      ...s,
      windows: s.windows.map(w => w.id === id ? { ...w, width, height } : w),
    }));
  }

  toggleStartMenu() {
    this.setState(s => ({ ...s, startMenuOpen: !s.startMenuOpen }));
  }

  closeStartMenu() {
    this.setState(s => ({ ...s, startMenuOpen: false }));
  }

  updateSettings(patch: Partial<OsSettings>) {
    this.setState(s => {
      const next = { ...s, settings: { ...s.settings, ...patch } };
      saveState(next);
      return next;
    });
  }

  addNotification(n: Omit<Notification, 'id' | 'time' | 'read'>) {
    const notif: Notification = { ...n, id: Date.now().toString(), time: Date.now(), read: false };
    this.setState(s => ({ ...s, notifications: [notif, ...s.notifications].slice(0, 50) }));
  }

  playSound(type: 'open' | 'close' | 'error' | 'notify' | 'click') {
    if (!this.state.settings.soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.value = (this.state.settings.soundVolume / 100) * 0.15;
      const sounds: Record<string, [number, number, string]> = {
        open:   [440, 0.12, 'sine'],
        close:  [280, 0.10, 'sine'],
        error:  [200, 0.25, 'square'],
        notify: [660, 0.15, 'sine'],
        click:  [800, 0.05, 'sine'],
      };
      const [freq, dur, wave] = sounds[type] || sounds['click'];
      osc.type = wave as OscillatorType;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch { /* ignore */ }
  }

  findFileById(id: string, items?: FileItem[]): FileItem | null {
    const list = items || this.state.fileSystem;
    for (const item of list) {
      if (item.id === id) return item;
      if (item.children) {
        const found = this.findFileById(id, item.children);
        if (found) return found;
      }
    }
    return null;
  }

  updateFileSystem(fs: FileItem[]) {
    this.setState(s => { const next = { ...s, fileSystem: fs }; saveState(next); return next; });
  }

  updateDesktopItems(items: FileItem[]) {
    this.setState(s => { const next = { ...s, desktopItems: items }; saveState(next); return next; });
  }

  addFileToFolder(parentId: string, file: FileItem) {
    const addToNode = (items: FileItem[]): FileItem[] =>
      items.map(item => {
        if (item.id === parentId) return { ...item, children: [...(item.children || []), file] };
        if (item.children) return { ...item, children: addToNode(item.children) };
        return item;
      });
    this.setState(s => { const next = { ...s, fileSystem: addToNode(s.fileSystem) }; saveState(next); return next; });
  }

  deleteFile(fileId: string) {
    const removeFromNode = (items: FileItem[]): FileItem[] =>
      items.filter(i => i.id !== fileId).map(i =>
        i.children ? { ...i, children: removeFromNode(i.children) } : i
      );
    this.setState(s => { const next = { ...s, fileSystem: removeFromNode(s.fileSystem) }; saveState(next); return next; });
  }

  renameFile(fileId: string, newName: string) {
    const renameNode = (items: FileItem[]): FileItem[] =>
      items.map(i => i.id === fileId ? { ...i, name: newName, modifiedAt: Date.now() } :
        i.children ? { ...i, children: renameNode(i.children) } : i);
    this.setState(s => { const next = { ...s, fileSystem: renameNode(s.fileSystem) }; saveState(next); return next; });
  }

  updateFileContent(fileId: string, content: string) {
    const update = (items: FileItem[]): FileItem[] =>
      items.map(i => i.id === fileId ? { ...i, content, modifiedAt: Date.now(), size: content.length } :
        i.children ? { ...i, children: update(i.children) } : i);
    this.setState(s => { const next = { ...s, fileSystem: update(s.fileSystem) }; saveState(next); return next; });
  }
}

export const osStore = new OsStore();
export default osStore;
