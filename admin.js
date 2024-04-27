function searchBookings() {
    let input = document.querySelector('input[name="bsearch"]').value;
    const resultsDiv = document.getElementById('results');
    const errorMessageDiv = document.getElementById('errorMessage');

    fetch('admin.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'bsearch=' + encodeURIComponent(input)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            errorMessageDiv.textContent = data.error;
            errorMessageDiv.style.display = 'block';
            resultsDiv.innerHTML = '';
        } else if (data.length > 0) {
            const table = createResultsTable(data);
            resultsDiv.innerHTML = '';
            resultsDiv.appendChild(table);
            errorMessageDiv.style.display = 'none';
        } else {
            errorMessageDiv.textContent = data.message || 'No bookings found.';
            errorMessageDiv.style.display = 'block';
            resultsDiv.innerHTML = '';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        errorMessageDiv.textContent = error.message || 'Error loading bookings.';
        errorMessageDiv.style.display = 'block';
        resultsDiv.innerHTML = '';
    });
}

function createResultsTable(bookings) {
    const table = document.createElement('table');
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

function assignBooking(bookingReference) {
    fetch('admin.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'assign=' + encodeURIComponent(bookingReference)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return response.json();
    })
    .then(data => {
        const successMessageDiv = document.getElementById('success');
        const errorMessageDiv = document.getElementById('errorMessage');

        if (data.success) {
            // Find the button by reference and disable it
            const assignButton = document.querySelector(`button[data-ref='${bookingReference}']`);
            assignButton.disabled = true;
            assignButton.innerText = 'Assigned';

            // Find the status cell in the same row as the button and update it
            const row = assignButton.closest('tr');
            const statusCell = row.cells[6];

            if (statusCell) {
                statusCell.textContent = 'assigned';
            }

            // Display the success message
            successMessageDiv.textContent = data.message;
            successMessageDiv.style.display = 'block';
            errorMessageDiv.style.display = 'none';

        } else {
            // Display error if operation was not successful
            errorMessageDiv.textContent = data.message;
            errorMessageDiv.style.display = 'block';
            successMessageDiv.style.display = 'none';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const errorMessageDiv = document.getElementById('errorMessage');
        errorMessageDiv.textContent = error.message || 'Error loading bookings.';
        errorMessageDiv.style.display = 'block';
    });
}
