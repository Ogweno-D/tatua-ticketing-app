// document.addEventListener('DOMContentLoaded', async () => {
//     const tableBody = document.querySelector("#ticketsTable tbody");
//     const closeBtn = document.querySelectorAll(".close");
//     const container = document.querySelector(".active-tags-container");
//     console.log(container);
//     if (!tableBody) return;
//
//
//     await window.storageReady;
//     const storage = window.storage;
//     let submissions = await storage.getSubmissions();
//     console.log(submissions);
//
//
//
//     const modal = document.getElementById("modal");
//     const modalBody = document.getElementById("modalBody");
//     //const closeModal = document.getElementById("closeModal");
//
//     // --- Filter & Sort State ---
//     let tableState = await storage.getTableState() || {};
//     let currentFilters = Array.isArray(tableState.filters) ? tableState.filters : [];
//     let currentSorts   = Array.isArray(tableState.sorts)   ? tableState.sorts   : [];
//
//
//
//     const filterOptions = [
//         {key: "fullName", label: "Full Name"},
//         {key: "email", label: "Email"},
//         {key: "phone", label: "Phone"},
//         {key: "subject", label: "Subject"},
//         {key: "message", label: "Message"},
//         {key: "contact", label: "Contact"},
//         {key: "status", label: "Status"}
//     ];
//
//     // --- Modal helpers ---
//     function openModal(content) {
//         modalBody.innerHTML = content;
//         modal.style.display = "block";
//     }
//     function closeModal() {
//         modal.style.display = "none";
//     }
//
//     // closeModal.onclick = () => modal.style.display = "none";
//     window.onclick = (e) => {
//         if (e.target === modal) modal.style.display = "none";
//     };
//
//     // --- URL State Persistence ---
//     function saveStateToUrl() {
//         // const state = {filters: currentFilters, sorts: tableState.sorts};
//         const hash = btoa(JSON.stringify(tableState)).slice(0, 12);
//         localStorage.setItem("state_" + hash, JSON.stringify(tableState));
//         history.replaceState(null, "", location.pathname + "#s=" + hash);
//     }
//
//     function loadStateFromUrl() {
//         if (!location.hash.startsWith("#s=")) return;
//         const hash = location.hash.replace("#s=", "");
//         const json = localStorage.getItem("state_" + hash);
//         if (!json) return;
//         const state = JSON.parse(json);
//         //if (state.filters) currentFilters = state.filters;
//         //if (state.sorts) tableState.sorts = state.sorts;
//         tableState.filters = state.filters || [];
//         tableState.sorts = state.sorts || [];
//     }
//
//     loadStateFromUrl();
//     function renderActiveTags() {
//         const filterContainer = document.getElementById("filterContainer");
//         const sortContainer = document.getElementById("sortContainer");
//
//         filterContainer.innerHTML = '';
//         currentFilters.forEach((f, i) => {
//             const tag = document.createElement('div');
//             tag.className = 'active-tag';
//             tag.innerHTML = `
//             <div class="tag-number">
//                 <span class="total-tags">1</span>
//                 <span class="tag-type">Filter</span>
//             </div>
//             <div class="delete-tag" data-type="filter" data-index="${i}">
//                 <i class="fa-solid fa-close"></i>
//             </div>
//         `;
//             filterContainer.appendChild(tag);
//         });
//
//         sortContainer.innerHTML = '';
//         currentSorts.forEach((s, i) => {
//             const tag = document.createElement('div');
//             tag.className = 'active-tag';
//             tag.innerHTML = `
//             <div class="tag-number">
//                 <span class="total-tags">1</span>
//                 <span class="tag-type">Sort</span>
//             </div>
//             <div class="delete-tag" data-type="sort" data-index="${i}">
//                 <i class="fa-solid fa-close"></i>
//             </div>
//         `;
//             sortContainer.appendChild(tag);
//         });
//
//         // Add event listeners dynamically
//         document.querySelectorAll('.delete-tag').forEach(el => {
//             el.addEventListener('click', () => {
//                 const type = el.dataset.type;
//                 const index = parseInt(el.dataset.index, 10);
//
//                 if (type === 'filter') currentFilters.splice(index, 1);
//                 else if (type === 'sort') currentSorts.splice(index, 1);
//
//                 renderActiveTags();
//                 renderTable();
//             });
//         });
//     }
//
//
//
//     // --- Table Rendering with filters & sorts ---
//     function renderTable() {
//         // let filtered = [...submissions];
//
//         // // Apply filters
//         // tableState.filters.forEach(f => {
//         //     filtered = filtered.filter(item => {
//         //         const cell = (item[f.field] || "").toString().toLowerCase();
//         //         return f.operator === "contains"
//         //             ? cell.includes(f.value.toLowerCase())
//         //             : cell === f.value.toLowerCase();
//         //     });
//         // });
//         //
//         // // Apply sorts
//         // if (tableState.sorts.length) {
//         //     filtered.sort((a, b) => {
//         //         for (let rule of tableState.sorts) {
//         //             let v1 = (a[rule.field] || "").toString().toLowerCase();
//         //             let v2 = (b[rule.field] || "").toString().toLowerCase();
//         //             if (v1 < v2) return rule.order === "asc" ? -1 : 1;
//         //             if (v1 > v2) return rule.order === "asc" ? 1 : -1;
//         //         }
//         //         return 0;
//         //     });
//         // }
//
//         const cached = submissions.map(item=>{
//             let lc = {};
//             for(let key in item){
//                 lc[key] =(item[key] || "").toString().toLowerCase();
//             }
//             return {original:item,lc};
//         })
//
//         // Filters
//         let filtered = cached.filter(({lc})=>{
//            return currentFilters.every(f=>{
//                const cell = lc[f.field];
//                const value = f.value.toLowerCase();
//
//                return f.operator === "contains" ? cell.includes(value) : cell === value
//            });
//         });
//
//         if(currentSorts.length ){
//             filtered.sort((a,b)=>{
//                 for(let rule of currentSorts){
//                     const v1 = a.lc[rule.field];
//                     const v2 = b.lc[rule.field];
//
//                     if(v1<v2) return rule.order === "asc" ? -1:1;
//                     if(v1>v2) return  rule.order === "asc" ? 1:-1;
//                 }
//                 return 0;
//             })
//         }
//
//         filtered = filtered.map(x=>x.original);
//
//         // Render rows
//         tableBody.innerHTML = "";
//         filtered.forEach(submission => {
//             const row = document.createElement("tr");
//             row.innerHTML = `
//                 <td>${submission.id}</td>
//                 <td>
//                     <p class="user-name">${submission.fullName}</p>
//                     <p class="user-email">${submission.email}</p>
//                 </td>
//                 <td>
//                     <p class="message-title">${submission.subject}</p>
//                     <p class="user-message">${submission.message}</p>
//                 </td>
//                 <td>${submission.date}</td>
//                 <td><span class="status ${submission.status.toLowerCase()}">${submission.status}</span></td>
//                 <td class="actions">
//                     <i class="fa-solid fa-info-circle info" data-id="${submission.id}"></i>
//                     <i class="fa-solid fa-download download" data-id="${submission.id}"></i>
//                     <i class="fa-solid fa-phone call" data-id="${submission.id}"></i>
//                     <i class="fa-regular fa-envelope message" data-id="${submission.id}"></i>
//                     <i class="fa-regular fa-pen-to-square edit" data-id="${submission.id}"></i>
//                     <i class="fa-solid fa-trash-alt delete" data-id="${submission.id}"></i>
//                 </td>
//             `;
//             tableBody.appendChild(row);
//         });
//
//         // Rendering the active selected preferred contact
//         document.querySelectorAll("td.actions").forEach(cell => {
//             const id = parseInt(cell.querySelector(".info").dataset.id);
//             const submission = submissions.find(sub => sub.id === id);
//
//             const phoneIcon = cell.querySelector(".call");
//             const emailIcon = cell.querySelector(".message");
//
//             // Reset first (important if re-rendering)
//             phoneIcon.classList.remove("disabled", "tooltip");
//             emailIcon.classList.remove("disabled", "tooltip");
//             phoneIcon.removeAttribute("data-tooltip");
//             emailIcon.removeAttribute("data-tooltip");
//
//             if (submission.contact === "phone") {
//                 emailIcon.classList.add("disabled", "tooltip");
//                 emailIcon.setAttribute("data-tooltip", "Preferred contact is phone, email disabled");
//             } else if (submission.contact === "email") {
//                 phoneIcon.classList.add("disabled", "tooltip");
//                 phoneIcon.setAttribute("data-tooltip", "Preferred contact is email, phone disabled");
//             }
//         });
//
//
//         // Toast messages for each action
//         if (currentFilters.length && tableState.sorts.length) {
//             closeFilterModal()
//             closeSortModal()
//             Toast.showToast("Filters and sorting applied successfully", "success");
//         } else if (currentFilters.length) {
//             closeFilterModal()
//             Toast.showToast("Filters applied successfully", "success");
//         } else if (currentSorts.length) {
//             closeSortModal()
//             Toast.showToast("Sort applied successfully", "success");
//         } else {
//             //Toast.showToast("Showing all results", "info");
//             closeSortModal()
//             closeFilterModal()
//         }
//
//         renderActiveTags();
//
//         actionHandlers();
//     }

