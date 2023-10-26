import React, { useState, useEffect } from 'react';
import './App.css';
import './tile_style.css';

//REPLACE WITH BIGGER WORD LIST LATER
import { tenWordList } from './tenWordList';
import { wordList } from './wordList';

//NOT FULLY FUNCTIONING YET!
const createLetterStack = () => {

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('button-container');

  const rows = 5;

  for (let i = 0; i < rows; i++) {

    const buttonRow = document.createElement('div');
    buttonRow.classList.add('button-row');
    buttonContainer.appendChild(buttonRow);

  }

  document.body.appendChild(buttonContainer);
  
};

const App = () => {
  const [randomWord1, setRandomWord1] = useState('');
  const [randomWord2, setRandomWord2] = useState('');
  const [pressedLetters, setPressedLetters] = useState('');
  const [submitList, setSubmitList] = useState([]);

  //RANDOMIZE MORE!
  const shuffleWord = (word) => {
    const shuffledWord = word.split('').sort(() => Math.random() - .5).join('');
    return shuffledWord;
  };

  useEffect(() => {

    createLetterStack();

    setRandomWord1(shuffleWord(tenWordList[Math.floor(Math.random() * tenWordList.length)]));
    setRandomWord2(shuffleWord(tenWordList[Math.floor(Math.random() * tenWordList.length)]));

    console.log(randomWord1);
    console.log(randomWord2);

    //ADD MORE WORDS LATER!

  }, []);

  const handleLetterClick = (letter) => {
    if(pressedLetters.length < 10){
    setPressedLetters((prevLetters) => prevLetters + letter);
    }
    else{
      alert("You can only type 10 letters");
    }
  };
  
  //searches for word played from index
  const wordSearch = () => {

    //let wordList = listOfWords();

    if (wordList.includes(pressedLetters)) {

      alert('Match found!');

      setSubmitList((prevSubmitList) => [...prevSubmitList, pressedLetters]);

      setRandomWord1(shuffleWord(tenWordList[Math.floor(Math.random() * tenWordList.length)]));

      setRandomWord2(randomWord1);


    } else {

      alert('No match found.');

    }

    setPressedLetters('');

  };

  const generateLetterTiles = (word, onClick) => {

    const letters = word.split('');

    return (

      <div className="button-row">

        {letters.map((letter, index) => (

          <button key={index} className="letter-button" onClick={() => onClick(letter)}>

            {letter}

          </button>

        ))}

      </div>

    );

  };

  return (
    <div className="App">
      <header className="App-header">
      <div class="scoreboard">
        <label>Your Score is: </label>
        <label id="lcScore">0</label>
        <span id="data"></span>
      </div>
        <div id="first-row" className="letter-row">
          {generateLetterTiles(randomWord1, handleLetterClick)}
        </div>
        <div id="second-row" className="letter-row">
          {generateLetterTiles(randomWord2, handleLetterClick)}
        </div>
        <div className="Submit-key">
          <button onClick={wordSearch}>SUBMIT</button>
        </div>
        <div className="pressed-letters">{pressedLetters}</div>
        <div className="submit-list">
          <h2>Submitted Words</h2>
          <ul>
            {submitList.map((word, index) => (
              <li key={index}>{word}</li>
            ))}
          </ul>
        </div>
      </header>
    </div>
  );
};

export default App;