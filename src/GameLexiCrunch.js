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
  
  //RandomWord1 and 2 are the two rows of letters which you click build words
  const [randomWord1, setRandomWord1] = useState('');
  const [randomWord2, setRandomWord2] = useState('');
  
  //pressedLetters are the buttons which appear when clicking the randomWord row.
  const [pressedLetters, setPressedLetters] = useState('');
  
  //submitList is the list of submitted words at the bottom of the page
  const [submitList, setSubmitList] = useState([]);
  
  //score usestate, self-explanatory. 
  const [score, setScore] = useState(0);
  
  const [game, setGame] = useState(true);
  
  //plays sound effect
  const[playSound] = useSound(soundEffect, {
    interupter: true
  })
  
   //ends the game
  const EndGame = () => {
    setGame(false);
  };
  
  const [timeLeft, setTimeLeft] = useState(60);
  
  //Timer Logic
  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
  
      if (timeLeft <= 0) {
        clearInterval(timerId);
        EndGame();
      }
    }, 1000);
  
    // Cleanup the interval on component unmount
    return () => clearInterval(timerId);
  }, [timeLeft]); // Include timeLeft as a dependency to avoid potential issues
  
  
  //RANDOMIZE MORE!
  const shuffleWord = (word) => {
    const shuffledWord = word.split('').sort(() => Math.random() - .5).join('');
    return shuffledWord;
  };
  
  useEffect(() => {
  
    //createLetterStack();
  
    //Defines setRandomWord() : Gets random word from tenWordList.js, shuffles it around, and updates the state. 
    setRandomWord1(shuffleWord(tenWordList[Math.floor(Math.random() * tenWordList.length)]));
    setRandomWord2(shuffleWord(tenWordList[Math.floor(Math.random() * tenWordList.length)]));
  
    //ADD MORE WORDS LATER!
  
  }, []);
  
  
  
  
  /*This function is passed a value, it then calls setPressedLetters which is a setState function.
  This is the onClick function used in the html. Joseph, 
  */
  const handleLetterClick = (letter, word, index) => {
  
    //Parameters are passed correctly
    console.log(letter + ' ' + index);
  
    //if pressedletters < 10, add the letter clicked
    if (pressedLetters.length < 10){
      setPressedLetters((prevLetters) => prevLetters + letter);
  
      //setRandomWord1((rowLetters) => rowLetters.substring[0, index] + rowLetters.substring[index + 1]);
  
      setRandomWord2(word.substring(0, index) + word.substring(index + 1) );
      playSound();
  
      }
      else{
  
      }
    }
  
    //This is the onClick function for the submit list. It will remove the button and return it to the 
    //row above when clicked. Word is the entire submit list and index is the index of the clicked button 
    const handleDeleteClick = (letter, word, index) => {
      
      //When buttonClicked, return the button to the row above.
      setRandomWord2((prevLetters) => prevLetters + letter);
      //Remove the button from the pressedLetters. 
      setPressedLetters(word.substring(0, index) + word.substring(index + 1));
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
  
      // Call fetchDatamuse for obscurity score
      await fetchDatamuse(pressedLetters); 
  
      //Updates the submitted list with the new word
      setSubmitList((prevSubmitList) => [...prevSubmitList, pressedLetters]);
  
      //Top row gets a new 10 letter word. 
      setRandomWord1(shuffleWord(tenWordList[Math.floor(Math.random() * tenWordList.length)]));
  
       //Top row is moved to the bottom row.
      setRandomWord2(randomWord1);
  
    } 
  
    //If word not found
    else {
  
      //return letters to top row
      setRandomWord2((prevLetters) => (prevLetters + pressedLetters.toLowerCase()));
  
    }
  
    //Clear the pressedLetters. 
    setPressedLetters('');
  
  };
  
  function wordsinstring(string) {
  
    const regex = /\bword\b/g;
    const matches = string.match(regex);
  
    const count = matches ? matches.length : 1;
  
    if (count > 1000) {
      count = 1000;
    }
  
    console.log({count});
  
    return count;
  
  }
  
  //computes the average score of a datamuse search
  //NOTE: currently only used for computing single score for spellalike words.
  function datamuseScore(string) {
  
    //counts the number of scores for a word
    const regex = /"score":(\d+)/g;
  
    const matches = string.match(regex);
  
    let totalScore = 0;
  
    if (matches) {
  
      matches.forEach((match) => {
  
        const score = parseInt(match.split(":")[1]);
        totalScore += score;
  
      });
  
    }
  
    const averageScore = matches ? totalScore / matches.length : 1;
  
    console.log(string + ' matches ' + matches + ' totalScore ' + totalScore + ' average score: ' + averageScore);
  
    return averageScore;
  
  }
  
  const fetchDatamuse = async (word) => {
  
    try {
      
      console.log('related words: ');
  
      let relatedresponse = await fetch(`https://api.datamuse.com/words?rel_trg=${word}&max=1000`);
      let relateddata = await relatedresponse.json();
      let relatedstring = JSON.stringify(relateddata);
      let numRelatedWords = wordsinstring(relatedstring);
  
      console.log('spellalikes: ');
  
      let spelledresponse = await fetch(`https://api.datamuse.com/words?sp=${word}&max=1`);
      let spelleddata = await spelledresponse.json();
      let spelledstring = JSON.stringify(spelleddata);
      let numSpelledSimilar = datamuseScore(spelledstring);
  
      console.log('soundalikes: ');
  
      let soundresponse = await fetch(`https://api.datamuse.com/words?sl=${word}&max=1000`);
      let sounddata = await soundresponse.json();
      let soundstring = JSON.stringify(sounddata);
      let numSoundalikes = wordsinstring(soundstring);
  
      const fscoreresponse = await fetch(`https://api.datamuse.com/words?sp=${word}&md=f&max=1`);
      const fscoredata = await fscoreresponse.json();
  
      let fscore = JSON.stringify(fscoredata);
  
      let fstart = fscore.indexOf('f:');
  
      let fscorestring = '';
  
      for (let i = fstart + 2; i < fscore.length; i++) {
        if (fscore[i] === '"') {
          break; // Break the loop when a closing quote is encountered
      }
  
      fscorestring += fscore[i];
      
    }
  
      console.log(`fscorestring: ${fscorestring}`);
  
      let lexiscore = Math.ceil(
  
        ((1 / parseFloat(numSpelledSimilar)) + (1 / parseFloat(numRelatedWords)) + (1 / parseFloat(numSoundalikes)) + (1 / parseFloat(fscorestring))) * 1000
  
      );
  
      console.log('lexiscore: ' + lexiscore);
  
      //users receive 0 points if same word is used in same round
      if (submitList.includes(pressedLetters.toLowerCase())) {
  
        lexiscore = 0;
  
      }
  
      updateScore(lexiscore);
  
    } catch (error) {
      console.error('Error fetching data from Datamuse API', error);
    }
  
  };
  
  // updates the score after each valid word.
  const updateScore = (newScore) =>
  {
  
      //Why are updateScore and setScore two different functions? 
  
      // replace score function with Collen's
          //score += newScore; 
          //score += newScore;
          setScore(prevScore => prevScore + newScore);
  
          //console.log(score + "+");
  
  };  
  
  //parameters are a word representing the row and the onClickFunction that gets called by onClick
  const generateLetterTiles = (word, onClickFunction) => {
  
    //console.log(word);
    const letters = word.split('');
  
    return (
  
      <div className="button-row">
  
        {letters.map((letter, index) => (
  
  
          /*
          <button id = {"buttonNum" + index}  key={index} className="letter-button" onClick={() => onClick(letter, index)}>
  
            {letter}
  
          </button>
  */        
  
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
          {generateLetterTiles(randomWord1, handleLetterClick)}
        </div>
      }
      {game &&
        <div id="second-row" className="letter-row">
          {generateLetterTiles(randomWord2, handleLetterClick)}
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