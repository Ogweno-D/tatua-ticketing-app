/**
 * Saves a new form submission.
 * @param {HTMLFormElement} form - The form element.
 * @param {Array} submissions - Array of submission objects.
 * @param {Object} storage - Storage object for saving submissions.
 * @param {Function} showToast - Toast notification function.
 */
export async function saveSubmission(form, submissions, storage, showToast) {
    if (!form || !storage) return;

    const formData = new FormData(form);
    let attachments = [];

    if (form.attachment && form.attachment.files.length > 0) {
        const files = Array.from(form.attachment.files);
        attachments = await Promise.all(files.map(file => {
            return new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = () => resolve({ name: file.name, type: file.type, data: reader.result });
                reader.readAsDataURL(file);
            });
        }));
    }

    const submission = {
        id: await storage.getNextId(),
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        subject: formData.get("subject"),
        message: formData.get("message"),
        contact: formData.get("contact"),
        attachments,
        status: "Open",
        date: new Date().toLocaleString(),
        terms: true
    };

    submissions.push(submission);
    await storage.saveSubmissions(submissions);
    showToast("Ticket submitted successfully.", "success");
    form.reset();
}

/**
 * Saves an edited form submission.
 * @param {HTMLFormElement} form - The edit form element.
 * @param {Array} submissions - Array of submission objects.
 * @param {Object} storage - Storage object for saving submissions.
 * @param {Function} showToast - Toast notification function.
 */
export async function saveEditSubmission(form, submissions, storage, showToast) {
    if (!form || !storage) return;

    const formData = new FormData(form);
    const id = parseInt(form.dataset.id, 10);
    const index = submissions.findIndex(sub => sub.id === id);
    if (index === -1) {
        showToast("Ticket not found.", "error");
        return;
    }

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
    showToast("Ticket updated successfully.", "success");
}