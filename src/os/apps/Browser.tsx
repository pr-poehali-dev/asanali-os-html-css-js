import { useState, useRef } from 'react';

const BOOKMARKS = [
  { icon: '🔍', label: 'Яндекс', url: 'https://yandex.ru' },
  { icon: '📧', label: 'Почта', url: 'https://mail.yandex.ru' },
  { icon: '📺', label: 'Видео', url: 'https://yandex.ru/video' },
  { icon: '🗺️', label: 'Карты', url: 'https://yandex.ru/maps' },
  { icon: '🛒', label: 'Маркет', url: 'https://market.yandex.ru' },
  { icon: '☁️', label: 'Диск', url: 'https://disk.yandex.ru' },
];

export default function Browser() {
  const [url, setUrl] = useState('https://yandex.ru');
  const [inputUrl, setInputUrl] = useState('https://yandex.ru');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>(['https://yandex.ru']);
  const [histIdx, setHistIdx] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const navigate = (target: string) => {
    let nav = target.trim();
    if (!nav.startsWith('http')) {
      nav = nav.includes('.') ? `https://${nav}` : `https://yandex.ru/search/?text=${encodeURIComponent(nav)}`;
    }
    setUrl(nav);
    setInputUrl(nav);
    setLoading(true);
    const newHist = [...history.slice(0, histIdx + 1), nav];
    setHistory(newHist);
    setHistIdx(newHist.length - 1);
  };

  const goBack = () => {
    if (histIdx > 0) {
      const prev = history[histIdx - 1];
      setHistIdx(histIdx - 1);
      setUrl(prev); setInputUrl(prev); setLoading(true);
    }
  };

  const goForward = () => {
    if (histIdx < history.length - 1) {
      const next = history[histIdx + 1];
      setHistIdx(histIdx + 1);
      setUrl(next); setInputUrl(next); setLoading(true);
    }
  };

  const reload = () => { setLoading(true); if (iframeRef.current) iframeRef.current.src = url; };

  return (
    <div className="flex flex-col h-full text-white">
      {/* Navbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/08 flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.03)' }}>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-lg disabled:opacity-30 transition-all"
          onClick={goBack} disabled={histIdx <= 0}>‹</button>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-lg disabled:opacity-30 transition-all"
          onClick={goForward} disabled={histIdx >= history.length - 1}>›</button>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-sm transition-all"
          onClick={reload}>🔄</button>

        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔒</span>
          <input
            value={inputUrl}
            onChange={e => setInputUrl(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') navigate(inputUrl); }}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-white/90 outline-none"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
            placeholder="Введите адрес или запрос..."
          />
        </div>

        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-sm"
          onClick={() => navigate(inputUrl)}>➜</button>
      </div>

      {/* Bookmarks bar */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b border-white/06 flex-shrink-0">
        {BOOKMARKS.map(b => (
          <button key={b.url} onClick={() => navigate(b.url)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs text-white/70 hover:text-white hover:bg-white/08 transition-all">
            <span>{b.icon}</span>
            <span>{b.label}</span>
          </button>
        ))}
      </div>

      {/* Loading bar */}
      {loading && (
        <div className="h-0.5 flex-shrink-0 overflow-hidden">
          <div className="h-full animate-pulse" style={{ background: 'var(--aos-accent)', width: '60%' }} />
        </div>
      )}

      {/* iFrame */}
      <div className="flex-1 relative overflow-hidden">
        <iframe
          ref={iframeRef}
          src={url}
          title="Asanalindex Browser"
          className="w-full h-full border-0"
          style={{ background: '#fff' }}
          onLoad={() => setLoading(false)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-navigation"
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ background: 'rgba(10,12,22,0.6)', backdropFilter: 'blur(4px)' }}>
            <div className="text-center">
              <div className="text-4xl mb-3 animate-bounce">🌐</div>
              <div className="text-white/60 text-sm">Загрузка...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
