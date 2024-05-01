/* COMP721: Web Development
 * Assignment 2: CabsOnline Website
 * Thomas Brears, #20122554, fcx9443 
 * script.js - Manages the styling of the entire website to ensure a consistent style across the site and enhances mobile responsiveness.
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