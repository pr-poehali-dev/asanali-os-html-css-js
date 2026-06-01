export type AppDef = {
  id: string;
  title: string;
  icon: string;
  defaultWidth?: number;
  defaultHeight?: number;
  category: string;
};

export const APPS: AppDef[] = [
  { id: 'notepad',     title: 'Блокнот',         icon: '📝', defaultWidth: 700,  defaultHeight: 520, category: 'tools' },
  { id: 'calculator',  title: 'Калькулятор',      icon: '🧮', defaultWidth: 360,  defaultHeight: 580, category: 'tools' },
  { id: 'paint',       title: 'Paint',            icon: '🎨', defaultWidth: 900,  defaultHeight: 640, category: 'creative' },
  { id: 'browser',     title: 'Asanalindex',      icon: '🌐', defaultWidth: 1000, defaultHeight: 680, category: 'internet' },
  { id: 'explorer',    title: 'Проводник',        icon: '📁', defaultWidth: 860,  defaultHeight: 560, category: 'system' },
  { id: 'settings',    title: 'Параметры',        icon: '⚙️', defaultWidth: 900,  defaultHeight: 620, category: 'system' },
  { id: 'mediaplayer', title: 'Медиаплеер',       icon: '🎵', defaultWidth: 780,  defaultHeight: 520, category: 'media' },
  { id: 'photos',      title: 'Фотографии',       icon: '🖼️', defaultWidth: 820,  defaultHeight: 560, category: 'media' },
  { id: 'vscode',      title: 'Visual Studio Code', icon: '💙', defaultWidth: 1000, defaultHeight: 680, category: 'dev' },
  { id: 'vs',          title: 'Visual Studio',    icon: '💜', defaultWidth: 1000, defaultHeight: 680, category: 'dev' },
  { id: 'terminal',    title: 'Терминал',         icon: '🖥️', defaultWidth: 720,  defaultHeight: 440, category: 'system' },
  { id: 'camera',      title: 'Камера',           icon: '📷', defaultWidth: 700,  defaultHeight: 520, category: 'media' },
  { id: 'clock',       title: 'Часы',             icon: '⏰', defaultWidth: 460,  defaultHeight: 380, category: 'tools' },
  { id: 'weather',     title: 'Погода',           icon: '🌤️', defaultWidth: 600,  defaultHeight: 480, category: 'tools' },
  { id: 'store',       title: 'AsanaliStore',     icon: '🛒', defaultWidth: 860,  defaultHeight: 600, category: 'system' },
  { id: 'recycle',     title: 'Корзина',          icon: '🗑️', defaultWidth: 700,  defaultHeight: 480, category: 'system' },
];

export function getApp(id: string): AppDef | undefined {
  return APPS.find(a => a.id === id);
}
