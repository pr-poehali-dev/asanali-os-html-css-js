import { WindowState } from './store';
import Calculator from './apps/Calculator';
import Notepad from './apps/Notepad';
import Paint from './apps/Paint';
import Browser from './apps/Browser';
import Explorer from './apps/Explorer';
import Settings from './apps/Settings';
import MediaPlayer from './apps/MediaPlayer';
import Photos from './apps/Photos';
import VSCode from './apps/VSCode';
import Terminal from './apps/Terminal';
import Clock from './apps/Clock';
import AsanaliStore from './apps/Store';

export default function AppRenderer({ win }: { win: WindowState }) {
  const props = { data: win.data };

  switch (win.appId) {
    case 'calculator':  return <Calculator />;
    case 'notepad':     return <Notepad {...props} />;
    case 'paint':       return <Paint />;
    case 'browser':     return <Browser />;
    case 'explorer':    return <Explorer {...props} />;
    case 'settings':    return <Settings {...props} />;
    case 'mediaplayer': return <MediaPlayer {...props} />;
    case 'photos':      return <Photos {...props} />;
    case 'vscode':      return <VSCode data={{ isVS: false }} />;
    case 'vs':          return <VSCode data={{ isVS: true }} />;
    case 'terminal':    return <Terminal />;
    case 'clock':       return <Clock />;
    case 'store':       return <AsanaliStore />;
    case 'recycle':     return (
      <div className="flex flex-col items-center justify-center h-full text-white gap-4">
        <span className="text-8xl">🗑️</span>
        <h2 className="text-xl font-semibold">Корзина</h2>
        <p className="text-white/40 text-sm">Корзина пуста</p>
        <button className="aos-btn text-sm" onClick={() => {}}>Очистить корзину</button>
      </div>
    );
    default: return (
      <div className="flex flex-col items-center justify-center h-full text-white gap-4">
        <span className="text-7xl">{win.icon}</span>
        <h2 className="text-xl font-semibold">{win.title}</h2>
        <p className="text-white/40 text-sm">Приложение запущено</p>
      </div>
    );
  }
}
