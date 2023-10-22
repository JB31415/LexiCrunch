import React, { useState, useEffect } from 'react';
import './App.css';
import './tile_style.css';

//REPLACE WITH BIGGER WORD LIST LATER
import { wordList } from './wordList';


//NOT FULLY FUNCTIONING YET!
const createLetterStack = () => {

  //Creates a div to store buttons in question
  const buttonContainer = document.createElement('div');
  //Makes new elements part of class 'button-container'
  buttonContainer.classList.add('button-container');

  //Max num of rows? 
  const rows = 5;

  //For each row...
  for (let i = 0; i < rows; i++) {

    //Do we need to make new buttonRow const every run? Just move it under the const rows? 
    
    //Create a new button row element
    const buttonRow = document.createElement('div');

    //Makes new elemnts part of class 'button-row'
    buttonRow.classList.add('button-row');
    
    //Adds a buttonRow to the html document????
    buttonContainer.appendChild(buttonRow);

  }

  //Adds the buttonContainer to the body
  document.body.appendChild(buttonContainer);
  
};


//The app in question, the main function???
const App = () => {


  /*First parameter is object we want to watch, second parameter is the 
  function used to update the state. useState is just the default state? 
  
  Parameter passed to the useState method also determines type of the value???
  useState is a react hook, specificially a state hook, updates and reacts when data or properties change
  */
 
  //Since function is the same, can't we just have them call the same function?
  const [randomWord1, setRandomWord1] = useState('');
  const [randomWord2, setRandomWord2] = useState('');

  const [pressedLetters, setPressedLetters] = useState('');
  const [submitList, setSubmitList] = useState([]);


  //RANDOMIZE MORE!
  //Shuffles a string
  const shuffleWord = (word) => {
    const shuffledWord = word.split('').sort(() => Math.random() - .5).join('');
    return shuffledWord;
  };


  useEffect(() => {

    //Creates rows of letters in html
    createLetterStack();

    //Defines setRandomWord() : Gets random word from wordList.js, shuffles it around, and updates the state. 
    setRandomWord1(shuffleWord(wordList[Math.floor(Math.random() * wordList.length)]));
    setRandomWord2(shuffleWord(wordList[Math.floor(Math.random() * wordList.length)]));

    //No idea, Joseph help me! 
    console.log(randomWord1);
    console.log(randomWord2);

    //ADD MORE WORDS LATER!

  }, []);


  //Everything after this is gibberish to me. I'd appreciate some help. 
  const handleLetterClick = (letter) => {
    setPressedLetters((prevLetters) => prevLetters + letter);
  };
  
  //searches for word played from index
  const wordSearch = () => {

    
    if (wordList.includes(pressedLetters.toUpperCase())) {

      alert('Match found!');

      setSubmitList((prevSubmitList) => [...prevSubmitList, pressedLetters]);

      setRandomWord1(randomWord1.substring(pressedLetters.length));

      setRandomWord2(wordList[Math.floor(Math.random() * wordList.length)]);

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
        <div className="letter-row">
          {generateLetterTiles(randomWord1, handleLetterClick)}
        </div>
        <div className="letter-row">
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