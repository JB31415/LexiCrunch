// word to validate
const vWord = 'whiskey';

const fs = require('fs');
const readline = require('readline');

function validateWord(fileName, searchWord, callback) {
  const fileStream = fs.createReadStream(fileName);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let score = null;

  rl.on('line', (line) => {
    const [word, lineScore] = line.split(':');
    if (word.trim() === searchWord) {
      score = parseFloat(lineScore);
      rl.close();
    }
  });

  rl.on('close', () => {
    callback(score);
  });

  fileStream.on('error', (err) => {
    console.error(`Error reading the file: ${err}`);
    callback(null);
  });
}

function getScore() {
  const fileName = 'sample.txt';
  const searchWord = vWord.toLowerCase();

 validateWord(fileName, searchWord, (score) => {
    if (score !== null) {
      console.log(`Score: ${score}`);
    } else {
      console.log('Invalid entry');
    }
  });
}

getScore();