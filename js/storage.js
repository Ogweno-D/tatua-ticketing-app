// // Abstract Storage Handler
// class StorageHandler {
//     getSubmissions() { throw new Error("getSubmissions() not implemented"); }
//     saveSubmissions(subs) { throw new Error("saveSubmissions() not implemented"); }
//
//     // --- Filters ---
//     getFilters() { throw new Error("getFilters() not implemented"); }
//     saveFilters(filters) { throw new Error("saveFilters() not implemented"); }
//
//     // --- Sorts ---
//     getSorts() { throw new Error("getSorts() not implemented"); }
//     saveSorts(sorts) { throw new Error("saveSorts() not implemented"); }
//
//     // Ids handling
//     getNextId(){
//         const subs = this.getSubmissions();
//         if (subs.length === 0) return 1;
//         return  subs[subs.length - 1].id+1;
//     }
// }
//
// class EncryptedStorageHandler  extends StorageHandler {
//     constructor(storage) {
//         super();
//         this.storage = storage; // this is for localStorage or sessionStorage
//     }
//
//     //
//     async getItem(key) {
//         const raw = this.storage.getItem(key);
//         if (!raw) return [];
//         try {
//             const parsed = JSON.parse(raw);
//             return await  decryptData(parsed);
//         }catch {
//             return JSON.parse(raw) // fallback
//         }
//     }
//
//     //
//     async setItem(key, value) {
//         const encrypted = await encryptData(value);
//         this.storage.setItem(key, JSON.stringify(encrypted));
//     }
// }
//
// // In-Memory Storage (resets on reload)-
// class InMemoryStorage extends StorageHandler {
//     constructor() {
//         super();
//         this.submissions = [];
//         this.filters = [];
//         this.sorts = [];
//     }
//
//     // --- Submissions ---
//     getSubmissions() {return this.submissions; }
//     saveSubmissions(subs) {this.submissions = subs; }
//
//     // --- Filters ---
//     getFilters() { return this.filters; }
//     saveFilters(filters) { this.filters = filters; }
//
//     // --- Sorts ---
//     getSorts() { return this.sorts; }
//     saveSorts(sorts) { this.sorts = sorts; }
// }
//
//
// // Session Storage (resets when browser closes)
// class SessionStorageHandler extends StorageHandler {
//     // --- Submissions ---
//     getSubmissions() {
//         return JSON.parse(sessionStorage.getItem("submissions")) || [];
//     }
//     saveSubmissions(subs) {
//         sessionStorage.setItem("submissions", JSON.stringify(subs));
//     }
//
//     // --- Filters ---
//     getFilters() {
//         return JSON.parse(sessionStorage.getItem("filters")) || [];
//     }
//     saveFilters(filters) {
//         sessionStorage.setItem("filters", JSON.stringify(filters));
//     }
//
//     // --- Sorts ---
//     getSorts() {
//         return JSON.parse(sessionStorage.getItem("sorts")) || [];
//     }
//     saveSorts(sorts) {
//         sessionStorage.setItem("sorts", JSON.stringify(sorts));
//     }
// }
//
//
// // Local Storage (persistent across reloads)
// class LocalStorageHandler extends StorageHandler {
//     // --- Submissions ---
//     getSubmissions() {
//         return JSON.parse(localStorage.getItem("submissions")) || [];
//     }
//     saveSubmissions(subs) {
//         localStorage.setItem("submissions", JSON.stringify(subs));
//     }
//
//     // --- Filters ---
//     getFilters() {
//         return JSON.parse(localStorage.getItem("filters")) || [];
//     }
//     saveFilters(filters) {
//         localStorage.setItem("filters", JSON.stringify(filters));
//     }
//
//     // --- Sorts ---
//     getSorts() {
//         return JSON.parse(localStorage.getItem("sorts")) || [];
//     }
//     saveSorts(sorts) {
//         localStorage.setItem("sorts", JSON.stringify(sorts));
//     }
// }
//
//
// /// TO toggle the stage types
// const STORAGE_TYPES = {
//     LOCAL: "Local",
//     SESSION: "Session",
//     MEMORY: "Memory"
// };
//
// // Map storage type to folder
// const storageFolderMap = {
//     [STORAGE_TYPES.LOCAL]: "local",
//     [STORAGE_TYPES.SESSION]: "session",
//     [STORAGE_TYPES.MEMORY]: "memory"
// };
//
// // --- Create storage handler ---
// function createStorage(type) {
//     switch(type) {
//         case STORAGE_TYPES.SESSION: return new SessionStorageHandler();
//         case STORAGE_TYPES.MEMORY: return new InMemoryStorage();
//         case STORAGE_TYPES.LOCAL:
//         default: return new LocalStorageHandler();
//     }
// }
//
// // --- Cache for submissions, filters, sorts ---
// const storageDataCache = {
//     [STORAGE_TYPES.LOCAL]: {
//         submissions: new LocalStorageHandler().getSubmissions(),
//         filters: new LocalStorageHandler().getFilters(),
//         sorts: new LocalStorageHandler().getSorts()
//     },
//     [STORAGE_TYPES.SESSION]: {
//         submissions: new SessionStorageHandler().getSubmissions(),
//         filters: new SessionStorageHandler().getFilters(),
//         sorts: new SessionStorageHandler().getSorts()
//     },
//     [STORAGE_TYPES.MEMORY]: JSON.parse(localStorage.getItem("memoryStorageCache")) || {
//         submissions: [],
//         filters: [],
//         sorts: []
//     }
// };
//
// // --- Load last selected storage type from localStorage ---
// let selectedStorageType = localStorage.getItem("selectedStorageType") || STORAGE_TYPES.LOCAL;
// let storage = createStorage(selectedStorageType);
//
// // Reload cached state into storage
// storage.saveSubmissions(storageDataCache[selectedStorageType].submissions);
// storage.saveFilters(storageDataCache[selectedStorageType].filters);
// storage.saveSorts(storageDataCache[selectedStorageType].sorts);
//
// // --- DOM Elements ---
// const toggleBtn = document.getElementById("toggleStorageBtn");
// const currentLabel = document.getElementById("currentStorage");
//
//
// currentLabel.textContent = selectedStorageType;
//
//
// // --- Save memory cache ---
// function saveMemoryCache() {
//     if (selectedStorageType === STORAGE_TYPES.MEMORY) {
//         localStorage.setItem("memoryStorageCache", JSON.stringify(storageDataCache[STORAGE_TYPES.MEMORY]));
//     }
// }
//
// // --- Toggle storage function ---
// toggleBtn.addEventListener("click", () => {
//     // Save current state to cache
//     storageDataCache[selectedStorageType].submissions = storage.getSubmissions();
//     storageDataCache[selectedStorageType].filters = storage.getFilters();
//     storageDataCache[selectedStorageType].sorts = storage.getSorts();
//     saveMemoryCache();
//
//     // Cycle storage type
//     if (selectedStorageType === STORAGE_TYPES.LOCAL) selectedStorageType = STORAGE_TYPES.SESSION;
//     else if (selectedStorageType === STORAGE_TYPES.SESSION) selectedStorageType = STORAGE_TYPES.MEMORY;
//     else selectedStorageType = STORAGE_TYPES.LOCAL;
//
//     // Save selected storage type to localStorage
//     localStorage.setItem("selectedStorageType", selectedStorageType);
//
//     // Switch storage handler
//     storage = createStorage(selectedStorageType);
//
//     // Reload state from cache
//     storage.saveSubmissions(storageDataCache[selectedStorageType].submissions);
//     storage.saveFilters(storageDataCache[selectedStorageType].filters);
//     storage.saveSorts(storageDataCache[selectedStorageType].sorts);
//
//     // Update UI label
//     currentLabel.textContent = selectedStorageType;
//
//     // Update URL folder without page reload
//     // Get selected folder
//     const folder = storageFolderMap[selectedStorageType]; // "local", "session", "memory"
//     // Build the new URL path
//     const newPath = `/tatua-ticketing-app/storage/${folder}/index.html`;
//     // Update URL without page reload
//     window.history.replaceState(null, "", newPath);
//
//
//     // Render submissions, filters, sorts
//     // renderAll();
//     Toast.showToast(`Storage switched to ${selectedStorageType} storage`, "info");
//     console.log("Switched storage to:", selectedStorageType);
// });
//
//
// // Switch storage type here
// //const storage = new LocalStorageHandler();
// // const storage = new SessionStorageHandler();
// // const storage = new InMemoryStorage();



