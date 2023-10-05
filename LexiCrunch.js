var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.7.1.min.js';
document.getElementsByTagName('head')[0].appendChild(script);
let score = 0;


function getScore()
{
    let lcScore = document.getElementById('lcScore');

    lcScore.innerHTML=score;
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

