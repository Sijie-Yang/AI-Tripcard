/**
 * Example usage of localdb.ts
 * 
 * This file demonstrates how to use the LocalDB module
 * for recording and managing swipe actions.
 */

import {
  recordSwipe,
  getAllSwipes,
  getUserSwipes,
  getStats,
  exportData,
  exportToFile,
  clearRecords,
  hasSwipedImage,
  getUnswipedImages,
  getProgress,
  printSummary,
} from './localdb';

// ============================================
// Example 1: Basic Usage
// ============================================

console.log('=== Example 1: Basic Swipe Recording ===\n');

// Generate a user ID (in real app, this might come from auth system)
const userId = 'user_' + Math.random().toString(36).substr(2, 9);
console.log(`User ID: ${userId}\n`);

// Record some swipes
console.log('Recording swipes...');
recordSwipe(userId, 'poi_001', true);   // Liked Marina Bay Sands
recordSwipe(userId, 'poi_002', false);  // Disliked Gardens by the Bay
recordSwipe(userId, 'poi_003', true);   // Liked Sentosa
recordSwipe(userId, 'poi_004', true);   // Liked Merlion
recordSwipe(userId, 'poi_005', false);  // Disliked Singapore Zoo

console.log('\n--- User Statistics ---');
const stats = getStats(userId);
console.log(`Total swipes: ${stats.total}`);
console.log(`Liked: ${stats.liked}`);
console.log(`Disliked: ${stats.disliked}`);
console.log(`Like rate: ${stats.likeRate}%`);

// ============================================
// Example 2: Check if Already Swiped
// ============================================

console.log('\n\n=== Example 2: Check Existing Swipes ===\n');

const imageToCheck = 'poi_001';
const existingSwipe = hasSwipedImage(userId, imageToCheck);

if (existingSwipe) {
  console.log(`✅ User has already swiped on ${imageToCheck}`);
  console.log(`   Liked: ${existingSwipe.liked}`);
  console.log(`   Time: ${new Date(existingSwipe.timestamp).toLocaleString()}`);
} else {
  console.log(`❌ User has not swiped on ${imageToCheck} yet`);
}

// ============================================
// Example 3: Track Progress
// ============================================

console.log('\n\n=== Example 3: Progress Tracking ===\n');

const totalImages = 60;
const progress = getProgress(userId, totalImages);

console.log(`Progress: ${progress.swiped} / ${progress.total} (${progress.percentage}%)`);

// Get unswiped images
const allImageIds = Array.from({ length: 60 }, (_, i) => 
  `poi_${String(i + 1).padStart(3, '0')}`
);
const unswiped = getUnswipedImages(userId, allImageIds);
console.log(`\nRemaining images: ${unswiped.length}`);
console.log(`Next image to show: ${unswiped[0] || 'None'}`);

// ============================================
// Example 4: Multiple Users
// ============================================

console.log('\n\n=== Example 4: Multiple Users ===\n');

// Simulate another user
const userId2 = 'user_' + Math.random().toString(36).substr(2, 9);
recordSwipe(userId2, 'poi_001', false);
recordSwipe(userId2, 'poi_002', true);
recordSwipe(userId2, 'poi_003', true);

console.log('User 1 stats:', getStats(userId));
console.log('User 2 stats:', getStats(userId2));

// Get all records
const allRecords = getAllSwipes();
console.log(`\nTotal records in database: ${allRecords.length}`);

// ============================================
// Example 5: Data Export
// ============================================

console.log('\n\n=== Example 5: Data Export ===\n');

const exportedData = exportData();
console.log('Export summary:');
console.log(`  Version: ${exportedData.version}`);
console.log(`  Exported at: ${new Date(exportedData.exportedAt).toLocaleString()}`);
console.log(`  Record count: ${exportedData.recordCount}`);
console.log('\nFirst record:', exportedData.records[0]);

// To export as a file (uncomment in browser environment):
// exportToFile();

