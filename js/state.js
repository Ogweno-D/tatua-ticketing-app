// ------------------------------
// Helpers
// ------------------------------
const SALT = "my-secret-salt"; // change to your own secret

async function sha256(input) {
    const msgBuffer = new TextEncoder().encode(input + SALT);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

function encode(obj) {
    return btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
}

function decode(str) {
    try {
        return JSON.parse(decodeURIComponent(escape(atob(str))));
    } catch {
        return { filters: [], sorts: [] };
    }
}

// ------------------------------
// Unified State Manager
// ------------------------------
class StateManager {
    constructor(storage) {
        this.storage = storage;
    }

    /**
     * Save filters and/or sorts independently.
     * Pass undefined for the part you don't want to update.
     */
    async saveState(filters = undefined, sorts = undefined) {
        const current = await this.getState();

        const state = {
            filters: filters !== undefined ? filters : current.filters || [],
            sorts: sorts !== undefined ? sorts : current.sorts || []
        };

        const encoded = encode(state);
        const sig = await sha256(encoded);

        // Save to storage
        this.storage.saveState({ encoded, sig });

        // Save to URL
        const url = new URL(window.location);
        url.searchParams.set("state", encoded);
        url.searchParams.set("sig", sig);
        history.replaceState({}, "", url);
    }

    async getState() {
        // Try URL first
        const params = new URLSearchParams(window.location.search);
        const encoded = params.get("state");
        const sig = params.get("sig");

        if (encoded && sig) {
            const validSig = await sha256(encoded);
            if (sig === validSig) {
                return decode(encoded);
            } else {
                console.warn("⚠️ State tampered in URL, ignoring");
            }
        }

        //  Fallback to storage
        const stored = this.storage.getState();
        if (stored?.encoded && stored?.sig) {
            const validSig = await sha256(stored.encoded);
            if (stored.sig === validSig) {
                return decode(stored.encoded);
            }
        }

        return { filters: [], sorts: [] };
    }

    async applyState() {
        const state = await this.getState();
        let data = [...this.storage.getSubmissions()];

        // Filters
        if (state.filters?.length) {
            state.filters.forEach(f => {
                data = data.filter(item => {
                    const cell = (item[f.field] || "").toString().toLowerCase();
                    return f.operator === "contains"
                        ? cell.includes(f.value.toLowerCase())
                        : cell === f.value.toLowerCase();
                });
            });
        }

        // Sorts
        if (state.sorts?.length) {
            data.sort((a, b) => {
                for (let rule of state.sorts) {
                    let v1 = (a[rule.field] || "").toString().toLowerCase();
                    let v2 = (b[rule.field] || "").toString().toLowerCase();
                    if (v1 < v2) return rule.order === "asc" ? -1 : 1;
                    if (v1 > v2) return rule.order === "asc" ? 1 : -1;
                }
                return 0;
            });
        }

        renderTable(data);
    }
}

// ------------------------------
// Extend Storage Handlers
// ------------------------------
class StateStorageHandler extends LocalStorageHandler {
    getState() {
        return JSON.parse(localStorage.getItem("tableState")) || {};
    }
    saveState(state) {
        localStorage.setItem("tableState", JSON.stringify(state));
    }
}

class SessionStateStorageHandler extends SessionStorageHandler {
    getState() {
        return JSON.parse(sessionStorage.getItem("tableState")) || {};
    }
    saveState(state) {
        sessionStorage.setItem("tableState", JSON.stringify(state));
    }
}

class InMemoryStateStorageHandler extends InMemoryStorage {
    constructor() {
        super();
        this.state = null;
    }
    getState() {
        return this.state || {};
    }
    saveState(state) {
        this.state = state;
    }
}

// ------------------------------
// Init
// ------------------------------
const stateStorage = new StateStorageHandler();
// const stateStorage = new SessionStateStorageHandler();
// const stateStorage = new InMemoryStateStorageHandler();

const stateManager = new StateManager(stateStorage);
