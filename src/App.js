import React, { useState, useEffect } from 'react';
import './App.css';
import './tile_style.css';

//Still used to check for word, replace with dictionary and it should work. 
import { wordList } from './wordList';

//Bigger list by Stephen, 
import {tenWordList} from './tenWordList';

import {dictList} from './dictList';

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
  //Shuffles a string
  const shuffleWord = (word) => {
    const shuffledWord = word.split('').sort(() => Math.random() - .5).join('');
    return shuffledWord;
  };


  useEffect(() => {

    //Creates rows of letters in html
    createLetterStack();

    //Defines setRandomWord() : Gets random word from tenWordList.js, shuffles it around, and updates the state. 
    setRandomWord1(shuffleWord(tenWordList[Math.floor(Math.random() * tenWordList.length)]));
    setRandomWord2(shuffleWord(tenWordList[Math.floor(Math.random() * tenWordList.length)]));

    //No idea, Joseph help me! 
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
  };
  
  //searches for word played from index
  const wordSearch = () => {

    //Searches the list to find words, not the dictionary. 
    if (dictList.includes(pressedLetters.toLowerCase())) {

      alert('Match found!');

      //Explain the syntax and semantics of this to me Joseph
      setSubmitList((prevSubmitList) => [...prevSubmitList, pressedLetters]);

      //Top row is moved to the bottom row
      setRandomWord1(randomWord1.substring(pressedLetters.length));

      //Top row gets a new 10 letter word. 
      setRandomWord2(shuffleWord(tenWordList[Math.floor(Math.random() * tenWordList.length)]));

    } else {

      alert('No match found.');

    }
    
    //Resets the pressed letters to empty string
    //I don't understand why this works though, setPressedLetters should 
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