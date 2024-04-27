<?php
require_once "../../files/settings.php";

// Establish database connection
$conn = mysqli_connect($host, $user, $pswd, $dbnm);
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$response = ['success' => false, 'message' => ''];
header('Content-Type: application/json');

// Collect and validate input
$cname = isset($_POST['cname']) ? mysqli_real_escape_string($conn, trim($_POST['cname'])) : '';
$phone = isset($_POST['phone']) ? mysqli_real_escape_string($conn, trim($_POST['phone'])) : '';
$snumber = isset($_POST['snumber']) ? mysqli_real_escape_string($conn, trim($_POST['snumber'])) : '';
$stname = isset($_POST['stname']) ? mysqli_real_escape_string($conn, trim($_POST['stname'])) : '';
$sbname = isset($_POST['sbname']) ? mysqli_real_escape_string($conn, trim($_POST['sbname'])) : '';
$dsbname = isset($_POST['dsbname']) ? mysqli_real_escape_string($conn, trim($_POST['dsbname'])) : '';
$date = isset($_POST['date']) ? mysqli_real_escape_string($conn, trim($_POST['date'])) : '';
$time = isset($_POST['time']) ? mysqli_real_escape_string($conn, trim($_POST['time'])) : '';

$missingFields = [];
if (empty($cname)) $missingFields[] = 'Customer Name';
if (empty($phone)) $missingFields[] = 'Phone Number';
if (empty($snumber)) $missingFields[] = 'Street Number';
if (empty($stname)) $missingFields[] = 'Street Name';
if (empty($date)) $missingFields[] = 'Pick-Up Date';
if (empty($time)) $missingFields[] = 'Pick-Up Time';

if (!empty($missingFields)) {
    $response['message'] = 'Please fill all required fields: ' . implode(', ', $missingFields) . '.';
    echo json_encode($response);
    exit;
}

// Validate phone number format
if (!preg_match('/^[0-9]{10,12}$/', $phone)) {
    $response['message'] = 'Invalid phone number format. Please enter a valid phone number with 10 to 12 digits.';
    echo json_encode($response);
    exit;
}

// Validate date format
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) || !strtotime($date)) {
    $response['message'] = 'Invalid date format. Please enter a valid date in YYYY-MM-DD format.';
    echo json_encode($response);
    exit;
}

// Validate time format
if (!preg_match('/^\d{2}:\d{2}$/', $time) || !strtotime($time)) {
    $response['message'] = 'Invalid time format. Please enter a valid time in HH:MM format.';
    echo json_encode($response);
    exit;
}

// Insert data into database
$query = "INSERT INTO bookings (cname, phone, snumber, stname, sbname, dsbname, date, time) VALUES ('$cname', '$phone', '$snumber', '$stname', '$sbname', '$dsbname', '$date', '$time')";
if (mysqli_query($conn, $query)) {
    $last_id = mysqli_insert_id($conn);
    // Format the booking number
    $booking_number = "BRN" . sprintf('%05d', $last_id);
    // Format the date from YYYY-MM-DD to DD/MM/YYYY
    $dateObject = DateTime::createFromFormat('Y-m-d', $date);
    $formattedDate = $dateObject ? $dateObject->format('d/m/Y') : 'invalid date';
    // Success response with formatted date and time
    $response['success'] = true;
    $response['message'] = "Booking Scheduled.<br>Thank you for your booking, $cname!<br>Your Booking reference number is $booking_number<br>Pick-up scheduled for $time (Pickup time) on $formattedDate (Pickup date).";
} else {
    $response['message'] = "Error: " . mysqli_error($conn);
}


echo json_encode($response);
mysqli_close($conn);
?>
