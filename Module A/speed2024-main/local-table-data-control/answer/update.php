<?php

$json = json_decode(file_get_contents("./table.json"), true);
$type = $_POST["type"];

if($type === "add") {
    // add row
    $array = [];
    foreach($json["fields"] as $field) {
        $array[] = "";
    }
    $json["rows"][] = $array;
} else if($type === "save") {
    // save row
    $data = [];
    $data["fields"] = $_POST["fields"];
    $data["rows"] = $_POST["rows"];
    $json = $data;
} else {
    // delete row
    unset($json["rows"][$type]);
}

file_put_contents("./table.json", json_encode($json));

header("Location: " . $_SERVER["HTTP_REFERER"]);