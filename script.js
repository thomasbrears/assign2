/* COMP721: Web Development
   Assignment 2: Social Networking, Status Posting Website
   Thomas Brears, #20122554, fcx9443 
*/

// Function to close the mobile menu
function closeMenu() {
    var navLinks = document.querySelector('.nav-links');
    if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
    }
}

function toggleMenu() {
    var navLinks = document.querySelector('.nav-links');
    var brandName = document.querySelector('.brand-name');
    navLinks.classList.toggle('active');
    brandName.classList.toggle('adjusted'); 
}

// Click event listeners to nav links for mobile menu close
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', closeMenu); // Close menu when nav link clicked
});