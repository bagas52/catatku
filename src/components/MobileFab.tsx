import React from 'react';
import { Plus } from 'lucide-react';

interface MobileFabProps {
  onClick: () => void;
}

export const MobileFab: React.FC<MobileFabProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="sm:hidden fixed bottom-6 right-6 z-40 bg-accent text-white shadow-lg hover:opacity-90 active:scale-95 transition-all p-3.5 rounded-full flex items-center justify-center border border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
      aria-label="Tambah catatan"
      title="Tambah Catatan"
    >
      <Plus className="w-6 h-6" />
    </button>
  );
};
