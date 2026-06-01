import { useState } from 'react';

const BTN_ROWS = [
  ['C', '±', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['0',     '.', '='],
];

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev]       = useState('');
  const [op, setOp]           = useState('');
  const [reset, setReset]     = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const calc = (a: number, b: number, operator: string): number => {
    switch (operator) {
      case '+': return a + b;
      case '−': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const fmt = (n: number) => {
    const s = parseFloat(n.toPrecision(12)).toString();
    return s.length > 14 ? n.toExponential(4) : s;
  };

  const press = (val: string) => {
    if (val === 'C') {
      setDisplay('0'); setPrev(''); setOp(''); setReset(false);
    } else if (val === '±') {
      setDisplay(d => d.startsWith('-') ? d.slice(1) : '-' + d);
    } else if (val === '%') {
      setDisplay(d => fmt(parseFloat(d) / 100));
    } else if (['+', '−', '×', '÷'].includes(val)) {
      if (op && !reset) {
        const res = calc(parseFloat(prev), parseFloat(display), op);
        setPrev(fmt(res));
        setDisplay(fmt(res));
      } else {
        setPrev(display);
      }
      setOp(val);
      setReset(true);
    } else if (val === '=') {
      if (!op) return;
      const res = calc(parseFloat(prev), parseFloat(display), op);
      const entry = `${prev} ${op} ${display} = ${fmt(res)}`;
      setHistory(h => [entry, ...h].slice(0, 20));
      setDisplay(fmt(res));
      setPrev('');
      setOp('');
      setReset(true);
    } else {
      if (val === '.' && display.includes('.')) return;
      if (reset) {
        setDisplay(val === '.' ? '0.' : val);
        setReset(false);
      } else {
        setDisplay(d => d === '0' && val !== '.' ? val : d.length < 12 ? d + val : d);
      }
    }
  };

  const getStyle = (v: string): React.CSSProperties => {
    if (v === '=')  return { background: 'var(--aos-accent)', color: '#fff', gridColumn: 'span 1' };
    if (v === '0')  return { background: 'rgba(255,255,255,0.10)', color: '#fff', gridColumn: 'span 2' };
    if (['+','−','×','÷'].includes(v)) return { background: 'rgba(255,165,0,0.4)', color: '#ffa500' };
    if (['C','±','%'].includes(v))      return { background: 'rgba(255,255,255,0.16)', color: '#fff' };
    return { background: 'rgba(255,255,255,0.08)', color: '#fff' };
  };

  return (
    <div className="flex h-full bg-transparent text-white">
      {/* Calc */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Display */}
        <div className="flex flex-col items-end justify-end px-4 py-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', minHeight: 100 }}>
          <div className="text-white/40 text-sm h-5">{prev} {op}</div>
          <div className="text-5xl font-light tracking-tight truncate max-w-full"
            style={{ fontSize: display.length > 8 ? 32 : display.length > 6 ? 42 : 52 }}>
            {display}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {BTN_ROWS.flat().map((v, i) => (
            <button
              key={`${v}-${i}`}
              className="calc-btn"
              style={{ height: 64, ...getStyle(v) }}
              onClick={() => press(v)}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="w-44 border-l border-white/08 p-3 flex flex-col gap-1 overflow-y-auto">
        <div className="text-xs text-white/40 mb-2 font-medium">История</div>
        {history.length === 0 && <div className="text-xs text-white/20 text-center mt-4">Пусто</div>}
        {history.map((h, i) => (
          <div key={i} className="text-xs text-white/60 py-1 border-b border-white/05 font-mono">{h}</div>
        ))}
      </div>
    </div>
  );
}
