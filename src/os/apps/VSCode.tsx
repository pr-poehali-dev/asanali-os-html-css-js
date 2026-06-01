import { useState } from 'react';

type Tab = { id: string; name: string; content: string; lang: string };

const SAMPLE_FILES: Tab[] = [
  { id: '1', name: 'main.py', lang: 'python', content: `# AsanaliOS Main Script
import os
import sys

def main():
    print("Добро пожаловать в AsanaliOS!")
    system_info = {
        "version": "1.0.0",
        "arch": "x64",
        "kernel": "AsanaliOS Kernel"
    }
    for key, val in system_info.items():
        print(f"  {key}: {val}")

if __name__ == "__main__":
    main()
` },
  { id: '2', name: 'index.tsx', lang: 'typescript', content: `import React from 'react';
import { osStore } from './store';

interface Props {
  title: string;
  children: React.ReactNode;
}

const Window: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="aos-window">
      <div className="aos-titlebar">
        <span>{title}</span>
      </div>
      <div className="window-content">
        {children}
      </div>
    </div>
  );
};

export default Window;
` },
  { id: '3', name: 'styles.css', lang: 'css', content: `.aos-window {
  background: rgba(18, 22, 36, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 14px;
  backdrop-filter: blur(40px);
  display: flex;
  flex-direction: column;
}

.aos-titlebar {
  height: 42px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
` },
];

const KEYWORDS: Record<string, string[]> = {
  python: ['def', 'class', 'import', 'from', 'return', 'if', 'else', 'elif', 'for', 'while', 'in', 'print', 'True', 'False', 'None'],
  typescript: ['import', 'export', 'const', 'let', 'var', 'function', 'return', 'interface', 'type', 'class', 'extends', 'React', 'default'],
  css: [],
};

