import { useState, useEffect } from 'react';
import Desktop from '../os/Desktop';
import Taskbar from '../os/Taskbar';
import WindowManager from '../os/WindowManager';
import { osStore } from '../os/store';
import { useOsStore } from '../os/useOsStore';

function BootSplash({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const steps = [20, 45, 70, 90, 100];
    let i = 0;
    const t = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i]);
        i++;
      } else {
        clearInterval(t);
        setTimeout(onDone, 300);
      }
    }, 280);
    return () => clearInterval(t);
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-[99999]"
      style={{ background: 'linear-gradient(135deg, #060a12 0%, #0a0e1a 50%, #060a12 100%)' }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(14,165,233,0.08) 0%, transparent 70%)',
      }} />

      <div className="flex flex-col items-center gap-6 relative z-10">
        {/* Logo */}
        <div className="relative">
          <div className="text-8xl select-none" style={{ filter: 'drop-shadow(0 0 40px rgba(14,165,233,0.5))' }}>🚀</div>
          <div className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ background: 'var(--aos-accent)', animationDuration: '2s' }} />
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-light text-white tracking-[0.3em] mb-1">AsanaliOS</h1>
          <p className="text-white/30 text-sm tracking-widest uppercase">Premium Edition</p>
        </div>

        {/* Progress bar */}
        <div className="w-64 flex flex-col gap-2 mt-4">
          <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--aos-accent), #a855f7)' }}
            />
          </div>
          <p className="text-white/25 text-xs text-center">
            {progress < 50 ? 'Инициализация ядра...' : progress < 85 ? 'Загрузка системы...' : 'Подготовка рабочего стола...'}
          </p>
        </div>

        <div className="text-white/15 text-xs mt-2">AsanaliOS Kernel v1.0.0 · © 2025 Asanali</div>
      </div>
    </div>
  );
}

export default function Index() {
  const state = useOsStore();
  const { settings } = state;
  const [booted, setBooted] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  // Apply accent color
  useEffect(() => {
    const hex = settings.accentColor.replace('#', '');
    if (hex.length < 6) return;
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    document.documentElement.style.setProperty('--aos-accent', settings.accentColor);
    document.documentElement.style.setProperty('--aos-accent-rgb', `${r},${g},${b}`);
  }, [settings.accentColor]);

  const handleBoot = () => {
    setBooted(true);
    setFadeIn(true);
    setTimeout(() => {
      osStore.addNotification({
        title: 'Добро пожаловать!',
        message: `AsanaliOS запущена. Привет, ${osStore.getState().settings.userName}! 🚀`,
        icon: '🚀',
      });
    }, 800);
  };

  // Global shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') osStore.closeStartMenu();
      if (e.ctrlKey && e.key === 'F1') {
        e.preventDefault();
        osStore.openWindow({ id: 'settings', title: 'Параметры', icon: '⚙️', defaultWidth: 900, defaultHeight: 620 });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', fontFamily: 'Golos Text, system-ui, sans-serif', fontSize: settings.fontSize }}>
      {/* Boot splash */}
      {!booted && <BootSplash onDone={handleBoot} />}

      {/* OS UI */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: fadeIn ? 1 : 0 }}
      >
        <Desktop />
        <WindowManager />
        <Taskbar />
      </div>
    </div>
  );
}
