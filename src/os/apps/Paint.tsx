import { useRef, useState, useEffect, useCallback } from 'react';

type Tool = 'pen' | 'eraser' | 'fill' | 'rect' | 'ellipse' | 'line' | 'spray' | 'text';

const PALETTE = [
  '#000000','#ffffff','#ff0000','#00ff00','#0000ff','#ffff00','#ff00ff','#00ffff',
  '#ff8800','#8800ff','#00ff88','#ff0088','#88ff00','#0088ff','#884400','#004488',
  '#ff4444','#44ff44','#4444ff','#ffaa00','#aa00ff','#00ffaa','#666666','#aaaaaa',
];

export default function Paint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#1a1a2e');
  const [size, setSize] = useState(4);
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState<ImageData[]>([]);
  const [textInput, setTextInput] = useState('');
  const [textPos, setTextPos] = useState<{ x: number; y: number } | null>(null);
  const [fontSize, setFontSize] = useState(20);
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 500 });
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const r = containerRef.current.getBoundingClientRect();
        setCanvasSize({ w: Math.floor(r.width), h: Math.floor(r.height) });
      }
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const getPos = (e: React.MouseEvent): { x: number; y: number } => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const saveHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    setHistory(h => [...h.slice(-19), ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const prev = history[history.length - 1];
    ctx.putImageData(prev, 0, 0);
    setHistory(h => h.slice(0, -1));
  };

  const fill = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = img.data;
    const idx = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
    const targetR = data[idx], targetG = data[idx+1], targetB = data[idx+2], targetA = data[idx+3];
    const fillColor = parseInt(color.slice(1), 16);
    const fillR = (fillColor >> 16) & 255, fillG = (fillColor >> 8) & 255, fillB = fillColor & 255;
    if (targetR === fillR && targetG === fillG && targetB === fillB) return;
    const stack = [[Math.floor(x), Math.floor(y)]];
    while (stack.length) {
      const [cx, cy] = stack.pop()!;
      const i = (cy * canvas.width + cx) * 4;
      if (cx < 0 || cx >= canvas.width || cy < 0 || cy >= canvas.height) continue;
      if (data[i] !== targetR || data[i+1] !== targetG || data[i+2] !== targetB || data[i+3] !== targetA) continue;
      data[i] = fillR; data[i+1] = fillG; data[i+2] = fillB; data[i+3] = 255;
      stack.push([cx+1,cy],[cx-1,cy],[cx,cy+1],[cx,cy-1]);
    }
    ctx.putImageData(img, 0, 0);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const pos = getPos(e);
    saveHistory();
    if (tool === 'fill') { fill(pos.x, pos.y); return; }
    if (tool === 'text') {
      setTextPos(pos);
      setTextInput('');
      return;
    }
    setStartPos(pos);
    setDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.strokeStyle = tool === 'eraser' ? bgColor : color;
    ctx.fillStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (tool === 'pen' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!drawing) return;
    const pos = getPos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    if (tool === 'pen' || tool === 'eraser') {
      ctx.strokeStyle = tool === 'eraser' ? bgColor : color;
      ctx.lineWidth = tool === 'eraser' ? size * 3 : size;
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (tool === 'spray') {
      for (let i = 0; i < 20; i++) {
        const r = size * 3;
        const rx = (Math.random() - 0.5) * 2 * r;
        const ry = (Math.random() - 0.5) * 2 * r;
        ctx.fillStyle = color;
        ctx.fillRect(pos.x + rx, pos.y + ry, 1.5, 1.5);
      }
    } else {
      const overlay = overlayRef.current;
      if (!overlay) return;
      const ov = overlay.getContext('2d')!;
      ov.clearRect(0, 0, overlay.width, overlay.height);
      ov.strokeStyle = color;
      ov.fillStyle = color + '33';
      ov.lineWidth = size;
      ov.lineCap = 'round';
      if (tool === 'rect') {
        ov.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
        ov.fillRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
      } else if (tool === 'ellipse') {
        ov.beginPath();
        ov.ellipse(
          (startPos.x + pos.x) / 2, (startPos.y + pos.y) / 2,
          Math.abs(pos.x - startPos.x) / 2, Math.abs(pos.y - startPos.y) / 2,
          0, 0, Math.PI * 2
        );
        ov.fill();
        ov.stroke();
      } else if (tool === 'line') {
        ov.beginPath();
        ov.moveTo(startPos.x, startPos.y);
        ov.lineTo(pos.x, pos.y);
        ov.stroke();
      }
    }
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (!drawing) return;
    const pos = getPos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const overlay = overlayRef.current;

    if (tool === 'rect') {
      ctx.strokeStyle = color; ctx.fillStyle = color + '33'; ctx.lineWidth = size;
      ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
      ctx.fillRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
    } else if (tool === 'ellipse') {
      ctx.strokeStyle = color; ctx.fillStyle = color + '33'; ctx.lineWidth = size;
      ctx.beginPath();
      ctx.ellipse(
        (startPos.x + pos.x) / 2, (startPos.y + pos.y) / 2,
        Math.abs(pos.x - startPos.x) / 2, Math.abs(pos.y - startPos.y) / 2,
        0, 0, Math.PI * 2
      );
      ctx.fill(); ctx.stroke();
    } else if (tool === 'line') {
      ctx.strokeStyle = color; ctx.lineWidth = size; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }

    if (overlay) { const ov = overlay.getContext('2d')!; ov.clearRect(0, 0, overlay.width, overlay.height); }
    setDrawing(false);
  };

  const commitText = useCallback(() => {
    if (!textPos || !textInput.trim()) { setTextPos(null); return; }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px 'Golos Text', sans-serif`;
    ctx.fillText(textInput, textPos.x, textPos.y);
    setTextPos(null);
    setTextInput('');
  }, [textPos, textInput, color, fontSize]);

  const screenshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url; a.download = `paint_${Date.now()}.png`; a.click();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    saveHistory();
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const tools: { id: Tool; icon: string; label: string }[] = [
    { id: 'pen',     icon: '✏️', label: 'Карандаш' },
    { id: 'eraser',  icon: '🧹', label: 'Ластик' },
    { id: 'fill',    icon: '🪣', label: 'Заливка' },
    { id: 'rect',    icon: '⬜', label: 'Прямоугольник' },
    { id: 'ellipse', icon: '⭕', label: 'Эллипс' },
    { id: 'line',    icon: '📏', label: 'Линия' },
    { id: 'spray',   icon: '🌫️', label: 'Аэрозоль' },
    { id: 'text',    icon: '🔤', label: 'Текст' },
  ];

  return (
    <div className="flex flex-col h-full text-white">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/08 flex-shrink-0 flex-wrap">
        {tools.map(t => (
          <button key={t.id} title={t.label} onClick={() => setTool(t.id)}
            className={`w-9 h-9 rounded-xl text-lg transition-all flex items-center justify-center ${tool === t.id ? 'bg-white/20 ring-1 ring-white/30' : 'hover:bg-white/10'}`}>
            {t.icon}
          </button>
        ))}
        <div className="w-px h-6 bg-white/15 mx-1" />
        <label className="text-xs text-white/50">Размер:</label>
        <input type="range" min={1} max={40} value={size} onChange={e => setSize(+e.target.value)} className="w-24" />
        <span className="text-xs text-white/60 w-6">{size}</span>
        <div className="w-px h-6 bg-white/15 mx-1" />
        <label className="text-xs text-white/50">Цвет:</label>
        <input type="color" value={color} onChange={e => setColor(e.target.value)}
          className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0.5"
          style={{ background: 'rgba(255,255,255,0.08)' }} />
        <label className="text-xs text-white/50">Фон:</label>
        <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
          className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0.5"
          style={{ background: 'rgba(255,255,255,0.08)' }} />
        {tool === 'text' && (
          <>
            <label className="text-xs text-white/50">Шрифт:</label>
            <input type="number" min={8} max={72} value={fontSize} onChange={e => setFontSize(+e.target.value)}
              className="w-14 text-xs rounded-lg px-2 py-1 text-center outline-none"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)' }} />
          </>
        )}
        <div className="flex-1" />
        <button className="aos-btn text-xs py-1 px-3" onClick={undo}>↩️ Отмена</button>
        <button className="aos-btn text-xs py-1 px-3" onClick={clearCanvas}>🗑️ Очистить</button>
        <button className="aos-btn aos-btn-accent text-xs py-1 px-3" onClick={screenshot}>📷 Сохранить</button>
      </div>

      {/* Palette */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b border-white/06 flex-shrink-0 flex-wrap">
        {PALETTE.map(c => (
          <button key={c} title={c} onClick={() => setColor(c)}
            className={`w-6 h-6 rounded-md transition-all hover:scale-110 ${color === c ? 'ring-2 ring-white scale-110' : ''}`}
            style={{ background: c, flexShrink: 0 }} />
        ))}
      </div>

      {/* Canvas area */}
      <div ref={containerRef} className="flex-1 overflow-auto relative" style={{ background: '#111' }}>
        <div style={{ position: 'relative', display: 'inline-block', minWidth: '100%', minHeight: '100%' }}>
          <canvas
            id="paint-canvas"
            ref={canvasRef}
            width={canvasSize.w}
            height={canvasSize.h}
            style={{ display: 'block', background: bgColor }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          />
          <canvas
            ref={overlayRef}
            width={canvasSize.w}
            height={canvasSize.h}
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
          />
          {textPos && (
            <input
              autoFocus
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') commitText(); if (e.key === 'Escape') setTextPos(null); }}
              onBlur={commitText}
              style={{
                position: 'absolute',
                left: textPos.x,
                top: textPos.y - fontSize,
                fontSize,
                color,
                background: 'transparent',
                border: '1px dashed rgba(255,255,255,0.4)',
                outline: 'none',
                fontFamily: 'Golos Text, sans-serif',
                userSelect: 'text',
                minWidth: 100,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
