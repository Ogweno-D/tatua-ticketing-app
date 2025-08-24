// ------------------------------
// Sorting Logic (uses storage.js + state.js)
// ------------------------------

async function addSortRow() {
    const container = document.getElementById("sortsContainer");
    const row = document.createElement("div");
    row.className = "sort-row";
    row.innerHTML = `
        <select class="sort-field">
            ${filterOptions.map(opt => `<option value="${opt.key}">${opt.label}</option>`).join("")}
        </select>
        <select class="sort-order">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
        </select>
        <i class="fa-solid fa-trash" onclick="this.parentElement.remove()"></i>
    `;
    container.appendChild(row);
}

async function resetSort() {
    document.getElementById("sortsContainer").innerHTML = "";
    storage.saveSorts([]); // clear stored sorts
    await stateManager.saveState(undefined, []); // save only sorts
    renderTable(storage.getSubmissions());
}

async function submitSort() {
    const rows = document.querySelectorAll(".sort-row");
    const sorts = [];
    let sorted = [...storage.getSubmissions()];

    rows.forEach(row => {
        const field = row.querySelector(".sort-field").value;
        const order = row.querySelector(".sort-order").value;
        sorts.push({ field, order });
    });

    if (sorts.length) {
        sorted.sort((a, b) => {
            for (let rule of sorts) {
                let v1 = (a[rule.field] || "").toString().toLowerCase();
                let v2 = (b[rule.field] || "").toString().toLowerCase();
                if (v1 < v2) return rule.order === "asc" ? -1 : 1;
                if (v1 > v2) return rule.order === "asc" ? 1 : -1;
            }
            return 0;
        });
    }

    // persist only sorts
    storage.saveSorts(sorts);
    await stateManager.saveState(undefined, sorts);

    renderTable(sorted);
    closeAllModals();
}

async function restoreSorts() {
    const saved = storage.getSorts();
    if (!saved.length) return;

    const container = document.getElementById("sortsContainer");
    container.innerHTML = "";

    saved.forEach(s => {
        const row = document.createElement("div");
        row.className = "sort-row";
        row.innerHTML = `
            <select class="sort-field">
                ${filterOptions.map(opt =>
            `<option value="${opt.key}" ${s.field === opt.key ? "selected" : ""}>${opt.label}</option>`
        ).join("")}
            </select>
            <select class="sort-order">
                <option value="asc" ${s.order === "asc" ? "selected" : ""}>Ascending</option>
                <option value="desc" ${s.order === "desc" ? "selected" : ""}>Descending</option>
            </select>
            <i class="fa-solid fa-trash" onclick="this.parentElement.remove()"></i>
        `;
        container.appendChild(row);
    });

    await submitSort(); // apply sorts immediately
}
