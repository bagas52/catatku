import React, { useRef, useState } from 'react';
import { X, Download, Upload, RotateCcw } from 'lucide-react';
import { Note } from '../types/note';
import { exportNotesToJson, importNotesFromJson } from '../utils/storage';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  onImport: (notes: Note[]) => void;
  onReset: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  notes,
  onImport,
  onReset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    exportNotesToJson(notes);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const parsed = importNotesFromJson(text);
        onImport(parsed);
        setMsg(`Berhasil memulihkan ${parsed.length} catatan.`);
        setTimeout(() => {
          onClose();
        }, 1200);
      } catch {
        setMsg('Gagal membaca file backup JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs text-left">
      <div
        className="bg-surface w-full max-w-sm rounded-lg shadow-xl border border-muted/20 p-5 text-left"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-muted/15 pb-2.5 mb-3">
          <h3 className="font-heading font-semibold text-base text-ink">
            Cadangkan Catatan
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-muted hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {msg && (
          <div className="p-2 mb-3 text-xs rounded bg-muted/10 text-ink">
            {msg}
          </div>
        )}

        <div className="space-y-2.5 text-xs sm:text-sm">
          {/* Ekspor */}
          <div className="p-2.5 bg-bg/50 rounded border border-muted/20 flex items-center justify-between gap-2">
            <div>
              <p className="font-medium text-ink">Ekspor Data</p>
              <p className="text-xs text-muted">Simpan file JSON backup</p>
            </div>
            <button
              type="button"
              onClick={handleExport}
              className="px-3 py-1.5 bg-surface border border-muted/25 hover:border-accent text-ink rounded text-xs flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor</span>
            </button>
          </div>

          {/* Impor */}
          <div className="p-2.5 bg-bg/50 rounded border border-muted/20 flex items-center justify-between gap-2">
            <div>
              <p className="font-medium text-ink">Impor Data</p>
              <p className="text-xs text-muted">Pulihkan dari file JSON</p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-surface border border-muted/25 hover:border-accent text-ink rounded text-xs flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Pilih File</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFile}
              accept=".json,application/json"
              className="hidden"
            />
          </div>

          {/* Reset */}
          <div className="p-2.5 bg-bg/50 rounded border border-muted/20 flex items-center justify-between gap-2">
            <div>
              <p className="font-medium text-ink">Muat Contoh</p>
              <p className="text-xs text-muted">Muat kembali catatan contoh mahasiswa</p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Muat ulang catatan contoh? Catatan saat ini akan diganti.')) {
                  onReset();
                  onClose();
                }
              }}
              className="px-3 py-1.5 bg-surface border border-muted/25 text-muted hover:text-ink rounded text-xs flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-3 mt-2 border-t border-muted/15">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1 text-xs text-muted hover:text-ink rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
