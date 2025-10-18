/**
 * LocalDB - Browser-based localStorage management for swipe records
 * 
 * This module provides a clean interface for storing and retrieving
 * user swipe actions locally. Designed to be easily migrated to 
 * backend storage (e.g., Supabase) in the future.
 */

// ============================================
// Type Definitions
// ============================================

export interface SwipeRecord {
  user_id: string;
  image_id: string;
  liked: boolean;
  timestamp: number;
}

export interface SwipeStats {
  total: number;
  liked: number;
  disliked: number;
  likeRate: number; // Percentage (0-100)
}

export interface ExportData {
  version: string;
  exportedAt: number;
  recordCount: number;
  records: SwipeRecord[];
}

// ============================================
// Configuration
// ============================================

const STORAGE_KEY = 'swipe_records_v1';
const VERSION = '1.0.0';

// ============================================
// Core Storage Functions
// ============================================

/**
 * Get all records from localStorage
 * @returns Array of all swipe records
 */
function getRecords(): SwipeRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as SwipeRecord[];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
}

/**
 * Save records to localStorage
 * @param records - Array of swipe records to save
 */
function saveRecords(records: SwipeRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    // Handle quota exceeded error
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('LocalStorage quota exceeded. Consider clearing old data.');
    }
  }
}

// ============================================
// Public API Functions
// ============================================

/**
 * Record a swipe action
 * @param user_id - Unique identifier for the user
 * @param image_id - Unique identifier for the image
 * @param liked - True if liked, false if disliked
 * @returns The created swipe record
 */
export function recordSwipe(
  user_id: string,
  image_id: string,
  liked: boolean
): SwipeRecord {
  const record: SwipeRecord = {
    user_id,
    image_id,
    liked,
    timestamp: Date.now(),
  };

  const records = getRecords();
  records.push(record);
  saveRecords(records);

  console.log(`✅ Recorded swipe: ${image_id} (${liked ? 'liked' : 'disliked'})`);
  return record;
}

/**
 * Get all swipe records
 * @returns Array of all swipe records
 */
export function getAllSwipes(): SwipeRecord[] {
  return getRecords();
}

/**
 * Get all swipe records for a specific user
 * @param user_id - User identifier
 * @returns Array of swipe records for the user
 */
export function getUserSwipes(user_id: string): SwipeRecord[] {
  const records = getRecords();
  return records.filter(record => record.user_id === user_id);
}

/**
 * Get statistics for a user's swipes
 * @param user_id - User identifier
 * @returns Statistics object with counts and percentages
 */
export function getStats(user_id: string): SwipeStats {
  const userSwipes = getUserSwipes(user_id);
  const total = userSwipes.length;
  const liked = userSwipes.filter(r => r.liked).length;
  const disliked = total - liked;
  const likeRate = total > 0 ? (liked / total) * 100 : 0;

  return {
    total,
    liked,
    disliked,
    likeRate: Math.round(likeRate * 100) / 100, // Round to 2 decimal places
  };
}

/**
 * Export all data as JSON
 * @returns Export data object with metadata
 */
export function exportData(): ExportData {
  const records = getRecords();
  return {
    version: VERSION,
    exportedAt: Date.now(),
    recordCount: records.length,
    records,
  };
}

/**
 * Export data as downloadable JSON file
 * @param filename - Optional filename (default: swipe_records_[timestamp].json)
 */