function highlight(code: string, lang: string): string {
  const kws = KEYWORDS[lang] || [];
  let result = code
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Strings
  result = result.replace(/(["'`])(.*?)\1/g, '<span style="color:#a3e635">$1$2$1</span>');
  // Comments
  result = result.replace(/(#.*$)/gm, '<span style="color:#6b7280">$1</span>');
  result = result.replace(/(\/\/.*$)/gm, '<span style="color:#6b7280">$1</span>');
  // Numbers
  result = result.replace(/\b(\d+)\b/g, '<span style="color:#fb923c">$1</span>');
  // Keywords
  kws.forEach(kw => {
    result = result.replace(new RegExp(`\\b(${kw})\\b`, 'g'), '<span style="color:#60a5fa">$1</span>');
  });
  return result;
}

export default function VSCode({ data }: { data?: { isVS?: boolean } }) {
  const [tabs, setTabs] = useState<Tab[]>(SAMPLE_FILES);
  const [activeTab, setActiveTab] = useState('1');
  const [editing, setEditing] = useState(false);
  const [terminal, setTerminal] = useState(false);
  const [termOutput, setTermOutput] = useState(['$ AsanaliOS Terminal v1.0', '$ Готов к работе.']);
  const [termInput, setTermInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const current = tabs.find(t => t.id === activeTab);

  const runTermCmd = () => {
    const cmd = termInput.trim();
    if (!cmd) return;
    const output = `$ ${cmd}`;
    let result = '';
    if (cmd === 'ls' || cmd === 'dir') result = 'main.py  index.tsx  styles.css';
    else if (cmd.startsWith('echo ')) result = cmd.slice(5);
    else if (cmd === 'clear') { setTermOutput([]); setTermInput(''); return; }
    else if (cmd === 'python main.py') result = 'Добро пожаловать в AsanaliOS!\n  version: 1.0.0\n  arch: x64\n  kernel: AsanaliOS Kernel';
    else result = `Команда не найдена: ${cmd}`;
    setTermOutput(prev => [...prev, output, result]);
    setTermInput('');
  };

  const addTab = () => {
    const id = Date.now().toString();
    const newTab: Tab = { id, name: 'untitled.txt', content: '', lang: 'typescript' };
    setTabs(prev => [...prev, newTab]);
    setActiveTab(id);
  };

  const closeTab = (id: string) => {
    setTabs(prev => prev.filter(t => t.id !== id));
    if (activeTab === id) setActiveTab(tabs[0]?.id || '');
  };

  const updateContent = (val: string) => {
    setTabs(prev => prev.map(t => t.id === activeTab ? { ...t, content: val } : t));
  };

  const lines = current?.content.split('\n').length || 0;

  return (
    <div className="flex flex-col h-full text-white text-sm" style={{ background: '#1e1e2e', fontFamily: 'IBM Plex Mono, monospace' }}>
      {/* Title bar */}
      <div className="flex items-center px-3 py-1 border-b border-white/08 flex-shrink-0" style={{ background: '#161622', fontSize: 12 }}>
        <span className="text-white/40 mr-3">{data?.isVS ? 'Visual Studio' : 'Visual Studio Code'}</span>
        {['Файл','Правка','Вид','Запуск','Терминал','Справка'].map(m => (
          <button key={m} className="px-2 py-0.5 hover:bg-white/08 rounded text-white/60 hover:text-white/90 transition-colors">{m}</button>
        ))}
        <div className="flex-1" />
        <button onClick={() => setTerminal(t => !t)}
          className={`px-2 py-0.5 rounded text-xs transition-all ${terminal ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/70'}`}>
          Терминал
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-44 border-r border-white/08 flex flex-col" style={{ background: '#161622' }}>
            <div className="text-xs text-white/30 px-3 py-2 uppercase tracking-wide font-semibold">Проводник</div>
            {tabs.map(t => (
              <div key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer text-xs transition-all ${activeTab === t.id ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/05'}`}>
                <span>{t.lang === 'python' ? '🐍' : t.lang === 'css' ? '🎨' : '📜'}</span>
                <span className="truncate flex-1">{t.name}</span>
              </div>
            ))}
            <button onClick={addTab} className="flex items-center gap-2 px-3 py-1.5 text-xs text-white/30 hover:text-white/60 transition-colors mt-1">
              + Новый файл
            </button>
          </div>
        )}

        {/* Editor area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center border-b border-white/08 overflow-x-auto flex-shrink-0" style={{ background: '#1a1a2e' }}>
            <button onClick={() => setSidebarOpen(s => !s)}
              className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-white/70 flex-shrink-0 text-lg">
              {sidebarOpen ? '◂' : '▸'}
            </button>
            {tabs.map(t => (
              <div key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 border-r border-white/08 cursor-pointer text-xs whitespace-nowrap transition-all ${activeTab === t.id ? 'bg-white/08 text-white border-t border-t-blue-400' : 'text-white/40 hover:text-white/70'}`}>
                <span>{t.name}</span>
                <button onClick={e => { e.stopPropagation(); closeTab(t.id); }}
                  className="opacity-40 hover:opacity-100 hover:text-red-400 transition-all ml-1">×</button>
              </div>
            ))}
            <button onClick={addTab} className="px-3 text-white/30 hover:text-white/70 text-lg flex-shrink-0">+</button>
          </div>

          {/* Code editor */}
          <div className="flex-1 flex overflow-hidden">
            {/* Line numbers */}
            <div className="select-none text-right pr-4 pt-3 text-white/20 text-xs overflow-hidden flex-shrink-0"
              style={{ minWidth: 48, fontFamily: 'IBM Plex Mono, monospace', lineHeight: '1.6rem', background: '#1e1e2e' }}>
              {Array.from({ length: lines }, (_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Code area */}
            <div className="flex-1 overflow-auto relative">
              {editing ? (
                <textarea
                  className="absolute inset-0 w-full h-full resize-none bg-transparent text-white/90 p-3 outline-none"
                  style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, lineHeight: '1.6rem', userSelect: 'text' }}
                  value={current?.content || ''}
                  onChange={e => updateContent(e.target.value)}
                  onBlur={() => setEditing(false)}
                  autoFocus
                  spellCheck={false}
                />
              ) : (
                <pre
                  className="p-3 text-xs overflow-visible cursor-text"
                  style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, lineHeight: '1.6rem', tabSize: 2, whiteSpace: 'pre' }}
                  onClick={() => setEditing(true)}
                  dangerouslySetInnerHTML={{ __html: highlight(current?.content || '', current?.lang || 'typescript') }}
                />
              )}
            </div>
          </div>

          {/* Terminal */}
          {terminal && (
            <div className="h-40 border-t border-white/10 flex flex-col flex-shrink-0" style={{ background: '#0d0d1a' }}>
              <div className="flex items-center px-3 py-1 border-b border-white/08 text-xs text-white/40">
                ТЕРМИНАЛ
              </div>
              <div className="flex-1 overflow-y-auto p-3 text-xs text-green-400 font-mono">
                {termOutput.map((line, i) => (
                  <div key={i} className={line.startsWith('$') ? 'text-cyan-400' : 'text-green-400'}>{line}</div>
                ))}
              </div>
              <div className="flex items-center px-3 py-1.5 border-t border-white/06">
                <span className="text-cyan-400 text-xs mr-2">$</span>
                <input
                  value={termInput}
                  onChange={e => setTermInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') runTermCmd(); }}
                  className="flex-1 bg-transparent outline-none text-xs text-green-400 font-mono"
                  style={{ userSelect: 'text' }}
                  placeholder="Введите команду..."
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center px-3 py-0.5 text-xs flex-shrink-0" style={{ background: 'var(--aos-accent)' }}>
        <span className="text-white/80 mr-3">🌿 main</span>
        <span className="text-white/70">Строка {lines}</span>
        <div className="flex-1" />
        <span className="text-white/70">{current?.lang || 'txt'}</span>
        <span className="ml-3 text-white/60">UTF-8</span>
      </div>
    </div>
  );
}
