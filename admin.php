<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once "../../files/settings.php";

// Set timezone for PHP and MySQL
date_default_timezone_set('Pacific/Auckland');
$conn = mysqli_connect($host, $user, $pswd, $dbnm);
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
mysqli_query($conn, "SET time_zone = '+12:00'");

header('Content-Type: application/json');
$response = [];

if (isset($_POST['bsearch'])) {
    $bsearch = mysqli_real_escape_string($conn, trim($_POST['bsearch']));
    if (!empty($bsearch)) {
        $bsearch = strtoupper($bsearch); // Convert input to uppercase
        // Validate search format (BRN followed by exactly 5 digits)
        if (preg_match('/^BRN\d{5}$/', $bsearch)) {
            $numericId = substr($bsearch, 3);
            $query = "SELECT * FROM bookings WHERE id = '$numericId'"; // Search for the id
        } else {
            $response = ['error' => 'Invalid booking reference format. Please use the format BRN followed by exactly 5 digits.'];
            echo json_encode($response);
            exit;
        }
    } else {
        $currentDateTime = new DateTime();
        $twoHoursLater = new DateTime();
        $twoHoursLater->modify('+2 hours');

        $currentDateTimeFormatted = $currentDateTime->format('Y-m-d H:i:s');
        $twoHoursLaterFormatted = $twoHoursLater->format('Y-m-d H:i:s');

        $query = "SELECT * FROM bookings WHERE STR_TO_DATE(CONCAT(date, ' ', time), '%Y-%m-%d %H:%i:%s') BETWEEN '$currentDateTimeFormatted' AND '$twoHoursLaterFormatted'";
    }
} 

if (isset($_POST['assign'])) {
    $reference = $_POST['assign']; // "BRN00001"
    $numericId = intval(substr($reference, 3)); // Extract numeric part and convert to integer, "1"

    $query = "UPDATE bookings SET status='assigned' WHERE id = '$numericId' AND status != 'assigned'";

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
        $response['message'] = "Failed to assign booking: " . mysqli_error($conn);
    }
    echo json_encode($response);
    exit;
}


$result = mysqli_query($conn, $query);
if ($result && mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $datetimeString = $row['date'] . ' ' . $row['time'];
        $datetimeObject = DateTime::createFromFormat('Y-m-d H:i:s', $datetimeString);
        $formattedDateTime = $datetimeObject ? $datetimeObject->format('d/m/Y H:i') : 'Invalid datetime';

        $response[] = [
            'reference' => 'BRN' . sprintf('%05d', $row['id']),
            'customer' => $row['cname'],
            'phone' => $row['phone'],
            'pickupSuburb' => $row['sbname'],
            'destinationSuburb' => $row['dsbname'],
            'pickupDateTime' => $formattedDateTime,
            'status' => $row['status']
        ];
    }
} else {
    $response = ['message' => 'No matching bookings found.'];
}

echo json_encode($response);
error_log("Response: " . json_encode($response));
mysqli_close($conn);
?>