export function exportToFile(filename?: string): void {
  const data = exportData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { 
    type: 'application/json' 
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `swipe_records_${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  console.log(`📥 Exported ${data.recordCount} records to ${link.download}`);
}

/**
 * Import data from a previous export
 * @param data - Export data object
 * @param merge - If true, merge with existing data; if false, replace
 */
export function importData(data: ExportData, merge: boolean = true): void {
  try {
    if (merge) {
      const existing = getRecords();
      const combined = [...existing, ...data.records];
      // Remove duplicates based on user_id, image_id, and timestamp
      const unique = Array.from(
        new Map(
          combined.map(r => [`${r.user_id}_${r.image_id}_${r.timestamp}`, r])
        ).values()
      );
      saveRecords(unique);
      console.log(`✅ Imported ${data.records.length} records (merged, ${unique.length} total)`);
    } else {
      saveRecords(data.records);
      console.log(`✅ Imported ${data.records.length} records (replaced)`);
    }
  } catch (error) {
    console.error('Error importing data:', error);
  }
}

/**
 * Clear all swipe records
 * @param user_id - Optional: clear only specific user's records
 */
export function clearRecords(user_id?: string): void {
  if (user_id) {
    const records = getRecords();
    const filtered = records.filter(r => r.user_id !== user_id);
    saveRecords(filtered);
    console.log(`🗑️ Cleared records for user: ${user_id}`);
  } else {
    localStorage.removeItem(STORAGE_KEY);
    console.log('🗑️ Cleared all records');
  }
}

/**
 * Check if a user has already swiped on an image
 * @param user_id - User identifier
 * @param image_id - Image identifier
 * @returns The existing record if found, null otherwise
 */
export function hasSwipedImage(
  user_id: string,
  image_id: string
): SwipeRecord | null {
  const records = getUserSwipes(user_id);
  return records.find(r => r.image_id === image_id) || null;
}

/**
 * Get images that haven't been swiped yet by a user
 * @param user_id - User identifier
 * @param allImageIds - Array of all available image IDs
 * @returns Array of image IDs not yet swiped
 */
export function getUnswipedImages(
  user_id: string,
  allImageIds: string[]
): string[] {
  const swipedIds = new Set(getUserSwipes(user_id).map(r => r.image_id));
  return allImageIds.filter(id => !swipedIds.has(id));
}

/**
 * Get progress for a user
 * @param user_id - User identifier
 * @param totalImages - Total number of images available
 * @returns Progress object with count and percentage
 */
export function getProgress(
  user_id: string,
  totalImages: number
): { swiped: number; total: number; percentage: number } {
  const swiped = getUserSwipes(user_id).length;
  const percentage = totalImages > 0 ? (swiped / totalImages) * 100 : 0;
  return {
    swiped,
    total: totalImages,
    percentage: Math.round(percentage * 100) / 100,
  };
}

// ============================================
// Future Backend Sync (Placeholder)
// ============================================

/**
 * Sync local records to backend (e.g., Supabase)
 * This is a placeholder for future implementation
 */
export async function syncToBackend(
  backendClient: any,
  user_id?: string
): Promise<void> {
  console.log('🔄 Backend sync not yet implemented');
  // Future implementation:
  // 1. Get records to sync (all or user-specific)
  // 2. Upload to backend
  // 3. Mark records as synced (add 'synced' flag to SwipeRecord)
  // 4. Handle conflicts and errors
  throw new Error('Not implemented');
}

/**
 * Pull records from backend and merge with local
 * This is a placeholder for future implementation
 */
export async function syncFromBackend(
  backendClient: any,
  user_id: string
): Promise<void> {
  console.log('🔄 Backend sync not yet implemented');
  // Future implementation:
  // 1. Fetch records from backend
  // 2. Merge with local records
  // 3. Resolve conflicts (timestamp-based or user choice)
  throw new Error('Not implemented');
}

// ============================================
// Utility Functions
// ============================================

/**
 * Get storage size in bytes
 * @returns Approximate size of stored data in bytes
 */
export function getStorageSize(): number {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? new Blob([data]).size : 0;
}

/**
 * Format storage size for display
 * @returns Human-readable storage size (e.g., "2.5 KB")
 */
export function getStorageSizeFormatted(): string {
  const bytes = getStorageSize();
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Print summary to console (for debugging)
 */
export function printSummary(): void {
  const records = getRecords();
  const users = new Set(records.map(r => r.user_id));
  
  console.log('📊 LocalDB Summary');
  console.log('==================');
  console.log(`Storage Key: ${STORAGE_KEY}`);
  console.log(`Version: ${VERSION}`);
  console.log(`Total Records: ${records.length}`);
  console.log(`Unique Users: ${users.size}`);
  console.log(`Storage Size: ${getStorageSizeFormatted()}`);
  console.log('==================');
  
  users.forEach(user_id => {
    const stats = getStats(user_id);
    console.log(`\nUser: ${user_id}`);
    console.log(`  Total: ${stats.total}`);
    console.log(`  Liked: ${stats.liked}`);
    console.log(`  Disliked: ${stats.disliked}`);
    console.log(`  Like Rate: ${stats.likeRate}%`);
  });
}

export default {
  recordSwipe,
  getAllSwipes,
  getUserSwipes,
  getStats,
  exportData,
  exportToFile,
  importData,
  clearRecords,
  hasSwipedImage,
  getUnswipedImages,
  getProgress,
  syncToBackend,
  syncFromBackend,
  getStorageSize,
  getStorageSizeFormatted,
  printSummary,
};

