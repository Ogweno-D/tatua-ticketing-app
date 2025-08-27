/**
 * Renders the ticket table with filtering and sorting.
 * @param {Array} submissions - Array of submission objects.
 * @param {Array} currentFilters - Active filters.
 * @param {Array} currentSorts - Active sorts.
 * @param {HTMLElement} tableBody - Table body element.
 * @param {Function} actionHandlers - Function to attach action handlers.
 * @param {Function} showToast - Toast notification function.
 * @param {Function} closeFilterModal - Function to close filter modal.
 * @param {Function} closeSortModal - Function to close sort modal.
 * @param {Function} renderActiveTags - Function to render active filter/sort tags.
 */

export function renderTable(submissions, currentFilters, currentSorts, tableBody, actionHandlers, showToast, closeFilterModal, closeSortModal, renderActiveTags) {
    // Cache lowercase values for efficient filtering/sorting
    const cached = submissions.map(item => {
        let lc = {};
        for (let key in item) lc[key] = (item[key] || "").toString().toLowerCase();
        return { original: item, lc };
    });

    // Apply filters
    let filtered = cached.filter(({ lc }) => {
        return currentFilters.every(f => {
            const cell = lc[f.field];
            const value = f.value.toLowerCase();
            return f.operator === "contains" ? cell.includes(value) : cell === value;
        });
    });

    // Apply sorts
    if (currentSorts.length) {
        filtered.sort((a, b) => {
            for (let rule of currentSorts) {
                const v1 = a.lc[rule.field];
                const v2 = b.lc[rule.field];
                if (v1 < v2) return rule.order === "asc" ? -1 : 1;
                if (v1 > v2) return rule.order === "asc" ? 1 : -1;
            }
            return 0;
        });
    }

    filtered = filtered.map(x => x.original);

    // Render rows
    tableBody.innerHTML = "";
    filtered.forEach(submission => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${submission.id}</td>
            <td>
                <p class="user-name">${submission.fullName}</p>
                <p class="user-email">${submission.email}</p>
            </td>
            <td>
                <p class="message-title">${submission.subject}</p>
                <p class="user-message">${submission.message}</p>
            </td>
            <td>${submission.date}</td>
            <td><span class="status ${submission.status.toLowerCase()}">${submission.status}</span></td>
            <td class="actions">
                <i class="fa-solid fa-info-circle info" data-id="${submission.id}"></i>
                <i class="fa-solid fa-download download" data-id="${submission.id}"></i>
                <i class="fa-solid fa-phone call" data-id="${submission.id}"></i>
                <i class="fa-regular fa-envelope message" data-id="${submission.id}"></i>
                <i class="fa-regular fa-pen-to-square edit" data-id="${submission.id}"></i>
                <i class="fa-solid fa-trash-alt delete" data-id="${submission.id}"></i>
            </td>
        `;
        tableBody.appendChild(row);

        // Handle preferred contact icons
        document.querySelectorAll("td.actions").forEach(cell => {
            const id = parseInt(cell.querySelector(".info").dataset.id);
            const submission = submissions.find(sub => sub.id === id);

            const phoneIcon = cell.querySelector(".call");
            const emailIcon = cell.querySelector(".message");

            phoneIcon.classList.remove("disabled", "tooltip");
            emailIcon.classList.remove("disabled", "tooltip");
            phoneIcon.removeAttribute("data-tooltip");
            emailIcon.removeAttribute("data-tooltip");

            if (submission.contact === "phone") {
                emailIcon.classList.add("disabled", "tooltip");
                emailIcon.setAttribute("data-tooltip", "Preferred contact is phone, email disabled");
            } else if (submission.contact === "email") {
                phoneIcon.classList.add("disabled", "tooltip");
                phoneIcon.setAttribute("data-tooltip", "Preferred contact is email, phone disabled");
            }
        });
    });

    // Show toast based on filters/sorts
    if (currentFilters.length && currentSorts.length) {
        closeFilterModal();
        closeSortModal();
        showToast("Filters and sorting applied successfully", "success");
    } else if (currentFilters.length) {
        closeFilterModal();
        showToast("Filters applied successfully", "success");
    } else if (currentSorts.length) {
        closeSortModal();
        showToast("Sort applied successfully", "success");
    } else {
        closeSortModal();
        closeFilterModal();
    }

    renderActiveTags();
    actionHandlers();
}