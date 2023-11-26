import React, { useState, useEffect, useRef, useCallback} from 'react';
import './App.css';
import './tile_style.css';
import soundEffect from "./pop-sound.wav";
// Be sure to install use-sound by typing "npm install use-sound" in the command prompt
import useSound from 'use-sound';
//background music
import music from './Chinese.wav';
//This allows us to render html elements in functions using render();
import reactDOM from 'react-dom';

import { useAutoAnimate } from '@formkit/auto-animate/react'

import { AnimatePresence, motion, useAnimation } from 'framer-motion';

//Still used to check for word, replace with dictionary and it should work. 
//import { wordList } from './wordList';

//VERY HANDY MECHANIC FOR ANIMATION, BUT NOT USED YET!
//import { motion } from "framer-motion";

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

//Get root element
const container = document.getElementById("playArea");

//Use reactDOM to create a root, this allows us to render elements at the root. 
const root = reactDOM.createRoot(container);



//tearDown function hides the lexiCrunch elements and will eventually return new html elements using .render()
const tearDown = () => {
  
  //Get root element
  const container = document.getElementById("playArea");

  //Use reactDOM to create a root, this allows us to render elements at the root. 
  const root = reactDOM.createRoot(container);


  //Application is an HTMLcollection of elements with the className "gameElements", so just the div.    
  const application = document.getElementsByClassName("gameElements");

  //Just like an array, you have to use item(subscript) to access the elements. Then change set attribute of hidden to true;
  application.item(0).setAttribute("hidden", "true");
  
  /*I'd like to pitch an idea: 

      What if we have the HTML inside of the "Game" portion just be outputted through render()? That way, we can just render the end screen
      and have it automatically replace all the elements. This would also be better than just hiding the elements. Plus, we can restart the game
      by simply rendering it again which I don't think we can do currently. 

      The HTML in the return function will be what will always be on screen, titles, colors, etc etc. The html in render() will be the game.  

  */


  //Get root element
  //const container = document.getElementById("root");

  //Use reactDOM to create a root, this allows us to render elements at the root. 
  //const root = reactDOM.createRoot(container);


  //When a second render is called, the first render is removed. This should be good for updating
  root.render(<h1>Testing </h1>);


  //Replace the html below with the end screen. 
  root.render(<h2>second</h2>);    

  


}

//Start game finds the div with id = playArea, and renders the GameLexicrunch component into it. 
const startGame = () => {

  /*  IMPORTANT INFORMATION ON RENDERING

  <GameLexiCrunch> is a react component containing all the logic of the game, that way we can create and destroy with 
  the render() method. 
  
  When we render something, we replace all internal elements with the new component. This means rendering a <StartScreen> 
  component using the same root will replace <GameLexiCrunch> 
  
 

  My advice would be to make a StartScreen component and an EndScreen component, possibly in different files, 
  and then render them as needed. 

   NOTE: all components must start with a capital letter. Also, the .getElementById() is referencing ./public/index.html
   I don't believe it can reference React components. 

  */




  //Get root element
  const container = document.getElementById("playArea");

  //Use reactDOM to create a root, this allows us to render elements at the container. 
  const root = reactDOM.createRoot(container);


  
  //Render component in element specified by container
  root.render(<GameLexiCrunch></GameLexiCrunch>);

}

