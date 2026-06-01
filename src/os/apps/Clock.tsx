import { useState, useEffect } from 'react';

export default function Clock() {
  const [now, setNow] = useState(new Date());
  const [mode, setMode] = useState<'clock' | 'stopwatch' | 'timer'>('clock');
  const [swRunning, setSwRunning] = useState(false);
  const [swMs, setSwMs] = useState(0);
  const [swStart, setSwStart] = useState(0);
  const [timerSec, setTimerSec] = useState(60);
  const [timerLeft, setTimerLeft] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  useEffect(() => {
    if (!swRunning) return;
    const t = setInterval(() => setSwMs(Date.now() - swStart), 10);
    return () => clearInterval(t);
  }, [swRunning, swStart]);

  useEffect(() => {
    if (!timerRunning) return;
    const t = setInterval(() => setTimerLeft(l => { if (l <= 1) { setTimerRunning(false); return 0; } return l - 1; }), 1000);
    return () => clearInterval(t);
  }, [timerRunning]);

  const pad = (n: number) => String(Math.floor(n)).padStart(2, '0');
  const ms = String(swMs % 1000).padStart(3, '0').slice(0, 2);

  const H = now.getHours(), M = now.getMinutes(), S = now.getSeconds();
  const secAngle = S * 6 - 90;
  const minAngle = (M + S / 60) * 6 - 90;
  const hourAngle = ((H % 12) + M / 60) * 30 - 90;
  const toXY = (angle: number, r: number) => ({
    x: 100 + r * Math.cos((angle * Math.PI) / 180),
    y: 100 + r * Math.sin((angle * Math.PI) / 180),
  });

  return (
    <div className="flex flex-col h-full text-white p-6" style={{ background: 'rgba(5,8,18,0.95)' }}>
      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit mx-auto" style={{ background: 'rgba(255,255,255,0.06)' }}>
        {[['clock','🕐 Часы'],['stopwatch','⏱ Секундомер'],['timer','⏳ Таймер']].map(([id, label]) => (
          <button key={id} onClick={() => setMode(id as 'clock'|'stopwatch'|'timer')}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${mode === id ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white/80'}`}>
            {label}
          </button>
        ))}
      </div>

      {mode === 'clock' && (
        <div className="flex flex-col items-center gap-6 flex-1 justify-center">
          <svg width={200} height={200} viewBox="0 0 200 200">
            <circle cx={100} cy={100} r={95} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" strokeWidth={2} />
            {Array.from({length:12},(_,i)=>{const a=i*30;const inner=toXY(a-90,78);const outer=toXY(a-90,88);return <line key={i} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="rgba(255,255,255,0.3)" strokeWidth={i%3===0?2:1} />;})}
            {/* Hour hand */}
            <line x1={100} y1={100} x2={toXY(hourAngle,52).x} y2={toXY(hourAngle,52).y} stroke="#fff" strokeWidth={4} strokeLinecap="round" />
            {/* Min hand */}
            <line x1={100} y1={100} x2={toXY(minAngle,70).x} y2={toXY(minAngle,70).y} stroke="#fff" strokeWidth={3} strokeLinecap="round" />
            {/* Sec hand */}
            <line x1={100} y1={100} x2={toXY(secAngle,75).x} y2={toXY(secAngle,75).y} stroke="var(--aos-accent)" strokeWidth={1.5} strokeLinecap="round" />
            <circle cx={100} cy={100} r={5} fill="var(--aos-accent)" />
          </svg>
          <div className="text-5xl font-light aos-mono">
            {pad(H)}:{pad(M)}:{pad(S)}
          </div>
          <div className="text-white/40 text-sm">
            {now.toLocaleDateString('ru', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      )}

      {mode === 'stopwatch' && (
        <div className="flex flex-col items-center gap-8 flex-1 justify-center">
          <div className="text-7xl font-light aos-mono text-center">
            {pad(swMs/60000)}:{pad((swMs%60000)/1000)}<span className="text-3xl text-white/40">.{ms}</span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => { if (swRunning) setSwRunning(false); else { setSwStart(Date.now()-swMs); setSwRunning(true); } }}
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl transition-all hover:scale-105"
              style={{ background: swRunning ? 'rgba(239,68,68,0.3)' : 'var(--aos-accent)' }}>
              {swRunning ? '⏸' : '▶'}
            </button>
            <button onClick={() => { setSwRunning(false); setSwMs(0); }}
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl hover:bg-white/10 transition-all border border-white/15">
              ⏹
            </button>
          </div>
        </div>
      )}

      {mode === 'timer' && (
        <div className="flex flex-col items-center gap-8 flex-1 justify-center">
          <div className="text-7xl font-light aos-mono" style={{ color: timerLeft < 10 && timerLeft > 0 ? '#ef4444' : '#fff' }}>
            {pad(timerLeft/60)}:{pad(timerLeft%60)}
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-white/50">Секунды:</label>
            <input type="number" min={1} max={3600} value={timerSec}
              onChange={e => { setTimerSec(+e.target.value); setTimerLeft(+e.target.value); setTimerRunning(false); }}
              className="w-24 text-center text-lg rounded-xl px-3 py-2 outline-none"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', userSelect: 'text' }} />
          </div>
          <div className="flex gap-4">
            <button onClick={() => setTimerRunning(r => !r)}
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl transition-all hover:scale-105"
              style={{ background: timerRunning ? 'rgba(239,68,68,0.3)' : 'var(--aos-accent)' }}>
              {timerRunning ? '⏸' : '▶'}
            </button>
            <button onClick={() => { setTimerRunning(false); setTimerLeft(timerSec); }}
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl hover:bg-white/10 transition-all border border-white/15">
              ⏹
            </button>
          </div>
          {timerLeft === 0 && <div className="text-red-400 text-lg font-semibold animate-pulse">⏰ Время вышло!</div>}
        </div>
      )}
    </div>
  );
}