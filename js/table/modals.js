/**
 * Opens a modal with the specified content.
 * @param {HTMLElement} modal - The modal element.
 * @param {HTMLElement} modalBody - The modal body element.
 * @param {HTMLElement} modalTitle - The modal title element.
 * @param {HTMLElement} closeBtn - The close button element.
 * @param {string} content - HTML content for the modal body.
 * @param {Object} options - Options including isDelete flag.
 */
export function openModal(modal, modalBody, modalTitle, closeBtn, content, { isDelete = false } = {}) {
    if (!modal || !modalBody || !modalTitle || !closeBtn) return;

    // Reset modal
    modal.classList.remove("delete");
    modalBody.innerHTML = "";
    modalTitle.innerHTML = "";
    modal.style.display = "block";

    // Set new content
    modalBody.innerHTML = content;
    if (isDelete) {
        modal.classList.add("delete");
        closeBtn.style.display = "none";
    } else {
        closeBtn.style.display = "block";
    }
}

/**
 * Closes the modal.
 * @param {HTMLElement} modal - The modal element.
 */
export function closeModal(modal) {
    if (modal) modal.style.display = "none";
}