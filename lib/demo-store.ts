import { useSyncExternalStore } from "react";
import { Inquiry } from "@/config/schema";
import { seedInquiries } from "@/data/seed";

const listeners = new Set<() => void>();

// Cache to prevent infinite loops in useSyncExternalStore
// We cache per niche so switching tabs remains fast
const snapshotCache: Record<string, Inquiry[]> = {};

// Global store for status overrides (in case they move a seed card)
const statusOverrides: Record<string, "new" | "pending" | "confirmed"> = {};

function computeSnapshot(niche: string): Inquiry[] {
  const seed = seedInquiries[niche] || [];
  let local: Inquiry[] = [];
  
  if (typeof window !== "undefined") {
    const localRaw = localStorage.getItem(`demo:inquiries:${niche}`);
    local = localRaw ? JSON.parse(localRaw) : [];
  }

  const all = [...local, ...seed].map(item => ({
    ...item,
    status: statusOverrides[item.id] || item.status
  }));

  // Sort by newest first
  return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function useInquiries(niche: string) {
  return useSyncExternalStore(
    (callback) => {
      listeners.add(callback);
      
      const handleStorage = (e: StorageEvent) => {
        if (e.key === `demo:inquiries:${niche}`) {
          delete snapshotCache[niche];
          callback();
        }
      };
      
      window.addEventListener("storage", handleStorage);
      return () => {
        listeners.delete(callback);
        window.removeEventListener("storage", handleStorage);
      };
    },
    // Client Snapshot
    () => {
      // If the cache is empty, compute it ONCE and store it.
      if (!snapshotCache[niche]) {
        snapshotCache[niche] = computeSnapshot(niche);
      }
      // Return the exact same array reference on subsequent calls
      return snapshotCache[niche];
    },
    // Server Snapshot
    () => seedInquiries[niche] || []
  );
}

export function updateInquiryStatus(niche: string, id: string, newStatus: "new" | "pending" | "confirmed") {
  statusOverrides[id] = newStatus;
  
  if (typeof window !== "undefined") {
    const localRaw = localStorage.getItem(`demo:inquiries:${niche}`);
    if (localRaw) {
      const local = JSON.parse(localRaw);
      const updated = local.map((item: Inquiry) => 
        item.id === id ? { ...item, status: newStatus } : item
      );
      localStorage.setItem(`demo:inquiries:${niche}`, JSON.stringify(updated));
    }
  }
  
  // Clear the cache so the next render generates a fresh snapshot
  delete snapshotCache[niche];
  
  // Notify React to re-render
  listeners.forEach((l) => l());
}