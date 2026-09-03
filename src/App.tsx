import React, { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { useNotes } from './hooks/useNotes';
import { useAlarm } from './hooks/useAlarm';
import { useAlarmSettings } from './hooks/useAlarmSettings';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CategoryFilter } from './components/CategoryFilter';
import { NoteList } from './components/NoteList';
import { NoteFormModal } from './components/NoteFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { AlarmModal } from './components/AlarmModal';
import { BackupModal } from './components/BackupModal';
import { AlarmSettingsModal } from './components/AlarmSettingsModal';
import { MobileFab } from './components/MobileFab';
import { Note } from './types/note';

export const App: React.FC = () => {
  // Theme hook
  const { isDark, toggleTheme } = useTheme();

  // Notes state & operations hook
  const {
    notes,
    pinnedNotes,
    regularNotes,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    categoryCounts,
    addNote,
    updateNote,
    deleteNote,
    toggleStar,
    toggleComplete,
    markNotesNotified,
    resetDefaults,
    setNotes,
  } = useNotes();

  // Alarm settings state (customizable alarm sound)
  const {
    settings: alarmSettings,
    setSettings: setAlarmSettings,
    mp3BlobUrl,
    isAudioReady,
    uploadAudio,
    removeAudio,
  } = useAlarmSettings();

  // Alarm & Sound hook
  const {
    isAlarmActive,
    activeAlarmNotes,
    dismissAlarm,
    testSound,
    isTestingSound,
  } = useAlarm(notes, markNotesNotified, {
    settings: alarmSettings,
    mp3BlobUrl,
    isAudioReady,
  });

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deletingNote, setDeletingNote] = useState<Note | null>(null);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isAlarmSettingsOpen, setIsAlarmSettingsOpen] = useState(false);

  const handleOpenCreate = () => {
    setEditingNote(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (note: Note) => {
    setEditingNote(note);
    setIsFormOpen(true);
  };

  const handleSaveNote = (data: Partial<Note>) => {
    if (editingNote) {
      updateNote(editingNote.id, data);
    } else {
      addNote(data);
    }
    setEditingNote(null);
  };

  const handleConfirmDelete = () => {
    if (deletingNote) {
      deleteNote(deletingNote.id);
      setDeletingNote(null);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col selection:bg-accent/20">
      {/* Header with Branding, Theme Toggle & Desktop Add */}
      <Header
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenCreate={handleOpenCreate}
        onOpenBackup={() => setIsBackupOpen(true)}
        onTestSound={testSound}
        isTestingSound={isTestingSound}
        onOpenSettings={() => setIsAlarmSettingsOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-12 text-left">
        {/* Full-width Search Bar */}
        <div className="mb-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Underline Category Filter Tabs: [Kuliah | Tugas | Pribadi | Semua] */}
        <div className="mb-5">
          <CategoryFilter
            active={activeCategory}
            onSelect={setActiveCategory}
            counts={categoryCounts}
          />
        </div>

        {/* Note List with Starred on Top, 3px Left-Border Accents, and Actionable Empty State */}
        <NoteList
          pinnedNotes={pinnedNotes}
          regularNotes={regularNotes}
          searchQuery={searchQuery}
          onEdit={handleOpenEdit}
          onDelete={setDeletingNote}
          onToggleStar={toggleStar}
          onToggleComplete={toggleComplete}
          onOpenCreate={handleOpenCreate}
        />
      </main>

      {/* Mobile Floating Action Button */}
      <MobileFab onClick={handleOpenCreate} />

      {/* Add / Edit Form Modal */}
      <NoteFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingNote(null);
        }}
        onSave={handleSaveNote}
        editingNote={editingNote}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deletingNote !== null}
        note={deletingNote}
        onClose={() => setDeletingNote(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Deadline Alarm Modal */}
      <AlarmModal
        isOpen={isAlarmActive}
        notes={activeAlarmNotes}
        onDismiss={dismissAlarm}
        onComplete={(id) => {
          toggleComplete(id);
          dismissAlarm();
        }}
      />

      {/* Backup / Export / Import Modal */}
      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        notes={notes}
        onImport={(imported) => {
          setNotes(imported);
        }}
        onReset={resetDefaults}
      />

      {/* Alarm Settings Modal */}
      <AlarmSettingsModal
        isOpen={isAlarmSettingsOpen}
        onClose={() => setIsAlarmSettingsOpen(false)}
        settings={alarmSettings}
        setSettings={setAlarmSettings}
        uploadAudio={uploadAudio}
        removeAudio={removeAudio}
        onTestSound={testSound}
        isTestingSound={isTestingSound}
      />
    </div>
  );
};

export default App;
