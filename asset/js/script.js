var keyBindings_Player1 = {
    up: "KeyZ",
    down: "KeyW",
    right: "KeyD",
    left: "KeyA",
    jump: "Space",
    position: {x: 1, y:280},
    direction: 'right'
};
var keyBindings_Player2 = {
    up: "KeyM",
    down: "KeyK",
    left: "KeyO",
    right: "Comma",
    jump: "Space"
};

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas_dessin');
    DrawGrid(canvas);

});

function init_Partie(id){
    let nomJ1 = document.getElementById('nomJoueur1');
    let nomJ2 = document.getElementById('nomJoueur2');
    let joueur1 = document.getElementById('joueur1')
    let joueur2 = document.getElementById('joueur2')

    nomJ1.textContent = joueur1.value
    nomJ2.textContent = joueur2.value

    fermerPlus(id)
    commencer_Partie()
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

function commencer_Partie(){
    touches_P1 = []
    touches_P2 = []

    document.addEventListener('keydown', function(e){
        if(Object.values(keyBindings_Player1).includes(e.code)){
            touches_P1.push(e.code)
            setTimeout( () => {
                move_Player1(canvas, touches_P1.shift())
                touches_P1.shift()
            }, 1000)
            console.log(touches_P1)
        }
    })
}


function move_Player1(canvas, latouche){
    const Set_Postion_player1 = new Set();
    const ctx = canvas.getContext('2d');
    var perdu = false
    var speed = 10

    var cx = keyBindings_Player1.position.x
    var cy = keyBindings_Player1.position.y + 5

    ctx.fillStyle = "orange"
    Set_Postion_player1.add(`${keyBindings_Player1.position.x}, ${keyBindings_Player1.position.y}`);
    ctx.beginPath()
    ctx.arc(cx, cy, 5, 3*Math.PI/2, Math.PI/2);
    ctx.fill();
    ctx.closePath()

    let newX = keyBindings_Player1.position.x
    let newY = keyBindings_Player1.position.y

    ctx.fillRect(keyBindings_Player1.position.x, keyBindings_Player1.position.y, 10, 10)

            switch(event.code){
                case keyBindings_Player1.up:
                    newY += speed
                    direction = 'top'
                    break;
                case keyBindings_Player1.down:
                    newY -= speed
                    direction = 'down'
                    break;
                case keyBindings_Player1.left:
                    newX -= speed
                    direction = 'left'
                    break;
                case keyBindings_Player1.right:
                    newX += speed
                    direction = 'right'
                    break;
                case keyBindings_Player1.jump:
                    switch(direction){
                        case 'top':
                            newY += speed * 2
                            break;
                        case 'down':
                            newY -= speed * 2
                            break;
                        case 'left':
                            newX -= speed * 2
                            break;
                        case 'right':
                            newX += speed * 2
                            break;
                    }
            }
        }
    });

    verif_perdu_joueur1(newX, newY, perdu)

}

function dessin_cercle(direction, position, ctx){
    ctx.beginPath()
    switch(direction){
        case 'top':
            cx = position.x + 5
            cy = position.y
            ctx.arc(cx, cy, 5, Math.PI, 0, true);
            break;
        case 'down':
            cx = position.x + 5
            cy = position.y + 10
            ctx.arc(cx, cy, 5, 0, Math.PI, true); 
            break;
        case 'left':
            cx = position.x + 10
            cy = position.y + 5             
            ctx.arc(cx, cy, 5, Math.PI/2, 3*Math.PI/2, false);
            break;
        case 'right':
            cx = position.x
            cy = position.y + 5               
            ctx.arc(cx, cy, 5, 3*Math.PI/2, Math.PI/2);
            break;
    }
    ctx.fill();
    ctx.closePath()
}

function verif_perdu_joueur1(newX, newY, perdu){
    if(!Set_Postion_player1.has(`${newX}, ${newY}`)){
        keyBindings_Player1.position.x = newX
        keyBindings_Player1.position.y = newY

        dessin_cercle(direction, position, ctx);            
                
        Set_Postion_player1.add(`${keyBindings_Player1.position.x}, ${keyBindings_Player1.position.y}`)
    }else{
        perdu = true
    }

    if(keyBindings_Player1.position.x > 800 || keyBindings_Player1.position.y > 590 || keyBindings_Player1.position.x < 0 || keyBindings_Player1.position.y < 0){
        perdu = true
    }if(perdu){
        alert("Joueur 1 a perdu !");
        window.location.reload();
    }
}

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
