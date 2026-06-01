import { useRef, useEffect } from 'react';
import { useOsStore } from './useOsStore';
import { osStore } from './store';

type Props = { onClose: () => void; taskbarPos: string };

export default function NotificationCenter({ onClose, taskbarPos }: Props) {
  const { notifications } = useOsStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const getPos = (): React.CSSProperties => {
    switch (taskbarPos) {
      case 'bottom': return { bottom: 60, right: 12 };
      case 'top':    return { top: 60, right: 12 };
      default:       return { bottom: 60, right: 12 };
    }
  };

  return (
    <div ref={ref} className="notif-panel" style={{ position: 'fixed', width: 380, maxHeight: 520, zIndex: 9600, ...getPos() }}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-semibold text-sm">Уведомления</span>
          <button
            className="text-xs text-white/40 hover:text-white/70 transition-colors"
            onClick={() => {
              osStore.setState(s => ({ ...s, notifications: s.notifications.map(n => ({ ...n, read: true })) }));
            }}
          >Прочитать все</button>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-8 text-white/30 text-sm">Нет уведомлений</div>
        ) : (
          <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
            {notifications.map(n => (
              <div key={n.id} className={`p-3 rounded-xl transition-all ${n.read ? 'bg-white/03' : 'bg-white/08'}`}>
                <div className="flex items-start gap-2">
                  <span className="text-xl">{n.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white font-medium">{n.title}</div>
                    <div className="text-xs text-white/60 mt-0.5 line-clamp-2">{n.message}</div>
                    <div className="text-xs text-white/30 mt-1">{new Date(n.time).toLocaleTimeString('ru')}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
