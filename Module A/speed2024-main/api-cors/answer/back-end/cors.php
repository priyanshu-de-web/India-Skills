<?php

// Domains to allow CORS
header("Access-Control-Allow-Origin: http://worldskills17:5173");

// HTTP methods to allow
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

// Headers to allow
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}