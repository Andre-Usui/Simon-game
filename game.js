/* 

    To do: Simon Game

            - Sincronizar o jQuery no html (ok)
            - ajustar formato do css (ok)

- clique em qualquer tecla do teclado para começar o jogo e reiniciar. 
-- muda o texto para level 1 (#level-title)

classes de transição: .pressed, .game-over
            selecionar os botões via jQuery (OK)
*/


/*
- Pensando a lógica do jogo:
-- Cria-se uma sequência aleatória (vazia?) começando do primeiro elemento
--- Math.float(Math.random()*3+1) para criar 4 elementos randômicos em um array[] (computerSequence) (ok)
-- O usuário deve acertar o elemento criado
--- verificar acerto 
---- possibilidade 1 - O jogador cria um novo array que deve condizer com o array aleatório
---- possibilidade 2 - cada click é averiguado a posição do array atual. 
--- aumenta 1 level (#level-title)

-- um novo elemento randômico deve ser criado
---- loop? infinito?
----- Se acertar aumenta i? (i=1, i<arrayAleatorio.lenght, i++)? 
----- Break? default?  

-- No momento do erro 
--- pisca a tela em vermelho 
--- muda o texto #level-title para "GAME OVER! Press any key to Restart"
*/

var blueSound = new Audio("./sounds/blue.mp3");
var greenSound = new Audio("./sounds/green.mp3");
var redSound = new Audio("./sounds/red.mp3");
var yellowSound = new Audio("./sounds/yellow.mp3");
var wrongSound = new Audio("./sounds/wrong.mp3");

/*function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}*/ 

var pcSequence = [];
var playerChoice = [];
var btnBlue = $("#blue");
var btnGreen = $("#green");
var btnRed = $("#red");
var btnYellow = $("#yellow");

//var buttonColours = ["red", "blue", "green", "yellow"];

var j;
var i;
var started = false;

$(document).keypress(function() {
    if (!started) {
        startGame();
        started = true;
    }
});

$(".white").on("click", () =>{
    if(!started) {
        fade($(".white"));
        startGame();
        started = true;
    }    
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
} //sleep from stackOverflow

function fade(a) {
    a.addClass("pressed");
    setTimeout(() =>{
        a.removeClass("pressed");
    }, 100);  
    return
}

/*function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function () {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}*/

function fadeOver(a) {
    a.addClass("game-over");
    setTimeout(() =>{
        a.removeClass("game-over");
    }, 300);  
    return
}

function startGame(){
    pcSequence = [];
    playerChoice = [];
    i = 0;
    j = 0;
    startLevel();
}

async function startLevel() {
    for (var i = 0; i <= (pcSequence.length + 1); i++){
        $("#level-title").text("level " + (i+1));                          
        console.log("startLevel has begun");
        await sleep(300);      
        await buildSequence(pcSequence);  
        await rightAnswer(pcSequence);
        await sleep(300);
        if (!started){
            console.log("startLevel has breaked");
            break
        }
        console.log("startLevel has looped");         
    }; return
}

async function buildSequence (pcSequence) {

        var newColor = Math.floor(Math.random()*4);
        pcSequence.push(newColor);
        console.log("pcSequence = " + pcSequence);
        switch (newColor) {
            case 0:
                blueSound.play();
                fade(btnBlue);

                break;

            case 1:
                greenSound.play();
                fade(btnGreen);
                
                break;

            case 2:
                redSound.play();
                fade(btnRed);
                
                break;

            case 3:
                yellowSound.play();
                fade(btnYellow);
                
                break;
        
            default:
                break;
        };

        await new Promise((resolve) => {
            console.log("promise is ok on buildSequence. the sequence is " + pcSequence);
            resolve(pcSequence);
        });
}

       //fazer um loop para averiguar cada elemento do array pcSequence e aguardar um retorno correto.
async function rightAnswer(pcSequence){        
    for(var j = 0 ; j < pcSequence.length ; j++){  
        console.log("rightAnswer was called");  

        // posso colocar os botões dentro do for
        // promise que aguarda a execução de uma função específica.
        await putAnswer(j, pcSequence);
    } return       
}

async function putAnswer(j, pcSequence, playerChoice){
    if (started) {                          // an error was occuring here because when
        playerChoice = [];                  // a button has pressed, a resolve was given
        return new Promise((resolve) => {   // and when "await putAnswer(j, pcSequence)"  
            btnBlue.on("click", () =>{      // is called, a pre-Data has already setted.
                playerChoice = [0];         // calling "checkAnswer" without a  player 
                blueSound.play();           // click. "if(started)" corrects the error.
                fade(btnBlue);
                resolve(pcSequence);
            });
            
            btnGreen.on("click", () =>{
                playerChoice = [1];
                greenSound.play();
                fade(btnGreen);
                resolve(pcSequence);
            });
            
            btnRed.on("click", () =>{
                playerChoice = [2];
                redSound.play();
                fade(btnRed);
                resolve(pcSequence);
            });
            
            btnYellow.on("click", () =>{
                playerChoice = [3];     
                yellowSound.play();
                fade(btnYellow);  
                resolve(pcSequence); 
            }); 
        })
        .then(() =>{
            checkAnswer(j, pcSequence, playerChoice);
        })              
    }   
}

async function checkAnswer(j, pcSequence, playerChoice){ //setTimeout 2s   !!! here isnt working, where?
    console.log("CheckAnswer pcSequence = " + pcSequence); 
    console.log("CheckAnswer playerChoice = " + playerChoice);   
    if (pcSequence[j] === playerChoice[0]) {
        console.log("Player got it right!");
        return;
    } else if(pcSequence[j] !== playerChoice[0]){
        console.log("Player got it wrong!");
        return gameOver();
    }
    
}

async function gameOver() {
    $("#level-title").text("Game over\nPress a Key to try again!");
    wrongSound.play();
    fadeOver($("body"));
    i = pcSequence.length+13; //trying to end the for loop.
    j = pcSequence.length+13;
    pcSequence = [];
    playerChoice = [];
    console.log("Game-over! i = " + i);
    console.log("Game-over! j = " + j);
    started = false;
    return
}


  // fim da function startGame
 
// async e awaits e promisses for the win! jQuery
// escrevo uma função que aguardará o click em um dos botões; 
// a função retornará um valor. 
// $( "ivd" ).promise().done(function() { que retornará o resultado e executará.
// ou acerto ou erro. if?


    
/*    IMPORTANTE
function pressKey () { // ajustar para dar início ao jogo.
    $("document").on("keydown", setTimeout(startGame(), 200));
    console.log("clique em um botão");
    return
}
pressKey();*/

// function gameOver()   --- ULTIMA ETAPA
// fim do loop i

    // aguardar a resposta do jogador
    // verificar a resposta do jogador
    // definir se continua ou gameover
    // gameover = resetar os sequences, mudar h1 para Game Over
    // gameover = desativar os botões e acionar o pressKey()

/*
Possíveis aprimoramentos. 

- registro de record. 
- timer.
- níveis de dificuldade? timer com menos tempo. mais elementos.
- padrão nas "aleatoriedades"? repetir várias vezes o mesmo elemento? evitar repetições até x leveis?


*/