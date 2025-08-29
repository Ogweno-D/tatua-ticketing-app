// document.addEventListener("DOMContentLoaded", async () => {
//     const form = document.getElementById("ticketForm");
//     if (!form) return;
//
//     const inputs = form.querySelectorAll("input, textarea, select");
//     await window.storageReady;
//     const storage = window.storage;
//     let submissions = await storage.getSubmissions();
//     console.log(submissions);
//
//     // Toggle Input error
//     function toggleInputError(field, showError) {
//         if (showError) {
//             field.classList.add("input-error");
//         } else {
//             field.classList.remove("input-error");
//         }
//     }
//
//     function validateField(field) {
//         const errorElement = document.getElementById(field.id + "Error");
//         if (!errorElement) return true;
//
//         errorElement.textContent = "";
//         let valid = true;
//
//         // Full Name
//         if (field.id === "fullName" || field.id === "editName") {
//             if (field.value.trim().length < 4) {
//                 errorElement.textContent = "Full Name must be at least 4 characters.";
//                 valid = false;
//             }
//         }
//
//         // Email
//         if (field.id === "email" || field.id === "editEmail") {
//             const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//             if (!emailRegex.test(field.value.trim())) {
//                 errorElement.textContent = "Enter a valid email address.";
//                 valid = false;
//             }
//         }
//
//         // Phone
//         if (field.id === "phone" || field.id === "editPhone") {
//             const phoneRegex = /^\+?[0-9]{10,15}$/;
//             if (!phoneRegex.test(field.value.trim())) {
//                 errorElement.textContent = "Enter a valid phone number.";
//                 valid = false;
//             }
//         }
//
//         // Subject
//         if (field.id === "subject" || field.id === "editSubject") {
//             if (field.value === "") {
//                 errorElement.textContent = "Please select a subject.";
//                 valid = false;
//             }
//         }
//
//         // Message
//         if (field.id === "message" || field.id === "editMessage") {
//             if (field.value.trim().length < 10) {
//                 errorElement.textContent = "Message must be at least 10 characters.";
//                 valid = false;
//             }
//         }
//
//         // File upload
//         if (field.id === "attachment" || field.id === "editAttachment") {
//             if (field.files.length > 0) {
//                 const allowed = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
//
//                 for (let i = 0; i < field.files.length; i++) {
//                     const file = field.files[i];
//
//                     if (!allowed.includes(file.type)) {
//                         errorElement.textContent = `Invalid file type: ${file.name}`;
//                         valid = false;
//                         break;
//                     }
//                     if (file.size > 1024 * 1024) {
//                         errorElement.textContent = `${file.name} exceeds 1MB limit.`;
//                         valid = false;
//                         break;
//                     }
//                 }
//             }
//         }
//
//         field.classList.toggle("input-error", !valid);
//         return valid;
//     }
//
//
//     // validate the radio group
//     function validateRadioGroup() {
//         const contactRadios = document.querySelectorAll("input[name='contact']");
//         const errorElement = document.getElementById("contactError");
//
//         let checked = false;
//
//         contactRadios.forEach(radio => {
//             if (radio.checked) checked = true;
//         });
//
//         if (!checked) {
//             errorElement.textContent = "Please select a contact method ";
//             return false;
//         } else {
//             errorElement.textContent = "";
//             return true;
//         }
//     }
//
//     function validateTerms() {
//         const terms = document.getElementById("terms");
//         const errorElement = document.getElementById("termsError");
//         if (!terms.checked) {
//             errorElement.textContent = "You must agree to the terms.";
//             return false;
//         }
//         errorElement.textContent = "";
//         return true;
//     }
//
//     // Live validation
//     // Validate each input on blur(When out of focus)
//     inputs.forEach(input => {
//         input.addEventListener("blur", () => {
//             if (input.type !== "checkbox" && input.type !== "radio") {
//                 validateField(input);
//             }
//         });
//     })
//
//     form.addEventListener("submit", (e) => {
//         e.preventDefault();
//
//         let isValid = true;
//         inputs.forEach(input => {
//             if (input.type !== "radio" && input.type !== "checkbox") {
//                 if (!validateField(input)) isValid = false;
//             }
//         });
//         if (!validateRadioGroup()) isValid = false;
//         if (!validateTerms()) isValid = false;
//         if (!isValid) {
//             Toast.showToast("Fill in the form correctly before submitting", "warning");
//             return;
//         }
//
//         const formData = new FormData(form);
//         let attachments = [];
//
//         if (formData.get("attachment") && form.attachment.files.length > 0) {
//             const files = Array.from(form.attachment.files);
//             const promises = files.map(file => {
//                 return new Promise(resolve => {
//                     const reader = new FileReader();
//                     reader.onload = () => {
//                         resolve({
//                             name: file.name,
//                             type: file.type,
//                             data: reader.result // base64
//                         });
//                     };
//                     reader.readAsDataURL(file);
//                 });
//             });
//             Promise.all(promises).then(results => {
//                 attachments = results;
//                 saveSubmission(results)
//             });
//
//         } else {
//             // save an empty array
//             saveSubmission([]);
//         }
//     });
//
//     async function saveSubmission(attachments) {
//         const formData = new FormData(form);
//         const submission = {
//             id: await storage.getNextId(),
//             fullName: formData.get("fullName"),
//             email: formData.get("email"),
//             phone: formData.get("phone"),
//             subject: formData.get("subject"),
//             message: formData.get("message"),
//             contact: formData.get("contact"),
//             attachments,
//             status: "Open",
//             date: new Date().toLocaleString(),
//             terms: true
//         };
//
//         submissions.push(submission);
//         await storage.saveSubmissions(submissions);
//
//         Toast.showToast("Ticket submitted successfully.", "success");
//         // alert("Ticket submitted!");
//         form.reset();
//     }
//
// });

