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

