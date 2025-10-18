/**
 * LocalDB - Browser-based localStorage management for swipe records
 * JavaScript version (compatible with vanilla JS / browser environments)
 * 
 * This module provides a clean interface for storing and retrieving
 * user swipe actions locally. Designed to be easily migrated to 
 * backend storage (e.g., Supabase) in the future.
 */

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
 * @returns {Array} Array of all swipe records
 */
function getRecords() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
}

/**
 * Save records to localStorage
 * @param {Array} records - Array of swipe records to save
 */
function saveRecords(records) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    if (error.name === 'QuotaExceededError') {
      console.warn('LocalStorage quota exceeded. Consider clearing old data.');
    }
  }
}

// ============================================
// Public API Functions
// ============================================

/**
 * Record a swipe action
 * @param {string} user_id - Unique identifier for the user
 * @param {string} image_id - Unique identifier for the image
 * @param {boolean} liked - True if liked, false if disliked
 * @returns {Object} The created swipe record
 */
function recordSwipe(user_id, image_id, liked) {
  const record = {
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
 * @returns {Array} Array of all swipe records
 */
function getAllSwipes() {
  return getRecords();
}

/**
 * Get all swipe records for a specific user
 * @param {string} user_id - User identifier
 * @returns {Array} Array of swipe records for the user
 */
function getUserSwipes(user_id) {
  const records = getRecords();
  return records.filter(record => record.user_id === user_id);
}

/**
 * Get statistics for a user's swipes
 * @param {string} user_id - User identifier
 * @returns {Object} Statistics object with counts and percentages
 */
function getStats(user_id) {
  const userSwipes = getUserSwipes(user_id);
  const total = userSwipes.length;
  const liked = userSwipes.filter(r => r.liked).length;
  const disliked = total - liked;
  const likeRate = total > 0 ? (liked / total) * 100 : 0;

  return {
    total,
    liked,
    disliked,
    likeRate: Math.round(likeRate * 100) / 100,
  };
}

/**
 * Export all data as JSON
 * @returns {Object} Export data object with metadata
 */
function exportData() {
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
 * @param {string} filename - Optional filename
 */
function exportToFile(filename) {
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
 * @param {Object} data - Export data object
 * @param {boolean} merge - If true, merge with existing data
 */
function importData(data, merge = true) {
  try {
    if (merge) {
      const existing = getRecords();
      const combined = [...existing, ...data.records];
      // Remove duplicates
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
 * @param {string} user_id - Optional: clear only specific user's records
 */
function clearRecords(user_id) {
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
 * @param {string} user_id - User identifier
 * @param {string} image_id - Image identifier
 * @returns {Object|null} The existing record if found, null otherwise
 */
function hasSwipedImage(user_id, image_id) {
  const records = getUserSwipes(user_id);
  return records.find(r => r.image_id === image_id) || null;
}

/**
 * Get images that haven't been swiped yet by a user
 * @param {string} user_id - User identifier
 * @param {Array} allImageIds - Array of all available image IDs
 * @returns {Array} Array of image IDs not yet swiped
 */
function getUnswipedImages(user_id, allImageIds) {
  const swipedIds = new Set(getUserSwipes(user_id).map(r => r.image_id));
  return allImageIds.filter(id => !swipedIds.has(id));
}

/**
 * Get progress for a user
 * @param {string} user_id - User identifier
 * @param {number} totalImages - Total number of images available
 * @returns {Object} Progress object
 */
function getProgress(user_id, totalImages) {
  const swiped = getUserSwipes(user_id).length;
  const percentage = totalImages > 0 ? (swiped / totalImages) * 100 : 0;
  return {
    swiped,
    total: totalImages,
    percentage: Math.round(percentage * 100) / 100,
  };
}

/**
 * Get storage size in bytes
 * @returns {number} Approximate size in bytes
 */
function getStorageSize() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? new Blob([data]).size : 0;
}

/**
 * Format storage size for display
 * @returns {string} Human-readable storage size
 */
function getStorageSizeFormatted() {
  const bytes = getStorageSize();
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Print summary to console
 */
function printSummary() {
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

// ============================================
// Export for different module systems
// ============================================

// For ES6 modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
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
    getStorageSize,
    getStorageSizeFormatted,
    printSummary,
  };
}

// For browser global scope
if (typeof window !== 'undefined') {
  window.LocalDB = {
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
    getStorageSize,
    getStorageSizeFormatted,
    printSummary,
  };
}