document.addEventListener("DOMContentLoaded", async () => {
    await window.storageReady;
    const storage = window.storage;
    let submissions = await storage.getSubmissions();

    // ------------------ VALIDATION HELPERS ------------------ //
    function toggleInputError(field, hasError) {
        const formField = field.closest(".form-field");
        if (!formField) return;

        const icon = formField.querySelector(".error-icon");
        // console.log(icon, hasError);
        if (hasError) {
            field.classList.add("input-error");
            if (icon) icon.style.display = "inline";
        } else {
            field.classList.remove("input-error");
            if (icon) icon.style.display = "none";
        }
    }

    function validateField(field) {
        const formField = field.closest('.form-field');
        if (!formField) return true;

        const errorElement = formField.querySelector('.error-message');
        if (!errorElement) return true;

        // if pristine, don't show errors yet
        if (!field.dataset.touched) {
            toggleInputError(field, false);
            return true;
        }

        errorElement.textContent = "";
        let valid = true;

        // Full Name
        if ((field.id === "fullName" || field.id === "editName") &&
            (field.value.trim() === "" || field.value.trim().length <= 4)) {
            errorElement.textContent = "Full Name must be at least 5 characters.";
            valid = false;
        }

        // Email
        if (field.id === "email" || field.id === "editEmail") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value.trim())) {
                errorElement.textContent = "Enter a valid email address.";
                valid = false;
            }
        }

        // Phone
        if (field.id === "phone" || field.id === "editPhone") {
            const phoneRegex = /^\+?[0-9]{10,15}$/;
            if (!phoneRegex.test(field.value.trim())) {
                errorElement.textContent = "Enter a valid phone number.";
                valid = false;
            }
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



    function validateRadioGroup(form) {
        const contactRadios = form.querySelectorAll("input[name='contact']");
        const errorElement = form.querySelector("#editContactError");
        let checked = [...contactRadios].some(radio => radio.checked);

        if (!checked) {
            if (errorElement) errorElement.textContent = "Please select a contact method.";
            return false;
        }

        if (errorElement) errorElement.textContent = "";
        return true;
    }

    function validateTerms(form) {
        const terms = form.querySelector("#terms");
        const errorElement = form.querySelector("#editTermsError");
        if (terms && !terms.checked) {
            if (errorElement) errorElement.textContent = "You must agree to the terms.";
            return false;
        }
        if (errorElement) errorElement.textContent = "";
        return true;
    }


    // ------------------ GENERIC FORM HANDLER ------------------ //
    function initFormValidation(form, onValidSubmit) {
        if (!form) return;
        const inputs = form.querySelectorAll("input, textarea, select");

        // live validation
        inputs.forEach(input => {
            input.addEventListener("blur", () => {
                input.dataset.touched = "true";
                if (input.type !== "checkbox" && input.type !== "radio") {
                    validateField(input);
                }
            });

            input.addEventListener("input", () => {
                if (input.dataset.touched) {
                    validateField(input);
                }
            });
        });


        // on submit
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
                Toast.showToast("Please fix errors before submitting.", "warning");
                return;
            }

            onValidSubmit(form);
        });
    }

    // ------------------ SAVE HANDLERS ------------------ //
    async function saveSubmission(form) {
        const formData = new FormData(form);
        let attachments = [];

        if (form.attachment && form.attachment.files.length > 0) {
            const files = Array.from(form.attachment.files);
            attachments = await Promise.all(files.map(file => {
                return new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        resolve({ name: file.name, type: file.type, data: reader.result });
                    };
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

        Toast.showToast("Ticket submitted successfully.", "success");
        form.reset();
    }

    async function saveEditSubmission(form) {
        const formData = new FormData(form);
        const id = parseInt(form.dataset.id, 10); // assume edit form has data-id
        const index = submissions.findIndex(sub => sub.id === id);
        if (index === -1) return;

        let attachments = submissions[index].attachments || [];
        if (form.editAttachment && form.editAttachment.files.length > 0) {
            const files = Array.from(form.editAttachment.files);
            attachments = await Promise.all(files.map(file => {
                return new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        resolve({ name: file.name, type: file.type, data: reader.result });
                    };
                    reader.readAsDataURL(file);
                });
            }));
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
        Toast.showToast("Ticket updated successfully.", "success");
    }

    // ------------------ INIT FORMS ------------------ //
    initFormValidation(document.getElementById("ticketForm"), saveSubmission);
    initFormValidation(document.getElementById("editTicketForm"), saveEditSubmission);
    window.initFormValidation = initFormValidation;
    window.validateField = validateField;
    window.validateRadioGroup = validateRadioGroup;
    window.validateTerms = validateTerms;

});
