export type CategoryType = 'Kuliah' | 'Tugas' | 'Pribadi';

export type FilterCategory = 'Kuliah' | 'Tugas' | 'Pribadi' | 'Semua';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: CategoryType;
  isPinned: boolean;       // ⭐ Star catatan penting
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
  deadline?: string;       // ISO timestamp (khusus Tugas)
  isCompleted?: boolean;   // Status selesai tugas
  notified?: boolean;      // Alarm sudah berbunyi
}
