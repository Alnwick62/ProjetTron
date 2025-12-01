<?php
    require_once("asset\bdd\ajouteScore.php"); 
    $pdo = PdoTron::getPdoTron();
    $joueur = "Test";
    $score = 123;

    $test = $pdo->prepare("INSERT INTO scores(joueur, score) VALUES (?, ?)");
    $rqt = $test->execute([$joueur, $score]);

    var_dump($rqt);

?>