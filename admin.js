/* COMP721: Web Development
 * Assignment 2: CabsOnline Website
 * Thomas Brears, #20122554, fcx9443 
 * admin.js - Handles booking searches (using the searchBookings function) and assignments (through the assignBooking function), interfacing with admin.php. It processes input, displays relevant data and messages, and manages the assignment of bookings when the assign button is pressed. Through the createResultsTable function, the table is created and populated with data.
 */
// Function to seach for a booking based on the users input
function searchBookings() {
	// Retrive the input from the bsearch field.
	let input = document.querySelector('input[name="bsearch"]').value;
	const resultsDiv = document.getElementById('results');
	const errorMessageDiv = document.getElementById('errorMessage');

	// preform an AJAX request to the server
	fetch('admin.php', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: 'bsearch=' + encodeURIComponent(input) // send input with request
		})
		.then(response => {
			// check if the server responce was successfull or not
			if (!response.ok) {
				throw new Error('The network response was not ok. Please try again later');
			}
			return response.json(); // Parse JSON data from the response.
		})
		.then(data => {
			// handle data returned from the server
			if (data.error) { // display error message if there was an issue
				errorMessageDiv.textContent = data.error;
				errorMessageDiv.style.display = 'block';
				resultsDiv.innerHTML = '';
			} else if (data.length > 0) { // display the table if data is returned
				const table = createResultsTable(data);
				resultsDiv.innerHTML = '';
				resultsDiv.appendChild(table);
				errorMessageDiv.style.display = 'none';
			} else { // Display relevent error message if no bookings were found
				errorMessageDiv.textContent = data.message || 'No bookings found.';
				errorMessageDiv.style.display = 'block';
				resultsDiv.innerHTML = '';
			}
		})
		.catch(error => { // display and log any fetch errors
			console.error('Error:', error);
			errorMessageDiv.textContent = error.message || 'Error loading bookings.';
			errorMessageDiv.style.display = 'block';
			resultsDiv.innerHTML = '';
		});
}

// function to create the booking data table
function createResultsTable(bookings) {
	const table = document.createElement('table');

	// table titles
	table.innerHTML = `<tr>
        <th>Booking Reference Number</th>
        <th>Customer Name</th>
        <th>Phone</th>
        <th>Pickup Suburb</th>
        <th>Destination Suburb</th>
        <th>Pickup Date and Time</th>
        <th>Status</th>
        <th>Assignment</th>
    </tr>`;

	// booking data from db for each booking
	bookings.forEach(booking => {
		const row = table.insertRow();
		row.innerHTML = `
            <td>${booking.reference}</td>
            <td>${booking.customer}</td>
            <td>${booking.phone}</td>
            <td>${booking.pickupSuburb}</td>
            <td>${booking.destinationSuburb}</td>
            <td>${booking.pickupDateTime}</td>
            <td>${booking.status}</td>
            <td><button class="assign-button" data-ref="${booking.reference}" onclick="assignBooking('${booking.reference}')">Assign</button></td>
        `;
	});

	return table;
}

// function to handle booking assignment
function assignBooking(bookingReference) {
	// preform post request to assign the booking
	fetch('admin.php', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: 'assign=' + encodeURIComponent(bookingReference) // send booking reference with the request
		})
		.then(response => {
			// check if the server responce was successfull or not
			if (!response.ok) {
				throw new Error('Network response was not ok. Please try again later.');
			}
			return response.json(); // Parse JSON response.
		})
		.then(data => {
			const successMessageDiv = document.getElementById('success');
			const errorMessageDiv = document.getElementById('errorMessage');
			const assignButton = document.querySelector(`button[data-ref='${bookingReference}']`); // find the button that was clicked

			if (!assignButton) {
				throw new Error('Button not found in the document.');
			}

			if (data.success) {
				// disable button and update the text if assignment is successful.
				assignButton.disabled = true;
				assignButton.innerText = 'Assigned';

				// find the relevent cell and update it
				const row = assignButton.closest('tr');
				const statusCell = row.cells[6];
				if (statusCell) {
					statusCell.textContent = 'Assigned';
				}

				//display the a success message
				successMessageDiv.textContent = data.message;
				successMessageDiv.style.display = 'block';
				errorMessageDiv.style.display = 'none';

			} else {
				// if there was any errors, display the error message
				errorMessageDiv.textContent = data.message;
				errorMessageDiv.style.display = 'block';
				successMessageDiv.style.display = 'none';
			}
		})
		.catch(error => { // display and log any fetch errors
			console.error('Error:', error);
			errorMessageDiv.textContent = error.message || 'Error processing your request.';
			errorMessageDiv.style.display = 'block';
		});
}