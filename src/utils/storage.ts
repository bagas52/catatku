import { Note } from '../types/note';

export const STORAGE_KEY = 'catatku_notes_v1';
export const THEME_KEY = 'catatku_theme_v1';

export function getSampleNotes(): Note[] {
  const now = new Date();
  
  // Deadline tugas urgent: 6 jam lagi (< 24 jam untuk mendemonstrasikan badge warn)
  const urgentDeadline = new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString();
  
  // Deadline tugas mendatang: 3 hari lagi
  const upcomingDeadline = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();

  return [
    {
      id: 'demo-1',
      title: 'Pemrograman Web — RESTful API & HTTP Methods',
      content: 'Materi kuliah hari ini membahas arsitektur client-server, perbedaan method GET, POST, PUT, DELETE, serta HTTP status codes (200, 201, 400, 404, 500). Pekan depan kuis praktikum implementasi Fetch API.',
      category: 'Kuliah',
      isPinned: true,
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'demo-2',
      title: 'Makalah Kecerdasan Buatan: Supervised Learning',
      content: 'Resume bab 3 mengenai algoritma Decision Tree dan Random Forest. Minimal 5 halaman standar IEEE, wajib cantumkan sitasi jurnal internasional bereputasi.',
      category: 'Tugas',
      isPinned: true,
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: urgentDeadline,
      isCompleted: false,
    },
    {
      id: 'demo-3',
      title: 'Agenda Rapat Divisi Kominfo BEM Kampus',
      content: 'Bahas jadwal rilis konten Dies Natalis, pembagian pembuatan feeds Instagram ormawa, dan pengajuan anggaran hosting server portal mahasiswa.',
      category: 'Pribadi',
      isPinned: false,
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'demo-4',
      title: 'Praktikum Jaringan: Subnetting & Static Routing',
      content: 'Selesaikan modul 4 di Cisco Packet Tracer: topologi 3 router, pembagian subnet /24 dan /28, serta tabel routing statis.',
      category: 'Tugas',
      isPinned: false,
      createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: upcomingDeadline,
      isCompleted: false,
    },
  ];
}

export function getStoredNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getSampleNotes();
      saveStoredNotes(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : getSampleNotes();
  } catch (err) {
    console.error('Error reading localStorage:', err);
    return getSampleNotes();
  }
}

export function saveStoredNotes(notes: Note[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
}

export function exportNotesToJson(notes: Note[]): void {
  const jsonStr = JSON.stringify(notes, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateTag = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `catatku-catatan-${dateTag}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importNotesFromJson(text: string): Note[] {
  const data = JSON.parse(text);
  if (!Array.isArray(data)) {
    throw new Error('Format file tidak valid. File harus berupa array catatan.');
  }
  return data.map((item, i) => ({
    id: item.id || `import-${Date.now()}-${i}`,
    title: String(item.title || 'Tanpa Judul'),
    content: String(item.content || ''),
    category: ['Kuliah', 'Tugas', 'Pribadi'].includes(item.category) ? item.category : 'Kuliah',
    isPinned: Boolean(item.isPinned),
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
    deadline: item.deadline ? String(item.deadline) : undefined,
    isCompleted: Boolean(item.isCompleted),
    notified: Boolean(item.notified),
  }));
}
