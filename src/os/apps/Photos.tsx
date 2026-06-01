import { useState, useRef } from 'react';
import { useOsStore } from '../useOsStore';

export default function Photos({ data }: { data?: { fileId?: string } }) {
  const state = useOsStore();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState('');
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [filter, setFilter] = useState('none');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const FILTERS = [
    { id: 'none', label: 'Оригинал' },
    { id: 'grayscale(100%)', label: 'Ч/Б' },
    { id: 'sepia(100%)', label: 'Сепия' },
    { id: 'invert(100%)', label: 'Инверсия' },
    { id: 'contrast(200%)', label: 'Контраст' },
    { id: 'brightness(150%)', label: 'Яркость' },
    { id: 'hue-rotate(90deg)', label: 'Тон +90°' },
    { id: 'saturate(300%)', label: 'Насыщ.' },
    { id: 'blur(2px)', label: 'Размытие' },
  ];

  const handleFile = (f: File) => {
    const url = URL.createObjectURL(f);
    setImageUrl(url);
    setFilename(f.name);
    setZoom(1);
    setRotation(0);
    setFilter('none');
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f?.type.startsWith('image/')) handleFile(f);
  };

  const download = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl; a.download = filename || 'image.png'; a.click();
  };

  void state; // state used for future FS integration

  return (
    <div className="flex flex-col h-full text-white">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/08 flex-shrink-0 flex-wrap">
        <button className="aos-btn text-xs py-1 px-3" onClick={() => fileInputRef.current?.click()}>📂 Открыть</button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        {imageUrl && (
          <>
            <div className="w-px h-5 bg-white/15" />
            <button className="aos-btn text-xs py-1 px-2" onClick={() => setZoom(z => Math.min(5, z + 0.25))}>🔍+</button>
            <button className="aos-btn text-xs py-1 px-2" onClick={() => setZoom(z => Math.max(0.1, z - 0.25))}>🔍−</button>
            <button className="aos-btn text-xs py-1 px-2" onClick={() => setZoom(1)}>⊞ 1:1</button>
            <div className="w-px h-5 bg-white/15" />
            <button className="aos-btn text-xs py-1 px-2" onClick={() => setRotation(r => r - 90)}>↺</button>
            <button className="aos-btn text-xs py-1 px-2" onClick={() => setRotation(r => r + 90)}>↻</button>
            <div className="w-px h-5 bg-white/15" />
            <button className="aos-btn text-xs py-1 px-2" onClick={download}>💾 Скачать</button>
          </>
        )}
        {filename && <span className="text-xs text-white/40 ml-2 truncate">{filename}</span>}
      </div>

      {/* Filters */}
      {imageUrl && (
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/06 overflow-x-auto flex-shrink-0">
          <span className="text-xs text-white/40 mr-1">Фильтры:</span>
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-all ${filter === f.id ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
              style={{ background: filter === f.id ? 'rgba(var(--aos-accent-rgb),0.3)' : 'rgba(255,255,255,0.06)', border: `1px solid ${filter === f.id ? 'rgba(var(--aos-accent-rgb),0.5)' : 'rgba(255,255,255,0.10)'}` }}>
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Image area */}
      <div
        className="flex-1 overflow-auto flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.4)' }}
        onDragOver={e => e.preventDefault()}
        onDrop={onDrop}
      >
        {!imageUrl ? (
          <div className="flex flex-col items-center gap-4 text-center p-8">
            <div className="text-8xl opacity-20">🖼️</div>
            <div className="text-white/40">Откройте изображение или перетащите сюда</div>
            <div className="text-white/25 text-xs">PNG, JPG, JPEG, SVG, WebP, GIF, BMP...</div>
            <button className="aos-btn aos-btn-accent mt-2" onClick={() => fileInputRef.current?.click()}>Открыть файл</button>
          </div>
        ) : (
          <div style={{ transform: `scale(${zoom}) rotate(${rotation}deg)`, transition: 'transform 0.2s', transformOrigin: 'center center' }}>
            <img
              src={imageUrl}
              alt={filename}
              style={{ maxWidth: '100%', maxHeight: '100%', display: 'block', filter: filter }}
              draggable={false}
            />
          </div>
        )}
      </div>

      {/* Zoom control */}
      {imageUrl && (
        <div className="flex items-center gap-3 px-4 py-2 border-t border-white/06 text-xs text-white/40 flex-shrink-0">
          <span>Масштаб: {Math.round(zoom * 100)}%</span>
          <input type="range" min={10} max={500} value={zoom * 100}
            onChange={e => setZoom(+e.target.value / 100)} className="w-32" />
          <span>Поворот: {rotation}°</span>
          <span className="ml-auto">{filename}</span>
        </div>
      )}
    </div>
  );
}