import { useState, useRef } from 'react';
import { useOsStore } from '../useOsStore';
import { osStore, FileItem } from '../store';

type SortKey = 'name' | 'date' | 'size' | 'type';
type SortDir = 'asc' | 'desc';
type ViewMode = 'list' | 'grid';
type CtxItem = { x: number; y: number; item?: FileItem; isDir: boolean };

function getIcon(item: FileItem): string {
  if (item.icon) return item.icon;
  if (item.type === 'folder') return '📁';
  if (item.type === 'shortcut') return '🔗';
  const ext = (item.ext || '').toLowerCase();
  if (['txt', 'md', 'log'].includes(ext)) return '📝';
  if (['png','jpg','jpeg','svg','webp','gif'].includes(ext)) return '🖼️';
  if (['mp3','wav','ogg','flac'].includes(ext)) return '🎵';
  if (['mp4','webm','avi','mov'].includes(ext)) return '🎬';
  if (['pdf'].includes(ext)) return '📕';
  if (['sys','dat','cfg'].includes(ext)) return '⚙️';
  if (['js','ts','tsx','jsx','py','cpp','c','cs'].includes(ext)) return '📜';
  return '📄';
}

function formatSize(size?: number): string {
  if (!size) return '—';
  if (size < 1024) return `${size} Б`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} КБ`;
  return `${(size / 1024 / 1024).toFixed(1)} МБ`;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('ru', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function Explorer({ data }: { data?: { path?: string[] } }) {
  const state = useOsStore();
  const { fileSystem } = state;
  const [path, setPath] = useState<string[]>(['root']);
  const [selected, setSelected] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [ctxMenu, setCtxMenu] = useState<CtxItem | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameVal, setRenameVal] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const findNode = (id: string, nodes: FileItem[]): FileItem | null => {
    for (const n of nodes) {
      if (n.id === id) return n;
      if (n.children) { const f = findNode(id, n.children); if (f) return f; }
    }
    return null;
  };

  const currentNode = findNode(path[path.length - 1], fileSystem);
  const items = currentNode?.children || fileSystem;

  const sorted = [...items].sort((a, b) => {
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;
    let cmp = 0;
    if (sortKey === 'name') cmp = a.name.localeCompare(b.name, 'ru');
    else if (sortKey === 'date') cmp = a.modifiedAt - b.modifiedAt;
    else if (sortKey === 'size') cmp = (a.size || 0) - (b.size || 0);
    else if (sortKey === 'type') cmp = (a.ext || '').localeCompare(b.ext || '');
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const navigate = (item: FileItem) => {
    if (item.type === 'folder') {
      setPath([...path, item.id]);
      setSelected(null);
    } else {
      const ext = (item.ext || '').toLowerCase();
      if (['txt','md','log','cfg','sys','dat'].includes(ext)) {
        osStore.openWindow({ id: 'notepad', title: item.name, icon: '📝', defaultWidth: 700, defaultHeight: 520, data: { fileId: item.id } });
      } else if (['png','jpg','jpeg','svg','webp','gif'].includes(ext)) {
        osStore.openWindow({ id: 'photos', title: item.name, icon: '🖼️', defaultWidth: 820, defaultHeight: 560, data: { fileId: item.id } });
      } else if (['mp3','wav','ogg','flac','mp4','webm'].includes(ext)) {
        osStore.openWindow({ id: 'mediaplayer', title: item.name, icon: '🎵', defaultWidth: 780, defaultHeight: 520, data: { fileId: item.id } });
      }
    }
  };

  const goUp = () => { if (path.length > 1) setPath(path.slice(0, -1)); };

  const breadcrumbs = path.map(id => findNode(id, fileSystem)?.name || id);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const onCtx = (e: React.MouseEvent, item?: FileItem) => {
    e.preventDefault();
    e.stopPropagation();
    setCtxMenu({ x: e.clientX, y: e.clientY, item, isDir: item?.type === 'folder' });
  };

  const createFolder = () => {
    const id = `folder_${Date.now()}`;
    osStore.addFileToFolder(path[path.length - 1], {
      id, name: 'Новая папка', type: 'folder',
      createdAt: Date.now(), modifiedAt: Date.now(), children: [],
      parentId: path[path.length - 1],
    });
    setCtxMenu(null);
  };

  const createFile = () => {
    const id = `file_${Date.now()}`;
    osStore.addFileToFolder(path[path.length - 1], {
      id, name: 'Новый файл.txt', type: 'file', ext: 'txt',
      content: '', size: 0,
      createdAt: Date.now(), modifiedAt: Date.now(),
      parentId: path[path.length - 1],
    });
    setCtxMenu(null);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(f => {
      const reader = new FileReader();
      const ext = f.name.split('.').pop() || '';
      const isText = ['txt','md','csv','json','js','ts','py','html','css','log','cfg'].includes(ext.toLowerCase());
      if (isText) {
        reader.onload = ev => {
          const id = `upload_${Date.now()}_${Math.random().toString(36).slice(2)}`;
          osStore.addFileToFolder(path[path.length - 1], {
            id, name: f.name, type: 'file', ext,
            content: ev.target?.result as string,
            size: f.size, createdAt: Date.now(), modifiedAt: Date.now(),
            parentId: path[path.length - 1],
          });
        };
        reader.readAsText(f);
      } else {
        reader.onload = ev => {
          const id = `upload_${Date.now()}_${Math.random().toString(36).slice(2)}`;
          osStore.addFileToFolder(path[path.length - 1], {
            id, name: f.name, type: 'file', ext,
            blobUrl: ev.target?.result as string,
            mimeType: f.type,
            size: f.size, createdAt: Date.now(), modifiedAt: Date.now(),
            parentId: path[path.length - 1],
          });
        };
        reader.readAsDataURL(f);
      }
    });
    setShowUpload(false);
  };

  const startRename = (item: FileItem) => {
    setRenaming(item.id);
    setRenameVal(item.name);
    setCtxMenu(null);
  };

  const confirmRename = (id: string) => {
    if (renameVal.trim()) osStore.renameFile(id, renameVal.trim());
    setRenaming(null);
  };

  const deleteItem = (id: string) => { osStore.deleteFile(id); setCtxMenu(null); };

  const SIDEBAR_SHORTCUTS = [
    { id: 'root', label: 'AsanaliOS (C:)', icon: '💾' },
    { id: 'docs', label: 'Документы', icon: '📄' },
    { id: 'downloads', label: 'Загрузки', icon: '⬇️' },
    { id: 'pictures', label: 'Изображения', icon: '🖼️' },
    { id: 'music', label: 'Музыка', icon: '🎵' },
    { id: 'videos', label: 'Видео', icon: '🎬' },
  ];

  return (
    <div className="flex h-full text-white" onContextMenu={e => onCtx(e)}>
      {/* Sidebar */}
      <div className="w-44 flex flex-col border-r border-white/08 p-2 gap-0.5 flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="text-xs text-white/30 px-2 py-1 uppercase font-semibold tracking-wide">Быстрый доступ</div>
        {SIDEBAR_SHORTCUTS.map(s => (
          <button key={s.id} onClick={() => setPath([s.id])}
            className={`explorer-item ${path[path.length-1] === s.id ? 'selected' : ''}`}>
            <span>{s.icon}</span>
            <span className="truncate text-xs">{s.label}</span>
          </button>
        ))}
        <div className="flex-1" />
        <button className="explorer-item text-xs" onClick={() => fileInputRef.current?.click()}>
          <span>⬆️</span><span>Залить файл</span>
        </button>
        <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleUpload} />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/08 flex-shrink-0">
          <button onClick={goUp} disabled={path.length <= 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-sm disabled:opacity-30 transition-all">⬆</button>
          <div className="flex items-center gap-1 text-xs text-white/60">
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <span className="text-white/30">›</span>}
                <button onClick={() => setPath(path.slice(0, i + 1))}
                  className="hover:text-white transition-colors truncate max-w-[120px]">{b}</button>
              </span>
            ))}
          </div>
          <div className="flex-1" />
          <button onClick={createFolder} className="aos-btn text-xs py-1 px-2">📁 Папка</button>
          <button onClick={createFile} className="aos-btn text-xs py-1 px-2">📄 Файл</button>
          <div className="flex rounded-lg overflow-hidden border border-white/12">
            <button onClick={() => setViewMode('list')}
              className={`w-8 h-7 flex items-center justify-center text-sm transition-all ${viewMode === 'list' ? 'bg-white/15' : 'hover:bg-white/08'}`}>☰</button>
            <button onClick={() => setViewMode('grid')}
              className={`w-8 h-7 flex items-center justify-center text-sm transition-all ${viewMode === 'grid' ? 'bg-white/15' : 'hover:bg-white/08'}`}>⊞</button>
          </div>
        </div>

        {/* Sort header (list only) */}
        {viewMode === 'list' && (
          <div className="flex items-center px-3 py-1.5 border-b border-white/06 text-xs text-white/40 flex-shrink-0">
            <span className="w-8" />
            {[
              { key: 'name' as SortKey, label: 'Имя', w: 'flex-1' },
              { key: 'date' as SortKey, label: 'Дата', w: 'w-28' },
              { key: 'type' as SortKey, label: 'Тип', w: 'w-16' },
              { key: 'size' as SortKey, label: 'Размер', w: 'w-20' },
            ].map(col => (
              <button key={col.key} onClick={() => toggleSort(col.key)}
                className={`${col.w} flex items-center gap-1 hover:text-white/70 transition-colors text-left`}>
                {col.label}
                {sortKey === col.key && <span>{sortDir === 'asc' ? '↑' : '↓'}</span>}
              </button>
            ))}
          </div>
        )}

        {/* Files */}
        <div className="flex-1 overflow-y-auto p-2" onContextMenu={e => { e.preventDefault(); onCtx(e); }}>
          {sorted.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-white/25 text-sm gap-2">
              <span className="text-5xl">📂</span>
              <span>Папка пуста</span>
            </div>
          )}

          {viewMode === 'list' ? (
            sorted.map(item => (
              <div key={item.id}
                className={`explorer-item ${selected === item.id ? 'selected' : ''}`}
                onClick={() => setSelected(item.id)}
                onDoubleClick={() => navigate(item)}
                onContextMenu={e => onCtx(e, item)}
              >
                <span className="text-xl w-8 text-center flex-shrink-0">{getIcon(item)}</span>
                {renaming === item.id ? (
                  <input autoFocus value={renameVal} onChange={e => setRenameVal(e.target.value)}
                    onBlur={() => confirmRename(item.id)}
                    onKeyDown={e => { if (e.key === 'Enter') confirmRename(item.id); if (e.key === 'Escape') setRenaming(null); }}
                    className="flex-1 bg-transparent border-none outline-none text-white text-sm"
                    style={{ userSelect: 'text' }} onClick={e => e.stopPropagation()} />
                ) : (
                  <span className="flex-1 text-sm truncate">{item.name}</span>
                )}
                <span className="w-28 text-xs text-white/40 flex-shrink-0">{formatDate(item.modifiedAt)}</span>
                <span className="w-16 text-xs text-white/40 flex-shrink-0">{item.ext?.toUpperCase() || (item.type === 'folder' ? 'Папка' : '—')}</span>
                <span className="w-20 text-xs text-white/40 flex-shrink-0 text-right">{item.type === 'folder' ? `${item.children?.length || 0} элем.` : formatSize(item.size)}</span>
              </div>
            ))
          ) : (
            <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))' }}>
              {sorted.map(item => (
                <div key={item.id}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl cursor-pointer transition-all ${selected === item.id ? 'bg-white/15' : 'hover:bg-white/08'}`}
                  onClick={() => setSelected(item.id)}
                  onDoubleClick={() => navigate(item)}
                  onContextMenu={e => onCtx(e, item)}
                >
                  <span className="text-4xl">{getIcon(item)}</span>
                  <span className="text-xs text-white/80 text-center leading-tight max-w-full truncate w-full text-center">{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status */}
        <div className="px-3 py-1.5 border-t border-white/06 text-xs text-white/30 flex-shrink-0">
          {sorted.length} объектов{selected ? ` · Выбран: ${sorted.find(s => s.id === selected)?.name}` : ''}
        </div>
      </div>

      {/* Context menu */}
      {ctxMenu && (
        <div className="aos-context-menu" style={{ position: 'fixed', left: ctxMenu.x, top: ctxMenu.y, zIndex: 9999 }}
          onClick={e => e.stopPropagation()}>
          {ctxMenu.item ? (
            <>
              <div className="ctx-item" onClick={() => { if (ctxMenu.item) navigate(ctxMenu.item); setCtxMenu(null); }}>▶️ Открыть</div>
              <div className="ctx-separator" />
              {[
                { key: 'name' as SortKey, label: '🔤 По имени' },
                { key: 'date' as SortKey, label: '📅 По дате' },
                { key: 'size' as SortKey, label: '📦 По размеру' },
              ].map(s => (
                <div key={s.key} className="ctx-item" onClick={() => { toggleSort(s.key); setCtxMenu(null); }}>{s.label}</div>
              ))}
              <div className="ctx-separator" />
              <div className="ctx-item" onClick={() => ctxMenu.item && startRename(ctxMenu.item)}>✏️ Переименовать</div>
              <div className="ctx-item danger" onClick={() => ctxMenu.item && deleteItem(ctxMenu.item.id)}>🗑️ Удалить</div>
            </>
          ) : (
            <>
              <div className="ctx-item" onClick={createFolder}>📁 Новая папка</div>
              <div className="ctx-item" onClick={createFile}>📄 Новый файл</div>
              <div className="ctx-separator" />
              {[
                { key: 'name' as SortKey, label: '🔤 По имени' },
                { key: 'date' as SortKey, label: '📅 По дате' },
                { key: 'size' as SortKey, label: '📦 По размеру' },
                { key: 'type' as SortKey, label: '📎 По типу' },
              ].map(s => (
                <div key={s.key} className="ctx-item" onClick={() => { toggleSort(s.key); setCtxMenu(null); }}>{s.label}</div>
              ))}
              <div className="ctx-separator" />
              <div className="ctx-item" onClick={() => { setSortDir(d => d === 'asc' ? 'desc' : 'asc'); setCtxMenu(null); }}>
                {sortDir === 'asc' ? '↓ По убыванию' : '↑ По возрастанию'}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
