import { useState, useRef, useEffect } from 'react';
import { osStore } from '../store';
import { getApp } from '../apps';

type Line = { text: string; type: 'input' | 'output' | 'error' | 'system' };

const FS_TREE: Record<string, string[]> = {
  '/': ['AsanaliOS System', 'Users', 'Program Files', 'Temp'],
  '/AsanaliOS System': ['kernel.sys', 'drivers.sys', 'registry.dat', 'boot.cfg'],
  '/Users': ['Asanali'],
  '/Users/Asanali': ['Documents', 'Downloads', 'Pictures', 'Music', 'Videos'],
  '/Users/Asanali/Documents': ['Привет AsanaliOS.txt'],
  '/Program Files': ['Asanalindex', 'AsanaliOS Paint', 'Notepad'],
};

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { text: 'AsanaliOS Terminal v1.0.0', type: 'system' },
    { text: 'Система AsanaliOS. Введите "help" для справки.', type: 'system' },
    { text: '', type: 'output' },
  ]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState('/Users/Asanali');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [lines]);

  const add = (text: string, type: Line['type'] = 'output') =>
    setLines(l => [...l, { text, type }]);

  const run = (cmd: string) => {
    const parts = cmd.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    setHistory(h => [cmd, ...h].slice(0, 50));
    setHistIdx(-1);
    add(`${cwd}$ ${cmd}`, 'input');

    switch (command) {
      case 'help':
        add('Доступные команды:');
        add('  ls / dir         — список файлов');
        add('  cd <path>        — сменить папку');
        add('  pwd              — текущая папка');
        add('  cat <file>       — показать файл');
        add('  echo <text>      — вывести текст');
        add('  clear            — очистить терминал');
        add('  open <app>       — открыть приложение');
        add('  date             — текущая дата');
        add('  whoami           — текущий пользователь');
        add('  sysinfo          — информация о системе');
        add('  mkdir <name>     — создать папку');
        add('  touch <name>     — создать файл');
        add('  calc <expr>      — калькулятор');
        break;

      case 'ls':
      case 'dir': {
        const children = FS_TREE[cwd] || ['(пусто)'];
        children.forEach(c => add(`  ${c}`));
        break;
      }

      case 'pwd':
        add(cwd);
        break;

      case 'cd': {
        if (!args[0] || args[0] === '~') { setCwd('/Users/Asanali'); break; }
        if (args[0] === '..') {
          const parts2 = cwd.split('/').filter(Boolean);
          parts2.pop();
          setCwd(parts2.length ? '/' + parts2.join('/') : '/');
          break;
        }
        const target = args[0].startsWith('/') ? args[0] : `${cwd}/${args[0]}`;
        if (FS_TREE[target] !== undefined) { setCwd(target); }
        else { add(`cd: нет такой папки: ${args[0]}`, 'error'); }
        break;
      }

      case 'cat': {
        if (!args[0]) { add('Укажите файл', 'error'); break; }
        const name = args[0];
        const currentFiles = FS_TREE[cwd] || [];
        if (currentFiles.includes(name)) {
          if (name.endsWith('.txt')) add('Добро пожаловать в AsanaliOS!\n\nЭта система создана для тебя. Наслаждайся!');
          else if (name.endsWith('.cfg')) add('boot_delay=0\ntheme=dark');
          else if (name.endsWith('.sys')) add('[BINARY DATA — Cannot display]');
          else add(`Содержимое файла: ${name}`);
        } else { add(`cat: ${name}: Нет такого файла`, 'error'); }
        break;
      }

      case 'echo':
        add(args.join(' '));
        break;

      case 'clear':
        setLines([{ text: 'AsanaliOS Terminal v1.0.0 (очищено)', type: 'system' }]);
        return;

      case 'date':
        add(new Date().toLocaleString('ru'));
        break;

      case 'whoami':
        add('asanali (Администратор)');
        break;

      case 'sysinfo':
        add('AsanaliOS v1.0.0');
        add(`Ядра: ${navigator.hardwareConcurrency || 8}`);
        add(`Платформа: ${navigator.platform}`);
        add(`Браузер: ${navigator.userAgent.split('(')[0].trim()}`);
        add('ОЗУ: 16 ГБ DDR5');
        break;

      case 'mkdir':
        if (args[0]) { add(`Создана папка: ${args[0]}`); }
        else { add('mkdir: укажите имя папки', 'error'); }
        break;

      case 'touch':
        if (args[0]) { add(`Создан файл: ${args[0]}`); }
        else { add('touch: укажите имя файла', 'error'); }
        break;

      case 'calc': {
        if (!args[0]) { add('Укажите выражение', 'error'); break; }
        try {
          const expr = args.join(' ').replace(/[^0-9+\-*/().\s]/g, '');
           
          const result = new Function(`return ${expr}`)();
          add(`= ${result}`);
        } catch { add('Ошибка в выражении', 'error'); }
        break;
      }

      case 'open': {
        const appId = args[0];
        if (!appId) { add('Укажите приложение', 'error'); break; }
        const app = getApp(appId);
        if (app) { osStore.openWindow(app); add(`Открываю ${app.title}...`); }
        else { add(`open: приложение не найдено: ${appId}`, 'error'); }
        break;
      }

      case '':
        break;

      default:
        add(`Команда не найдена: ${command}. Введите "help".`, 'error');
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { run(input); setInput(''); }
    else if (e.key === 'ArrowUp') {
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx);
      setInput(history[idx] || '');
    } else if (e.key === 'ArrowDown') {
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? '' : history[idx]);
    }
  };

  const COLORS = { input: '#7dd3fc', output: '#e2e8f0', error: '#f87171', system: '#a78bfa' };

  return (
    <div
      className="flex flex-col h-full p-4 overflow-auto cursor-text"
      style={{ background: '#060a12', fontFamily: 'IBM Plex Mono, monospace', fontSize: 13 }}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1">
        {lines.map((l, i) => (
          <div key={i} className="leading-6 whitespace-pre-wrap" style={{ color: COLORS[l.type] }}>
            {l.text}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span style={{ color: '#a78bfa' }}>{cwd}$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
          className="flex-1 bg-transparent outline-none text-cyan-300"
          style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, userSelect: 'text' }}
          autoFocus
          spellCheck={false}
        />
      </div>
      <div ref={endRef} />
    </div>
  );
}
