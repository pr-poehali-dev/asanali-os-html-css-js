import { useEffect, useState } from 'react';
import { osStore, OsState } from './store';

export function useOsStore(): OsState {
  const [state, setState] = useState(osStore.getState());
  useEffect(() => {
    return osStore.subscribe(() => setState(osStore.getState()));
  }, []);
  return state;
}
