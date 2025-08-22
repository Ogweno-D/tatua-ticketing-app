// Handle Hamburger Toggle
document.getElementById("menuBtn").addEventListener("click", function () {
    this.classList.toggle("active");
    document.getElementById("navbar-menu").classList.toggle("show");
});

// Highlight Active Nav Link
const navLinks = document.querySelectorAll('.nav-link a');
const currentPage = window.location.pathname;

navLinks.forEach(link => {
    link.classList.remove('active');
    if (new URL(link.href).pathname === currentPage) {
        link.classList.add('active');
    }
});
