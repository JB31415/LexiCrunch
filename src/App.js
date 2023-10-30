import React, { useState, useEffect } from 'react';
import './App.css';
import './tile_style.css';

//Still used to check for word, replace with dictionary and it should work. 
import { wordList } from './wordList';

//Bigger list by Stephen, 
import {tenWordList} from './tenWordList';

//List with all words in dictionaries
import {dictList} from './dictList';

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


  /*First parameter is object we want to watch, second parameter is the 
  function used to update the state. This is defined by react, not us, what we pass becomes the value 
  useState is just the default state.
  
  Parameter passed to the useState method also determines type of the value???
  useState is a react hook, specificially a state hook, updates and reacts when data or properties change
  */
 
  //Since function is the same, can't we just have them call the same function?   
  const [randomWord1, setRandomWord1] = useState('');
  const [randomWord2, setRandomWord2] = useState('');

  //setPressedLetters function is used in handleLetterClick
  const [pressedLetters, setPressedLetters] = useState('');

  const [submitList, setSubmitList] = useState([]);

  //RANDOMIZE MORE!
  const shuffleWord = (word) => {
    const shuffledWord = word.split('').sort(() => Math.random() - .5).join('');
    return shuffledWord;
  };

  useEffect(() => {

    createLetterStack();

    //Defines setRandomWord() : Gets random word from tenWordList.js, shuffles it around, and updates the state. 
    setRandomWord1(shuffleWord(tenWordList[Math.floor(Math.random() * tenWordList.length)]));
    setRandomWord2(shuffleWord(tenWordList[Math.floor(Math.random() * tenWordList.length)]));

    console.log(randomWord1);
    console.log(randomWord2);

    //ADD MORE WORDS LATER!

  }, []);


  /*This function is passed a value, it then calls setPressedLetters which is a setState function.
  This is the onClick function used in the html. Joseph, 
  */
  const handleLetterClick = (letter) => {

    //pressedLetters setState function. What we pass and store in prevLetters is prevLetters + letter
    setPressedLetters((prevLetters) => prevLetters + letter);
    }

    //This is a lambda expression, you don't have an if statement and thus cannot have an else. You'll need to figure out a new way to do this. 
    /*
    else{
      alert("You can only type 10 letters");
    }
    */
  };
  
  //searches for word played from index
  const wordSearch = () => {

    //Searches the dictionary to find words. 
    if (dictList.includes(pressedLetters.toLowerCase())) {

      alert('Match found!');

      //Updates the submitted list with the new word
      setSubmitList((prevSubmitList) => [...prevSubmitList, pressedLetters]);

      //Conflict with merging, I don't know why they've been reversed. Will confirm with Stephen. 
      /*
      setRandomWord1(shuffleWord(tenWordList[Math.floor(Math.random() * tenWordList.length)]));

      setRandomWord2(randomWord1);
      */

      //Top row is moved to the bottom row
      setRandomWord1(randomWord1.substring(pressedLetters.length));

      //Top row gets a new 10 letter word. 
      setRandomWord2(shuffleWord(tenWordList[Math.floor(Math.random() * tenWordList.length)]));

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