// ===============================
// Abstract Storage Handler
// ===============================
class StorageHandler {
    async getSubmissions() { throw new Error("getSubmissions() not implemented"); }
    async saveSubmissions(subs) { throw new Error("saveSubmissions() not implemented"); }

    // NEW unified state
    async getTableState() { throw new Error("getTableState() not implemented"); }
    async saveTableState(state) { throw new Error("saveTableState() not implemented"); }


    // async getNextId() {
    //     const subs = await this.getSubmissions();
    //     if (!subs || subs.length === 0) return 1;
    //     return subs[subs.length - 1].id + 1;
    // }
    async getNextId() {
        const subs = await this.getSubmissions();
        if (!subs || subs.length === 0) return 1;

        const lastId = Number(subs[subs.length - 1].id); // ensure it's a number
        return lastId + 1;
    }
}

// ===============================
// Encrypted Storage Handler
// ===============================

class EncryptedStorageHandler extends StorageHandler {
    constructor(storage) {
        super();
        this.storage = storage;
    }

    // --- Helper: Get encrypted item and decrypt ---
    async getItem(key) {
        const raw = this.storage.getItem(key);
        if (!raw) return [];

        try {
            const parsed = JSON.parse(raw);

            // Only decrypt if object has iv + cipher
            if (parsed.iv && parsed.cipher) {
                const decrypted = await decryptData(parsed);
                // Make sure it's an array for submissions/filters/sorts
                return Array.isArray(decrypted) ? decrypted : [];
            }
            // const decryptedData = await decryptData(parsed);
            //return Array.isArray(decryptedData)? decryptedData : [];

            // If already plain (legacy), return as is
            return parsed;
        } catch (err) {
            console.error("Failed to parse/decrypt storage item", key, err);
            return [];
        }
    }



