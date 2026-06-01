import { useState } from 'react';
import { osStore } from '../store';
import { getApp } from '../apps';

const STORE_APPS = [
  { id: 'browser',     name: 'Asanalindex',    cat: 'Интернет', price: 'Бесплатно', rating: 4.8, reviews: 12400, icon: '🌐', desc: 'Мощный браузер на базе Яндекс' },
  { id: 'notepad',     name: 'Блокнот Pro',    cat: 'Продуктивность', price: 'Бесплатно', rating: 4.6, reviews: 8200, icon: '📝', desc: 'Умный блокнот с подсчётом слов' },
  { id: 'paint',       name: 'AsanaliPaint',   cat: 'Творчество', price: 'Бесплатно', rating: 4.9, reviews: 5600, icon: '🎨', desc: 'Полнофункциональный графический редактор' },
  { id: 'calculator',  name: 'Калькулятор',    cat: 'Инструменты', price: 'Бесплатно', rating: 4.7, reviews: 21000, icon: '🧮', desc: 'Научный калькулятор с историей' },
  { id: 'vscode',      name: 'VS Code',         cat: 'Разработка', price: 'Бесплатно', rating: 5.0, reviews: 98000, icon: '💙', desc: 'Лучший редактор кода' },
  { id: 'mediaplayer', name: 'Медиаплеер',     cat: 'Медиа', price: 'Бесплатно', rating: 4.5, reviews: 3400, icon: '🎵', desc: 'Проигрывание видео и аудио' },
  { id: 'photos',      name: 'Фотографии',     cat: 'Медиа', price: 'Бесплатно', rating: 4.4, reviews: 2800, icon: '🖼️', desc: 'Просмотр и редактирование фото' },
  { id: 'terminal',    name: 'Терминал',        cat: 'Системные', price: 'Бесплатно', rating: 4.9, reviews: 7600, icon: '🖥️', desc: 'Мощный терминал командной строки' },
  { id: 'clock',       name: 'Часы & Таймер',  cat: 'Инструменты', price: 'Бесплатно', rating: 4.6, reviews: 4100, icon: '⏰', desc: 'Часы, секундомер и таймер' },
];

const CATS = ['Все', 'Интернет', 'Продуктивность', 'Творчество', 'Медиа', 'Разработка', 'Инструменты', 'Системные'];

export default function AsanaliStore() {
  const [cat, setCat] = useState('Все');
  const [search, setSearch] = useState('');

  const filtered = STORE_APPS.filter(a =>
    (cat === 'Все' || a.cat === cat) &&
    (a.name.toLowerCase().includes(search.toLowerCase()) || a.desc.toLowerCase().includes(search.toLowerCase()))
  );

  const stars = (r: number) => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));

  return (
    <div className="flex flex-col h-full text-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/08 flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.1), rgba(99,102,241,0.08))' }}>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🛒</span>
          <div>
            <h2 className="text-lg font-semibold">AsanaliStore</h2>
            <p className="text-xs text-white/40">Магазин приложений для AsanaliOS</p>
          </div>
          <div className="flex-1" />
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск..."
              className="pl-9 pr-4 py-2 rounded-xl text-sm text-white outline-none"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
            />
          </div>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-4 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${cat === c ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
              style={{ background: cat === c ? 'var(--aos-accent)' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Apps grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {filtered.map(app => (
            <div key={app.id} className="rounded-2xl p-4 transition-all hover:bg-white/05 cursor-pointer group"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
                  style={{ background: 'rgba(var(--aos-accent-rgb),0.12)', border: '1px solid rgba(var(--aos-accent-rgb),0.2)' }}>
                  {app.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white">{app.name}</div>
                  <div className="text-xs text-white/40">{app.cat}</div>
                  <div className="text-xs text-yellow-400 mt-0.5">{stars(app.rating)} <span className="text-white/30">{app.reviews.toLocaleString('ru')}</span></div>
                </div>
              </div>
              <p className="text-xs text-white/50 mb-4 line-clamp-2">{app.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-400">{app.price}</span>
                <button
                  onClick={() => { const a = getApp(app.id); if (a) osStore.openWindow(a); }}
                  className="aos-btn aos-btn-accent text-xs py-1.5 px-4">
                  Открыть
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
