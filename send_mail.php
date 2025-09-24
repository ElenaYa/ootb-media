<?php

if (function_exists('date_default_timezone_set')) {
    date_default_timezone_set('UTC');
}


function is_post() {
    return ($_SERVER['REQUEST_METHOD'] ?? '') === 'POST';
}
function is_ajax() {
    $xr = $_SERVER['HTTP_X_REQUESTED_WITH'] ?? '';
    return strtolower($xr) === 'xmlhttprequest';
}
function json_response($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
function html_response($title, $message, $code = 200) {
    http_response_code($code);
    header('Content-Type: text/html; charset=UTF-8');
    echo '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1" />'
       . '<title>' . htmlspecialchars($title) . '</title>'
       . '<style>body{font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;'
       . 'background:#FAFAFA;color:#111827;padding:2rem;line-height:1.6} .card{max-width:720px;margin:0 auto;background:#fff;border:1px solid #E5E7EB;'
       . 'border-radius:12px;box-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1);padding:1.5rem}</style></head><body>'
       . '<div class="card"><h1 style="margin-top:0">' . htmlspecialchars($title) . '</h1><pre style="white-space:pre-wrap">'
       . htmlspecialchars($message) . '</pre>'
       . '<p><a href="contact.html">Back to contact</a></p></div></body></html>';
    exit;
}

if (!is_post()) {
    $msg = 'Method Not Allowed. Please submit the contact form via POST.';
    if (is_ajax()) json_response(['success' => false, 'error' => $msg], 405);
    html_response('405 - Method Not Allowed', $msg, 405);
}

$firstName = trim(filter_input(INPUT_POST, 'firstName', FILTER_SANITIZE_SPECIAL_CHARS));
$lastName  = trim(filter_input(INPUT_POST, 'lastName', FILTER_SANITIZE_SPECIAL_CHARS));
$email     = trim(filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL));
$company   = trim(filter_input(INPUT_POST, 'company', FILTER_SANITIZE_SPECIAL_CHARS));
$industry  = trim(filter_input(INPUT_POST, 'industry', FILTER_SANITIZE_SPECIAL_CHARS));
$budget    = trim(filter_input(INPUT_POST, 'budget', FILTER_SANITIZE_SPECIAL_CHARS));
$message   = trim(filter_input(INPUT_POST, 'message', FILTER_SANITIZE_SPECIAL_CHARS));
$privacy   = isset($_POST['privacy']) ? 'Yes' : 'No';

$services = [];
if (isset($_POST['services'])) {
    $rawServices = $_POST['services'];
    if (is_array($rawServices)) {
        foreach ($rawServices as $s) {
            $services[] = trim(filter_var($s, FILTER_SANITIZE_SPECIAL_CHARS));
        }
    } else {
        $services[] = trim(filter_var($rawServices, FILTER_SANITIZE_SPECIAL_CHARS));
    }
}

$errors = [];
if ($firstName === '') $errors[] = 'First name is required.';
if ($lastName === '')  $errors[] = 'Last name is required.';
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Valid email is required.';
if ($industry === '')  $errors[] = 'Industry is required.';
if ($message === '')   $errors[] = 'Project details are required.';
if (count($services) === 0) $errors[] = 'Please select at least one service.';
if ($privacy !== 'Yes') $errors[] = 'Please agree to be contacted.';

if (!empty($errors)) {
    if (is_ajax()) json_response(['success' => false, 'errors' => $errors], 400);
    html_response('Form validation error', implode("\n", $errors), 400);
}

$to = 'ootbmedia0@gmail.com';
$subject = 'New Campaign Inquiry - OOTB Media';
$timestamp = date('Y-m-d H:i:s');

$body  = "New Campaign Inquiry - OOTB Media\n\n";
$body .= "Contact Information:\n";
$body .= 'Name: ' . $firstName . ' ' . $lastName . "\n";
$body .= 'Email: ' . $email . "\n";
$body .= 'Company: ' . ($company !== '' ? $company : 'Not specified') . "\n\n";
$body .= "Project Details:\n";
$body .= 'Industry: ' . $industry . "\n";
$body .= 'Monthly Budget: ' . ($budget !== '' ? $budget : 'Not specified') . "\n";
$body .= 'Services Interested In: ' . (count($services) ? implode(', ', $services) : 'Not specified') . "\n\n";
$body .= "Message:\n" . $message . "\n\n";
$body .= "---\n";
$body .= "This inquiry was submitted through the OOTB Media website contact form.\n";
$body .= 'Timestamp: ' . $timestamp . "\n";

$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'From: OOTB Media Website <mailer@ootb-media.local>';
$headers[] = 'Reply-To: ' . $firstName . ' ' . $lastName . ' <' . $email . '>';
$headers[] = 'X-Mailer: PHP/' . phpversion();

$sent = @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers));

if ($sent) {
    $response = [
        'success' => true,
        'message' => 'Message sent successfully.',
        'preview' => $body,
    ];
    if (is_ajax()) json_response($response);
    html_response('Message Sent Successfully', $body, 200);
} else {
    $errMsg = 'Failed to send email. Mail server may be unavailable.';
    if (is_ajax()) json_response(['success' => false, 'error' => $errMsg, 'preview' => $body], 500);
    html_response('Email Sending Failed', $errMsg . "\n\n" . $body, 500);
}
