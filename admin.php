<?php
// db connection details stored in a seperate location for security
require_once "../../files/settings.php";

// Set timezone for PHP and MySQL and establish db connection
date_default_timezone_set('Pacific/Auckland');
$conn = mysqli_connect($host, $user, $pswd, $dbnm);
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
mysqli_query($conn, "SET time_zone = '+12:00'");

// prepare to send JSON responses
header('Content-Type: application/json');
$response = [];

// Function to fetch and format bookings
function fetchBookings($result) {
    $bookings = [];
    while ($row = mysqli_fetch_assoc($result)) {
        // format date from YYYY=MM-DD to DD/MM/YYYY and time from HH:MM:SS to HH:MM 
        $datetimeString = $row['date'] . ' ' . $row['time'];
        $datetimeObject = DateTime::createFromFormat('Y-m-d H:i:s', $datetimeString);
        $formattedDateTime = $datetimeObject ? $datetimeObject->format('d/m/Y H:i') : 'Invalid datetime';

        $bookings[] = [
            'reference' => 'BRN' . sprintf('%05d', $row['id']),
            'customer' => $row['cname'],
            'phone' => $row['phone'],
            'pickupSuburb' => $row['sbname'],
            'destinationSuburb' => $row['dsbname'],
            'pickupDateTime' => $formattedDateTime,
            'status' => $row['status']
        ];
    }
    return $bookings;
}

// Handling search requests
if (isset($_POST['bsearch'])) {
    $bsearch = mysqli_real_escape_string($conn, trim($_POST['bsearch']));
    
    if (!empty($bsearch)) { // If text is inputed
        $bsearch = strtoupper($bsearch);
        // Validate input format
        if (preg_match('/^BRN\d{5}$/', $bsearch)) {
            // If valid input, search for the id only (removes leading BRN and 0s)
            $numericId = substr($bsearch, 3);
            $query = "SELECT * FROM bookings WHERE id = '$numericId'";
        } else {
            // Otherwise is invalid input. 
            $response['error'] = 'Invalid booking reference format. Please use the format BRN followed by exactly 5 digits.';
            echo json_encode($response);
            exit;
        }
    } else {
        // Search for any bookings within the next two hours
        $currentDateTime = new DateTime();
        $twoHoursLater = new DateTime();
        $twoHoursLater->modify('+2 hours');
        $currentDateTimeFormatted = $currentDateTime->format('Y-m-d H:i:s');
        $twoHoursLaterFormatted = $twoHoursLater->format('Y-m-d H:i:s');
        
        $query = "SELECT * FROM bookings WHERE status='unassigned' AND STR_TO_DATE(CONCAT(date, ' ', time), '%Y-%m-%d %H:%i:%s') BETWEEN '$currentDateTimeFormatted' AND '$twoHoursLaterFormatted'";
    }
    // Display the results or error message
    $result = mysqli_query($conn, $query);
    if (mysqli_num_rows($result) > 0) {
        $response = fetchBookings($result);
    } else {
        $response['message'] = empty($bsearch) ? 'No scheduled or unassigned bookings within the next two hours.' : 'No booking found with reference ' . $bsearch;
    }
}

// Handling assignment requests
if (isset($_POST['assign'])) {
    // Update the db reccords for the relevent booking 
    $reference = $_POST['assign'];
    $numericId = intval(substr($reference, 3));
    $query = "UPDATE bookings SET status='assigned' WHERE id = '$numericId' AND status != 'assigned'";
    // If the booking status is updated, show success message or say its already assigned / not found
    if (mysqli_query($conn, $query)) {
        if (mysqli_affected_rows($conn) > 0) {
            $response['success'] = true;
            $response['message'] = "Congratulations! Booking request $reference has been assigned!";
        } else {
            $response['success'] = false;
            $response['message'] = "Booking already assigned or not found.";
        }
    } else {
        $response['success'] = false;
        $response['message'] = "Failed to assign booking: " . mysqli_error($conn); // Display an error with error message
    }
    echo json_encode($response);
    exit;
}

echo json_encode($response);
mysqli_close($conn);
