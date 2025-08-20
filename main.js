//  To toggle the opening of the hamburger
document.getElementById("menuBtn").addEventListener("click", function() {
    this.classList.toggle("active");
    document.getElementById("navbar-menu").classList.toggle("show");
});
// For the active nav links
// Select all links inside navbar
const navLinks = document.querySelectorAll('.nav-link a');
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        // Remove active from all
        navLinks.forEach(l => l.classList.remove('active'));

        // Add active to clicked one
        this.classList.add('active');
    });
});



document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("ticketForm");
    const tableBody = document.querySelector("#ticketsTable tbody");
    // console.log(tableBody);
    const closeBtn = document.querySelectorAll(".close");

    // Submissions
    let submissions = JSON.parse(sessionStorage.getItem("submissions")) || [];
    let submissionCounter = 1;


    if(form){
        const inputs = form.querySelectorAll("input,textarea,select");
        // Form Validation
        function validateField(field) {
            let valid = true;
            const errorElement = document.getElementById(field.id +"Error");
            if (!errorElement) return true;

            errorElement.textContent ="";

            if(field.id === "fullName" && field.value === "" && field.value.trim().length < 3) {
                errorElement.textContent = " Full  Name is required";
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
                const phoneRegex = /^[0-9]{10,15}$/;
                if (!phoneRegex.test(field.value.trim())) {
                    errorElement.textContent = "Enter a valid phone number (10–15 digits).";
                    valid = false;
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

            // Input of less than 2MBS
            if (field.id === "attachment" && field.files.length > 0) {
                const file = field.files[0];
                if (file.size > 2 * 1024 * 1024) {
                    errorElement.textContent = "File size must be less than 2MB.";
                    valid = false;
                }
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

        /// Validate the terms
        function validateTerms(){
            const terms = document.getElementById("terms");
            const errorElement = document.getElementById("termsError");

            if(!terms.checked){
                errorElement.textContent = "Kindly agree with the terms before using this service";
                return false;
            }
            errorElement.textContent ="";
            return true;
        }

        // Validate each input on blur(When out of focus)
        inputs.forEach(input => {
            input.addEventListener("blur", ()=>{
                if(input.type !== "checkbox" && input.type !== "radio") {
                    validateField(input);
                }
            });
        })


        // This is the final validation on submit
        form.addEventListener("submit", function (event) {
            let isValid = true;

            inputs.forEach(input => {
                if (input.type !== "radio" && input.type !== "checkbox") {
                    if (!validateField(input)) isValid = false;
                }
            });

            if (!validateRadioGroup()) isValid = false;
            if (!validateTerms()) isValid = false;

            if (!isValid) event.preventDefault();
            event.preventDefault();


        const formData = new FormData(form);

            // To store only when the terms are accepted
            if (!formData.get("terms")) {
                alert("You must accept the terms and conditions before submitting.");
                return;
            }

            const submission = {
            id: submissionCounter++,
            fullName: formData.get("fullName"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            subject: formData.get("subject"),
            message: formData.get("message"),
            contact: formData.get("contact"),
            attachment: formData.get("attachment")?.name || "None",
            status: "Open",
            date: new Date().toLocaleString(),
            terms: true
        }
        submissions.push(submission);
        sessionStorage.setItem("submissions", JSON.stringify(submissions));
        console.log(JSON.stringify(submissions));
        form.reset();
        alert("Ticket Submitted Successfully");
    });
}

    // Table Page
    if(tableBody){
         function renderTable() {
            tableBody.innerHTML = "";

            submissions.forEach(((submission) => {
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
            }));
            actionHandlers();
         }
        // Modal controls
        const modal = document.getElementById("modal");
        const modalBody = document.getElementById("modalBody");
        const closeModal = document.getElementById("closeModal");

        function openModal(content) {
            modalBody.innerHTML = content;
            modal.style.display = "block";
        }
        closeModal.onclick = () => modal.style.display = "none";
        //When out of focus
        window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

        // Attach handlers
        function actionHandlers() {
            document.querySelectorAll(".info").forEach(icon => {
                icon.addEventListener("click", (e) => {
                    const sub = submissions[e.target.dataset.id];
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
                    const sub = submissions[e.target.dataset.id];
                    openModal(`<h3 class="info-header">Call</h3>
                                   <p class="info-item">Dialing <b>${sub.fullName}</b> at <b>${sub.phone || "N/A"}</b></p>
                           `);
                });
            });

            document.querySelectorAll(".message").forEach(icon => {
                icon.addEventListener("click", (e) => {
                    const sub = submissions[e.target.dataset.id];
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
                        alert("Message sent to " + sub.email);
                        modal.style.display = "none";
                    };

                });
            });

            document.querySelectorAll(".edit").forEach(icon => {
                icon.addEventListener("click", (e) => {
                    const id = e.target.dataset.id;
                    const sub = submissions[id];
                    openModal(`
                       <h3>Edit Ticket</h3>
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
                                    <input type="radio" name="contact" value="Email" ${sub.contact==="email"?"checked":""}>
                                    Email
                                </label>
                                <label class="form-check">
                                    <input type="radio" name="contact" value="Phone" ${sub.contact==="phone"?"checked":""}>
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
                        submissions[id].fullName = document.getElementById("editName").value;
                        submissions[id].email = document.getElementById("editEmail").value;
                        submissions[id].subject = document.getElementById("editSubject").value;
                        submissions[id].message = document.getElementById("editMessage").value;
                        submissions[id].status = document.getElementById("editStatus").value;
                        sessionStorage.setItem("submissions", JSON.stringify(submissions));
                        renderTable();
                        modal.style.display = "none";
                    };
                });
            });

            document.querySelectorAll(".download").forEach(icon => {
                icon.addEventListener("click", (e) => {
                    const sub = submissions[e.target.dataset.id];
                    const content = `
                        Ticket Info:
                        Name: ${sub.fullName}
                        Email: ${sub.email}
                        Subject: ${sub.subject}
                        Message: ${sub.message}
                        Status: ${sub.status}
                        Date: ${sub.date}
                    `;
                    const blob = new Blob([content], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);

                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `ticket_${sub.fullName}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                });
            });

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
                            sessionStorage.setItem("submissions", JSON.stringify(submissions));
                            renderTable();
                            alert("Ticket deleted successfully!");
                        } else {
                            alert("Ticket not found!");
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
        renderTable();
    }

});

