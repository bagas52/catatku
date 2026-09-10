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
  notifyFlags?: {          // Status push notification per tahap
    day?: boolean;         // Sudah kirim "1 hari lagi"
    hour?: boolean;        // Sudah kirim "1 jam lagi"
    thirtyMin?: boolean;   // Sudah kirim "30 menit lagi"
  };
}
