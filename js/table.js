document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector("#ticketsTable tbody");
    const closeBtn = document.querySelectorAll(".close");
    if (!tableBody) return;

    let submissions = storage.getSubmissions();
    const modal = document.getElementById("modal");
    const modalBody = document.getElementById("modalBody");
    const closeModal = document.getElementById("closeModal");

    // --- Filter & Sort State ---
    let currentFilters = [];
    let currentSorts = [];

    const filterOptions = [
        { key: "fullName", label: "Full Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "subject", label: "Subject" },
        { key: "message", label: "Message" },
        { key: "contact", label: "Contact" },
        { key: "status", label: "Status" }
    ];

    // --- Modal helpers ---
    function openModal(content) {
        modalBody.innerHTML = content;
        modal.style.display = "block";
    }

    closeModal.onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

    // --- URL State Persistence ---
    function saveStateToUrl() {
        const state = { filters: currentFilters, sorts: currentSorts };
        const hash = btoa(JSON.stringify(state)).slice(0, 12);
        localStorage.setItem("state_" + hash, JSON.stringify(state));
        history.replaceState(null, "", location.pathname + "#s=" + hash);
    }

    function loadStateFromUrl() {
        if (!location.hash.startsWith("#s=")) return;
        const hash = location.hash.replace("#s=", "");
        const json = localStorage.getItem("state_" + hash);
        if (!json) return;
        const state = JSON.parse(json);
        if (state.filters) currentFilters = state.filters;
        if (state.sorts) currentSorts = state.sorts;
    }

    loadStateFromUrl();

    // --- Table Rendering with filters & sorts ---
    function renderTable() {
        let filtered = [...submissions];

        // Apply filters
        currentFilters.forEach(f => {
            filtered = filtered.filter(item => {
                const cell = (item[f.field] || "").toString().toLowerCase();
                return f.operator === "contains"
                    ? cell.includes(f.value.toLowerCase())
                    : cell === f.value.toLowerCase();
            });
        });

        // Apply sorts
        if (currentSorts.length) {
            filtered.sort((a, b) => {
                for (let rule of currentSorts) {
                    let v1 = (a[rule.field] || "").toString().toLowerCase();
                    let v2 = (b[rule.field] || "").toString().toLowerCase();
                    if (v1 < v2) return rule.order === "asc" ? -1 : 1;
                    if (v1 > v2) return rule.order === "asc" ? 1 : -1;
                }
                return 0;
            });
        }

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
        });

        actionHandlers();
    }

    // --- Filter Modal Logic ---
    const filterModal = document.getElementById("filterModal");
    const filtersContainer = document.getElementById("filtersContainer");

    function openFilterModal() {
        filterModal.style.display = "flex";
        if (!filtersContainer.querySelector(".filter-row")) addFilterRow();
    }

    function addFilterRow() {
        const row = document.createElement("div");
        row.className = "filter-row";
        row.innerHTML = `
             <div>
                <label> Column </label>
                 <select class="filter-field">
                 <option selected disabled> Select column</option>
                  ${filterOptions.map(opt => `<option value="${opt.key}">${opt.label}</option>`).join("")}
                 </select>
            </div>
             <div>
                <label> Relation </label>
                 <select class="filter-operator">
                    <option selected disabled> Select relation</option>
                    <option value="contains">contains</option>
                    <option value="equals">equals</option>
                </select>   
             </div>
            <div>
            <label> Filter Value </label>
              <input type="text" class="filter-value" placeholder="Enter value">

            </div>
           
           
            <span class="trash" onclick="this.parentElement.remove()"> 
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M9 3V4H4V6H5V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V6H20V4H15V3H9ZM7 6H17V19H7V6ZM9 8V17H11V8H9ZM13 8V17H15V8H13Z" fill="#A10900"/>
                </svg>
            </span>        `;
        filtersContainer.appendChild(row);
    }

    function submitFilters() {
        currentFilters = [];
        filtersContainer.querySelectorAll(".filter-row").forEach(row => {
            const field = row.querySelector(".filter-field").value;
            const operator = row.querySelector(".filter-operator").value;
            const value = row.querySelector(".filter-value").value;
            if (value) currentFilters.push({ field, operator, value });
        });
        saveStateToUrl();
        renderTable();
        filterModal.style.display = "none";
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

    function openSortModal() {
        sortModal.style.display = "flex";
        if (!sortsContainer.querySelector(".sort-row")) addSortRow();
    }

    function addSortRow() {
        const row = document.createElement("div");
        row.className = "sort-row";
        row.innerHTML = `
            <div>
                <label> Column </label>
                <select class="sort-field">
                    ${filterOptions.map(opt => `<option value="${opt.key}">${opt.label}</option>`).join("")}
                </select>
            </div>
            <div>
                <label> Order</label>
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

    function submitSorts() {
        currentSorts = [];
        sortsContainer.querySelectorAll(".sort-row").forEach(row => {
            const field = row.querySelector(".sort-field").value;
            const order = row.querySelector(".sort-order").value;
            currentSorts.push({ field, order });
        });
        saveStateToUrl();
        renderTable();
        sortModal.style.display = "none";
    }

    function resetSorts() {
        currentSorts = [];
        sortsContainer.innerHTML = "";
        saveStateToUrl();
        renderTable();
    }

    document.querySelector(".sort-icon").addEventListener("click", openSortModal);
    // document.getElementById("applySorts").addEventListener("click", submitSorts);
    // document.getElementById("resetSorts").addEventListener("click", resetSorts);

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
                    const subject = encodeURIComponent("Tatua Ticket #" + sub.id +":" + sub.message)
                    const body = encodeURIComponent("Hello " + sub.fullName+ ", \n\n" + reply.value.trim());

                    window.location.href = `mailto:${sub.email}? subject=${subject}&body=${body}`;
                    Toast.showToast("Message sent successfully.", "success");
                    // alert("Message sent to " + sub.email);
                    modal.style.display = "none";
                };

            });
        });

        document.querySelectorAll(".edit").forEach(icon => {
            icon.addEventListener("click", (e) => {
                const id = parseInt(e.target.dataset.id);
                const index = submissions.findIndex(sub => sub.id === id);
                const sub = submissions[index];
                openModal(`
                       <h3 class="info-header">Edit Ticket</h3>
                       <form id="editTicketForm">
                            <div class="form-row">
                                <label class="form-label" for="editName">Full Name:</label>
                                <input type="text" id="editName" name="fullName" value="${sub.fullName}">
                            </div>
                        
                            <div class="form-row">
                                <label class="form-label" for="editEmail">Email Address:</label>
                                <input type="email" id="editEmail" name="email" value="${sub.email}">
                            </div>
                        
                            <div class="form-row">
                                <label class="form-label" for="editPhone">Phone Number:</label>
                                <input type="tel" id="editPhone" name="phone" value="${sub.phone}">
                            </div>
                        
                            <div class="form-row">
                                <label class="form-label" for="editSubject">Subject:</label>
                                <select id="editSubject" name="subject">
                                    <option value="Web Development" ${sub.subject==="Web Development"?"selected":""}>Web Development</option>
                                    <option value="App Development" ${sub.subject==="App Development"?"selected":""}>App Development</option>
                                    <option value="Other" ${sub.subject==="Other"?"selected":""}>Other</option>
                                </select>
                            </div>
                        
                            <div class="form-row">
                                <label class="form-label" for="editMessage">Message:</label>
                                <textarea id="editMessage" name="message" rows="6">${sub.message}</textarea>
                            </div>
                        
                            <div class="form-row">
                                <label class="form-label" for="editContact">Preferred Contact:</label>
                                <label class="form-check">
                                    <input type="radio" name="contact" value="email" ${sub.contact==="email"?"checked":""}>
                                    Email
                                </label>
                                <label class="form-check">
                                    <input type="radio" name="contact" value="phone" ${sub.contact==="phone"?"checked":""}>
                                    Phone
                                </label>
                            </div>
                        
                            <div class="form-row">
                                <label class="form-label" for="editStatus">Status:</label>
                                <select id="editStatus" name="status">
                                    <option value="Open" ${sub.status==="Open"?"selected":""}>Open</option>
                                    <option value="Closed" ${sub.status==="Closed"?"selected":""}>Closed</option>
                                    <option value="Pending" ${sub.status==="Pending"?"selected":""}>Pending</option>
                                </select>
                            </div>
                        
                            <div class="form-row">
                            <button type="button" class="btn btn-primary" id="saveEdit">Save</button>
                        </div>
                        </form>
                        `);
                document.getElementById("saveEdit").onclick = () => {
                    const id = parseInt(e.target.dataset.id);
                    const index = submissions.findIndex(sub => sub.id === id);
                    submissions[index].fullName = document.getElementById("editName").value;
                    submissions[index].email = document.getElementById("editEmail").value;
                    submissions[index].subject = document.getElementById("editSubject").value;
                    submissions[index].message = document.getElementById("editMessage").value;
                    submissions[index].status = document.getElementById("editStatus").value;
                    submissions[index].contact = document.querySelector('input[name="contact"]:checked').value;
                    localStorage.setItem("submissions", JSON.stringify(submissions));
                    renderTable();
                    modal.style.display = "none";
                };

            });
        });
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
                    return new Blob([byteArray], { type: mimeType });
                }

                // Render Preview
                function renderPreview(index) {
                    const file = sub.attachments[index];
                    const blob = base64ToBlob(file.data);
                    const url = URL.createObjectURL(blob);

                    const modalBody = document.getElementById("modalBody");
                    const modalTitle = document.getElementById("modalTitle");

                    // ✅ Show file name + position
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

                    // ✅ Download button
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

                    // ✅ Arrows visibility
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



        document.querySelectorAll(".delete").forEach(icon => {
            icon.addEventListener("click", (e) => {
                const id = parseInt(e.target.dataset.id);
                const confirmed = confirm("Are you sure you want to delete this?")
                if (confirmed) {
                    // Find the index of the item with this ID
                    const index = submissions.findIndex(sub => sub.id === id);

                    // Non-negative index
                    if (index !== -1) {
                        submissions.splice(index, 1); // remove that item
                        localStorage.setItem("submissions", JSON.stringify(submissions));
                        renderTable();
                        Toast.showToast("Ticket deleted Successfully!", "success");
                        // alert("Ticket deleted successfully!");
                    } else {
                        Toast.showToast("Ticket not found.", "error");
                        // alert("Ticket not found!");
                    }
                }
            })
        })
    }

    // Close modals
    closeBtn.forEach(btn => {
        btn.addEventListener("click", () => {
            btn.closest(".modal").style.display = "none";
        });
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
            btn.closest(".style-modal").style.display = "none";
        });
    });

})