//Variable globales
var datas_Player1 = {
    up: "Z",
    down: "W",
    right: "D",
    left: "Q",
    jump: "A",
    position: {x: 10, y:280},
    direction: 'right',
    perdu: false,
};
var datas_Player2 = {
    up: "M",
    down: "K",
    left: "O",
    right: ",",
    jump: "I",
    position: {x: 10, y:300},
    direction: 'right',
    perdu: false,
};
const Set_Position_player1 = new Set();
const Set_Position_player2 = new Set();
var partieEnCours = false;
var gameLoop = null;
var touches_P1 = [];
var touches_P2 = [];

//Partie
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas_dessin');
    dessineGrid(canvas);

    document.addEventListener('keydown', function(e){
        const key = e.key.toUpperCase();
        if([datas_Player1.up, datas_Player1.down, datas_Player1.left, datas_Player1.right, datas_Player1.jump].includes(key)){
            touches_P1.push(key);
        }
        if([datas_Player2.up, datas_Player2.down, datas_Player2.left, datas_Player2.right, datas_Player2.jump].includes(key)){
            touches_P2.push(key);
        }
    });
});

function verifNomJoueur(){
    let nomJ1 = document.getElementById('nomJoueur1');
    let nomJ2 = document.getElementById('nomJoueur2');

    if(nomJ1.textContent === "" && nomJ2.textContent === ""){
        document.getElementById('choixJoueur').showModal();
    }else{
        commencer_Partie();
    }
}

function nomJoueur(id){
    let nomJ1 = document.getElementById('nomJoueur1');
    let nomJ2 = document.getElementById('nomJoueur2');
    let joueur1 = document.getElementById('joueur1');
    let joueur2 = document.getElementById('joueur2');

    if(nomJ1.textContent === "" && nomJ2.textContent === ""){
        nomJ1.textContent = joueur1.value;
        nomJ2.textContent = joueur2.value;
    }
        
    fermerPlus(id);
    commencer_Partie();
}

