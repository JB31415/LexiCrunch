//Import React, and the CSS files
import React, { useState, useEffect } from 'react';
import './App.css';
import './style.css';

//background music
import music from './Chinese.wav';

//reactDom used for rendering the game component in public/index.html
import reactDOM from 'react-dom';

import GameLexiCrunch from './GameLexiCrunch.js';

//This library is used for animation in some branches, not in the basic prototype. 
//import { useAutoAnimate } from '@formkit/auto-animate/react'

//This library is used for animation in some branches, not in the basic prototype. 
//import { motion } from "framer-motion";


//Get the location of ID = "playArea", this is where we want to render our game elements. 
const container = document.getElementById("playArea");

//Use reactDOM to create a root, this allows us to render elements at the root. 
const root = reactDOM.createRoot(container);

//Start game renders the Lexicrunch game, it also contains an explanation on rendering. 
const startGame = async event => {

  /*  
  <GameLexiCrunch> is a react component containing all the logic of the game, that way we can create and destroy it with 
  the render() method. 
  
  When we render something, we replace all internal elements with the new component. This means rendering a <StartScreen> 
  component using the same root will replace <GameLexiCrunch> 
  */

  //Render Lexicrunch using the root defined directly above this function.
  root.render(<GameLexiCrunch></GameLexiCrunch>);
}

//App is the main application without the LexiCrunch play area. 
const App = () => {

  //isMusicPlaying is a boolean set to false as default, controls the 
  const[isMusicPlaying, setIsMusicPlaying] = useState(false);

  //Logic for music
  useEffect(() => {
    // Create an audio element
    const backgroundMusic = new Audio(music);

    // Set the audio settings
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.35;
    backgroundMusic.interupter = true;

    //If true, play else, pause. 
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

  //Return the StartGame and the Music Button. 
  return (
    <div  className="App">
          <div id = "testArea"></div>
          <button className='start-button' onClick = {() => {startGame(); setIsMusicPlaying(true)}}>StartGame</button>
          <button className='music-button' onClick = {toggleMusic}>Music on/off</button>
    </div>
  );

};
export default App;