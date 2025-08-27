/**
 * Attaches action handlers for table row actions.
 * @param {Array} submissions - Array of submission objects.
 * @param {Object} storage - Storage object for saving submissions.
 * @param {Function} openModal - Function to open a modal.
 * @param {Function} closeModal - Function to close a modal.
 * @param {Function} showToast - Toast notification function.
 * @param {Function} renderTable - Function to render the table.
 */
export function actionHandlers(submissions, storage, openModal, closeModal, showToast, renderTable) {
    // Info action
    document.querySelectorAll(".info").forEach(icon => {
        icon.addEventListener("click", (e) => {
            const id = parseInt(e.target.dataset.id);
            const sub = submissions.find(sub => sub.id === id);
            if (!sub) return;
            openModal(`
                <h3 class="info-header">Ticket Info</h3>
                <p class="info-item"><b>Name:</b> ${sub.fullName}</p>
                <p class="info-item"><b>Email:</b> ${sub.email}</p>
                <p class="info-item"><b>Subject:</b> ${sub.subject}</p>
                <p class="info-item"><b>Message:</b> ${sub.message}</p>
                <p class="info-item"><b>Status:</b> ${sub.status}</p>
                <p class="info-item"><b>Date:</b> ${sub.date}</p>
            `);
        });
    });

    // Call action
    document.querySelectorAll(".call").forEach(icon => {
        icon.addEventListener("click", (e) => {
            const id = parseInt(e.target.dataset.id);
            const sub = submissions.find(sub => sub.id === id);
            if (!sub) return;
            openModal(`
                <h3 class="info-header">Call</h3>
                <p class="info-item">Dialing <b>${sub.fullName}</b> at <b>${sub.phone || "N/A"}</b></p>
            `);
        });
    });

    // Message action
    document.querySelectorAll(".message").forEach(icon => {
        icon.addEventListener("click", (e) => {
            const id = parseInt(e.target.dataset.id);
            const sub = submissions.find(sub => sub.id === id);
            if (!sub) return;
            openModal(`
                <h3 class="info-header">Send Message</h3>
                <p class="info-item">To: <b>${sub.email}</b></p>
                <textarea class="modal-textarea" rows="4" style="width:100%"></textarea>
                <button class="btn btn-primary" id="sendBtn">Send</button>
            `);
            document.getElementById("sendBtn").onclick = () => {
                const reply = document.querySelector(".modal-textarea");
                const subject = encodeURIComponent("Tatua Ticket #" + sub.id + ":" + sub.message);
                const body = encodeURIComponent("Hello " + sub.fullName + ", \n\n" + reply.value.trim());
                window.location.href = `mailto:${sub.email}?subject=${subject}&body=${body}`;
                showToast("Message sent successfully.", "success");
                closeModal(document.getElementById("modal"));
            };
        });
    });

    // Edit action
    document.querySelectorAll(".edit").forEach(icon => {
        icon.addEventListener("click", (e) => {
            const id = parseInt(e.target.dataset.id);
            const index = submissions.findIndex(sub => sub.id === id);
            const sub = submissions[index];
            if (!sub) return;

            openModal(`
                <h3 class="info-header">Edit Ticket</h3>
                <form id="editTicketForm" data-id="${id}">
                    <div class="form-row">
                        <label class="form-label" for="editName">Full Name:</label>
                        <div class="form-field">
                            <input type="text" id="editName" name="fullName" value="${sub.fullName}">
                            <span class="error-message" id="editNameError"></span>
                        </div>
                    </div>
                    <div class="form-row">
                        <label class="form-label" for="editEmail">Email Address:</label>
                        <div class="form-field">
                            <input type="email" id="editEmail" name="email" value="${sub.email}">
                            <span class="error-message" id="editEmailError"></span>
                        </div>
                    </div>
                    <div class="form-row">
                        <label class="form-label" for="editPhone">Phone Number:</label>
                        <div class="form-field">
                            <input type="tel" id="editPhone" name="phone" value="${sub.phone}">
                            <span class="error-message" id="editPhoneError"></span>
                        </div>
                    </div>
                    <div class="form-row">
                        <label class="form-label" for="editSubject">Subject:</label>
                        <div class="form-field">
                            <select id="editSubject" name="subject">
                                <option value="Web Development" ${sub.subject === "Web Development" ? "selected" : ""}>Web Development</option>
                                <option value="App Development" ${sub.subject === "App Development" ? "selected" : ""}>App Development</option>
                                <option value="Other" ${sub.subject === "Other" ? "selected" : ""}>Other</option>
                            </select>
                            <span class="error-message" id="editSubjectError"></span>
                        </div>
                    </div>
                    <div class="form-row">
                        <label class="form-label" for="editMessage">Message:</label>
                        <div class="form-field">
                            <textarea id="editMessage" name="message" rows="6">${sub.message}</textarea>
                            <small class="error-message" id="editMessageError"></small>
                        </div>
                    </div>
                    <div class="form-row">
                        <label class="form-label">Preferred Contact:</label>
                        <label>
                            <input type="radio" name="contact" value="email" ${sub.contact === "email" ? "checked" : ""}> Email
                        </label>
                        <label>
                            <input type="radio" name="contact" value="phone" ${sub.contact === "phone" ? "checked" : ""}> Phone
                        </label>
                        <span class="error-message" id="editContactError"></span>
                    </div>
                    <div class="form-row">
                        <label class="form-label" for="editAttachment">Attachments:</label>
                        <div class="form-field">
                            <input type="file" id="editAttachment" name="attachment" class="form-control" multiple accept=".pdf,image/png,image/jpeg,image/jpg">
                            <div class="form-hints">
                                <span class="help-text">Only PDF, images (.jpeg, .jpg, .png) up to 1MB.</span>
                                <span class="error-message" id="editAttachmentError"></span>
                            </div>
                            <div id="attachmentPreview"></div>
                        </div>
                    </div>
                    <div class="form-row">
                        <label class="form-label" for="editStatus">Status:</label>
                        <div class="form-field">
                            <select id="editStatus" name="status">
                                <option value="Open" ${sub.status === "Open" ? "selected" : ""}>Open</option>
                                <option value="Closed" ${sub.status === "Closed" ? "selected" : ""}>Closed</option>
                                <option value="Pending" ${sub.status === "Pending" ? "selected" : ""}>Pending</option>
                            </select>
                            <span class="error-message" id="editStatusError"></span>
                        </div>
                    </div>
                    <div class="form-row">
                        <button type="submit" class="btn btn-primary">Save</button>
                    </div>
                </form>
            `);

            // Show existing attachments
            showAttachments(index, submissions, storage, showToast);

            // Handle form submission
            const editForm = document.getElementById("editTicketForm");
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
                showToast("Ticket updated successfully!", "success");
                renderTable();
                closeModal(document.getElementById("modal"));
            });
        });
    });

    // Download action
    document.querySelectorAll(".download").forEach(icon => {
        icon.addEventListener("click", (e) => {
            const id = parseInt(e.target.dataset.id);
            const sub = submissions.find(sub => sub.id === id);
            if (!sub || !sub.attachments || sub.attachments.length === 0) {
                showToast("No attachment to preview.", "error");
                return;
            }

            let currentIndex = 0;

            function renderPreview(index) {
                const file = sub.attachments[index];
                const blob = base64ToBlob(file.data);
                const url = URL.createObjectURL(blob);

                const modalBody = document.getElementById("modalBody");
                const modalTitle = document.getElementById("modalTitle");
                modalTitle.textContent = `File ${index + 1} of ${sub.attachments.length}: ${file.name}`;
                modalTitle.style.display = "block";
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

                const downloadBtn = document.getElementById("downloadFile");
                downloadBtn.style.display = "inline-block";
                downloadBtn.onclick = () => {
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = file.name || `attachment_${sub.id}_${index}`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                };

                document.getElementById("prevFile").style.display = index > 0 ? "inline-block" : "none";
                document.getElementById("nextFile").style.display = index < sub.attachments.length - 1 ? "inline-block" : "none";
            }

            function handleKeyNav(e) {
                if (e.key === "Escape") {
                    closeModal(document.getElementById("modal"));
                } else if (e.key === "ArrowLeft" && currentIndex > 0) {
                    currentIndex--;
                    renderPreview(currentIndex);
                } else if (e.key === "ArrowRight" && currentIndex < sub.attachments.length - 1) {
                    currentIndex++;
                    renderPreview(currentIndex);
                }
            }

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

            document.getElementById("modal").style.display = "flex";
            document.getElementById("modalControls").style.display = "flex";
            renderPreview(currentIndex);
            document.getElementById("closeModal").onclick = () => {
                closeModal(document.getElementById("modal"));
                document.getElementById("modalBody").innerHTML = "";
                document.getElementById("modalControls").style.display = "none";
                document.getElementById("modalTitle").style.display = "none";
                document.getElementById("downloadFile").style.display = "none";
                document.removeEventListener("keydown", handleKeyNav);
            };
            document.addEventListener("keydown", handleKeyNav);
        });
    });

    // Delete action
    document.querySelectorAll(".delete").forEach(icon => {
        icon.addEventListener("click", (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            openModal(`
                <div class="delete-modal">
                    <div>
                        <p class="info-header">Are you sure you want to delete?</p>
                    </div>
                    <div class="delete-confirmation">
                        <button id="cancelBtn" class="btn">Cancel</button>
                        <button class="confirm-delete btn delete-btn" data-id="${id}">Yes</button>
                    </div>
                </div>
            `, { isDelete: true });

            document.getElementById("cancelBtn").addEventListener("click", () => closeModal(document.getElementById("modal")));
            document.querySelector(".confirm-delete").addEventListener("click", (ev) => {
                const submissionId = parseInt(ev.target.dataset.id);
                const index = submissions.findIndex(sub => sub.id === submissionId);
                if (index !== -1) {
                    submissions.splice(index, 1);
                    storage.saveSubmissions(submissions);
                    showToast("Ticket deleted successfully!", "success");
                    renderTable();
                } else {
                    showToast("Ticket not found.", "error");
                }
                closeModal(document.getElementById("modal"));
            });
        });
    });
}

