<?php
$host = "sql100.infinityfree.com";       
$dbname = "if0_40562468_ProjetTron"; 
$user = "if0_40562468";           
$pass = "EP37AJ8bE9";         

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(Exception $e) {
    die('Erreur : '.$e->getMessage());
}

$joueur = $_POST['joueur'] ?? '';
$score = $_POST['score'] ?? 0;

$stmt = $pdo->prepare("INSERT INTO scores(joueur, score) VALUES (?, ?)");
$stmt->execute([$joueur, $score]);

echo "Score enregistré !";
?>
