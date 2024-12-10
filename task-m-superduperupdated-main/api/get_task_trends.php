<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/Database.php';
include_once '../api/Task.php';

$database = new Database();
$db = $database->getConnection();
$task = new Task($db);

$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : die();

$task->user_id = $user_id;

$result = $task->getTaskTrends();

if ($result) {
    http_response_code(200);
    echo json_encode($result);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "No task trends found."));
}