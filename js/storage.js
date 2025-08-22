// Abstract Storage Handler
class StorageHandler {
    getSubmissions() { throw new Error("getSubmissions() not implemented"); }
    saveSubmissions(subs) { throw new Error("saveSubmissions() not implemented"); }

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
    }
    getSubmissions() { return this.submissions; }
    saveSubmissions(subs) { this.submissions = subs; }
}

// Session Storage (resets when browser closes)
class SessionStorageHandler extends StorageHandler {
    getSubmissions() {
        return JSON.parse(sessionStorage.getItem("submissions")) || [];
    }
    saveSubmissions(subs) {
        sessionStorage.setItem("submissions", JSON.stringify(subs));
    }
}

// Local Storage (persistent across reloads)
class LocalStorageHandler extends StorageHandler {
    getSubmissions() {
        return JSON.parse(localStorage.getItem("submissions")) || [];
    }
    saveSubmissions(subs) {
        localStorage.setItem("submissions", JSON.stringify(subs));
    }
}

// Switch storage type here
const storage = new LocalStorageHandler();
// const storage = new SessionStorageHandler();
// const storage = new InMemoryStorage();
