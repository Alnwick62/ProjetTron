var datas_Player1 = {
    up: "KeyZ",
    down: "KeyW",
    right: "KeyD",
    left: "KeyA",
    jump: "Space",
    position: {x: 1, y:280},
    direction: 'right',
    perdu: false,
};
var datas_Player2 = {
    up: "KeyM",
    down: "KeyK",
    left: "KeyO",
    right: "Comma",
    jump: "Space",
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

    datas_Player1.position = {x: 1, y:280}
    datas_Player1.direction = 'right'
    datas_Player1.perdu = false

    datas_Player2.position = {x: 1, y:300}
    datas_Player2.direction = 'right'
    datas_Player2.perdu = false

    Set_Position_player1.clear();
    Set_Position_player2.clear()

    touches_P1 = [];
    touches_P2 = [];

    const initialCtx = canvas.getContext('2d');
    initialCtx.fillStyle = "orange";
    initialCtx.fillRect(datas_Player1.position.x, datas_Player1.position.y, 10, 10);
    dessin_cercle(datas_Player1, initialCtx);
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
        if(Object.values(datas_Player1).includes(e.code)){
            touches_P1.push(e.code);
        }

        if(Object.values(datas_Player2).includes(e.code)){
            touches_P2.push(e.code);
        }
    });

    gameLoop = setInterval(function(){
        if(datas_Player1.perdu === true){
            clearInterval(gameLoop);
            partieEncours = false;
            return;
        }
        move_Player1(canvas, touches_P1.shift());
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

/*
function move_Player2(canvas, latouche){
    const stx = canvas.getContext('2d');

    ctx.fillStyle = "blue";
    ctx.fillRect(datas_Player2.position.x, datas_Player2.position.y, 10, 10);
    Set_Position_player2.add(`${datas_Player2.position.x}, ${datas_Player2.position.y}`)

    changeDirection(latouche);
    dessin_cercle(ctx);
    verif_perdu_joueur2(canvas);
}
*/
function changeDirection(keyBindings, latouche){
    var speed = 10
    let { x, y} = keyBindings.position
    let direction = keyBindings.direction

    if(latouche){
        switch(latouche){
            case keyBindings.up:
                direction = 'top'
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
        }
    }

    switch(direction){
        case 'top':
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

    keyBindings.position.x = x
    keyBindings.position.y = y
    keyBindings.direction = direction
}

function dessin_cercle(keyBindings, ctx){
    ctx.beginPath()
    switch(keyBindings.direction){
        case 'top':
            cx = keyBindings.position.x + 5
            cy = keyBindings.position.y
            ctx.arc(cx, cy, 5, Math.PI, 0, true);
            break;
        case 'down':
            cx = keyBindings.position.x + 5
            cy = keyBindings.position.y + 10
            ctx.arc(cx, cy, 5, 0, Math.PI, true); 
            break;
        case 'left':
            cx = keyBindings.position.x + 10
            cy = keyBindings.position.y + 5             
            ctx.arc(cx, cy, 5, Math.PI/2, 3*Math.PI/2, false);
            break;
        case 'right':
            cx = keyBindings.position.x
            cy = keyBindings.position.y + 5               
            ctx.arc(cx, cy, 5, 3*Math.PI/2, Math.PI/2);
            break;
    }
    ctx.fill();
    ctx.closePath()
}

function verif_perdu_joueur1(canvas){
    const ctx = canvas.getContext('2d');
    
    if(datas_Player1.perdu) 
        if(!partieEnCours) return;

    if(Set_Position_player1.has(`${datas_Player1.position.x}, ${datas_Player1.position.y}`) ||
        datas_Player1.position.x > 800 ||
        datas_Player1.position.y > 590 ||
        datas_Player1.position.x < 0 ||
        datas_Player1.position.y < 0
    ){
        datas_Player1.perdu = true;
    }

    if(datas_Player1.perdu){
        finDeManche(canvas);
        return;
    }
    Set_Position_player1.add(`${datas_Player1.position.x}, ${datas_Player1.position.y}`);
}  

function finDeManche(canvas){
    if(!partieEnCours) return;

    partieEnCours = false;

    clearInterval(gameLoop);

    alert("Joueur 1 a perdu !");
    let pts2 = document.getElementById('pts2');
    pts2.textContent = parseInt(pts2.textContent) + 1;

    ClearGrid(canvas);
    commencer_Partie();
}

//Mondal
function ouvrirPlus(id) {
    document.getElementById(id).style.display = "flex";
    document.getElementById('joueur1').focus();
}

function fermerPlus(id) {
    document.getElementById(id).style.display = "none";
}

window.onclick = function(event) {
    let modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
};
