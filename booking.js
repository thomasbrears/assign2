/* COMP721: Web Development
 * Assignment 2: CabsOnline Website
 * Thomas Brears, #20122554, fcx9443 
 * booking.js - Handles the creation of bookings by capturing form input and sending it to booking.php for processing. It ensures that only trips for today or in the future can be booked by automatically updating the minimum date and time.
 */
// Listen for the DOMContentLoaded event to ensure all elements are fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function() {
	const form = document.getElementById('bookingForm');
	// the event listener hadles the form submision
	form.addEventListener('submit', function(event) {
		event.preventDefault(); // Dont reload the page
		const formData = new FormData(form); // capture all data from the form in this object

		// preform an post request to the server with the form data
		fetch('booking.php', {
				method: 'POST',
				body: formData
			})
			.then(response => response.json()) // convert responce to JSON format
			.then(data => {
				// check if server indictes sucesss or not 
				if (data.success) {
					// display the success message
					const referenceDiv = document.getElementById('reference');
					referenceDiv.innerHTML = `<p>${data.message}</p>`;
					referenceDiv.style.display = 'block';
				} else {
					// display the error message
					const errorMessageDiv = document.getElementById('errorMessage');
					errorMessageDiv.textContent = data.message;
					errorMessageDiv.style.display = 'block';
					document.getElementById('reference').style.display = 'none';
				}
			})
			.catch(error => {
				// display and log any fetch errors
				console.error('Error:', error);
				const errorMessageDiv = document.getElementById('errorMessage');
				errorMessageDiv.textContent = 'An error occurred while submitting the form.';
				errorMessageDiv.style.display = 'block';
				document.getElementById('reference').style.display = 'none';
			});
	});
});

// Listen for the DOMContentLoaded event to ensure all elements are fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function() {
	var now = new Date();
	// format the date and time in the Auckland timezone using Intl.DateTimeFormat
	var formatterDate = new Intl.DateTimeFormat('en-NZ', {
		timeZone: 'Pacific/Auckland',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});

	var formatterTime = new Intl.DateTimeFormat('en-NZ', {
		timeZone: 'Pacific/Auckland',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	});

	// formate the date and time from the input
	var dateString = formatterDate.format(now).split('/').reverse().join('-'); // Converts to YYYY-MM-DD
	var timeString = formatterTime.format(now).replace(/\s/g, ''); // Removes any spaces
	var dateInput = document.getElementById('date');
	var timeInput = document.getElementById('time');

	dateInput.value = dateString; // Set to the current date
	dateInput.min = dateString; // dont allow past dates
	timeInput.value = timeString; // Set to the current time

	// Function to update the minimum time allowed / no past time. present only
    function updateMinTime() {
        var selectedDate = dateInput.value;
        var currentDate = formatterDate.format(new Date()).split('/').reverse().join('-');
        
        if (selectedDate === currentDate) {
            timeInput.min = formatterTime.format(new Date()).replace(/\s/g, '');
        } else {
            timeInput.min = "00:00"; // Reset to allow any time on future dates
        }
    }

    // Event listener for the date input validation
    dateInput.addEventListener('input', updateMinTime);
    dateInput.addEventListener('change', updateMinTime);
    dateInput.addEventListener('invalid', function(event) {
        event.target.setCustomValidity('');
        if (!event.target.validity.valid) {
            event.target.setCustomValidity('Pickup must be today or a future date.');
        }
    });

    // Event listener for the time input validation
    timeInput.addEventListener('input', updateMinTime);
    timeInput.addEventListener('invalid', function(event) {
        event.target.setCustomValidity('');
        if (!event.target.validity.valid) {
            event.target.setCustomValidity('The time for pickup must be ' + timeInput.min + ' or later.');
        }
    });

    // Clear custom validity messages after they are displayed
    dateInput.addEventListener('input', function(event) {
        event.target.setCustomValidity('');
    });
    timeInput.addEventListener('input', function(event) {
        event.target.setCustomValidity('');
    });

    // Call function to set the minimum time
    updateMinTime();
});