    // --- Helper: Encrypt item before saving ---
    async setItem(key, value) {
        try {
            const encrypted = await encryptData(value);
            this.storage.setItem(key, JSON.stringify(encrypted));
        } catch (e) {
            console.error("Encryption failed, storing raw:", e);
            this.storage.setItem(key, JSON.stringify(value));
        }
    }

    // Unified state
    async getTableState() {
        const raw = this.storage.getItem("tableState");
        if (!raw) return { filters: [], sorts: [] }; // default empty object
        try {
            return JSON.parse(raw);
        } catch (err) {
            console.error("Failed to parse tableState:", err);
            return { filters: [], sorts: [] };
        }
    }


    async saveTableState(state) {
        await this.setItem("tableState", state);
    }

}


// ===============================
// In-Memory Storage (resets on reload)
// ===============================
class InMemoryStorage extends StorageHandler {
    constructor() {
        super();
        this.submissions = [];
        this.tableState = {filters:[], sorts:[]};

    }

    async getSubmissions() { return this.submissions; }
    async saveSubmissions(subs) { this.submissions = subs; }

    async getTableState() { return this.tableState; }
    async saveTableState(state) {
        this.tableState = state;
    }

}

// ===============================
// Session Storage (encrypted, resets on browser close)
// ===============================
class SessionStorageHandler extends EncryptedStorageHandler {
    constructor() {
        super(sessionStorage);
    }

    async getSubmissions() { return await this.getItem("submissions"); }
    async saveSubmissions(subs) { await this.setItem("submissions", subs); }

    async getTableState() { return await super.getTableState(); }
    async saveTableState(state) {
        await this.setItem("tableState", state);
    }

}

// ===============================
// Local Storage (plain JSON)
// ===============================
class LocalStorageHandler extends EncryptedStorageHandler {
    constructor() {
        super(localStorage);
    }
    async getSubmissions() { return  await this.getItem("submissions")}
    async saveSubmissions(subs) { return await  this.setItem("submissions", subs); }

    async getTableState() { return await super.getTableState(); }
    async saveTableState(state) {
        await this.setItem("tableState", state);
    }
}

// ===============================
// Storage Types & Utilities
// ===============================
const STORAGE_TYPES = {
    LOCAL: "Local",
    SESSION: "Session",
    MEMORY: "Memory"
};

const storageFolderMap = {
    [STORAGE_TYPES.LOCAL]: "local",
    [STORAGE_TYPES.SESSION]: "session",
    [STORAGE_TYPES.MEMORY]: "memory"
};

