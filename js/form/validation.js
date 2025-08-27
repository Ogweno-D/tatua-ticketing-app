/**
 * Toggles error state for a form field.
 * @param {HTMLElement} field - The form input element.
 * @param {boolean} showError - Whether to show the error state.
 */

export function toggleInputError(field, showError) {
    if (!field) return;
    field.classList.toggle("input-error", showError);
}

/**
 * Validates a single form field.
 * @param {HTMLElement} field - The form input element.
 * @returns {boolean} - Whether the field is valid.
 */
export function validateField(field) {
    if (!field) return true;
    const errorElement = field.closest('.form-row')?.querySelector('.error-message');
    if (!errorElement) return true;

    errorElement.textContent = "";
    let valid = true;

    // Full Name
    if (field.id === "fullName" && (field.value.trim() === "" || field.value.trim().length <= 4)) {
        errorElement.textContent = "Full Name must be at least 5 characters.";
        valid = false;
    }

    // Email
    if ((field.id === "email" || field.id === "editEmail") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) {
        errorElement.textContent = "Enter a valid email address.";
        valid = false;
    }

    // Phone
    if ((field.id === "phone" || field.id === "editPhone") && !/^\+?[0-9]{10,15}$/.test(field.value.trim())) {
        errorElement.textContent = "Enter a valid phone number.";
        valid = false;
    }

    // Subject
    if ((field.id === "subject" || field.id === "editSubject") && field.value === "") {
        errorElement.textContent = "Please select a subject.";
        valid = false;
    }

    // Message
    if ((field.id === "message" || field.id === "editMessage") && field.value.trim().length < 10) {
        errorElement.textContent = "Message must be at least 10 characters.";
        valid = false;
    }

    // Attachment
    if ((field.id === "attachment" || field.id === "editAttachment") && field.files.length > 0) {
        const allowed = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
        for (let file of field.files) {
            if (!allowed.includes(file.type)) {
                errorElement.textContent = `Invalid file type: ${file.name}`;
                valid = false;
                break;
            }
            if (file.size > 1024 * 1024) {
                errorElement.textContent = `${file.name} exceeds 1MB limit.`;
                valid = false;
                break;
            }
        }
    }

    toggleInputError(field, !valid);
    return valid;
}

/**
 * Validates the contact radio group.
 * @param {HTMLFormElement} form - The form element.
 * @returns {boolean} - Whether a contact method is selected.
 */
export function validateRadioGroup(form) {
    if (!form) return false;
    const contactRadios = form.querySelectorAll("input[name='contact']");
    const errorElement = form.querySelector("#editContactError") || form.querySelector("#contactError");
    const checked = [...contactRadios].some(radio => radio.checked);

    if (!checked && errorElement) {
        errorElement.textContent = "Please select a contact method.";
        return false;
    }

    if (errorElement) errorElement.textContent = "";
    return true;
}

/**
 * Validates the terms' checkbox.
 * @param {HTMLFormElement} form - The form element.
 * @returns {boolean} - Whether the terms are accepted.
 */
export function validateTerms(form) {
    if (!form) return false;
    const terms = form.querySelector("#terms");
    const errorElement = form.querySelector("#editTermsError") || form.querySelector("#termsError");
    if (terms && !terms.checked) {
        if (errorElement) errorElement.textContent = "You must agree to the terms.";
        return false;
    }
    if (errorElement) errorElement.textContent = "";
    return true;
}