//GameLexiCrunch is the component of the game itself. It should be able to be placed anywhere and have a fully functioning LexiCrunch
const GameLexiCrunch = () => {

  const [game, setGame] = useState(true);

  const [letterBlocks, setLetterBlocks] = useState([]);
  //const [cellStates, setCellStates] = useState([]);

  const [pressedLetters, setPressedLetters] = useState('');
  const [pressedBlocks, setPressedBlocks] = useState([]);
  const [submitList, setSubmitList] = useState([]);
  const [score, setScore] = useState(0);
  const TILE_SIZE = 50;

  const [animationControls, setAnimationControls] = useState({});

  


    //plays sound effect
    const[playSound] = useSound(soundEffect, {
      interupter: true
    })

  //ends the game
  const EndGame = () => {
    setGame(false);
  };

  useEffect(() => {

    const initialBlocks = Array.from({ length: 10 }, (_, i) =>
      Array.from({ length: 10 }, (_, j) => ({
        key: `${i}-${j}`,
        rowIndex: i,
        columnIndex: j,
        letter: letterPicker().toUpperCase(),
        unsubmitted: true,
      }))
    );

    setLetterBlocks(initialBlocks);
  }, []);

  function letterPicker() {

    let randomWord = tenWordList[Math.floor(Math.random() * tenWordList.length)];
    return randomWord[Math.floor(Math.random() * randomWord.length)];

  }

  const backspace = () => {

    if (pressedLetters.length > 0) {
      // Remove the last letter pressed
      setPressedLetters((prevLetters) => prevLetters.slice(0, -1));

      // Remove the last block pressed
      setPressedBlocks((prevPressedBlocks) => prevPressedBlocks.slice(0, -1));
    }
    

  }
  
  const handleClick = (rowIndex, columnIndex, letter) => {

    playSound();
  
    // Check if the letter has already been pressed
    const sameBlock = pressedBlocks.some(
      (block) => block.rowIndex === rowIndex && block.columnIndex === columnIndex
    );
  
    if (!sameBlock) {
      if (pressedLetters.length < 101) {
        setPressedLetters((prevLetters) => prevLetters + letter);
        setPressedBlocks((prevPressedBlocks) => [...prevPressedBlocks, { rowIndex, columnIndex, letter }]);
      } else {
        alert('You cannot add more than 10 letters');
      }
    } else {
      //alert('You cannot use the same letter block twice!');
    }
  };



  const LetterTile = React.memo(({ rowIndex, columnIndex, unsubmitted, onClick }) => {
    const [generatedLetter] = letterBlocks[rowIndex][columnIndex].letter;
  
    const handleClickMemoized = useCallback(() => {
      onClick(rowIndex, columnIndex, generatedLetter);
    }, [rowIndex, columnIndex, generatedLetter, onClick]);
  
    return (
      unsubmitted && (
        <button className="letterTile" onClick={handleClickMemoized}>
          {generatedLetter}
        </button>
      )
    );
  });

  // searches for word played from index
  const wordSearch = async () => {

    

    if (dictList.includes(pressedLetters.toLowerCase())) {

      

    pressedBlocks.forEach((block) => {
          
      setLetterBlocks((prevLetterBlocks) => {

        const newLetterBlocks = [...prevLetterBlocks];
      
        newLetterBlocks[block.rowIndex][block.columnIndex].unsubmitted = false;
    
        return newLetterBlocks;
        
      });

    });

    
    
    

    if (dictList.includes(pressedLetters.toLowerCase())) {

      await fetchDatamuse(pressedLetters);

      setSubmitList((prevSubmitList) => [...prevSubmitList, pressedLetters]);

    } else {
      // alert('No match found.');
    }
    //setPressedLetters('');

  }
  else {
    
  }

  setPressedLetters('');
  setPressedBlocks([]);

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

      updateScore(lexiscore);
    } catch (error) {
      console.error('Error fetching data from Datamuse API', error);
    }

  };

  const updateScore = (newScore) => {
    setScore((prevScore) => prevScore + newScore);
  };

  return (

    <div className="App">
      <div class="scoreboard">
        <label>Your Score is: </label>
        <label id="lcScore">{score}</label>
        <span id="data"></span>
      </div>
        {game && <button onClick={backspace}>Undo</button>}
        {game && <button onClick={wordSearch}>SUBMIT</button>}
        {!game && <p>Game Over! Thanks for playing!</p>}
        {game && <button onClick={EndGame}>End Session</button>} 

{game &&
        <ul style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <autoAnimate intial={false}>
        <AnimatePresence intial={false} >
        <ul style={{ display: 'flex', flexDirection: 'row' }}>
          {letterBlocks.map((column, columnIndex) => (
            <autoAnimate style={{ display: 'flex', flexDirection: 'column-reverse' }}>
            <motion.li key={column} layout style={{ display: 'flex', flexDirection: 'column-reverse' }}>
              
              {column.map((block) => (
               <autoAnimate initial={false} layout style={{ display: 'flex', flexDirection: 'column', borderRadius: 20 }}>
                <LetterTile
                  key={block.key}
                  rowIndex={block.rowIndex}
                  columnIndex={block.columnIndex}
                  letter={block.letter}
                  unsubmitted={block.unsubmitted}
                  onClick={() => {
                    handleClick(block.rowIndex, block.columnIndex, block.letter);
                  }}
                />
                </autoAnimate>
              ))}
            </motion.li>
            </autoAnimate>
          ))}
        </ul>
        </AnimatePresence>
        </autoAnimate>
        </ul>

      }

      {game &&
      <div className="submit-list">
      <h1>{pressedLetters}</h1>

          <h2>Submitted Words</h2>
          <ul>
            {submitList.map((word, index) => (
              <li key={index}>{word}</li>
            ))}
          </ul>
        </div>
      }
    </div>
  );
};

//App is the main application without the LexiCrunch play area. It'll be a base for other components. The CSS is not working correctly but that should be an easy fix. 
const App = () => {

  const[isMusicPlaying, setIsMusicPlaying] = useState(false);

  //Plays the background music 
  useEffect(() => {
    // Create an audio element
    const backgroundMusic = new Audio(music);

    // Set the audio to loop
    backgroundMusic.loop = true;

    backgroundMusic.volume = 0.35;

    backgroundMusic.interupter = true;

    if (isMusicPlaying) {
      backgroundMusic.play();
    } else {
      backgroundMusic.pause();
    }

    // Clean up the audio element when the component is unmounted
    return () => {
      backgroundMusic.pause();
      backgroundMusic.src = '';
    };
  }, [isMusicPlaying]);

  const toggleMusic = () => {
    if(!isMusicPlaying){
      setIsMusicPlaying(true);
    }
    else{
      setIsMusicPlaying(false);
    }
  }
  return (
    <div className="App">
          <div id = "testArea"></div>
          <button onClick = {() => {startGame(); setIsMusicPlaying(true)}}>StartGame</button>
          <button onClick = {() => {tearDown(); setIsMusicPlaying(false)}}>TearDown Button</button>
          <button onClick = {toggleMusic}>Music on/off</button>
    </div>
  );

};
export default App;