var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.7.1.min.js';
document.getElementsByTagName('head')[0].appendChild(script);
let score = 0;


function getScore()
{
    let lcScore = document.getElementById('lcScore');

    lcScore.innerHTML=score;
}

function stringToButton() {

    const fs = require('fs');

    fs.readFile('10 letter words.txt', 'utf8', function(err, data) {
        if (err) throw err;};
    const lines = data.split('\n');
    const randomLine = lines[Math.floor(Math.random() * lines.length)];

    let word = randomLine;
    
    for (i = 1; i <= 10; i++) {
        let letter = word.charAt(i - 1);
        let newTile = document.getElementById('t' + i.toString());
        newTile.innerHTML = letter;
    }
       

}

function updateScore()
{
    // checks to see if the enter key has been pressed.
    $('#answer').keypress(function (press) {
        var key = press.which;
        if (key == 13)  // the enter key code
        {
            $('#enter').click();
            return false;
        }
    }); 

    // gives a score.
    let answer = document.getElementById('answer').value; // extracts the string from the "answer" id in "LexiCrunch.html".
    let lcScore = document.getElementById('lcScore');

    // replace score function with Collen's
        score = score + 2; 
        lcScore.innerHTML=score;
    document.getElementById("answer").value = "";

}

