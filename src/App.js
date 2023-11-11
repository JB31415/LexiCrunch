import React, { useState, useEffect } from 'react';
import './App.css';
import './tile_style.css';

//This allows us to render html elements in functions using render();
import reactDOM from 'react-dom';

//Still used to check for word, replace with dictionary and it should work. 
//import { wordList } from './wordList';

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

  const [score, setScore] = useState(0);

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

      }
      else{
        alert("You cannot add more than 10 letters");
      }
    }
  
    //deletes the previous letter.
    const handleBackspace = () => {

      setPressedLetters((prevLetters) => (
        prevLetters.substring(0, (prevLetters.length - 1))

        //I'm not sure if a void function will destroy this but why not
        //setRandomWord2((previousRow) => (previousRow + prevLetters.substring(prevLetters.length - 2)));
      )
        );


    };
  
  //searches for word played from index
  const wordSearch = async () => {

    //Searches the dictionary to find words. 
    if (dictList.includes(pressedLetters.toLowerCase())) {

      alert('Match found!');

      await fetchDatamuse(pressedLetters); // Call fetchDatamuse for obscurity score

      //Updates the submitted list with the new word
      setSubmitList((prevSubmitList) => [...prevSubmitList, pressedLetters]);

      //Top row gets a new 10 letter word. 
      setRandomWord1(shuffleWord(tenWordList[Math.floor(Math.random() * tenWordList.length)]));

       //Top row is moved to the bottom row.
      setRandomWord2(randomWord1);

    } 
    else {

      alert('No match found.');

    }
    setPressedLetters('');

  };

//
const fetchDatamuse = async (word) => {
  try {
    //NEED TO COLLECT definitions, examples, synonyms, antonyms, parts of speech, and pronunciation
    //const response = await fetch(`https://api.datamuse.com/words?sp=${word}&md=dprf`);
    const response = await fetch(`https://api.datamuse.com/words?sp=${word}&md=f`);
    const data = await response.json();

    let fscore = JSON.stringify(data)

    let fstart = fscore.indexOf('f:')

    //alert(JSON.stringify(data));
    //alert(fstart);

    //lets say you want to find the word frequency for "word"
    //https://api.datamuse.com/words?sp=word&md=f returns
    //[{"word":"word","score":5385,"tags":["f:147.674682"]}]

    let fscorestring = '';

    for (let i = fstart + 2; i < fscore.length; i++) {
      if (fscore[i] === '"') {
        break; // Break the loop when a closing quote is encountered
      }

      //lexiscore is '147.674682'
      fscorestring += fscore[i];
      //alert(`Lexiscore: ${lexiscore}`);
    }
    
    //lexiscore is now a float 1/147.674682 (because word is a very common word!)
    let lexiscore = 1 / parseFloat(fscorestring);

    alert(`Lexiscore: ${lexiscore}`);

    updateScore(lexiscore);

    lexiscore = '';

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
  
  };

  
  
  

  //parameters are a word representing the row and the onClickFunction that gets called by onClick
  const generateLetterTiles = (word, onClickFunction) => {

    console.log(word);
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
      <div class="scoreboard">
        <label>Your Score is: </label>
        <label id="lcScore">{score}</label>
        <span id="data"></span>
      </div>
        <div id="first-row" className="letter-row">
          {generateLetterTiles(randomWord1, handleLetterClick)}
        </div>
        <div id="second-row" className="letter-row">
          {generateLetterTiles(randomWord2, handleLetterClick)}
        </div>
        
        <div className="Interface-keys">
          <button onClick={handleBackspace} style={{ marginRight: '425px' }}>&#x232B;BACK</button>
          <button onClick={wordSearch}>SUBMIT</button>
        </div>

        <div className="pressed-letters">{generateLetterTiles(pressedLetters, null)}</div>
        <br></br>
        <div className="submit-list">
          <h2>Submitted Words</h2>
          <ul>
            {submitList.map((word, index) => (
              <li key={index}>{word}</li>
            ))}
          </ul>
        </div>
        </div>
        </header>
        </div>
        
      
  )

}

//App is the main application without the LexiCrunch play area. It'll be a base for other components. The CSS is not working correctly but that should be an easy fix. 
const App = () => {
  return (
    <div className="App">
          <div id = "testArea"></div>
          <button onClick = {startGame}>StartGame</button>
          <button onClick = {tearDown}>TearDown Button</button>
    </div>
  );

};
export default App;