document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.querySelector("#ticketsTable tbody");
    if (!tableBody) return;

    await window.storageReady;
    const storage = window.storage;
    let submissions = await storage.getSubmissions();

    const modal = document.getElementById("modal");
    const modalBody = document.getElementById("modalBody");
    //const closeModal = document.getElementById("closeModal");



    // --- Filter & Sort State ---
    let tableState = await storage.getTableState() || {};
    let currentFilters = Array.isArray(tableState.filters) ? tableState.filters : [];
    let currentSorts = Array.isArray(tableState.sorts) ? tableState.sorts : [];

    // --- URL State Persistence ---
    function saveStateToUrl() {
        // const state = {filters: currentFilters, sorts: tableState.sorts};
        const hash = btoa(JSON.stringify(tableState)).slice(0, 12);
        localStorage.setItem("state_" + hash, JSON.stringify(tableState));
        history.replaceState(null, "", location.pathname + "#s=" + hash);
    }

    function loadStateFromUrl() {
        if (!location.hash.startsWith("#s=")) return;
        const hash = location.hash.replace("#s=", "");
        const json = localStorage.getItem("state_" + hash);
        if (!json) return;
        const state = JSON.parse(json);
        //if (state.filters) currentFilters = state.filters;
        //if (state.sorts) tableState.sorts = state.sorts;
        tableState.filters = state.filters || [];
        tableState.sorts = state.sorts || [];
    }

    loadStateFromUrl()

    const filterOptions = [
        {key: "fullName", label: "Full Name"},
        {key: "email", label: "Email"},
        {key: "phone", label: "Phone"},
        {key: "subject", label: "Subject"},
        {key: "message", label: "Message"},
        {key: "contact", label: "Contact"},
        {key: "status", label: "Status"}
    ];

    // --- Modal helpers ---
    function openModal(content,{isDelete =false} ={}) {
        // modalBody.innerHTML = content;
        // modal.style.display = "block";
        const modalTitle = document.getElementById("modalTitle")
        const closeBtn = document.getElementById("closeModal")

        // Reset Modal
        modal.classList.remove("delete");
        modalBody.innerHTML = "";
        modalTitle.innerHTML =""

        //New content
        modalBody.innerHTML = content
        modal.style.display = "block";

        // Remove any errors before being submitted/touched
        modalBody.querySelectorAll(".error-icon").forEach(icon => icon.style.display = "none");
        modalBody.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));

        //Build them automatically later
        modalBody.querySelectorAll(".form-field").forEach(field => {
            if (!field.querySelector(".error-icon")) {
                const icon = document.createElement("i");
                icon.className = "fa-solid fa-exclamation-circle error-icon";
                console.log(icon);
                field.insertBefore(icon, field.querySelector(".error-message"));
            }
        });


        if (isDelete) {
            modal.classList.add("delete");
            closeBtn.style.display = "none";
        }else{
            closeBtn.style.display = "block";
        }

    }
    function closeModal() {
        modal.style.display = "none";
    }

    // closeModal.onclick = () => modal.style.display = "none";
    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = "none";
    };

    const filterContainer = document.getElementById("filterContainer");
    const sortContainer = document.getElementById("sortContainer");

    // --- Active Tags Rendering ---
    function renderActiveTags() {
        const filterCount = currentFilters.length;
        const sortCount = currentSorts.length;

        filterContainer.innerHTML = filterCount > 0
            ? `<div class="active-tag" data-type="filter">
                <div class="tag-number">
                    <span class="total-tags">${filterCount}</span>
                    <span class="tag-type">Filter${filterCount > 1 ? 's' : ''}</span>
                </div>
                <div class="delete-tag" data-type="filter">
                    <i class="fa-solid fa-close"></i>
                </div>
           </div>`
            : `<div class="filter-icon">
                <svg width="20" height="18" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 7H15V5H3M0 0V2H18V0M7 12H11V10H7V12Z" fill="#DB8A74"/>
                </svg>
                <span> Filter</span>
           </div>`;

        sortContainer.innerHTML = sortCount > 0
            ? `<div class="active-tag" data-type="sort">
                <div class="tag-number">
                    <span class="total-tags">${sortCount}</span>
                    <span class="tag-type">Sort${sortCount > 1 ? 's' : ''}</span>
                </div>
                <div class="delete-tag" data-type="sort">
                    <i class="fa-solid fa-close"></i>
                </div>
           </div>`
            : `<div class="sort-icon">
                <svg width="20" height="18" viewBox="0 0 20 18" fill="black" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 18L12 14H15V4H12L16 0L20 4H17V14H20M0 16V14H10V16M0 10V8H7V10M0 4V2H4V4H0Z" fill="#DB8A74"/>
                </svg>
                <span> Sort </span>
           </div>`;
    }

    // --- Event Delegation ---
    document.addEventListener('click', e => {

        // Delete single filter/sort
        if (e.target.closest('.delete-tag')) {
            e.stopPropagation(); // Prevent modal opening
            const type = e.target.closest('.delete-tag').dataset.type;
            if (type === 'filter') currentFilters = [];
            else if (type === 'sort') currentSorts = [];

            renderActiveTags();
            renderTable();
            return;
        }

        // Open Filter Modal
        if (e.target.closest('.filter-icon')) {
            openFilterModal();
        }

        // Open Sort Modal
        if (e.target.closest('.sort-icon')) {
            openSortModal();
        }
    });

    // --- Table Rendering ---
    function renderTable() {
        const cached = submissions.map(item => {
            let lc = {};
            for (let key in item) lc[key] = (item[key] || "").toString().toLowerCase();
            return {original: item, lc};
        });

        let filtered = cached.filter(({lc}) => {
            return currentFilters.every(f => {
                const cell = lc[f.field];
                const value = f.value.toLowerCase();
                return f.operator === "contains" ? cell.includes(value) : cell === value;
            });
        });

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
            // Rendering the active selected preferred contact
            document.querySelectorAll("td.actions").forEach(cell => {
            const id = parseInt(cell.querySelector(".info").dataset.id);
            const submission = submissions.find(sub => sub.id === id);

            const phoneIcon = cell.querySelector(".call");
            const emailIcon = cell.querySelector(".message");

            // Reset first (important if re-rendering)
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

        // Toast messages for each action
        if (currentFilters.length && currentSorts.length) {
            closeFilterModal()
            closeSortModal()
            Toast.showToast("Filters and sorting applied successfully", "success");
        } else if (currentFilters.length) {
            closeFilterModal()
            Toast.showToast("Filters applied successfully", "success");
        } else if (currentSorts.length) {
            closeSortModal()
            Toast.showToast("Sort applied successfully", "success");
        } else {
            //Toast.showToast("Showing all results", "info");
            closeSortModal()
            closeFilterModal()
        }

        renderActiveTags();
        actionHandlers(); // Your existing handlers for info, call, message, edit, delete
    }

    // --- Filter Modal Logic ---
    const filterModal = document.getElementById("filterModal");
    const filtersContainer = document.getElementById("filtersContainer");
    const filterOverlay = document.getElementById("filterOverlay");


    function openFilterModal() {
        filterModal.style.display = "flex";
        if (filterOverlay) {
            filterOverlay.style.display = "flex";
        }
        if (!filtersContainer.querySelector(".filter-row")) addFilterRow();
    }

    function closeFilterModal() {
        filterModal.style.display = "none";
        if (filterOverlay) {
            filterOverlay.style.display = "none";
        }
    }

    if (filterOverlay) {
        filterOverlay.addEventListener("click", e => {
            if (e.target === filterOverlay) closeFilterModal();
        });
    }


    function addFilterRow() {
        const row = document.createElement("div");
        row.className = "filter-row";
        row.innerHTML = `
             <div>
                <label class="form-label"> Column </label>
                 <select class="filter-field" name="Select your column" >
                    <option selected disabled hidden> Select column</option>
                    ${filterOptions.map(opt => `<option value="${opt.key}">${opt.label}</option>`).join("")}
                 </select>
            </div>
             <div>
                <label class="form-label"> Relation </label>
                 <select class="filter-operator">
                    <option selected disabled> Select relation</option>
                    <option value="contains">contains</option>
                    <option value="equals">equals</option>
                </select>   
             </div>
            <div>
            <label class="form-label"> Filter Value </label>
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

    function submitFilters() {
        currentFilters = [];
        filtersContainer.querySelectorAll(".filter-row").forEach(row => {
            const field = row.querySelector(".filter-field").value;
            const operator = row.querySelector(".filter-operator").value;
            const value = row.querySelector(".filter-value").value;
            if (value) currentFilters.push({field, operator, value});
        });
        saveStateToUrl();
        renderTable();
        filterModal.style.display = "none";
        filterOverlay.style.display = "none";
    }

    function resetFilters() {
        currentFilters = [];
        filtersContainer.innerHTML = "";
        saveStateToUrl();
        renderTable();
    }

    document.querySelector(".filter-icon").addEventListener("click", openFilterModal);
    //document.getElementById("applyFilters").addEventListener("click", submitFilters);
    //document.getElementById("resetFilters").addEventListener("click", resetFilters);

    // --- Sort Modal Logic ---
    const sortModal = document.getElementById("sortModal");
    const sortsContainer = document.getElementById("sortsContainer");
    const sortOverlay = document.getElementById("sortOverlay");
    // console.log(sortOverlay);

    function openSortModal() {
        if (sortOverlay) {
            sortOverlay.style.display = "flex";
        }
        sortModal.style.display = "flex";

        if (!sortsContainer.querySelector(".sort-row")) addSortRow();
    }

    function closeSortModal() {
        sortModal.style.display = "none";
        if (sortOverlay) {
            sortOverlay.style.display = "none";
        }
    }

    if (sortOverlay) {
        sortOverlay.addEventListener("click", e => {
            if (e.target === sortOverlay) closeSortModal();
        });
    }

    function addSortRow() {
        const row = document.createElement("div");
        row.className = "sort-row";
        row.innerHTML = `
            <div>
                <label class="form-label"> Column </label>
                <select class="sort-field">
                    ${filterOptions.map(opt => `<option value="${opt.key}">${opt.label}</option>`).join("")}
                </select>
            </div>
            <div>
                <label class="form-label"> Order</label>
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
        // Toast.showToast("Table sorted successfully", "success");
    }

    function submitSorts() {
        currentSorts = [];
        sortsContainer.querySelectorAll(".sort-row").forEach(row => {
            const field = row.querySelector(".sort-field").value;
            const order = row.querySelector(".sort-order").value;
            currentSorts.push({field, order});
        });
        saveStateToUrl();
        renderTable();
        sortModal.style.display = "none";
        sortOverlay.style.display = "none";
    }

    function resetSorts() {
        currentSorts = [];
        sortsContainer.innerHTML = "";
        saveStateToUrl();
        renderTable();
    }

    document.querySelector(".sort-icon").addEventListener("click", openSortModal);

    // Attach handlers
    function actionHandlers() {
        document.querySelectorAll(".info").forEach(icon => {
            icon.addEventListener("click", (e) => {
                const id = parseInt(e.target.dataset.id);
                const index = submissions.findIndex(sub => sub.id === id);
                const sub = submissions[index]
                openModal(`
                <h3 class="info-header">Ticket Info</h3>
                <p class="info-item"><b>Name:</b> ${sub.fullName}</p>
                <p class="info-item" ><b>Email:</b> ${sub.email}</p>
                <p class="info-item"><b>Subject:</b> ${sub.subject}</p>
                <p class="info-item"><b>Message:</b> ${sub.message}</p>
                <p class="info-item"><b>Status:</b> ${sub.status}</p>
                <p class="info-item"><b>Date:</b> ${sub.date}</p>
            `);
            });
        });

        document.querySelectorAll(".call").forEach(icon => {
            icon.addEventListener("click", (e) => {
                const id = parseInt(e.target.dataset.id);
                const index = submissions.findIndex(sub => sub.id === id);
                const sub = submissions[index]
                openModal(`
                                  <h3 class="info-header">Call</h3>
                                   <p class="info-item">Dialing <b>${sub.fullName}</b> at <b>${sub.phone || "N/A"}</b></p>
                           `);
            });
        });

        document.querySelectorAll(".message").forEach(icon => {
            icon.addEventListener("click", (e) => {
                const id = parseInt(e.target.dataset.id);
                const index = submissions.findIndex(sub => sub.id === id);
                const sub = submissions[index]
                openModal(`
                <h3 class="info-header">Send Message</h3>
                <p class="info-item">To: <b>${sub.email}</b></p>
                <textarea class="modal-textarea" rows="4" style="width:100%"></textarea>
                <button class="btn btn-primary" id="sendBtn">Send</button>
            `);
                document.getElementById("sendBtn").onclick = () => {
                    const reply = document.querySelector((".modal-textarea"));
                    const subject = encodeURIComponent("Tatua Ticket #" + sub.id + ":" + sub.message)
                    const body = encodeURIComponent("Hello " + sub.fullName + ", \n\n" + reply.value.trim());

                    window.location.href = `mailto:${sub.email}? subject=${subject}&body=${body}`;
                    Toast.showToast("Message sent successfully.", "success");
                    // alert("Message sent to " + sub.email);
                    modal.style.display = "none";
                };

            });
        });

        // Show preview + enable deleting attachments
        function showAttachments(index) {
            const container = document.getElementById("attachmentPreview");
            container.innerHTML = "";

            submissions[index].attachments.forEach((file, i) => {
                const wrapper = document.createElement("div");
                wrapper.classList.add("attachment-item");

                if (file.type.startsWith("image/")) {
                    wrapper.innerHTML = `
                    <img src="${file.data}" alt="${file.name}" width="100">
                    <span>${file.name}</span>
                    <button  class="remove-attachment delete-btn" data-index="${i}">Remove</button>
                `;
                } else {
                    wrapper.innerHTML = `
                    <a href="${file.data}" download="${file.name}">${file.name}</a>
                    <button  class="remove-attachment delete-btn" data-index="${i}">Remove</button>
                `;
                }

                container.appendChild(wrapper);
            });

            // Attach delete handlers
            container.querySelectorAll(".remove-attachment").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const fileIndex = parseInt(e.target.dataset.index, 10);

                    // Remove selected attachment
                    submissions[index].attachments.splice(fileIndex, 1);

                    // Save immediately
                    storage.saveSubmissions(submissions[index]);
                    Toast.showToast("File deleted successfully", "success")
                    // Re-render preview
                    showAttachments(index);
                });
            });
        }

        document.querySelectorAll(".edit").forEach(icon => {
            icon.addEventListener("click", (e) => {
                const id = parseInt(e.target.dataset.id);
                const index = submissions.findIndex(sub => sub.id === id);
                const sub = submissions[index];

                openModal(`
                  <h3 class="info-header">Edit Ticket</h3>
                 <form id="editTicketForm" data-id="${id}">
  <!-- Full Name -->
  <div class="form-row">
    <label class="form-label" for="editName">Full Name:</label>
    <div class="form-field">
      <input type="text" id="editName" name="fullName" value="${sub.fullName}">
      <i class="fa-solid fa-circle-exclamation error-icon"></i>
      <span class="error-message" id="editNameError"></span>
    </div>
  </div>

  <!-- Email -->
  <div class="form-row">
    <label class="form-label" for="editEmail">Email Address:</label>
    <div class="form-field">
      <input type="email" id="editEmail" name="email" value="${sub.email}">
      <i class="fa-solid fa-circle-exclamation error-icon"></i>
      <span class="error-message" id="editEmailError"></span>
    </div>
  </div>

                      <!-- Phone -->
                      <div class="form-row">
                        <label class="form-label" for="editPhone">Phone Number:</label>
                        <div class="form-field">
                          <input type="tel" id="editPhone" name="phone" value="${sub.phone}">
                          <i class="fa-solid fa-circle-exclamation error-icon"></i>
                          <span class="error-message" id="editPhoneError"></span>
                        </div>
                      </div>
                    
                      <!-- Subject -->
                      <div class="form-row">
                        <label class="form-label" for="editSubject">Subject:</label>
                        <div class="form-field">
                          <select id="editSubject" name="subject">
                            <option value="Web Development" ${sub.subject === "Web Development" ? "selected" : ""}>Web Development</option>
                            <option value="App Development" ${sub.subject === "App Development" ? "selected" : ""}>App Development</option>
                            <option value="Other" ${sub.subject === "Other" ? "selected" : ""}>Other</option>
                          </select>
                          <i class="fa-solid fa-circle-exclamation error-icon"></i>
                          <span class="error-message" id="editSubjectError"></span>
                        </div>
                      </div>
                    
                      <!-- Message -->
                      <div class="form-row">
                        <label class="form-label" for="editMessage">Message:</label>
                        <div class="form-field">
                          <textarea id="editMessage" name="message" rows="6">${sub.message}</textarea>
                          <i class="fa-solid fa-circle-exclamation error-icon"></i>
                          <small class="error-message" id="editMessageError"></small>
                        </div>
                      </div>
                    
                      <!-- Preferred Contact -->
                      <div class="form-row">
                        <label class="form-label">Preferred Contact:</label>
                        <div class="form-field">
                          <label>
                            <input type="radio" name="contact" value="email" ${sub.contact === "email" ? "checked" : ""}> Email
                          </label>
                          <label>
                            <input type="radio" name="contact" value="phone" ${sub.contact === "phone" ? "checked" : ""}> Phone
                          </label>
                          <i class="fa-solid fa-circle-exclamation error-icon"></i>
                          <span class="error-message" id="editContactError"></span>
                        </div>
                      </div>
                    
                      <!-- File Upload -->
                      <div class="form-row">
                        <label class="form-label" for="editAttachment">Attachments:</label>
                        <div class="form-field">
                          <input type="file" id="editAttachment" name="attachment" multiple accept=".pdf,image/png,image/jpeg,image/jpg">
                          <i class="fa-solid fa-circle-exclamation error-icon"></i>
                          <div class="form-hints">
                            <span class="help-text">Only PDF, images (.jpeg, .jpg, .png) up to 1MB.</span>
                            <span class="error-message" id="editAttachmentError"></span>
                          </div>
                          <div id="attachmentPreview"></div>
                        </div>
                      </div>  
                    
                      <!-- Status -->
                      <div class="form-row">
                        <label class="form-label" for="editStatus">Status:</label>
                        <div class="form-field">
                          <select id="editStatus" name="status">
                            <option value="Open" ${sub.status === "Open" ? "selected" : ""}>Open</option>
                            <option value="Closed" ${sub.status === "Closed" ? "selected" : ""}>Closed</option>
                            <option value="Pending" ${sub.status === "Pending" ? "selected" : ""}>Pending</option>
                          </select>
                          <i class="fa-solid fa-circle-exclamation error-icon"></i>
                          <span class="error-message" id="editStatusError"></span>
                        </div>
                      </div>
                    
                      <!-- Save -->
                      <div class="form-btn">
                        <button type="submit" class="btn btn-primary">Save</button>
                        <button type="reset" class="btn btn-secondary">Clear</button>
                      </div>
                    </form>

                 `);

                // Show existing attachments in preview
                showAttachments(index);

                // 2Form now exists in the DOM
                const editForm = document.getElementById("editTicketForm");

                // Initialize validation and submit handling
                window.initFormValidation(editForm, async (form) => {
                    const formData = new FormData(form);
                    let attachments = submissions[index].attachments || [];

                    if (form.editAttachment && form.editAttachment.files.length > 0) {
                        const files = Array.from(form.editAttachment.files);
                        const newAttachments = await Promise.all(files.map(file => {
                            return new Promise(resolve => {
                                const reader = new FileReader();
                                reader.onload = () => resolve({ name: file.name, type: file.type, data: reader.result });
                                reader.readAsDataURL(file);
                            });
                        }));

                        // Append new files to existing attachments
                        attachments = attachments.concat(newAttachments);
                    }


                    submissions[index] = {
                        ...submissions[index],
                        fullName: formData.get("fullName"),
                        email: formData.get("email"),
                        phone: formData.get("phone"),
                        subject: formData.get("subject"),
                        message: formData.get("message"),
                        contact: formData.get("contact"),
                        attachments,
                        status: formData.get("status")
                    };

                    await storage.saveSubmissions(submissions);
                    Toast.showToast("Ticket updated successfully!", "success");
                    renderTable();
                    modal.style.display = "none";
                });
            });
        });
        // Save button handler
                // document.getElementById("saveEdit").onclick = () => {
                //     submissions[index].fullName = document.getElementById("editName").value;
                //     submissions[index].email = document.getElementById("editEmail").value;
                //     submissions[index].phone = document.getElementById("editPhone").value;
                //     submissions[index].subject = document.getElementById("editSubject").value;
                //     submissions[index].message = document.getElementById("editMessage").value;
                //     submissions[index].status = document.getElementById("editStatus").value;
                //     submissions[index].contact = document.querySelector('input[name="contact"]:checked').value;
                //
                //     // Handle new file uploads (append to existing attachments)
                //     const fileInput = document.getElementById("editAttachment");
                //     if (fileInput.files.length > 0) {
                //         const files = Array.from(fileInput.files);
                //         const promises = files.map(file => {
                //             return new Promise(resolve => {
                //                 const reader = new FileReader();
                //                 reader.onload = () => {
                //                     resolve({
                //                         name: file.name,
                //                         type: file.type,
                //                         data: reader.result
                //                     });
                //                 };
                //                 reader.readAsDataURL(file);
                //             });
                //         });
                //
                //         Promise.all(promises).then(results => {
                //             submissions[index].attachments.push(...results);
                //             storage.saveSubmissions("submissions", JSON.stringify(submissions));
                //             renderTable();
                //             Toast.showToast("Form edited successfully", "success");
                //             modal.style.display = "none";
                //         });
                //     } else {
                //         // No new files, just save edits
                //         storage.saveSubmissions("submissions", JSON.stringify(submissions));
                //         renderTable();
                //         Toast.showToast("Form edited successfully", "success");
                //         modal.style.display = "none";
                //     }
                // };

        document.querySelectorAll(".download").forEach(icon => {
            icon.addEventListener("click", (e) => {
                const id = parseInt(e.target.dataset.id);
                const sub = submissions.find(sub => sub.id === id);

                if (!sub.attachments || sub.attachments.length === 0) {
                    Toast.showToast("No attachment to preview.", "error");
                    return;
                }

                let currentIndex = 0;

                function base64ToBlob(dataUrl) {
                    const [header, base64] = dataUrl.split(',');
                    const mimeType = header.match(/:(.*?);/)[1];
                    const byteString = atob(base64);
                    const byteArray = Uint8Array.from(byteString, c => c.charCodeAt(0));
                    return new Blob([byteArray], {type: mimeType});
                }

                // Render Preview
                function renderPreview(index) {
                    const file = sub.attachments[index];
                    const blob = base64ToBlob(file.data);
                    const url = URL.createObjectURL(blob);

                    const modalBody = document.getElementById("modalBody");
                    const modalTitle = document.getElementById("modalTitle");

                    // Show file name + position
                    modalTitle.textContent = `File ${index + 1} of ${sub.attachments.length}: ${file.name}`;
                    modalTitle.style.display = "block"; // show title

                    modalBody.innerHTML = "";

                    if (file.type.startsWith("image/")) {
                        const img = document.createElement("img");
                        img.src = url;
                        img.style.maxWidth = "100%";
                        img.style.marginTop = "1rem";
                        img.style.maxHeight = "80vh";
                        modalBody.appendChild(img);
                    } else if (file.type === "application/pdf") {
                        const iframe = document.createElement("iframe");
                        iframe.src = url;
                        iframe.style.marginTop = "1rem";
                        iframe.style.width = "100%";
                        iframe.style.height = "80vh";
                        modalBody.appendChild(iframe);
                    } else {
                        modalBody.innerHTML = `<p>Preview not available. You can download the file.</p>`;
                    }

                    // Download button
                    const downloadBtn = document.getElementById("downloadFile");
                    downloadBtn.style.display = "inline-block"; // show download button
                    downloadBtn.onclick = () => {
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = file.name || `attachment_${sub.id}_${index}`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    };

                    // Arrows visibility
                    document.getElementById("prevFile").style.display = (index > 0) ? "inline-block" : "none";
                    document.getElementById("nextFile").style.display = (index < sub.attachments.length - 1) ? "inline-block" : "none";
                }

                // Controls
                const prevBtn = document.getElementById("prevFile");
                const nextBtn = document.getElementById("nextFile");

                prevBtn.onclick = () => {
                    if (currentIndex > 0) {
                        currentIndex--;
                        renderPreview(currentIndex);
                    }
                };

                nextBtn.onclick = () => {
                    if (currentIndex < sub.attachments.length - 1) {
                        currentIndex++;
                        renderPreview(currentIndex);
                    }
                };

                //  Keyboard navigation
                function handleKeyNav(e) {
                    if (e.key === "Escape") {
                        closeModal();
                    } else if (e.key === "ArrowLeft") {
                        if (currentIndex > 0) {
                            currentIndex--;
                            renderPreview(currentIndex);
                        }
                    } else if (e.key === "ArrowRight") {
                        if (currentIndex < sub.attachments.length - 1) {
                            currentIndex++;
                            renderPreview(currentIndex);
                        }
                    }
                }

                // Close modal function
                function closeModal() {
                    const modal = document.getElementById("modal");
                    modal.style.display = "none";
                    document.getElementById("modalBody").innerHTML = "";
                    document.getElementById("modalControls").style.display = "none";
                    document.getElementById("modalTitle").style.display = "none";
                    document.getElementById("downloadFile").style.display = "none";
                    document.removeEventListener("keydown", handleKeyNav); // remove keyboard listener
                }

                // Show modal
                const modal = document.getElementById("modal");
                modal.style.display = "flex";
                document.getElementById("modalControls").style.display = "flex";
                renderPreview(currentIndex);

                // Attach close + keyboard
                document.getElementById("closeModal").onclick = closeModal;
                document.addEventListener("keydown", handleKeyNav);
            });
        });


        // document.querySelectorAll(".download").forEach(icon => {
        //     icon.addEventListener("click", (e) => {
        //         const id = parseInt(e.target.dataset.id);
        //         const index = submissions.findIndex(sub => sub.id === id);
        //         const sub = submissions[index];
        //
        //         if (!sub.attachments || sub.attachments.length === 0) {
        //             Toast.showToast("No attachments to download for this ticket.", "error");
        //             return;
        //         }
        //
        //         // Helper to convert base64 -> Blob
        //         function base64ToBlob(dataUrl) {
        //             const [header, base64] = dataUrl.split(',');
        //             const mimeType = header.match(/:(.*?);/)[1];
        //             const byteString = atob(base64);
        //             const byteArray = Uint8Array.from(byteString, c => c.charCodeAt(0));
        //             return new Blob([byteArray], { type: mimeType });
        //         }
        //
        //         // Show previews for each file
        //         sub.attachments.forEach((file, idx) => {
        //             const blob = base64ToBlob(file.data);
        //             const url = URL.createObjectURL(blob);
        //
        //             // Preview in a new tab if PDF or image
        //             if (file.type.startsWith("image/") || file.type === "application/pdf") {
        //                 const previewWindow = window.open(url, "_blank");
        //                 if (!previewWindow) {
        //                     Toast.showToast("Popup blocked. Allow popups to preview.", "warning");
        //                 }
        //             }
        //
        //             // Trigger download
        //             const a = document.createElement("a");
        //             a.href = url;
        //             a.download = file.name || `attachment_${sub.id}_${idx + 1}`;
        //             document.body.appendChild(a);
        //             a.click();
        //             document.body.removeChild(a);
        //
        //             // Clean up
        //             URL.revokeObjectURL(url);
        //         });
        //     });
        // });

        // Delete submission
        function deleteSubmission(id) {
            const index = submissions.findIndex(sub => sub.id === id);

            if (index !== -1) {
                submissions.splice(index, 1);
                storage.saveSubmissions("submissions", JSON.stringify(submissions));
                renderTable();
                Toast.showToast("Ticket deleted Successfully!", "success");
            } else {
                Toast.showToast("Ticket not found.", "error");
            }
        }

        document.querySelectorAll(".delete").forEach(icon => {
            icon.addEventListener("click", (e) => {
                const id = parseInt(e.currentTarget.dataset.id);

                openModal(`
                    <div class="delete-modal">
                        <div class="">
                            <p class="info-header">Are you sure you want to delete?</p>
                        </div>
                        <div class="delete-confirmation"> 
                            <button id="cancelBtn" class="btn ">Cancel</button>
                            <button class="confirm-delete btn delete-btn " data-id="${id}">Yes</button> 
                        </div>
                    </div>
                `, {isDelete: true});

                // Hide the default close button for the modals
                document.getElementById("closeModal").style.display = "none";

                const cancelBtn = document.getElementById("cancelBtn");
                // Attach handlers after modal opens
                cancelBtn.addEventListener("click", closeModal)
                document.querySelector(".confirm-delete").addEventListener("click", (ev) => {
                    const submissionId = parseInt(ev.target.dataset.id);
                    deleteSubmission(submissionId);
                    closeModal()
                });
            });
        });

    }

    // Close modals
    document.addEventListener('click', (e) => {
        const closeBtn = e.target.closest('.close');
        if (closeBtn) {
            const modal = closeBtn.closest('.modal');
            if (modal) modal.style.display = 'none';
            sortOverlay.style.display = 'none';
            filterOverlay.style.display = 'none';
        }
    });



    // Refresh Icon
    document.querySelector(".refresh-icon").addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();

        location.reload();
    })
    renderTable();
    document.querySelector(".filter-icon").addEventListener("click", openFilterModal);
    document.querySelector(".sort-icon").addEventListener("click", openSortModal);
    document.querySelector(".add-filter").addEventListener("click", addFilterRow);
    document.querySelector(".add-sort").addEventListener("click", addSortRow);
    document.getElementById("applyFilterBtn").addEventListener("click", submitFilters);
    document.getElementById("resetFilterBtn").addEventListener("click", resetFilters);
    document.getElementById("applySortBtn").addEventListener("click", submitSorts);
    document.getElementById("resetSortBtn").addEventListener("click", resetSorts);
    document.querySelectorAll(".close-filter-sort").forEach(btn => {
        btn.addEventListener("click", () => {
            const modal = btn.closest(".style-modal");
            modal.style.display = "none";

            if (modal.id === "filterModal") {
                filterOverlay.style.display = "none";
            } else if (modal.id === "sortModal") {
                sortOverlay.style.display = "none";
            }
        });
    });


})