<?php
// Compteur de vues par réalisation, stocké dans un fichier JSON (pas de base de données).
// GET  -> renvoie le nombre de vues de chaque réalisation : {"slug": 12, ...}
// POST id=<slug> -> incrémente le compteur de cette réalisation et renvoie le nouveau total.

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://ferrogarrigues.fr');

$dataFile = __DIR__ . '/data/views.json';

function readCounts($file) {
    if (!file_exists($file)) {
        return [];
    }
    $content = file_get_contents($file);
    $data = json_decode($content, true);
    return is_array($data) ? $data : [];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = isset($_POST['id']) ? $_POST['id'] : '';

    // Slug : lettres minuscules, chiffres, tirets uniquement, 100 caractères max.
    if (!preg_match('/^[a-z0-9-]{1,100}$/', $id)) {
        http_response_code(400);
        echo json_encode(['error' => 'invalid id']);
        exit;
    }

    $fp = fopen($dataFile, 'c+');
    if (!$fp) {
        http_response_code(500);
        echo json_encode(['error' => 'storage unavailable']);
        exit;
    }

    flock($fp, LOCK_EX);
    $size = filesize($dataFile) ?: 0;
    $content = $size > 0 ? fread($fp, $size) : '';
    $counts = json_decode($content, true);
    if (!is_array($counts)) {
        $counts = [];
    }

    $counts[$id] = (isset($counts[$id]) ? $counts[$id] : 0) + 1;

    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($counts));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);

    echo json_encode(['id' => $id, 'count' => $counts[$id]]);
    exit;
}

// GET (par défaut) : renvoie tous les compteurs.
echo json_encode(readCounts($dataFile), JSON_FORCE_OBJECT);
