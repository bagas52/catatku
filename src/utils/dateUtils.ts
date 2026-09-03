// Date and deadline formatting utilities

const MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

/**
 * Format tanggal: "2 Sep 23:59" sesuai contoh DESIGN.md
 */
export function formatNoteDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const dateNum = d.getDate();
    const month = MONTHS_ID[d.getMonth()];
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${dateNum} ${month} ${hours}:${mins}`;
  } catch {
    return dateString;
  }
}

export interface DeadlineStatus {
  isUrgent: boolean;    // true jika < 24 jam atau sudah lewat (memakai badge warn)
  isOverdue: boolean;   // true jika waktu sudah lewat
  label: string;        // contoh: "< 24 jam", "Lewat tenggat", "2 hari lagi"
}

/**
 * Memeriksa status tenggat waktu untuk tugas
 */
export function checkDeadlineStatus(deadlineStr?: string, isCompleted?: boolean): DeadlineStatus {
  if (!deadlineStr || isCompleted) {
    return { isUrgent: false, isOverdue: false, label: '' };
  }

  const deadlineMs = new Date(deadlineStr).getTime();
  const nowMs = Date.now();
  const diffMs = deadlineMs - nowMs;

  if (diffMs <= 0) {
    return {
      isUrgent: true,
      isOverdue: true,
      label: 'Lewat tenggat',
    };
  }

  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 24) {
    const hours = Math.floor(diffHours);
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const label = hours === 0 ? `< ${mins} mnt` : `< ${hours + 1} jam`;
    return {
      isUrgent: true,
      isOverdue: false,
      label: label,
    };
  }

  const diffDays = Math.ceil(diffHours / 24);
  return {
    isUrgent: false,
    isOverdue: false,
    label: `${diffDays} hari lagi`,
  };
}
