document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookingForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(form);

        fetch('booking.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const referenceDiv = document.getElementById('reference');
                referenceDiv.innerHTML = `<p>${data.message}</p>`; // Display message within a paragraph inside the reference div
                referenceDiv.style.display = 'block'; // Show the div
            } else {
                const errorMessageDiv = document.getElementById('errorMessage');
                errorMessageDiv.textContent = data.message;
                errorMessageDiv.style.display = 'block';
                document.getElementById('reference').style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            const errorMessageDiv = document.getElementById('errorMessage');
            errorMessageDiv.textContent = 'An error occurred while submitting the form.';
            errorMessageDiv.style.display = 'block';
            document.getElementById('reference').style.display = 'none';
        });
    });
});



document.addEventListener('DOMContentLoaded', function() {
    // Create a new date object for the current time
    var now = new Date();

    // Use the Intl.DateTimeFormat to format the date and time in the Auckland timezone
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

    // Extract the formatted date and time
    var dateString = formatterDate.format(now).split('/').reverse().join('-'); // Converts to YYYY-MM-DD
    var timeString = formatterTime.format(now).replace(/\s/g, ''); // Removes any spaces

    var dateInput = document.getElementById('date');
    var timeInput = document.getElementById('time');

    dateInput.value = dateString; // Set the current Auckland date
    dateInput.min = dateString; // Disallow past dates

    timeInput.value = timeString; // Set the current Auckland time

    // Update the min time for today's date dynamically
    dateInput.addEventListener('change', function() {
        if (this.value === dateString) {
            timeInput.min = timeString; // Set min time to current time if it's today
        } else {
            timeInput.min = "00:00"; // Allow any time for future dates
        }
    });
});
