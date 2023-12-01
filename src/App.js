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

  const [pressedLetters, setPressedLetters] = useState('');
  const [pressedBlocks, setPressedBlocks] = useState([]);
  const [submitList, setSubmitList] = useState([]);
  const [score, setScore] = useState(0);

  const TILE_SIZE = 50;

  const [animationControls, setAnimationControls] = useState({});

  //the current bottom of each column, which letters can be played
  const bottomZero = useRef(0);
  const bottomOne = useRef(0);
  const bottomTwo = useRef(0);
  const bottomThree = useRef(0);
  const bottomFour = useRef(0);
  const bottomFive = useRef(0);
  const bottomSix = useRef(0);
  const bottomSeven = useRef(0);
  const bottomEight = useRef(0);
  const bottomNine = useRef(0);

    //plays sound effect
    const[playSound] = useSound(soundEffect, {
      interupter: true
    })

  //ends the game
  const EndGame = () => {
    setGame(false);
  };

  //Current timer is 120 seconds
  const [timeLeft, setTimeLeft] = useState(120);

  //User has 120 seconds to play!
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
  }, [timeLeft]);

  //Sets up the initial blocks
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

  //picks out random letters for each row/column
  function letterPicker() {

    let randomWord = tenWordList[Math.floor(Math.random() * tenWordList.length)];
    return randomWord[Math.floor(Math.random() * randomWord.length)];

  }

  //for a backspace button. Not used yet!
  const backspace = () => {

    if (pressedLetters.length > 0) {

      //Remove the last letter pressed
      setPressedLetters((prevLetters) => prevLetters.slice(0, -1));

      //Remove the last block pressed
      setPressedBlocks((prevPressedBlocks) => prevPressedBlocks.slice(0, -1));

    }
    

  }
  
  //handles letter clicking
  const handleClick = (rowIndex, columnIndex, letter) => {
  
    //Check if the letter has already been pressed
    const sameBlock = pressedBlocks.some(
      (block) => block.rowIndex === rowIndex && block.columnIndex === columnIndex
    );
  
    if (!sameBlock) {
      playSound();
      if (pressedLetters.length < 10) {
        setPressedLetters((prevLetters) => prevLetters + letter);
        setPressedBlocks((prevPressedBlocks) => [...prevPressedBlocks, { rowIndex, columnIndex, letter }]);
      } else {
        //alert('You cannot add more than 10 letters');
      }
    } else {
      //alert('You cannot use the same letter block twice!');
    }
  };

  const undo = (rowIndex, columnIndex, letter) => {
    const remainingOccurrences = pressedBlocks.filter(
      (block) => block.letter === letter && (block.rowIndex !== rowIndex || block.columnIndex !== columnIndex)
    );
  
    setLetterBlocks((prevLetterBlocks) => {
      const newLetterBlocks = [...prevLetterBlocks];
      
      // If no remaining occurrences of the pressed letter, update unpressed property
      if (remainingOccurrences.length === 0) {
        newLetterBlocks[rowIndex][columnIndex].unpressed = true;
      }
  
      return newLetterBlocks;
    });
  
    const newPressedBlocks = pressedBlocks.filter(
      (block) => block.rowIndex !== rowIndex || block.columnIndex !== columnIndex || block.letter !== letter
    );
  
    setPressedBlocks(newPressedBlocks);
  
    const remainingLetters = newPressedBlocks.map((block) => block.letter).join('');
    setPressedLetters(remainingLetters);
  };



  const LetterTile = React.memo(({ rowIndex, columnIndex, unsubmitted, onClick, className }) => {
    const [generatedLetter] = letterBlocks[rowIndex][columnIndex].letter;
  
    const handleClickMemoized = useCallback(() => {
      onClick(rowIndex, columnIndex, generatedLetter);
    }, [rowIndex, columnIndex, generatedLetter, onClick]);
  
    return (
      unsubmitted && (
        <button className={className} onClick={handleClickMemoized}>
          {generatedLetter}
        </button>
      )
    );
  });

  // searches for word played from index
  const wordSearch = async () => {

    if (dictList.includes(pressedLetters.toLowerCase())) {

      

    pressedBlocks.forEach((block) => {

      const rowIndex = block.rowIndex;
      
      //increments the current bottom of each column
      if (rowIndex === 0) {
        bottomZero.current += 1;
      } else if (rowIndex === 1) {
        bottomOne.current += 1;
      } else if (rowIndex === 2) {
        bottomTwo.current += 1;
      } else if (rowIndex === 3) {
        bottomThree.current += 1;
      } else if (rowIndex === 4) {
        bottomFour.current += 1;
      } else if (rowIndex === 5) {
        bottomFive.current += 1;
      } else if (rowIndex === 6) {
        bottomSix.current += 1;
      } else if (rowIndex === 7) {
        bottomSeven.current += 1;
      } else if (rowIndex === 8) {
        bottomEight.current += 1;
      } else if (rowIndex === 9) {
        bottomNine.current += 1;
      }

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
      //No match found
    }

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
      <div className="scoreboard" layout style={{ display: 'flex', flexDirection: 'column' }}>
        {game && (
          <button className="end-session-button" style={{ maxWidth: '200px', alignSelf: 'center', marginTop: '25px' }} onClick={EndGame}>
            End Session
          </button>
        )}
        <label id="lcScore" style={{ fontSize: '2rem', color: 'white' }}>
          YOUR SCORE IS {score}
        </label>
        <span id="data"></span>
      </div>
      {!game && <p style={{ fontSize: '3rem', color: 'white' }}>Game Over! Thanks for playing!</p>}
      {game && <div style={{ fontSize: '3rem', color: 'white' }}>{timeLeft}</div>}
  
      {game &&
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '-275px'}}>
        <ul style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <autoAnimate intial={false}>
            <AnimatePresence intial={false}>
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
                              if (
                                (block.rowIndex === 0 && block.columnIndex === bottomZero.current) ||
                                (block.rowIndex === 1 && block.columnIndex === bottomOne.current) ||
                                (block.rowIndex === 2 && block.columnIndex === bottomTwo.current) ||
                                (block.rowIndex === 3 && block.columnIndex === bottomThree.current) ||
                                (block.rowIndex === 4 && block.columnIndex === bottomFour.current) ||
                                (block.rowIndex === 5 && block.columnIndex === bottomFive.current) ||
                                (block.rowIndex === 6 && block.columnIndex === bottomSix.current) ||
                                (block.rowIndex === 7 && block.columnIndex === bottomSeven.current) ||
                                (block.rowIndex === 8 && block.columnIndex === bottomEight.current) ||
                                (block.rowIndex === 9 && block.columnIndex === bottomNine.current)
                              ) {
                                handleClick(block.rowIndex, block.columnIndex, block.letter);
                              }
                            }}
                            className={
                              (block.rowIndex === 0 && block.columnIndex === bottomZero.current) ||
                              (block.rowIndex === 1 && block.columnIndex === bottomOne.current) ||
                              (block.rowIndex === 2 && block.columnIndex === bottomTwo.current) ||
                              (block.rowIndex === 3 && block.columnIndex === bottomThree.current) ||
                              (block.rowIndex === 4 && block.columnIndex === bottomFour.current) ||
                              (block.rowIndex === 5 && block.columnIndex === bottomFive.current) ||
                              (block.rowIndex === 6 && block.columnIndex === bottomSix.current) ||
                              (block.rowIndex === 7 && block.columnIndex === bottomSeven.current) ||
                              (block.rowIndex === 8 && block.columnIndex === bottomEight.current) ||
                              (block.rowIndex === 9 && block.columnIndex === bottomNine.current)
                                ? 'letterTile'
                                : 'upperTile'
                            }
                          />
                        </autoAnimate>
                      ))}
                    </motion.li>
                  </autoAnimate>
                ))}
              </ul>
            </AnimatePresence>
          </autoAnimate>
          <ul style={{ fontSize: '1.5rem', color: 'white', marginTop: '-200px', marginLeft: '100px' }}>Submitted Words:
            {submitList.map((word, index) => (
              <li key={index}>{word}</li>
            ))}
          </ul>
        </ul>
        
      </div>
      }
      {!game &&
                <ul style={{ fontSize: '2.5rem', color: 'white', marginTop: '0' }}>Submitted Words:
                {submitList.map((word, index) => (
                  <div key={index}>{word}</div>
                ))}
              </ul>
      }
      {game && (
        <autoAnimate intial={false}>
          <AnimatePresence intial={false}>
            <motion.div className="submit-list" style={{ display: 'flex', flexDirection: 'column', marginTop: '155px' }}>
              <ul style={{ display: 'flex', flexDirection: 'row', listStyle: 'none', marginRight: '33px', minHeight: '50px' }}>
                {pressedBlocks.map((block, index) => (
                  <div key={index}>
                    <button className="pressedTile" onClick={() => undo(block.rowIndex, block.columnIndex, block.letter)}>
                      {block.letter}
                    </button>
                  </div>
                ))}
              </ul>
              <button className="submit-button" style={{ fontSize: '2.5rem', color: 'white'}} onClick={wordSearch}>
                SUBMIT
              </button>
            </motion.div>
          </AnimatePresence>
        </autoAnimate>
      )}
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
          <button className="start-button" onClick = {() => {startGame(); setIsMusicPlaying(true)}}>StartGame</button>
          <button className="music-button" onClick = {toggleMusic}>Music on/off</button>
    </div>
  );

};
export default App;