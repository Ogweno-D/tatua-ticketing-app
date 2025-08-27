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
 * Opens the sort modal and adds a sort row if none exists.
 * @param {HTMLElement} sortModal - The sort modal element.
 * @param {HTMLElement} sortOverlay - The sort overlay element.
 * @param {HTMLElement} sortsContainer - The container for sort rows.
 */
export function openSortModal(sortModal, sortOverlay, sortsContainer) {
    if (!sortModal || !sortsContainer) return;
    sortModal.style.display = "flex";
    if (sortOverlay) sortOverlay.style.display = "flex";
    if (!sortsContainer.querySelector(".sort-row")) addSortRow(sortsContainer);
}

/**
 * Closes the sort modal.
 * @param {HTMLElement} sortModal - The sort modal element.
 * @param {HTMLElement} sortOverlay - The sort overlay element.
 */
export function closeSortModal(sortModal, sortOverlay) {
    if (sortModal) sortModal.style.display = "none";
    if (sortOverlay) sortOverlay.style.display = "none";
}

/**
 * Adds a sort row to the sorts container.
 * @param {HTMLElement} sortsContainer - The container for sort rows.
 */
export function addSortRow(sortsContainer) {
    if (!sortsContainer) return;
    const row = document.createElement("div");
    row.className = "sort-row";
    row.innerHTML = `
        <div>
            <label class="form-label">Column</label>
            <select class="sort-field">
                ${filterOptions.map(opt => `<option value="${opt.key}">${opt.label}</option>`).join("")}
            </select>
        </div>
        <div>
            <label class="form-label">Order</label>
            <select class="sort-order">
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>
        </div>
        <span class="trash" onclick="this.parentElement.remove()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 3V4H4V6H5V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V6H20V4H15V3H9ZM7 6H17V19H7V6ZM9 8V17H11V8H9ZM13 8V17H15V8H13Z" fill="#A10900"/>
            </svg>
        </span>
    `;
    sortsContainer.appendChild(row);
}

/**
 * Submits the sorts and updates the state.
 * @param {HTMLElement} sortsContainer - The container for sort rows.
 * @param {Array} currentSorts - Active sorts array.
 * @param {Function} saveStateToUrl - Function to save state to URL.
 * @param {Function} renderTable - Function to render the table.
 * @param {HTMLElement} sortModal - The sort modal element.
 * @param {HTMLElement} sortOverlay - The sort overlay element.
 */
export function submitSorts(sortsContainer, currentSorts, saveStateToUrl, renderTable, sortModal, sortOverlay) {
    if (!sortsContainer) return;
    currentSorts.length = 0; // Clear current sorts
    sortsContainer.querySelectorAll(".sort-row").forEach(row => {
        const field = row.querySelector(".sort-field").value;
        const order = row.querySelector(".sort-order").value;
        currentSorts.push({ field, order });
    });
    saveStateToUrl();
    renderTable();
    closeSortModal(sortModal, sortOverlay);
}

/**
 * Resets the sorts.
 * @param {HTMLElement} sortsContainer - The container for sort rows.
 * @param {Array} currentSorts - Active sorts array.
 * @param {Function} saveStateToUrl - Function to save state to URL.
 * @param {Function} renderTable - Function to render the table.
 */
export function resetSorts(sortsContainer, currentSorts, saveStateToUrl, renderTable) {
    if (!sortsContainer) return;
    currentSorts.length = 0;
    sortsContainer.innerHTML = "";
    saveStateToUrl();
    renderTable();
}