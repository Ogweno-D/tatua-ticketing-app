const filterOptions = [
    { key: "fullName", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "subject", label: "Subject" },
    { key: "message", label: "Message" },
    { key: "contact", label: "Contact" },
    { key: "status", label: "Status" }
];

/**
 * Opens the filter modal and adds a filter row if none exists.
 * @param {HTMLElement} filterModal - The filter modal element.
 * @param {HTMLElement} filterOverlay - The filter overlay element.
 * @param {HTMLElement} filtersContainer - The container for filter rows.
 */
export function openFilterModal(filterModal, filterOverlay, filtersContainer) {
    if (!filterModal || !filtersContainer) return;
    filterModal.style.display = "flex";
    if (filterOverlay) filterOverlay.style.display = "flex";
    if (!filtersContainer.querySelector(".filter-row")) addFilterRow(filtersContainer);
}

/**
 * Closes the filter modal.
 * @param {HTMLElement} filterModal - The filter modal element.
 * @param {HTMLElement} filterOverlay - The filter overlay element.
 */
export function closeFilterModal(filterModal, filterOverlay) {
    if (filterModal) filterModal.style.display = "none";
    if (filterOverlay) filterOverlay.style.display = "none";
}

/**
 * Adds a filter row to the filters container.
 * @param {HTMLElement} filtersContainer - The container for filter rows.
 */
export function addFilterRow(filtersContainer) {
    if (!filtersContainer) return;
    const row = document.createElement("div");
    row.className = "filter-row";
    row.innerHTML = `
        <div>
            <label class="form-label">Column</label>
            <select class="filter-field" name="Select your column">
                <option selected disabled hidden>Select column</option>
                ${filterOptions.map(opt => `<option value="${opt.key}">${opt.label}</option>`).join("")}
            </select>
        </div>
        <div>
            <label class="form-label">Relation</label>
            <select class="filter-operator">
                <option selected disabled>Select relation</option>
                <option value="contains">contains</option>
                <option value="equals">equals</option>
            </select>
        </div>
        <div>
            <label class="form-label">Filter Value</label>
            <input type="text" class="filter-value" placeholder="Enter value">
        </div>
        <div>
            <span class="trash" onclick="this.parentElement.remove()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 3V4H4V6H5V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V6H20V4H15V3H9ZM7 6H17V19H7V6ZM9 8V17H11V8H9ZM13 8V17H15V8H13Z" fill="#A10900"/>
                </svg>
            </span>
        </div>
    `;
    filtersContainer.appendChild(row);
}

/**
 * Submits the filters and updates the state.
 * @param {HTMLElement} filtersContainer - The container for filter rows.
 * @param {Array} currentFilters - Active filters array.
 * @param {Function} saveStateToUrl - Function to save state to URL.
 * @param {Function} renderTable - Function to render the table.
 * @param {HTMLElement} filterModal - The filter modal element.
 * @param {HTMLElement} filterOverlay - The filter overlay element.
 */
export function submitFilters(filtersContainer, currentFilters, saveStateToUrl, renderTable, filterModal, filterOverlay) {
    if (!filtersContainer) return;
    currentFilters.length = 0; // Clear current filters
    filtersContainer.querySelectorAll(".filter-row").forEach(row => {
        const field = row.querySelector(".filter-field").value;
        const operator = row.querySelector(".filter-operator").value;
        const value = row.querySelector(".filter-value").value;
        if (value) currentFilters.push({ field, operator, value });
    });
    saveStateToUrl();
    renderTable();
    closeFilterModal(filterModal, filterOverlay);
}

/**
 * Resets the filters.
 * @param {HTMLElement} filtersContainer - The container for filter rows.
 * @param {Array} currentFilters - Active filters array.
 * @param {Function} saveStateToUrl - Function to save state to URL.
 * @param {Function} renderTable - Function to render the table.
 */
export function resetFilters(filtersContainer, currentFilters, saveStateToUrl, renderTable) {
    if (!filtersContainer) return;
    currentFilters.length = 0;
    filtersContainer.innerHTML = "";
    saveStateToUrl();
    renderTable();
}