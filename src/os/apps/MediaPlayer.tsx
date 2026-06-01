import { useState, useRef, useEffect } from 'react';

export default function MediaPlayer({ data }: { data?: { fileId?: string } }) {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'audio' | 'video' | 'image' | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [filename, setFilename] = useState('');
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const open = (file: File) => {
    const url = URL.createObjectURL(file);
    setMediaUrl(url);
    setFilename(file.name);
    const type = file.type.startsWith('video') ? 'video' : file.type.startsWith('audio') ? 'audio' : 'image';
    setMediaType(type);
    setPlaying(false);
    setCurrentTime(0);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) open(f);
  };

  const togglePlay = () => {
    const el = mediaRef.current;
    if (!el) return;
    if (playing) { el.pause(); setPlaying(false); }
    else { el.play(); setPlaying(true); }
  };

  const seek = (v: number) => {
    const el = mediaRef.current;
    if (!el) return;
    el.currentTime = v;
    setCurrentTime(v);
  };

  const changeVolume = (v: number) => {
    setVolume(v);
    const el = mediaRef.current;
    if (el) el.volume = v;
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  const mediaProps = {
    style: { display: 'none' },
    src: mediaUrl || '',
    volume,
    muted,
    onTimeUpdate: (e: React.SyntheticEvent<HTMLVideoElement | HTMLAudioElement>) => setCurrentTime(e.currentTarget.currentTime),
    onLoadedMetadata: (e: React.SyntheticEvent<HTMLVideoElement | HTMLAudioElement>) => setDuration(e.currentTarget.duration),
    onEnded: () => setPlaying(false),
    ref: mediaRef as React.Ref<HTMLVideoElement>,
  };

  return (
    <div className="flex flex-col h-full text-white" style={{ background: 'rgba(5,8,18,0.95)' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/08 flex-shrink-0">
        <button className="aos-btn text-xs py-1 px-3" onClick={() => fileInputRef.current?.click()}>📂 Открыть</button>
        <input ref={fileInputRef} type="file" accept="video/*,audio/*,image/*" className="hidden" onChange={onFileChange} />
        {filename && <span className="text-xs text-white/50 truncate flex-1 ml-2">{filename}</span>}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center overflow-hidden p-4">
        {!mediaUrl ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="text-8xl opacity-30">🎬</div>
            <div className="text-white/40 text-sm">Откройте медиафайл</div>
            <div className="text-white/25 text-xs">MP4, MP3, WAV, WebM, OGG, PNG, JPG, WebP...</div>
            <button className="aos-btn aos-btn-accent mt-2" onClick={() => fileInputRef.current?.click()}>
              Открыть файл
            </button>
          </div>
        ) : mediaType === 'image' ? (
          <img src={mediaUrl} alt={filename} className="max-w-full max-h-full object-contain rounded-lg" />
        ) : mediaType === 'video' ? (
          <div className="w-full h-full flex items-center justify-center">
            <video
              src={mediaUrl}
              ref={el => { mediaRef.current = el; }}
              className="max-w-full max-h-full rounded-xl"
              style={{ maxHeight: 'calc(100% - 8px)' }}
              onTimeUpdate={e => setCurrentTime(e.currentTarget.currentTime)}
              onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
              onEnded={() => setPlaying(false)}
              muted={muted}
              onClick={togglePlay}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="w-40 h-40 rounded-3xl flex items-center justify-center text-7xl"
              style={{ background: 'rgba(var(--aos-accent-rgb),0.15)', border: '2px solid rgba(var(--aos-accent-rgb),0.3)' }}>
              🎵
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-white">{filename}</div>
              <div className="text-sm text-white/40 mt-1">Аудио</div>
            </div>
            <audio
              src={mediaUrl}
              ref={el => { mediaRef.current = el; }}
              onTimeUpdate={e => setCurrentTime(e.currentTarget.currentTime)}
              onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
              onEnded={() => setPlaying(false)}
              muted={muted}
            />
          </div>
        )}
      </div>

      {/* Controls */}
      {mediaUrl && mediaType !== 'image' && (
        <div className="flex-shrink-0 px-4 pb-4 pt-2 border-t border-white/08">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-white/40 aos-mono w-10">{fmt(currentTime)}</span>
            <input type="range" min={0} max={duration || 100} value={currentTime}
              onChange={e => seek(+e.target.value)} className="flex-1" style={{ accentColor: 'var(--aos-accent)' }} />
            <span className="text-xs text-white/40 aos-mono w-10 text-right">{fmt(duration)}</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => seek(Math.max(0, currentTime - 10))}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-white/70 transition-all">⏮</button>
            <button onClick={togglePlay}
              className="w-14 h-14 flex items-center justify-center rounded-full text-2xl transition-all hover:scale-105"
              style={{ background: 'var(--aos-accent)' }}>
              {playing ? '⏸' : '▶️'}
            </button>
            <button onClick={() => seek(Math.min(duration, currentTime + 10))}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-white/70 transition-all">⏭</button>
            <div className="flex items-center gap-2 ml-4">
              <button onClick={() => setMuted(m => !m)} className="text-lg">{muted ? '🔇' : '🔊'}</button>
              <input type="range" min={0} max={1} step={0.01} value={muted ? 0 : volume}
                onChange={e => changeVolume(+e.target.value)} className="w-20" style={{ accentColor: 'var(--aos-accent)' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
