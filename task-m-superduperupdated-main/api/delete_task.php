<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../config/Database.php';
require_once '../api/Task.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    $task = new Task($db);

    $data = json_decode(file_get_contents("php://input"));

    if (!empty($data->id) && !empty($data->user_id)) {
        if ($task->delete($data->id, $data->user_id)) {
            http_response_code(200);
            echo json_encode(["message" => "Task deleted successfully"]);
        } else {
            throw new Exception("Failed to delete task");
        }
    } else {
        throw new Exception("Missing required fields");
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["message" => $e->getMessage()]);
}
