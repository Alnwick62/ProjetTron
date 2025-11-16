document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas_dessin');
    DrawGrid(canvas);
    move_Player1(canvas, keyBindings_Player1);
});

var keyBindings_Player1 = {
    up: "KeyZ",
    down: "KeyW",
    left: "KeyD",
    right: "KeyA",
    jump: "Space"
};
var keyBindings_Player2 = {
    up: "KeyM",
    down: "KeyK",
    left: "KeyO",
    right: "Comma",
    jump: "Space"
};

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

function move_Player1(canvas, keyBindings){
    const Set_Postion_player1 = new Set();
    const ctx = canvas.getContext('2d');
    var perdu = false
    var speed = 10
    var positionX = 400
    var positionY = 0
    var direction = 'top'

    ctx.fillStyle = "#27F5BB";
    Set_Postion_player1.add(`${positionX}, ${positionY}`);
    ctx.fillRect(positionX, positionY, 10, 10)

    /*
    ctx.fillRect(positionX, positionY, 10, 10)
    Set_Postion_player1.add('${positionX}, ${positionY}');
    */
    document.addEventListener('keydown', function(event){
        if(Object.values(keyBindings).includes(event.code)){
            let newX = positionX
            let newY = positionY

            switch(event.code){
                case keyBindings.up:
                    newY += speed
                    direction = 'top'
                    break;
                case keyBindings.down:
                    newY -= speed
                    direction = 'down'
                    break;
                case keyBindings.left:
                    newX += speed
                    direction = 'left'
                    break;
                case keyBindings.right:
                    newX -= speed
                    direction = 'right'
                    break;
                case keyBindings.jump:
                    switch(direction){
                        case 'top':
                            newY += speed * 2
                            break;
                        case 'down':
                            newY -= speed * 2
                            break;
                        case 'left':
                            newX += speed * 2
                            break;
                        case 'right':
                            newX -= speed * 2
                            break;
                    }
            }

        if(!Set_Postion_player1.has(`${newX}, ${newY}`)){
            positionX = newX
            positionY = newY
            ctx.fillRect(positionX, positionY, 10, 10)
            Set_Postion_player1.add(`${positionX}, ${positionY}`)
        }else{
            perdu = true
        }}
        //fillRect(positionX, positionY, largeur, hauteur)

        if(positionX == 800 || positionY == 590 || positionX < 0 || positionY < 0){
            perdu = true
        }

        if(perdu){
            alert("Joueur 1 a perdu !");
            window.location.reload();
        }
    });

}

function ouvrirPlus(id) {
    document.getElementById(id).style.display = "flex";
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