function dessineGrid(canvas){
    const ctx = canvas.getContext('2d');

    const taille_carre = 10;
    const width = canvas.width;
    const height = canvas.height;

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    //Pour les lignes verticales
    for(let x = 0; x <= width; x += taille_carre){
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }

    //Pour les lignes horizontales
    for(let y = 0; y <= height; y += taille_carre){
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
}

function resetGrid(canvas){
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    dessineGrid(canvas);

    datas_Player1.position = {x: 10, y:280};
    datas_Player1.direction = 'right';
    datas_Player1.perdu = false;

    datas_Player2.position = {x: 10, y:300};
    datas_Player2.direction = 'right';
    datas_Player2.perdu = false;
}

function commencer_Partie(){
    const canvas = document.getElementById('canvas_dessin');

    if(gameLoop !== null){
        clearInterval(gameLoop);
    }

    partieEnCours = true;
    Set_Position_player1.clear();
    Set_Position_player2.clear();
    touches_P1 = [];
    touches_P2 = [];

    if(partieEnCours){
        document.getElementById('commencer').disabled = true;
    }

    gameLoop = setInterval(function(){
        if(datas_Player1.perdu || datas_Player2.perdu){
            clearInterval(gameLoop);
            partieEnCours = false;
            return;
        }

        const j1Dead = movePlayer1(canvas, touches_P1.shift());
        if (j1Dead || datas_Player1.perdu) {
            clearInterval(gameLoop);
            partieEnCours = false;
            finDeManche(canvas);
            return;
        }

         const j2Dead = movePlayer2(canvas, touches_P2.shift());
        if (j2Dead || datas_Player2.perdu) {
            clearInterval(gameLoop);
            partieEnCours = false;
            finDeManche(canvas);
            return;
        }
    }, 100);
}

function movePlayer1(canvas, latouche){
    if(datas_Player1.perdu) { 
        return false;
    }
    
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = "blue";
    ctx.fillRect(datas_Player1.position.x, datas_Player1.position.y, 10, 10);
    Set_Position_player1.add(`${datas_Player1.position.x}, ${datas_Player1.position.y}`);

    changeDirection(datas_Player1, latouche);

    verif_perdu_joueur1();
    if(datas_Player1.perdu) { 
        return true; 
    }

    dessin_cercle(datas_Player1, ctx);

    return false;
}

function movePlayer2(canvas, latouche){
    if(datas_Player2.perdu) { 
        return false;
    }
    
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = "red";
    ctx.fillRect(datas_Player2.position.x, datas_Player2.position.y, 10, 10);
    Set_Position_player2.add(`${datas_Player2.position.x}, ${datas_Player2.position.y}`);

    changeDirection(datas_Player2, latouche);

    verif_perdu_joueur2();
    if(datas_Player2.perdu) { 
        return true; 
    }

    dessin_cercle(datas_Player2, ctx);

    return false;
}

function directionOpposee(directionOppos) {
    switch(directionOppos){
        case "up":
            return "down";
        case "down":  
            return "up";
        case "left":  
            return "right";
        case "right": 
            return "left";
    }
}

function changeDirection(keyBindings, latouche){
    var speed = 10;
    let { x, y } = keyBindings.position;
    let direction = keyBindings.direction;
    let opDirection = directionOpposee(direction);
    
    if (latouche === keyBindings[opDirection]) {
        latouche = null;
    }

    if(latouche){
        switch(latouche){
            case keyBindings.up:
                direction = 'up';
                break;
            case keyBindings.down:
                direction = 'down';
                break;
            case keyBindings.left:
                direction = 'left';
                break;
            case keyBindings.right:
                direction = 'right';
                break;
            case keyBindings.jump:
                switch(direction){
                    case 'up':
                        y -= speed;
                        break;
                    case 'down':
                        y += speed;
                        break;
                    case 'left':
                        x -= speed;
                        break;
                    case 'right':
                        x += speed;
                        break;
                }
        }
    }

    switch(direction){
        case 'up':
            y -= speed;
            break;
        case 'down':
            y += speed;
            break;
        case 'left':
            x -= speed;
            break;
        case 'right':
            x += speed;
            break;
    }

    keyBindings.position.x = x;
    keyBindings.position.y = y;
    keyBindings.direction = direction;
}

function dessin_cercle(keyBindings, ctx){
    let cx = 0;
    let cy = 0;
    ctx.beginPath();
    switch(keyBindings.direction){
        case 'up':
            cx = keyBindings.position.x + 5;
            cy = keyBindings.position.y + 10;
            ctx.arc(cx, cy, 5, Math.PI, 0 );
            break;
        case 'down':
            cx = keyBindings.position.x + 5;
            cy = keyBindings.position.y;
            ctx.arc(cx, cy, 5, 0, Math.PI); 
            break;
        case 'left':
            cx = keyBindings.position.x + 10;
            cy = keyBindings.position.y + 5;          
            ctx.arc(cx, cy, 5, Math.PI/2, 3*Math.PI/2);
            break;
        case 'right':
            cx = keyBindings.position.x;
            cy = keyBindings.position.y + 5;           
            ctx.arc(cx, cy, 5, 3*Math.PI/2, Math.PI/2);
            break;
    }
    ctx.fill();
    ctx.closePath();
}

function verif_perdu_joueur1(){
    if(datas_Player1.perdu){
        if(!partieEnCours) { 
            return; 
        }
    }
        
    if(Set_Position_player1.has(`${datas_Player1.position.x}, ${datas_Player1.position.y}`) ||
        datas_Player1.position.x > 800 ||
        datas_Player1.position.y > 590 ||
        datas_Player1.position.x < 0 ||
        datas_Player1.position.y < 0
    ){
        datas_Player1.perdu = true;
    }
    if(Set_Position_player2.has(`${datas_Player1.position.x}, ${datas_Player1.position.y}`)){
        datas_Player1.perdu = true;
    }
}   

function verif_perdu_joueur2(){
    if(datas_Player2.perdu) { 
        if(!partieEnCours) { 
            return; 
        } 
    }

    if(Set_Position_player2.has(`${datas_Player2.position.x}, ${datas_Player2.position.y}`) || 
        datas_Player2.position.x > 800 ||
        datas_Player2.position.y > 590 ||
        datas_Player2.position.x < 0 ||
        datas_Player2.position.y < 0
    ){
        datas_Player2.perdu = true;
    }
    if(Set_Position_player1.has(`${datas_Player2.position.x}, ${datas_Player2.position.y}`)){
        datas_Player2.perdu = true;
    }
}

function finDeManche(canvas){ 
    let pts1 = document.getElementById('pts1');
    let pts2 = document.getElementById('pts2');

    partieEnCours = false;
    clearInterval(gameLoop);

    if(datas_Player1.perdu && datas_Player2.perdu){
        alert("Egalité");
    }else if(datas_Player1.perdu){
        alert("Joueur 2 a gagné la manche !");
        pts2.textContent = parseInt(pts2.textContent) + 1;
    }else{
        alert("Joueur 1 a gagné la manche !");
        pts1.textContent = parseInt(pts1.textContent) + 1;
    }
    
    if(pts1.textContent == 3 || pts2.textContent == 3){
        finDePartie(canvas);
        return;
    }

    resetGrid
(canvas);
    partieEnCours = true;
    commencer_Partie();
}

function finDePartie(canvas){
    let pts1 = document.getElementById('pts1');
    let pts2 = document.getElementById('pts2');

    clearInterval(gameLoop);
    partieEnCours = false;

    if(parseInt(pts1.textContent) === 3){
        alert("Le joueur 1 a gagné la partie !");
    }else{
        alert("Le joueur 2 a gagné la partie !");
    }

    pts1.textContent = 0;
    pts2.textContent = 0;

    resetGrid
(canvas);
    document.getElementById('commencer').disabled = false;
}

//Touches
function estToucheLibre(joueur, touche, action) {
    touche = touche.toUpperCase();
    var j1 = datas_Player1;
    var j2 = datas_Player2;
    var joueurActuel;
    var autreJoueur;

    if (joueur === "p1") {
        joueurActuel = j1;
        autreJoueur = j2;
    } else {
        joueurActuel = j2;
        autreJoueur = j1;
    }


    for (var key1 in joueurActuel) {
        if (["up","down","left","right","jump"].includes(key1) && key1 !== action) {
            if (joueurActuel[key1] === touche) {
                return false; 
            }
        }
    }

    for (var key2 in autreJoueur) {
        if (["up","down","left","right","jump"].includes(key2)) {
            if (autreJoueur[key2] === touche) {
                return false; 
            }
        }
    }

    return true;
}

function changerTouche(joueur, action) {
    var nouvelleTouche = prompt("Appuie sur la nouvelle touche pour " + action);
    if (!nouvelleTouche){
        return;
    } 
    if (estToucheLibre(joueur, nouvelleTouche, action) === false){
        return;
    } 
     var touche = nouvelleTouche.substring(0, 1).toUpperCase();
    if (joueur === "p1") {
        datas_Player1[action] = touche;
        document.getElementById("j1_" + action).textContent = touche;
    } else {
        datas_Player2[action] = touche;
        document.getElementById("j2_" + action).textContent = touche;
    }

    alert("Touche changée ! Maintenant tu joues avec " + touche);
}

//Modal
function ouvrirPlus(id) {
    const dlg = document.getElementById(id);
    if (dlg) {
        dlg.showModal(); 
        const input = dlg.querySelector('input');
        if (input){
            input.focus(); 
        }  
    }
}

function fermerPlus(id) {
    const dlg = document.getElementById(id);
    if (dlg && dlg.open) {
        dlg.close(); 
    }
}

