<?php
// Inclure l'autoloader de Composer (si besoin)
require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

define('LOG_FILE', __DIR__ . '/logs/debug.log');

// Fonction simple pour logger
function logMessage(string $msg) {
    error_log(date('[Y-m-d H:i:s] ') . $msg . PHP_EOL, 3, LOG_FILE);
}

// Initialiser réponse
$response = [
    'success' => false,
    'message' => '',
    'debug' => []
];

// Vérifier POST
if (!isset($_POST['titre']) || !isset($_POST['data'])) {
    $response['message'] = "Erreur: titre ou données manquantes.";
    logMessage($response['message']);
    echo json_encode($response);
    exit;
}

$titre = $_POST['titre'];
$data = $_POST['data'];

logMessage("Reçu titre: $titre");
logMessage("Reçu data: " . print_r($data, true));

// Construire le message Telegram
$message = "━━━━━━━━━━━━━━━━━━━━\n";
$message .= "$titre\n";
$message .= "━━━━━━━━━━━━━━━━━━━━\n\n";

foreach ($data as $index => $item) {
    if (!is_array($item)) {
        logMessage("Données inattendues à l'index $index: " . print_r($item, true));
        continue;
    }
    foreach ($item as $key => $value) {
        // Beautifier la clé
        $cleLisible = preg_replace('/(?<!^)[A-Z]/', ' $0', $key);
        $cleLisible = ucfirst(strtolower($cleLisible));
        $message .= "🔹 $cleLisible : $value\n";
    }
    $message .= "\n";
}

logMessage("Message formaté pour Telegram: $message");

// Récupérer les valeurs sensibles depuis .env si possible, sinon variables en dur
$apiToken = getenv('TELEGRAM_TOKEN') ?: "8104504221:AAEeamysrWvs0UkUn3-DdAA4FAFalKhvwH8";
$chatId = getenv('TELEGRAM_CHAT_ID') ?: 7788292178;

if (!$apiToken || !$chatId) {
    $response['message'] = "Erreur: token ou chat ID manquant.";
    logMessage($response['message']);
    echo json_encode($response);
    exit;
}

// Préparer l'URL et envoyer la requête
$messageEncoded = urlencode($message);
$url = "https://api.telegram.org/bot$apiToken/sendMessage?chat_id=$chatId&text=$messageEncoded";

logMessage("URL Telegram: $url");

$telegramResponse = @file_get_contents($url);

if ($telegramResponse === false) {
    $error = error_get_last();
    $response['message'] = "Erreur lors de l'envoi vers Telegram.";
    $response['debug'] = $error;
    logMessage("Erreur file_get_contents: " . print_r($error, true));
    echo json_encode($response);
    exit;
}

// Décoder la réponse Telegram pour vérifier le statut
$telegramResponseDecoded = json_decode($telegramResponse, true);
if (!$telegramResponseDecoded || !$telegramResponseDecoded['ok']) {
    $response['message'] = "Erreur Telegram: " . ($telegramResponseDecoded['description'] ?? 'Réponse invalide');
    $response['debug'] = $telegramResponseDecoded;
    logMessage("Erreur Telegram: " . print_r($telegramResponseDecoded, true));
    echo json_encode($response);
    exit;
}

$response['success'] = true;
$response['message'] = "Message envoyé avec succès.";
$response['debug'] = $telegramResponseDecoded;

logMessage("Message envoyé avec succès.");

echo json_encode($response);
