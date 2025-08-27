import { validateField, validateRadioGroup, validateTerms } from './validation.js';
import { saveSubmission, saveEditSubmission } from './submission.js';
import { showToast } from '../toast.js';

/**
 * Initializes form validation and submission handling.
 * @param {HTMLFormElement} form - The form element.
 * @param {Function} onValidSubmit - Callback to handle valid form submission.
 */
export function initFormValidation(form, onValidSubmit) {
    if (!form) return;

    const inputs = form.querySelectorAll("input, textarea, select");

    // Live validation on blur
    inputs.forEach(input => {
        input.addEventListener("blur", () => {
            if (input.type !== "checkbox" && input.type !== "radio") {
                validateField(input);
            }
        });
    });

    // Form submission
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let isValid = true;

        inputs.forEach(input => {
            if (input.type !== "radio" && input.type !== "checkbox") {
                if (!validateField(input)) isValid = false;
            }
        });
        if (!validateRadioGroup(form)) isValid = false;
        if (!validateTerms(form)) isValid = false;

        if (!isValid) {
            showToast("Please fix errors before submitting.", "warning");
            return;
        }

        onValidSubmit(form);
    });
}

/**
 * Initializes ticket and edit forms.
 */
document.addEventListener("DOMContentLoaded", async () => {
    await window.storageReady;
    const storage = window.storage;
    if (!storage) {
        console.error("Storage not available");
        return;
    }

    let submissions = await storage.getSubmissions();

    // Initialize ticket form
    const ticketForm = document.getElementById("ticketForm");
    if (ticketForm) {
        initFormValidation(ticketForm, form => saveSubmission(form, submissions, storage, showToast));
    }

    // Initialize edit form (if present, handled dynamically by actions.js)
    const editForm = document.getElementById("editTicketForm");
    if (editForm) {
        initFormValidation(editForm, form => saveEditSubmission(form, submissions, storage, showToast));
    }

    // Expose globals for compatibility with actions.js
    window.initFormValidation = initFormValidation;
    window.validateField = validateField;
    window.validateRadioGroup = validateRadioGroup;
    window.validateTerms = validateTerms;
});