// ============================================
// Example 6: Print Full Summary
// ============================================

console.log('\n\n=== Example 6: Full Summary ===\n');
printSummary();

// ============================================
// Example 7: Real-world Integration Pattern
// ============================================

console.log('\n\n=== Example 7: Real-world Integration ===\n');

/**
 * Example function that might be called when user swipes a card
 */
function handleCardSwipe(userId: string, imageId: string, liked: boolean): void {
  // Record the swipe
  const record = recordSwipe(userId, imageId, liked);
  
  // Update UI with progress
  const progress = getProgress(userId, 60);
  console.log(`Card swiped! Progress: ${progress.percentage}%`);
  
  // Check if user completed all images
  if (progress.swiped === progress.total) {
    console.log('🎉 All images completed!');
    const finalStats = getStats(userId);
    console.log(`Final results: ${finalStats.liked} liked, ${finalStats.disliked} disliked`);
    
    // Optionally export or sync to backend
    console.log('Exporting results...');
    const data = exportData();
    // In real app: syncToBackend(supabaseClient, userId);
  }
}

// Simulate swiping
console.log('Simulating card swipe...');
handleCardSwipe(userId, 'poi_006', true);

// ============================================
// Example 8: Data Management
// ============================================

console.log('\n\n=== Example 8: Data Management ===\n');

// Check storage size
import { getStorageSizeFormatted } from './localdb';
console.log(`Current storage size: ${getStorageSizeFormatted()}`);

// Clear specific user data
// clearRecords(userId2);
// console.log(`Cleared data for ${userId2}`);

// Clear all data (use with caution!)
// clearRecords();
// console.log('All data cleared');

// ============================================
// Example 9: Advanced Query
// ============================================

console.log('\n\n=== Example 9: Advanced Queries ===\n');

// Get all liked images for a user
const userSwipes = getUserSwipes(userId);
const likedImages = userSwipes.filter(r => r.liked).map(r => r.image_id);
console.log(`Liked images: ${likedImages.join(', ')}`);

// Get recent swipes (last 3)
const recentSwipes = userSwipes
  .sort((a, b) => b.timestamp - a.timestamp)
  .slice(0, 3);
console.log('\nRecent swipes:');
recentSwipes.forEach(swipe => {
  console.log(`  ${swipe.image_id}: ${swipe.liked ? '👍' : '👎'} at ${new Date(swipe.timestamp).toLocaleTimeString()}`);
});

// ============================================
// Example 10: React/Vue Integration Pattern
// ============================================

console.log('\n\n=== Example 10: Framework Integration Pattern ===\n');

/**
 * Example React hook pattern
 */
/*
function useSwipeTracker(userId: string, totalImages: number) {
  const [stats, setStats] = useState<SwipeStats | null>(null);
  const [progress, setProgress] = useState<any>(null);
  
  useEffect(() => {
    // Load initial data
    setStats(getStats(userId));
    setProgress(getProgress(userId, totalImages));
  }, [userId, totalImages]);
  
  const handleSwipe = useCallback((imageId: string, liked: boolean) => {
    recordSwipe(userId, imageId, liked);
    setStats(getStats(userId));
    setProgress(getProgress(userId, totalImages));
  }, [userId, totalImages]);
  
  return { stats, progress, handleSwipe };
}
*/

/**
 * Example Vue composition API pattern
 */
/*
function useSwipeTracker(userId: string, totalImages: number) {
  const stats = ref<SwipeStats | null>(null);
  const progress = ref<any>(null);
  
  const loadData = () => {
    stats.value = getStats(userId);
    progress.value = getProgress(userId, totalImages);
  };
  
  const handleSwipe = (imageId: string, liked: boolean) => {
    recordSwipe(userId, imageId, liked);
    loadData();
  };
  
  onMounted(loadData);
  
  return { stats, progress, handleSwipe };
}
*/

console.log('Framework integration patterns defined (commented out)');

console.log('\n✅ All examples completed!\n');

