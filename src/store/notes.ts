
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import {create} from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Note } from "../types/index";
import { nowIso } from "../utils/date";

type NotesState = {
  notes: Note[];
  addNote: (note: Omit<Note, "createdAt" | "updatedAt">) => void; // omit means not inculded
  updateNote: (note: Partial<Note> & { id: string }) => void; // Partail means all the Notes feilds become optional
  deleteNote: (id: string) => void;
  getNoteById: (id: string) => Note | undefined;
  clearAll: () => void;
};

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],

      addNote: (note) => {
        const timestamp = nowIso();
        const newNote: Note = {
          ...note,
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        set((s) => ({ notes: [newNote, ...s.notes] }));
      },

      updateNote: (partial) => {
        set((s) => ({
          notes: s.notes.map((n) =>
            n.id === partial.id ? { ...n, ...partial, updatedAt: nowIso() } : n
          ),
        }));
      },

      deleteNote: async (id) => {
        const note = get().notes.find((n) => n.id === id);
        if (note?.imageUri) {
          try {
            // ensure file exists before deleting (no crash)
            const info = await FileSystem.getInfoAsync(note.imageUri);
            if (info.exists) {
              await FileSystem.deleteAsync(note.imageUri, { idempotent: true });
            }
          } catch (e) {
            // ignore filesystem errors but log in dev
            console.warn("deleteNote: failed to remove image", e);
          }
        }
        set((s) => ({ notes: s.notes.filter((n) => n.id !== id) }));
      },

      getNoteById: (id) => {
        return get().notes.find((n) => n.id === id);
      },

      clearAll: () => {
        // Danger: removes all notes (keeps images untouched)
        set({ notes: [] });
      },
    }),
    {
      name: "notes-notes-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
