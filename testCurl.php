<?php
require 'vendor/autoload.php';  // Charge les dépendances de Composer

use GuzzleHttp\Client;

// Crée une nouvelle instance de Guzzle HTTP client
$client = new Client([
    'verify' => false  // Désactive la vérification SSL (pour test uniquement)
]);

try {
    // Envoie une requête GET à Telegram API
    $response = $client->request('GET', 'https://api.telegram.org');
    echo "Réponse reçue: " . $response->getBody();
} catch (\GuzzleHttp\Exception\RequestException $e) {
    echo 'Erreur cURL : ' . $e->getMessage();
}
