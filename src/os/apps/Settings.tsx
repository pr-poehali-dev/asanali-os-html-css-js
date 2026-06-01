import { useState } from 'react';
import { useOsStore } from '../useOsStore';
import { Tab, TABS } from './SettingsShared';
import SettingsPanelSystem from './SettingsPanelSystem';
import SettingsPanelPersonalization from './SettingsPanelPersonalization';

const SYSTEM_TABS: Tab[] = ['system', 'display', 'storage', 'activation', 'update', 'apps'];
const PERSONALIZATION_TABS: Tab[] = ['personalization', 'accounts', 'network', 'bluetooth', 'time', 'privacy', 'accessibility'];

export default function Settings({ data }: { data?: { tab?: Tab } }) {
  useOsStore();
  const [tab, setTab] = useState<Tab>(data?.tab || 'system');

  return (
    <div className="flex h-full text-white">
      {/* Sidebar */}
      <div
        className="w-56 border-r border-white/08 p-3 flex flex-col gap-0.5 overflow-y-auto flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        <div className="px-3 py-2 text-xs font-semibold text-white/30 uppercase tracking-wide">
          Параметры
        </div>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`settings-nav-item ${tab === t.id ? 'active' : ''}`}
          >
            <span className="text-lg">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {SYSTEM_TABS.includes(tab) && (
          <SettingsPanelSystem tab={tab} />
        )}
        {PERSONALIZATION_TABS.includes(tab) && (
          <SettingsPanelPersonalization tab={tab} />
        )}
      </div>
    </div>
  );
}