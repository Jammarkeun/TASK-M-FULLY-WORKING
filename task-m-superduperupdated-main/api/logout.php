<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Start the session
session_start();

// Check if the user is logged in
if (isset($_SESSION['user_id'])) {
    // Unset all of the session variables
    $_SESSION = array();

    // Destroy the session
    session_destroy();

    // Respond with a success message
    http_response_code(200);
    echo json_encode(["message" => "Logout successful."]);
} else {
    // If the user is not logged in
    http_response_code(400);
    echo json_encode(["message" => "No user is logged in."]);
}
