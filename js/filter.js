// ------------------------------
// Filters Logic (uses storage.js + state.js)
// ------------------------------

async function addFilterRow() {
    const container = document.getElementById("filtersContainer");
    const row = document.createElement("div");
    row.className = "filter-row";
    row.innerHTML = `
        <select class="filter-field">
            ${filterOptions.map(opt => `<option value="${opt.key}">${opt.label}</option>`).join("")}
        </select>
        <select class="filter-operator">
            <option value="contains">contains</option>
            <option value="equals">equals</option>
        </select>
        <input type="text" class="filter-value" placeholder="Enter value">
        <i class="fa-solid fa-trash" onclick="this.parentElement.remove()"></i>
    `;
    container.appendChild(row);
}

async function resetFilter() {
    document.getElementById("filtersContainer").innerHTML = "";
    storage.saveFilters([]); // clear stored filters
    await stateManager.saveState([]); // save only filters
    renderTable(storage.getSubmissions());
}

async function submitFilters() {
    const rows = document.querySelectorAll(".filter-row");
    const filters = [];
    let filtered = [...storage.getSubmissions()];

    rows.forEach(row => {
        const field = row.querySelector(".filter-field").value;
        const operator = row.querySelector(".filter-operator").value;
        const value = row.querySelector(".filter-value").value.trim();

        if (value) {
            filters.push({ field, operator, value });

            filtered = filtered.filter(item => {
                const cell = (item[field] || "").toString().toLowerCase();
                return operator === "contains"
                    ? cell.includes(value.toLowerCase())
                    : cell === value.toLowerCase();
            });
        }
    });

    // persist only filters
    storage.saveFilters(filters);
    await stateManager.saveState(filters);

    renderTable(filtered);
    closeAllModals();
}

async function restoreFilters() {
    const saved = storage.getFilters();
    if (!saved.length) return;

    const container = document.getElementById("filtersContainer");
    container.innerHTML = "";

    saved.forEach(f => {
        const row = document.createElement("div");
        row.className = "filter-row";
        row.innerHTML = `
            <select class="filter-field">
                ${filterOptions.map(opt =>
            `<option value="${opt.key}" ${f.field === opt.key ? "selected" : ""}>${opt.label}</option>`
        ).join("")}
            </select>
            <select class="filter-operator">
                <option value="contains" ${f.operator === "contains" ? "selected" : ""}>contains</option>
                <option value="equals" ${f.operator === "equals" ? "selected" : ""}>equals</option>
            </select>
            <input type="text" class="filter-value" value="${f.value}">
            <i class="fa-solid fa-trash" onclick="this.parentElement.remove()"></i>
        `;
        container.appendChild(row);
    });

    await submitFilters(); // apply filters immediately
}
