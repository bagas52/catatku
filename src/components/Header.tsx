import React from 'react';
import { Sun, Moon, Plus, Download, BellRing, Settings } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenCreate: () => void;
  onOpenBackup: () => void;
  onTestSound: () => void;
  isTestingSound: boolean;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onToggleTheme,
  onOpenCreate,
  onOpenBackup,
  onTestSound,
  isTestingSound,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-sm border-b border-muted/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo / Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 flex items-center justify-center shrink-0">
            <img
              src="/logo.svg"
              alt="Logo CatatKu"
              className="w-8 h-8"
              draggable={false}
            />
          </div>
          <div className="min-w-0">
            <h1 className="font-heading font-bold text-lg text-ink leading-none tracking-tight truncate">
              CatatKu
            </h1>
            <p className="text-[12px] text-muted font-normal leading-tight mt-0.5 truncate">
              Notebook Kuliah
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Audio Test */}
          <button
            type="button"
            onClick={onTestSound}
            title={isTestingSound ? 'Hentikan uji alarm' : 'Uji bunyi alarm'}
            className="p-2 rounded text-muted hover:text-ink hover:bg-muted/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            aria-label="Uji suara"
          >
            <BellRing className={`w-4 h-4 ${isTestingSound ? 'animate-bounce text-ink' : ''}`} />
          </button>

          {/* Backup */}
          <button
            type="button"
            onClick={onOpenBackup}
            title="Cadangkan data catatan"
            className="p-2 rounded text-muted hover:text-ink hover:bg-muted/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            aria-label="Cadangkan data"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Alarm Settings */}
          <button
            type="button"
            onClick={onOpenSettings}
            title="Pengaturan bunyi alarm"
            className="p-2 rounded text-muted hover:text-ink hover:bg-muted/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            aria-label="Pengaturan bunyi alarm"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            title={isDark ? 'Mode terang' : 'Mode gelap'}
            className="p-2 rounded text-muted hover:text-ink hover:bg-muted/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            aria-label="Ganti tema"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Desktop "+ Tambah Catatan" Button */}
          <button
            type="button"
            onClick={onOpenCreate}
            className="hidden sm:inline-flex items-center gap-1.5 bg-accent text-white hover:opacity-90 px-3.5 py-1.5 rounded font-heading font-semibold text-xs sm:text-sm tracking-tight transition-opacity ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Catatan</span>
          </button>
        </div>
      </div>
    </header>
  );
};
