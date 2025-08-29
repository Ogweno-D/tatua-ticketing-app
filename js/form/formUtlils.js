export function toggleInputError(field, hasError) {
    const formField = field.closest('.form-field');
    if (!formField) return;
    const icon = formfield.querySelector(".error-icon");
    field .classList.toggle("input-error", hasError);
    if (icon) icon.style.display = hasError ? "inline" : "none";
}

export function initFormValidation(form, validateField, extraChecks, onValidSubmit) {
    if (!form) return;
    const inputs = form.querySelectorAll("input, textarea, select");

    inputs.forEach(input => {
        input.addEventListener("blur", () => {
            input.dataset.touched = "true";
            if (!["checkbox","radio"].includes(input.type)) validateField(input);
        });
        input.addEventListener("input", () => {
            if (input.dataset.touched) validateField(input);
        });
    });

    form.addEventListener("submit", e => {
        e.preventDefault();
        let valid = [...inputs].every(input => {
            if (["checkbox","radio"].includes(input.type)) return true;
            return validateField(input);
        });

        if (extraChecks) valid = extraChecks(form) && valid;

        if (!valid) {
            Toast.showToast("Please fix errors before submitting.", "warning");
            return;
        }

        onValidSubmit(form);
    });
}