function createStorage(type) {
    switch (type) {
        case STORAGE_TYPES.SESSION: return new SessionStorageHandler();
        case STORAGE_TYPES.MEMORY: return new InMemoryStorage();
        case STORAGE_TYPES.LOCAL:
        default: return new LocalStorageHandler();
    }
}

// ===============================
// Cache Handling
// ===============================
const storageDataCache = {};

async function initStorageCache() {
    storageDataCache[STORAGE_TYPES.LOCAL] = {
        submissions: await new LocalStorageHandler().getSubmissions(),
        tableState: await new LocalStorageHandler().getTableState()
    };

    storageDataCache[STORAGE_TYPES.SESSION] = {
        submissions: await new SessionStorageHandler().getSubmissions(),
        tableState: await new SessionStorageHandler().getTableState()
    };

    storageDataCache[STORAGE_TYPES.MEMORY] =
        JSON.parse(localStorage.getItem("memoryStorageCache")) || {
            submissions: [],
            tableState:{
                filters :[], sorts:[]
            }
        };
}

function saveMemoryCache() {
    localStorage.setItem("memoryStorageCache", JSON.stringify(storageDataCache[STORAGE_TYPES.MEMORY]));
}

// ===============================
// App Initialization
// ===============================
(async function setupStorage() {

    // Initialize cache first
    await initStorageCache();

    // Load last selected storage type
    let selectedStorageType = localStorage.getItem("selectedStorageType") || STORAGE_TYPES.LOCAL;
    let storage = createStorage(selectedStorageType);

    // Expose globally
    window.selectedStorageType = selectedStorageType;
    window.storage = storage;

    // Restore cached state
    await storage.saveSubmissions(storageDataCache[selectedStorageType].submissions);
    await storage.saveTableState(storageDataCache[selectedStorageType].tableState);


    // DOM Elements
    const toggleBtn = document.getElementById("toggleStorageBtn");
    const currentLabel = document.getElementById("currentStorage");
    currentLabel.textContent = selectedStorageType;

    // Toggle Storage Handler
    toggleBtn.addEventListener("click", async () => {

        // Save current state into cache
        storageDataCache[selectedStorageType].submissions = await storage.getSubmissions();
        storageDataCache[selectedStorageType].tableState = await storage.getTableState();

        if (selectedStorageType === STORAGE_TYPES.MEMORY) saveMemoryCache();

        // Cycle storage type
        if (selectedStorageType === STORAGE_TYPES.LOCAL) {
            selectedStorageType = STORAGE_TYPES.SESSION;
        } else if (selectedStorageType === STORAGE_TYPES.SESSION) {
            selectedStorageType = STORAGE_TYPES.MEMORY;
        } else {
            selectedStorageType = STORAGE_TYPES.LOCAL;
        }

        // Save new selection
        localStorage.setItem("selectedStorageType", selectedStorageType);

        // Switch handler
        storage = createStorage(selectedStorageType);

        // Expose globally
        window.selectedStorageType = selectedStorageType;
        window.storage = storage;

        // Restore from cache
        await storage.saveSubmissions(storageDataCache[selectedStorageType].submissions);
        await storage.saveTableState(storageDataCache[selectedStorageType].tableState);
        // Update UI
        currentLabel.textContent = selectedStorageType;

        // Update URL
        const folder = storageFolderMap[selectedStorageType];
        const newPath = `/tatua-ticketing-app/storage/${folder}/index.html`;
        window.history.replaceState(null, "", newPath);

        // Notify
        Toast.showToast(`Storage switched to ${selectedStorageType} storage`, "info");
        console.log("Switched storage to:", selectedStorageType);

    });

})();

// To supply storage to other files <Pun intended!>
window.storageReady = (async function setupStorage() {
    await initStorageCache();

    let selectedStorageType = localStorage.getItem("selectedStorageType") || STORAGE_TYPES.LOCAL;
    let storage = createStorage(selectedStorageType);

    window.selectedStorageType = selectedStorageType;
    window.storage = storage;

    const cachedSubs = storageDataCache[selectedStorageType].submissions;
    const cachedState = storageDataCache[selectedStorageType].tableState;

    if (cachedSubs && cachedSubs.length > 0) {
        await storage.saveSubmissions(cachedSubs);
    }
    if (cachedState && (cachedState.filters?.length || cachedState.sorts?.length)) {
        await storage.saveTableState(cachedState);
    }

    return storage; // resolve with storage
})();


