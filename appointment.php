<?php
// NOVA Vision Eye Clinic - Appointment Form Handler
// Security and validation-first approach

header('Content-Type: application/json');

// Check if form was submitted via POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Validate and sanitize inputs
$name = isset($_POST['name']) ? trim(htmlspecialchars($_POST['name'])) : '';
$email = isset($_POST['email']) ? trim(htmlspecialchars($_POST['email'])) : '';
$phone = isset($_POST['phone']) ? trim(htmlspecialchars($_POST['phone'])) : '';
$service = isset($_POST['service']) ? trim(htmlspecialchars($_POST['service'])) : '';
$date = isset($_POST['date']) ? trim(htmlspecialchars($_POST['date'])) : '';

// Validation checks
$errors = [];

if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Please provide a valid name';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please provide a valid email address';
}

if (empty($phone) || strlen($phone) < 10) {
    $errors[] = 'Please provide a valid phone number';
}

if (empty($service)) {
    $errors[] = 'Please select a service';
}

if (empty($date)) {
    $errors[] = 'Please select an appointment date';
}

// Return errors if validation fails
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Validation failed', 'errors' => $errors]);
    exit;
}

// Prepare email
$to = "info@novavision.com.ng";
$subject = "New Appointment Request - NOVA Vision Eye Clinic";

// Create professional email body
$email_body = "
===========================================
NEW APPOINTMENT REQUEST
===========================================

Patient Name: " . $name . "
Email: " . $email . "
Phone: " . $phone . "
Service: " . $service . "
Preferred Date: " . $date . "
Submission Time: " . date('Y-m-d H:i:s') . "

===========================================
This is an automated message from NOVA Vision Eye Clinic website.
===========================================
";

// Email headers
$headers = "From: noreply@novavisioneyeclinic.com.ng\r\n";
$headers .= "Reply-To: " . filter_var($email, FILTER_SANITIZE_EMAIL) . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send email
$mail_sent = mail($to, $subject, $email_body, $headers);

if ($mail_sent) {
    // Optional: Send confirmation to patient
    $patient_subject = "Appointment Request Received - NOVA Vision Eye Clinic";
    $patient_body = "Dear " . $name . ",\n\nThank you for booking an appointment with NOVA Vision Eye Clinic.\n\nWe have received your appointment request for " . $date . " for " . $service . ".\n\nOur team will contact you shortly at " . $phone . " to confirm your appointment.\n\nBest regards,\nNOVA Vision Eye Clinic Team\nPhone: +234 703 019 3773";

    mail(filter_var($email, FILTER_SANITIZE_EMAIL), $patient_subject, $patient_body, "From: info@novavision.com.ng\r\nContent-Type: text/plain; charset=UTF-8");

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Appointment request submitted successfully! We will contact you shortly to confirm.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to submit appointment. Please try again or call us directly at +234 703 019 3773'
    ]);
}
