//Variable globales
var datas_Player1 = {
    up: "Z",
    down: "W",
    right: "D",
    left: "Q",
    jump: " ",
    position: {x: 1, y:280},
    direction: 'right',
    perdu: false,
};

var datas_Player2 = {
    up: "M",
    down: "K",
    left: "O",
    right: ",",
    jump: " ",
    position: {x: 1, y:300},
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
    DrawGrid(canvas);
});

function init_Partie(id){
    let nomJ1 = document.getElementById('nomJoueur1');
    let nomJ2 = document.getElementById('nomJoueur2');
    let joueur1 = document.getElementById('joueur1');
    let joueur2 = document.getElementById('joueur2');

    nomJ1.textContent = joueur1.value;
    nomJ2.textContent = joueur2.value;

    fermerPlus(id);
    commencer_Partie();
}

function DrawGrid(canvas){
    const ctx = canvas.getContext('2d');

    const pointSize = 10
    const width = canvas.width;
    const height = canvas.height;

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1

    //Pour les lignes verticales
    for(let x = 0; x <= width; x += pointSize){
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }

    //Pour les lignes horizontales
    for(let y = 0; y <= height; y += pointSize){
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
}

function ClearGrid(canvas){
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    DrawGrid(canvas);

    datas_Player1.position = {x: 1, y:280};
    datas_Player1.direction = 'right';
    datas_Player1.perdu = false;

    datas_Player2.position = {x: 1, y:300};
    datas_Player2.direction = 'right';
    datas_Player2.perdu = false;

    const initialCtx = canvas.getContext('2d');

    initialCtx.fillStyle = "orange";
    initialCtx.fillRect(datas_Player1.position.x, datas_Player1.position.y, 10, 10);
    dessin_cercle(datas_Player1, initialCtx);

    initialCtx.fillStyle = "white";
    initialCtx.fillRect(datas_Player2.position.x, datas_Player2.position.y, 10, 10);
    dessin_cercle(datas_Player2, initialCtx);
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

    document.addEventListener('keydown', function(e){


        console.log(e.key);
        if(Object.values(datas_Player1).includes(e.key.toUpperCase())){
            touches_P1.push(e.key.toUpperCase());
        }

        if(Object.values(datas_Player2).includes(e.key.toUpperCase())){
            touches_P2.push(e.key.toUpperCase());

        }
    });

    gameLoop = setInterval(function(){
        if(datas_Player1.perdu === true){
            clearInterval(gameLoop);
            partieEncours = false;
            return;
        }
        if(datas_Player2.perdu === true){
            clearInterval(gameLoop);
            partieEnCours = false;
            return;
        }

        move_Player1(canvas, touches_P1.shift());
        move_Player2(canvas, touches_P2.shift())
    }, 100);
}

function move_Player1(canvas, latouche){
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = "orange";
    ctx.fillRect(datas_Player1.position.x, datas_Player1.position.y, 10, 10);
    Set_Position_player1.add(`${datas_Player1.position.x}, ${datas_Player1.position.y}`);

    changeDirection(datas_Player1, latouche);
    dessin_cercle(datas_Player1, ctx);
    verif_perdu_joueur1(canvas);
}

function move_Player2(canvas, latouche){
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = "white";
    ctx.fillRect(datas_Player2.position.x, datas_Player2.position.y, 10, 10);
    Set_Position_player2.add(`${datas_Player2.position.x}, ${datas_Player2.position.y}`)

    changeDirection(datas_Player2, latouche);
    dessin_cercle(datas_Player2, ctx);
    verif_perdu_joueur2(canvas);
}

function changeDirection(keyBindings, latouche){
    var speed = 10
    let { x, y} = keyBindings.position
    let direction = keyBindings.direction

    if(latouche){
        switch(latouche){
            case keyBindings.up:
                direction = 'up'
                break;
            case keyBindings.down:
                direction = 'down'
                break;
            case keyBindings.left:
                direction = 'left'
                break;
            case keyBindings.right:
                direction = 'right'
                break;
            case keyBindings.jump:
                switch(direction){
                    case 'up':
                        y += speed
                        break;
                    case 'down':
                        y -= speed
                        break;
                    case 'left':
                        x -= speed
                        break;
                    case 'right':
                        x += speed
                        break;
                }
        }
    }
    switch(direction){
        case 'up':
            y -= speed
            break;
        case 'down':
            y += speed
            break;
        case 'left':
            x -= speed
            break;
        case 'right':
            x += speed
            break;
    }

    keyBindings.position.x = x
    keyBindings.position.y = y
    keyBindings.direction = direction
}

function dessin_cercle(keyBindings, ctx){
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

function verif_perdu_joueur1(canvas){
    if(datas_Player1.perdu){
        if(!partieEnCours) { return; }
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

    if(datas_Player1.perdu){
        finDeManche(canvas);
        return;
    }
    Set_Position_player1.add(`${datas_Player1.position.x}, ${datas_Player1.position.y}`);
}   

function verif_perdu_joueur2(canvas){
    if(datas_Player2.perdu)
        if(!partieEnCours) return ;

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

    if(datas_Player2.perdu){
        finDeManche(canvas);
        return;
    }
    Set_Position_player2.add(`${datas_Player2.position.x}, ${datas_Player2.position.y}`);
}

function finDeManche(canvas){
    let pts1 = document.getElementById('pts1');
    let pts2 = document.getElementById('pts2');
    
    if(!partieEnCours) { return; }

    partieEnCours = false;

    clearInterval(gameLoop);

    if(datas_Player1.perdu){
        alert("Joueur 1 a perdu la manche !");
        pts2.textContent = parseInt(pts2.textContent) + 1;
        ClearGrid(canvas);
        commencer_Partie();
    }else{
        alert("Joueur 2 a perdu la manche !");
        pts1.textContent = parseInt(pts1.textContent) + 1;
        ClearGrid(canvas);
        commencer_Partie();
    }

    if(pts1.textContent == 3){
        alert("Le joueur 1 à gagner la partie !!!");
        pts1.textContent = 0;
        pts2.textContent = 0;
        ClearGrid(canvas);
    }else if(pts2.textContent == 3){
        alert("Le joueur 2 a gagné la partie !!!");
        pts1.textContent = 0;
        pts2.textContent = 0;
        ClearGrid(canvas);   
    }
}

//Touches
document.addEventListener('keydown', function(e){
    const key = e.key.toUpperCase();
    if([datas_Player1.up, datas_Player1.down, datas_Player1.left, datas_Player1.right, datas_Player1.jump].includes(key)){
        touches_P1.push(key);
    }
    if([datas_Player2.up, datas_Player2.down, datas_Player2.left, datas_Player2.right, datas_Player2.jump].includes(key)){
        touches_P2.push(key);
    }
});

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


    for (var key in joueurActuel) {
        if (["up","down","left","right","jump"].includes(key) && key !== action) {
            if (joueurActuel[key] === touche) {
                return false; 
            }
        }
    }

    for (var key in autreJoueur) {
        if (["up","down","left","right","jump"].includes(key)) {
            if (autreJoueur[key] === touche) {
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

