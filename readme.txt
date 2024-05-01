<!-- COMP721: Web Development
     Assignment 2: CabsOnline Website
     Thomas Brears, #20122554, fcx9443 
     readme.txt - Includes a description of each file within the system and instructions on how to use it.
-->

SYSTEM FILES

readme.txt 
Includes a description of each file within the system and instructions on how to use it.

admin.html 
Contains the search bar to search existing bookings using the booking reference number or for bookings scheduled within 2 hours. It also displays success and error messages related to search operations.

admin.js 
Handles booking searches and assignments, interfacing with admin.php. It processes input, displays relevant data and messages, and manages the assignment of bookings when the assign button is pressed.

admin.php 
Manages input validation and database interactions. It retrieves and updates records, returning data, success, or error messages accordingly.

booking.html 
Includes multiple fields to gather information from a user to book a taxi ride, including name, address, date, and time. It passes data to booking.js for processing and handles some input validation. Success and error messages related to bookings are also displayed here.

booking.js 
Handles the creation of bookings by capturing form input and sending it to booking.php for processing. It ensures that only trips for today or in the future can be booked by automatically updating the minimum date and time.

booking.php 
Performs secondary input validation and uploads information to the database. It returns success or error messages to the JavaScript.

mysqlcommand.txt 
Contains all MySQL queries used across the program for table creation, data insertion, updates, and searches.

style.css 
Manages the styling of the entire website to ensure a consistent style across the site and ensures it is mobile friendly.

script.js 
Manages the styling of the entire website to ensure a consistent style across the site and enhances mobile responsiveness.


HOW TO USE THE SYSTEM
There are two user interactable pages on the website.
Booking page: https://webdev.aut.ac.nz/~fcx9443/assign2/booking.html
Admin dashboard: https://webdev.aut.ac.nz/~fcx9443/assign2/admin.html

TO MAKE A BOOKING (Booking System)
Navigate to the booking page where you will find a form. 
Fill in the fields and submit the form. Fields marked with an asterisk (*) are required; others are optional. 
If any fields are missing or incorrectly formatted, a helpful prompt will highlight this. 
A green message containing a booking reference indicates a successful submission. 
A red message indicates an error occured; please review the error message and try again.

TO SEARCH A BOOKING (ADMIN DASHBOARD)
Navigate to the admin dashboard. You have two search options:
1) By Booking Reference Number: Enter a booking reference number (e.g., BRN00010). 
    If the number exists, the details of the booking will be displayed.
2) Upcoming Unassigned Bookings: Leave the search field empty and click the search button to display all unassigned bookings scheduled within the next two hours.

Error messages or search results will be displayed accordingly. 
If an error message appears, refer to the message, correct the issue, and try again. 
If booking details are displayed, you can also assign bookings directly from this page. Assigning an already assigned booking will result in an error.