// Clear all EcoVision AI cached data from browser

// Run this in browser console (F12 > Console tab)
// Or paste into frontend to auto-clear on startup

// Clear localStorage
localStorage.clear();

// Clear sessionStorage  
sessionStorage.clear();

// Clear IndexedDB (if any)
const dbs = await indexedDB.databases();
dbs.forEach(db => indexedDB.deleteDatabase(db.name));

// Clear service worker cache
if ('caches' in window) {
    const cacheNames = await caches.keys();
    cacheNames.forEach(name => caches.delete(name));
}

// Optional: Close & reopen browser
location.reload();

console.log("✅ All cached data cleared! Page will reload fresh.");
