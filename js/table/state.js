/**
 * Saves the table state to the URL and localStorage.
 * @param {Object} tableState - The table state object (filters, sorts).
 */
export function saveStateToUrl(tableState) {
    const hash = btoa(JSON.stringify(tableState)).slice(0, 12);
    localStorage.setItem("state_" + hash, JSON.stringify(tableState));
    history.replaceState(null, "", location.pathname + "#s=" + hash);
}

/**
 * Loads the table state from the URL and localStorage.
 * @param {Object} tableState - The table state object to update.
 * @returns {Object} - Updated table state.
 */
export function loadStateFromUrl(tableState) {
    if (!location.hash.startsWith("#s=")) return tableState;
    const hash = location.hash.replace("#s=", "");
    const json = localStorage.getItem("state_" + hash);
    if (!json) return tableState;
    try {
        const state = JSON.parse(json);
        return {
            filters: Array.isArray(state.filters) ? state.filters : [],
            sorts: Array.isArray(state.sorts) ? state.sorts : []
        };
    } catch (err) {
        console.error("Failed to parse URL state:", err);
        return tableState;
    }
}