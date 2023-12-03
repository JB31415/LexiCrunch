//Import React, and the CSS files
import React, { useState, useEffect } from 'react';
import './App.css';
import './style.css';


//useSound is the library that plays sounds 
import useSound from 'use-sound';

//soundEffect is a popping sound used for button clicks
import soundEffect from "./pop-sound.wav";

//A list of 10 letter words, used to fill in rows. This guarentees that every row has at least one possible word to submit
import {tenWordList} from './tenWordList';

//List with all words in our chosen dictionary. 
import {dictList} from './dictList';





export default function GameLexiCrunch() {

    /*First parameter is object we want to watch, second parameter is the 
  function used to update the state. This is defined by react, not us, what we pass becomes the value 
  useState is just the default state.
  
  Parameter passed to the useState method also determines type of the value???
  useState is a react hook, specificially a state hook, updates and reacts when data or properties change
  */
  


  //START REACT HOOKS

  //row1 and 2 are the two rows of letters which you click to build words
  const [row1, setRow1] = useState('');
  const [row2, setRow2] = useState('');
  
  //pressedLetters are the buttons which appear when clicking the rows.
  const [pressedLetters, setPressedLetters] = useState('');
  
  //submitList is the list of submitted words at the bottom of the page
  const [submitList, setSubmitList] = useState([]);
  
  //score usestate, self-explanatory. 
  const [score, setScore] = useState(0);
  
  //This hook determines whether or not the game elements should be visible. 
  const [game, setGame] = useState(true);
  
  //plays sound effect
  const[playSound] = useSound(soundEffect, {
    interupter: true
  })
  
  //React hook for our timer function
  const [timeLeft, setTimeLeft] = useState(60);

  //END REACT HOOKS

   //ends the game
  const EndGame = () => {
    setGame(false);
  };
  
  
  
  //Timer Logic
  useEffect(() => {
    
    //setInterval takes two parameters, a function and a integer. setInterval calls the passed function every integer amount of miliseconds. 
    //For us, it counts down the timer and checks if it has time left every second. 
    const timerId = setInterval(() => {

      //Count down timer
      setTimeLeft((prevTime) => prevTime - 1);
  
      //If no more time, clear timer and end game
      if (timeLeft <= 0) {
        clearInterval(timerId);
        EndGame();
      }
    }, 1000);
  
    // Cleanup the interval on component unmount
    return () => clearInterval(timerId);
  }, [timeLeft]); // Include timeLeft as a dependency to avoid potential issues
  
  
  //shuffleWord randomizes the letters in a word. 
  const shuffleWord = (word) => {
    const shuffledWord = word.split('').sort(() => Math.random() - .5).join('');
    return shuffledWord;
  };
  

  useEffect(() => {
  
    //Fills in value of row with setRow() : Gets random word from tenWordList.js, shuffles it around, and updates the state. 
    setRow1(shuffleWord(tenWordList[Math.floor(Math.random() * tenWordList.length)]));
    setRow2(shuffleWord(tenWordList[Math.floor(Math.random() * tenWordList.length)]));
  
    //ADD MORE WORDS LATER!
  
  }, []);
  
  
  
  
  /*  handleLetterClick handles the user clicking on the row of letters to form a word
      
      Parameters: letter is the individual letter, word is all the letters as a whole, index is the index where the letter is stored. 
  */
  const handleLetterClick = (letter, word, index) => {
  
  
    //if pressedletters < 10...
    if (pressedLetters.length < 10){

      //add the letter clicked to PressedLetters
      setPressedLetters((prevLetters) => prevLetters + letter);

      //remove letter clicked from row2
      setRow2(word.substring(0, index) + word.substring(index + 1) );
      //Play pop sound effect
      playSound();
  
      }

      //If you already have 10 letters, do nothing. 
      else{
  
      }
    }
  
    //This is the onClick function for the pressedLetters. It will remove the button and return it to the 
    //row above when clicked. Word is the entire submit list and index is the index of the clicked button 
    const handleDeleteClick = (letter, word, index) => {
      
      //When buttonClicked, return the button to the row above.
      setRow2((prevLetters) => prevLetters + letter);

      //Remove the button from the pressedLetters. 
      setPressedLetters(word.substring(0, index) + word.substring(index + 1));

      //Play sound effect
      playSound();
  
    }
  
  //used for wordSearch so that users cannot submit the exact same guess in succession
  let onCooldown = false;
  
  //searches for word played from index
  const wordSearch = async () => {
  
  //If still in cooldown, do nothing
  if (onCooldown) {
    return;
  }
  
  //Set cooldown to true
  onCooldown = true;
  
  //Set a 1000 ms timer to reset the cooldown. User cannot call submit again in this time
  setTimeout(() => {
    onCooldown = false;
  }, 1000);
  
    //If submitted word is in the dictionary...
    if (dictList.includes(pressedLetters.toLowerCase())) {
  
      // Call fetchDatamuse for score
      await fetchDatamuse(pressedLetters); 
  
      //Updates the submitted list with the new word
      setSubmitList((prevSubmitList) => [...prevSubmitList, pressedLetters]);
  
      //Top row gets a new 10 letter word. 
      setRow1(shuffleWord(tenWordList[Math.floor(Math.random() * tenWordList.length)]));
  
       //Top row is moved to the bottom row.
      setRow2(row1);
  
    } 
  
    //If word not found
    else {
  
      //return letters to top row
      setRow2((prevLetters) => (prevLetters + pressedLetters.toLowerCase()));
  
    }
  
    //Clear the pressedLetters regardless
    setPressedLetters('');
  
  };
  
  //Regular expression used to extract data from DataMuse API
  function wordsinstring(string) {
  
    //Regular Expression
    const regex = /\bword\b/g;

    //Matches is the number of values regular expression found 
    const matches = string.match(regex);
  
    //If no matches, just set to 1, minimum num of matches to avoid divide by 0 error
    let count = matches ? matches.length : 1;
  
    //Max matches is 1000
    if (count > 1000) {
      count = 1000;
    }
  
    return count;
  
  }
  
  //Computes the average score of a datamuse search
  //NOTE: currently only used for computing single score for spellalike words.
  function datamuseScore(string) {
  
    //counts the number of scores for a word
    const regex = /"score":(\d+)/g;
  
    //Find every match for regular expression
    const matches = string.match(regex);
  
    let totalScore = 0;
  
    //If there were matches...
    if (matches) {
  
      //For each match...
      matches.forEach((match) => {
  
        //Get the score, and add it to the total score
        const score = parseInt(match.split(":")[1]);
        totalScore += score;
  
      });
  
    }
  
    //If there are matches, calculate average score, else set to 1. 
    const averageScore = matches ? totalScore / matches.length : 1;
  
    //console.log(string + ' matches ' + matches + ' totalScore ' + totalScore + ' average score: ' + averageScore);
  
    return averageScore;
  
  }
  
  //fetchDataMuse calculates the LexiScore and updates the scoreState with it
  const fetchDatamuse = async (word) => {
  
    try {
      
      //console.log('related words: ');
  
      //Get related words...
      let relatedresponse = await fetch(`https://api.datamuse.com/words?rel_trg=${word}&max=1000`);
      let relateddata = await relatedresponse.json();
      let relatedstring = JSON.stringify(relateddata);
      let numRelatedWords = wordsinstring(relatedstring);
  
      //console.log('spellalikes: ');
  
      //Get words spelled similarly
      let spelledresponse = await fetch(`https://api.datamuse.com/words?sp=${word}&max=1`);
      let spelleddata = await spelledresponse.json();
      let spelledstring = JSON.stringify(spelleddata);
      let numSpelledSimilar = datamuseScore(spelledstring);
  
      //console.log('soundalikes: ');
  
      //Get words that sound alike. 
      let soundresponse = await fetch(`https://api.datamuse.com/words?sl=${word}&max=1000`);
      let sounddata = await soundresponse.json();
      let soundstring = JSON.stringify(sounddata);
      let numSoundalikes = wordsinstring(soundstring);
  
      //Get frequency score of word
      const fscoreresponse = await fetch(`https://api.datamuse.com/words?sp=${word}&md=f&max=1`);
      const fscoredata = await fscoreresponse.json();
  
      //Extract JSON file
      let fscore = JSON.stringify(fscoredata);

      //Get first index 
      let fstart = fscore.indexOf('f:');

      //create a string to store score
      let fscorestring = '';
  
      //From fstart index to end, add the score character to fscorestring. 
      //Essentially, you're just copying the score string from DataMuse.  
      for (let i = fstart + 2; i < fscore.length; i++) {
        if (fscore[i] === '"') {
          break; // Break the loop when a closing quote is encountered
      }
      
      //Add character to string
      fscorestring += fscore[i];


    }
  
      //console.log(`fscorestring: ${fscorestring}`);
  
      //Calculate the inverse of individual metrics, times by 1000, and take ceiling to get LexiScore.  
      let lexiscore = Math.ceil(
  
        ((1 / parseFloat(numSpelledSimilar)) + (1 / parseFloat(numRelatedWords)) + (1 / parseFloat(numSoundalikes)) + (1 / parseFloat(fscorestring))) * 1000
  
      );
  
      //console.log('lexiscore: ' + lexiscore);
  
      //users receive 0 points if same word is used in same round
      if (submitList.includes(pressedLetters.toLowerCase())) {
  
        lexiscore = 0;
  
      }
      
      //Update score state with LexiScore
      updateScore(lexiscore);
  
    } catch (error) {
      console.error('Error fetching data from Datamuse API', error);
    }
  
  };
  
  // updates the score after each valid word.
  const updateScore = (newScore) =>
  {
    setScore(prevScore => prevScore + newScore);
  };  
  
  //GenerateLetterTiles fills in the rows with letters and adds the function you want to be onClick
  const generateLetterTiles = (word, onClickFunction) => {
  
    //console.log(word);
    const letters = word.split('');
  
    return (
  
      <div className="button-row">
        {letters.map((letter, index) => (

          <button  className="letter-button" onClick={() => onClickFunction(letter, word, index)}>
            {letter}
          </button>
        ))}
      </div>
  
    );
        };
  
  //Return GameLexiCrunch, basically returns all the html to make LexiCrunch. 
  return(
    <div className = "App">
    <header className="App-header">
      <div class="gameElements">
      {game && <button className="end-session-button" onClick={EndGame}>End Session</button>} 
      {!game && <p>Game Over! Thanks for playing!</p>}
      <div class="scoreboard">
        <label>Your Score is: </label>
        <label id="lcScore">{score}</label>
        <span id="data"></span>
      </div>
      {game && <div>{timeLeft}</div>}
      {game &&
        <div id="first-row" className="letter-row">
          {generateLetterTiles(row1, handleLetterClick)}
        </div>
      }
      {game &&
        <div id="second-row" className="letter-row">
          {generateLetterTiles(row2, handleLetterClick)}
        </div>
      }
      {game &&
        <div className="Interface-keys">
      <button
        className={`submit-button ${pressedLetters.length < 3 ? 'tooShort' : ''}`}
        onClick={pressedLetters.length >= 3 ? wordSearch : null}
      >
        SUBMIT</button>
        </div>
      }
      {game &&
        <div className="pressed-letters">{generateLetterTiles(pressedLetters, handleDeleteClick)}</div>
      }
        <br></br>
        <br></br>
        <div className="submit-list">
          <h2>Submitted Words</h2>
          <autoAnimate style={{ display: 'flex', flexDirection: 'column-reverse' }}>
          <ul>
            {submitList.map((word, index) => (
              <li key={index}>{word}</li>
            ))}
          </ul>
          </autoAnimate>
        </div>
        </div>
        </header>
        </div>
        
      
  );
  
  }