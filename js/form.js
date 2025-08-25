document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("ticketForm");
    if(!form) return;

    const inputs = form.querySelectorAll("input, textarea, select");
    let submissions = storage.getSubmissions();

    // Toggle Input error
    function toggleInputError(field, showError){
        if(showError){
            field.classList.add("input-error");
        } else{
            field.classList.remove("input-error");
        }
    }

    function validateField(field) {
        const errorElement = document.getElementById(field.id +"Error");
        if (!errorElement) return true;

        errorElement.textContent ="";

        let valid = true;
        if(field.id === "fullName" && field.value.trim() === "" && field.value.trim().length <= 4) {
            errorElement.textContent = "Full Name is required";
            valid = false;
        }

        // Email
        if (field.id === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value.trim())) {
                errorElement.textContent = "Enter a valid email address.";
                valid = false;
            }
        }

        // Phone
        if (field.id === "phone") {
            const phoneRegex = /^\+?[0-9]{10,15}$/;
            if (!phoneRegex.test(field.value.trim())) {
                errorElement.textContent = "Enter a valid phone number";
                valid = false
            }
        }

        // If selected?
        if (field.id === "subject" && field.value === "") {
            errorElement.textContent = "Please select a subject.";
            valid = false;
        }
        // Message of at least 10 characters
        if (field.id === "message" && field.value.trim().length < 10) {
            errorElement.textContent = "Message must be at least 10 characters.";
            valid = false;
        }

        // Input of max 1MBS
        if (field.id === "attachment" && field.files.length > 0) {

            const allowed = ["application/pdf", "image/jpeg","image/jpg", "image/png"];

            for (let i = 0; i < field.files.length; i++) {
                const file = field.files[i];

                // Check type
                if (!allowed.includes(file.type)) {
                    errorElement.textContent = `Invalid file type: ${file.name}`;
                    toggleInputError(field, true);
                    valid = false;
                    break;
                }

                // Check size (max 1MB each)
                if (file.size > 1024 * 1024) {
                    errorElement.textContent = `${file.name} exceeds 2MB limit.`;
                    toggleInputError(field, true);
                    valid = false;
                    break;
                }
            }
        }

        if(valid){
            field.classList.remove("input-error");
        } else{
            field.classList.add("input-error");
        }

        return valid;

    }

    // validate the radio group
    function validateRadioGroup(){
        const contactRadios = document.querySelectorAll("input[name='contact']");
        const errorElement = document.getElementById("contactError");

        let checked =false;

        contactRadios.forEach(radio => {
            if (radio.checked) checked = true;
        });

        if(!checked){
            errorElement.textContent = "Please select a contact method ";
            return false;
        } else{
            errorElement.textContent ="";
            return true;
        }
    }

    function validateTerms() {
        const terms = document.getElementById("terms");
        const errorElement = document.getElementById("termsError");
        if (!terms.checked) {
            errorElement.textContent = "You must agree to the terms.";
            return false;
        }
        errorElement.textContent = "";
        return true;
    }

    // Live validation
    // Validate each input on blur(When out of focus)
    inputs.forEach(input => {
        input.addEventListener("blur", ()=>{
            if(input.type !== "checkbox" && input.type !== "radio") {
                validateField(input);
            }
        });
    })

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let isValid = true;
        inputs.forEach(input => {
            if (input.type !== "radio" && input.type !== "checkbox") {
                if (!validateField(input)) isValid = false;
            }
        });
        if (!validateRadioGroup()) isValid = false;
        if (!validateTerms()) isValid = false;
        if (!isValid) {
            Toast.showToast("Fill in the form correctly before submitting","warning");
            return;
        }

        const formData = new FormData(form);
        let attachments = [];

        if (formData.get("attachment") && form.attachment.files.length > 0) {
            const files = Array.from(form.attachment.files);
            const promises = files.map(file => {
                return new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onload =() =>{
                        resolve({
                            name: file.name,
                            type: file.type,
                            data: reader.result // base64
                        });
                    };
                    reader.readAsDataURL(file);
                });
            });
            Promise.all(promises).then(results => {
                attachments = results;
                saveSubmission(results)
            });

        } else {
            // save an empty array
            saveSubmission([]);
        }
    });

    function saveSubmission(attachments) {
        const formData = new FormData(form);
        const submission = {
            id: storage.getNextId(),
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
        storage.saveSubmissions(submissions);

        Toast.showToast("Ticket submitted successfully.", "success");
        // alert("Ticket submitted!");
        form.reset();
    }

});