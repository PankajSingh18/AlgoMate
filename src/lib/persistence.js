import { supabase } from "@/lib/supabase";
import { createLogger } from "./logger.js";

const log = createLogger("persistence");

const STORAGE_KEYS = {
  PRACTICE_PROGRESS: 'algobuddy_practice_progress',
  BOOKMARKS: 'algobuddy_bookmarks',
  PROBLEM_BOOKMARKS: 'algobuddy_problem_bookmarks',
  RECENTLY_VIEWED: 'algobuddy_recently_viewed',
  THEME: 'algobuddy_theme',
};

class PersistenceManager {
  constructor() {
    this.syncQueue = [];
    this.syncInProgress = false;
    this.syncTimer = null;
  }

  async get(key) {
    const storageKey = STORAGE_KEYS[key];
    if (typeof window === "undefined" || !storageKey) return null;

    let local = null;
    try {
      local = localStorage.getItem(storageKey);
    } catch {
      return null;
    }

    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        return null;
      }
    }
    return null;
  }

  set(key, value) {
    const storageKey = STORAGE_KEYS[key];
    if (typeof window === "undefined" || !storageKey) return false;

    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  remove(key) {
    const storageKey = STORAGE_KEYS[key];
    if (typeof window === "undefined" || !storageKey) return false;

    try {
      localStorage.removeItem(storageKey);
      return true;
    } catch {
      return false;
    }
  }

  async loadFromServer(table, userId) {
    if (!userId) return null;
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('user_id', userId);
      if (error) {
        log.error({ table, err: error }, "Failed to load from server.");
        return null;
      }
      return data;
    } catch (e) {
      log.error({ table, err: e }, "Error loading from server.");
      return null;
    }
  }

  async syncToServer(table, data, conflictColumns = ['user_id']) {
    try {
      const { error } = await supabase
        .from(table)
        .upsert(data, { onConflict: conflictColumns });
      if (error) {
        log.error({ table, err: error }, "Failed to sync to server.");
      }
    } catch (e) {
      log.error({ table, err: e }, "Error syncing to server.");
    }
  }

  mergeProgress(local, server, userId) {
    const merged = { ...local };
    if (server) {
      server.forEach((item) => {
        const problemId = item.problem_id;
        const serverStatus = item.status;
        const serverUpdated = item.updated_at ? new Date(item.updated_at).getTime() : 0;
        const localUpdated = local[problemId]?.updatedAt
          ? new Date(local[problemId].updatedAt).getTime()
          : 0;

        if (serverUpdated >= localUpdated) {
          merged[problemId] = { status: serverStatus, updatedAt: item.updated_at };
        }
      });
    }
    return merged;
  }

  mergeBookmarks(localArray, serverArray, idField = 'id') {
    const merged = {};
    localArray.forEach((item) => {
      merged[item[idField]] = item;
    });
    serverArray.forEach((item) => {
      const key = item[idField] || item.problem_id;
      if (key) {
        merged[key] = item;
      }
    });
    return Object.values(merged);
  }
}

export const persistence = new PersistenceManager();