/**
 * Shows attachment previews and handles deletion.
 * @param {number} index - Index of the submission in the submissions array.
 * @param {Array} submissions - Array of submission objects.
 * @param {Object} storage - Storage object for saving submissions.
 * @param {Function} showToast - Toast notification function.
 */
function showAttachments(index, submissions, storage, showToast) {
    const container = document.getElementById("attachmentPreview");
    if (!container) return;
    container.innerHTML = "";

    submissions[index].attachments.forEach((file, i) => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("attachment-item");
        wrapper.innerHTML = file.type.startsWith("image/") ?
            `<img src="${file.data}" alt="${file.name}" width="100"><span>${file.name}</span><button class="remove-attachment delete-btn" data-index="${i}">Remove</button>` :
            `<a href="${file.data}" download="${file.name}">${file.name}</a><button class="remove-attachment delete-btn" data-index="${i}">Remove</button>`;
        container.appendChild(wrapper);
    });

    container.querySelectorAll(".remove-attachment").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const fileIndex = parseInt(e.target.dataset.index, 10);
            submissions[index].attachments.splice(fileIndex, 1);
            storage.saveSubmissions(submissions);
            showToast("File deleted successfully", "success");
            showAttachments(index, submissions, storage, showToast);
        });
    });
}

/**
 * Converts base64 data to a Blob.
 * @param {string} dataUrl - Base64 data URL.
 * @returns {Blob} - Converted Blob.
 */
function base64ToBlob(dataUrl) {
    const [header, base64] = dataUrl.split(',');
    const mimeType = header.match(/:(.*?);/)[1];
    const byteString = atob(base64);
    const byteArray = Uint8Array.from(byteString, c => c.charCodeAt(0));
    return new Blob([byteArray], { type: mimeType });
}