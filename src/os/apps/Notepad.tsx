import { useState, useEffect, useRef } from 'react';
import { osStore } from '../store';
import { useOsStore } from '../useOsStore';

type Props = { data?: { fileId?: string; content?: string; filename?: string } };

export default function Notepad({ data }: Props) {
  const state = useOsStore();
  const [text, setText] = useState('');
  const [filename, setFilename] = useState('Без названия.txt');
  const [saved, setSaved] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [font, setFont] = useState('Golos Text');
  const [wordWrap, setWordWrap] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const fileId = useRef<string | null>(null);

  useEffect(() => {
    if (data?.fileId) {
      const file = osStore.findFileById(data.fileId);
      if (file) {
        setText(file.content || '');
        setFilename(file.name);
        fileId.current = file.id;
        setSaved(true);
      }
    } else if (data?.content) {
      setText(data.content);
      if (data.filename) setFilename(data.filename);
    }
  }, [data]);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const lines = text.split('\n').length;
  const readMin = Math.ceil(words / 200);

  const save = () => {
    if (fileId.current) {
      osStore.updateFileContent(fileId.current, text);
    } else {
      const newId = `notepad_${Date.now()}`;
      fileId.current = newId;
      osStore.addFileToFolder('docs', {
        id: newId,
        name: filename,
        type: 'file',
        ext: 'txt',
        content: text,
        createdAt: Date.now(),
        modifiedAt: Date.now(),
        size: text.length,
        parentId: 'docs',
      });
    }
    setSaved(true);
  };

  const saveAs = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full text-white">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/08 flex-shrink-0 flex-wrap">
        <button className="aos-btn text-xs py-1 px-3" onClick={save} title="Ctrl+S">💾 Сохранить</button>
        <button className="aos-btn text-xs py-1 px-3" onClick={saveAs}>⬇️ Скачать</button>
        <div className="w-px h-5 bg-white/15" />
        <label className="text-xs text-white/50">Шрифт:</label>
        <select
          className="text-xs rounded-lg px-2 py-1 outline-none"
          style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)' }}
          value={font}
          onChange={e => setFont(e.target.value)}
        >
          {['Golos Text', 'IBM Plex Mono', 'monospace', 'serif'].map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <label className="text-xs text-white/50">Размер:</label>
        <input type="number" min={8} max={40} value={fontSize}
          onChange={e => setFontSize(Number(e.target.value))}
          className="w-14 text-xs rounded-lg px-2 py-1 outline-none text-center"
          style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)' }}
        />
        <label className="flex items-center gap-1 text-xs text-white/60 cursor-pointer">
          <input type="checkbox" checked={wordWrap} onChange={e => setWordWrap(e.target.checked)} />
          Перенос
        </label>
        <label className="flex items-center gap-1 text-xs text-white/60 cursor-pointer">
          <input type="checkbox" checked={showStats} onChange={e => setShowStats(e.target.checked)} />
          Статистика
        </label>
        <div className="flex-1" />
        {!saved && <span className="text-xs text-yellow-400">● Не сохранено</span>}
      </div>

      {/* Filename */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-white/05">
        <span className="text-xs text-white/40">Файл:</span>
        <input
          value={filename}
          onChange={e => setFilename(e.target.value)}
          className="text-xs text-white/70 bg-transparent outline-none border-none flex-1"
          style={{ userSelect: 'text' }}
        />
      </div>

      {/* Editor */}
      <textarea
        className="flex-1 resize-none outline-none bg-transparent text-white/90 p-4 aos-mono"
        style={{
          fontFamily: font,
          fontSize,
          lineHeight: 1.7,
          whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
          overflowWrap: wordWrap ? 'break-word' : 'normal',
          userSelect: 'text',
          overflowY: 'auto',
        }}
        value={text}
        onChange={e => { setText(e.target.value); setSaved(false); }}
        onKeyDown={e => { if (e.ctrlKey && e.key === 's') { e.preventDefault(); save(); } }}
        placeholder="Начните писать..."
        spellCheck
      />

      {/* Status bar */}
      {showStats && (
        <div className="flex items-center gap-4 px-4 py-2 border-t border-white/06 text-xs text-white/40 flex-shrink-0">
          <span>Строки: <span className="text-white/60">{lines}</span></span>
          <span>Символы: <span className="text-white/60">{chars}</span></span>
          <span>Слова: <span className="text-white/60">{words}</span></span>
          <span>Чтение: <span className="text-white/60">~{readMin} мин</span></span>
        </div>
      )}
    </div>
  );
}
