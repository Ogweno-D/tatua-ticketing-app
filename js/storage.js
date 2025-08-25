// Abstract Storage Handler
class StorageHandler {
    getSubmissions() { throw new Error("getSubmissions() not implemented"); }
    saveSubmissions(subs) { throw new Error("saveSubmissions() not implemented"); }

    // --- Filters ---
    getFilters() { throw new Error("getFilters() not implemented"); }
    saveFilters(filters) { throw new Error("saveFilters() not implemented"); }

    // --- Sorts ---
    getSorts() { throw new Error("getSorts() not implemented"); }
    saveSorts(sorts) { throw new Error("saveSorts() not implemented"); }

    // Ids handling
    getNextId(){
        const subs = this.getSubmissions();
        if (subs.length === 0) return 1;
        return  subs[subs.length - 1].id+1;
    }
}

// In-Memory Storage (resets on reload)
class InMemoryStorage extends StorageHandler {
    constructor() {
        super();
        this.submissions = [];
        this.filters = [];
        this.sorts = [];
    }

    // --- Submissions ---
    getSubmissions() {return this.submissions; }
    saveSubmissions(subs) {this.submissions = subs; }

    // --- Filters ---
    getFilters() { return this.filters; }
    saveFilters(filters) { this.filters = filters; }

    // --- Sorts ---
    getSorts() { return this.sorts; }
    saveSorts(sorts) { this.sorts = sorts; }
}


// Session Storage (resets when browser closes)
class SessionStorageHandler extends StorageHandler {
    // --- Submissions ---
    getSubmissions() {
        return JSON.parse(sessionStorage.getItem("submissions")) || [];
    }
    saveSubmissions(subs) {
        sessionStorage.setItem("submissions", JSON.stringify(subs));
    }

    // --- Filters ---
    getFilters() {
        return JSON.parse(sessionStorage.getItem("filters")) || [];
    }
    saveFilters(filters) {
        sessionStorage.setItem("filters", JSON.stringify(filters));
    }

    // --- Sorts ---
    getSorts() {
        return JSON.parse(sessionStorage.getItem("sorts")) || [];
    }
    saveSorts(sorts) {
        sessionStorage.setItem("sorts", JSON.stringify(sorts));
    }
}


// Local Storage (persistent across reloads)
class LocalStorageHandler extends StorageHandler {
    // --- Submissions ---
    getSubmissions() {
        return JSON.parse(localStorage.getItem("submissions")) || [];
    }
    saveSubmissions(subs) {
        localStorage.setItem("submissions", JSON.stringify(subs));
    }

    // --- Filters ---
    getFilters() {
        return JSON.parse(localStorage.getItem("filters")) || [];
    }
    saveFilters(filters) {
        localStorage.setItem("filters", JSON.stringify(filters));
    }

    // --- Sorts ---
    getSorts() {
        return JSON.parse(localStorage.getItem("sorts")) || [];
    }
    saveSorts(sorts) {
        localStorage.setItem("sorts", JSON.stringify(sorts));
    }
}


/// TO toggle the stage types
const STORAGE_TYPES = {
    LOCAL: "Local",
    SESSION: "Session",
    MEMORY: "Memory"
};

// Map storage type to folder
const storageFolderMap = {
    [STORAGE_TYPES.LOCAL]: "local",
    [STORAGE_TYPES.SESSION]: "session",
    [STORAGE_TYPES.MEMORY]: "memory"
};

// --- Create storage handler ---
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
    [STORAGE_TYPES.LOCAL]: {
        submissions: new LocalStorageHandler().getSubmissions(),
        filters: new LocalStorageHandler().getFilters(),
        sorts: new LocalStorageHandler().getSorts()
    },
    [STORAGE_TYPES.SESSION]: {
        submissions: new SessionStorageHandler().getSubmissions(),
        filters: new SessionStorageHandler().getFilters(),
        sorts: new SessionStorageHandler().getSorts()
    },
    [STORAGE_TYPES.MEMORY]: JSON.parse(localStorage.getItem("memoryStorageCache")) || {
        submissions: [],
        filters: [],
        sorts: []
    }
};

// --- Load last selected storage type from localStorage ---
let selectedStorageType = localStorage.getItem("selectedStorageType") || STORAGE_TYPES.LOCAL;
let storage = createStorage(selectedStorageType);

// Reload cached state into storage
storage.saveSubmissions(storageDataCache[selectedStorageType].submissions);
storage.saveFilters(storageDataCache[selectedStorageType].filters);
storage.saveSorts(storageDataCache[selectedStorageType].sorts);

// --- DOM Elements ---
const toggleBtn = document.getElementById("toggleStorageBtn");
const currentLabel = document.getElementById("currentStorage");


currentLabel.textContent = selectedStorageType;


// --- Save memory cache ---
function saveMemoryCache() {
    if (selectedStorageType === STORAGE_TYPES.MEMORY) {
        localStorage.setItem("memoryStorageCache", JSON.stringify(storageDataCache[STORAGE_TYPES.MEMORY]));
    }
}

// --- Toggle storage function ---
toggleBtn.addEventListener("click", () => {
    // Save current state to cache
    storageDataCache[selectedStorageType].submissions = storage.getSubmissions();
    storageDataCache[selectedStorageType].filters = storage.getFilters();
    storageDataCache[selectedStorageType].sorts = storage.getSorts();
    saveMemoryCache();

    // Cycle storage type
    if (selectedStorageType === STORAGE_TYPES.LOCAL) selectedStorageType = STORAGE_TYPES.SESSION;
    else if (selectedStorageType === STORAGE_TYPES.SESSION) selectedStorageType = STORAGE_TYPES.MEMORY;
    else selectedStorageType = STORAGE_TYPES.LOCAL;

    // Save selected storage type to localStorage
    localStorage.setItem("selectedStorageType", selectedStorageType);

    // Switch storage handler
    storage = createStorage(selectedStorageType);

    // Reload state from cache
    storage.saveSubmissions(storageDataCache[selectedStorageType].submissions);
    storage.saveFilters(storageDataCache[selectedStorageType].filters);
    storage.saveSorts(storageDataCache[selectedStorageType].sorts);

    // Update UI label
    currentLabel.textContent = selectedStorageType;

    // Update URL folder without page reload
    // Get selected folder
    const folder = storageFolderMap[selectedStorageType]; // "local", "session", "memory"
    // Build the new URL path
    const newPath = `/tatua-ticketing-app/storage/${folder}/index.html`;
    // Update URL without page reload
    window.history.replaceState(null, "", newPath);


    // Render submissions, filters, sorts
    // renderAll();
    Toast.showToast(`Storage switched to ${selectedStorageType} storage`, "info");
    console.log("Switched storage to:", selectedStorageType);
});


// Switch storage type here
//const storage = new LocalStorageHandler();
// const storage = new SessionStorageHandler();
// const storage = new InMemoryStorage();
