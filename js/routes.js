// --- Storage Types ---
const STORAGE_TYPES = {
    LOCAL: "Local",
    SESSION: "Session",
    MEMORY: "Memory"
};

// --- Storage Factory ---
function createStorage(type) {
    switch(type) {
        case STORAGE_TYPES.SESSION: return new SessionStorageHandler();
        case STORAGE_TYPES.MEMORY: return new InMemoryStorage();
        case STORAGE_TYPES.LOCAL:
        default: return new LocalStorageHandler();
    }
}

// --- Cache for submissions, filters, sorts ---
const storageDataCache = {
    [STORAGE_TYPES.LOCAL]: { submissions: [], filters: [], sorts: [] },
    [STORAGE_TYPES.SESSION]: { submissions: [], filters: [], sorts: [] },
    [STORAGE_TYPES.MEMORY]: { submissions: [], filters: [], sorts: [] }
};

// --- Load Memory cache from localStorage if exists ---
const memoryCache = JSON.parse(localStorage.getItem("memoryStorageCache") || "{}");
if (memoryCache.submissions) storageDataCache[STORAGE_TYPES.MEMORY] = memoryCache;

// --- Load last selected storage type from localStorage ---
let selectedStorageType = localStorage.getItem("selectedStorageType") || STORAGE_TYPES.LOCAL;

// --- Initialize storage ---
let storage = createStorage(selectedStorageType);
storage.saveSubmissions(storageDataCache[selectedStorageType].submissions);
storage.saveFilters(storageDataCache[selectedStorageType].filters);
storage.saveSorts(storageDataCache[selectedStorageType].sorts);

// --- Update storage label ---
function updateStorageLabel() {
    const label = document.getElementById("currentStorage");
    if (label) label.textContent = selectedStorageType;
}

// --- Save Memory cache to localStorage ---
function saveMemoryCache() {
    if (selectedStorageType === STORAGE_TYPES.MEMORY) {
        localStorage.setItem("memoryStorageCache", JSON.stringify(storageDataCache[STORAGE_TYPES.MEMORY]));
    }
}

// --- Switch storage function ---
function switchStorage() {
    // Save current state to cache
    storageDataCache[selectedStorageType].submissions = storage.getSubmissions();
    storageDataCache[selectedStorageType].filters = storage.getFilters();
    storageDataCache[selectedStorageType].sorts = storage.getSorts();

    saveMemoryCache(); // persist Memory storage

    // Cycle storage type
    if (selectedStorageType === STORAGE_TYPES.LOCAL) selectedStorageType = STORAGE_TYPES.SESSION;
    else if (selectedStorageType === STORAGE_TYPES.SESSION) selectedStorageType = STORAGE_TYPES.MEMORY;
    else selectedStorageType = STORAGE_TYPES.LOCAL;

    localStorage.setItem("selectedStorageType", selectedStorageType);

    // Switch storage handler
    storage = createStorage(selectedStorageType);

    // Reload state from cache
    storage.saveSubmissions(storageDataCache[selectedStorageType].submissions);
    storage.saveFilters(storageDataCache[selectedStorageType].filters);
    storage.saveSorts(storageDataCache[selectedStorageType].sorts);

    updateStorageLabel();

    console.log("Switched storage to:", selectedStorageType);
    console.log("Submissions:", storage.getSubmissions());
}

// --- Determine storage from route folder ---
function router() {
    const path = window.location.pathname; // e.g., "/local/index.html"
    const folder = path.split("/")[1]; // "local"
    const routeStorage = Object.values(STORAGE_TYPES).find(
        t => t.toLowerCase() === folder.toLowerCase()
    );
    if (routeStorage) {
        selectedStorageType = routeStorage;
        localStorage.setItem("selectedStorageType", selectedStorageType);
        storage = createStorage(selectedStorageType);
        storage.saveSubmissions(storageDataCache[selectedStorageType].submissions);
        storage.saveFilters(storageDataCache[selectedStorageType].filters);
        storage.saveSorts(storageDataCache[selectedStorageType].sorts);
    }
    updateStorageLabel();
}

// --- Listen to DOM load ---
window.addEventListener("DOMContentLoaded", () => {
    router();
    const toggleBtn = document.getElementById("toggleStorageBtn");
    if (toggleBtn) toggleBtn.addEventListener("click", switchStorage);
});
