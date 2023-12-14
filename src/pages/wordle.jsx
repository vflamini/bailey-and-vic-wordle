import { useState, useEffect } from 'react';
import Keyboard from '../objects/keyboard.jsx';
import ColorPickerButton from '../objects/colorpickerbutton.jsx';
import getFontColor from '../functions/getFontColor.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import '../css/wordle.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

function Wordle() {
  const [guesses, setGuess] = useState(
    [
      ['','','','',''],
      ['','','','',''],
      ['','','','',''],
      ['','','','',''],
      ['','','','',''],
      ['','','','','']
    ]
  );
  const [guessNumber, setGuessNumber] = useState(1);
  const [correctColor, setCorrectColor] = useState('#0c6b11');
  const [wrongColor, setWrongColor] = useState('#61690f');
  const [victoryColor, setVictoryColor] = useState('#37edb6');
  const [flipAnimationClass, setFlipAnimationClass] = useState(["letter-guess flip-card-inner","letter-guess flip-card-inner","letter-guess flip-card-inner","letter-guess flip-card-inner","letter-guess flip-card-inner","letter-guess flip-card-inner"]);
  const [withAnimationClass, setWithAnimationClass] = useState('');
  const [sepClass, setSepClass] = useState('full-page first-page');
  const [correctWord, setCorrectWord] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  let correctLetters = [];
  let wrongPlaceLetters = [];
  let wrongLetters = [];

  // Get today's date
  const today = new Date();

  // Extract year, month, and day
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(today.getDate()).padStart(2, '0');

  // Format the date as "YYYY-MM-DD"
  const formattedDate = `${year}-${month}-${day}`;

  useEffect(() => {
    const getWordleWord = async () => {
      // let headers = new Headers({
      //   "Accept": "*/*",
      //   "Content-Type": "application/x-www-form-urlencoded",
      //   "User-Agent": 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36',
      //   "Accept-Language": "en-US,en;q=0.9",
      //   "Sec-Fetch-Mode": "cors",
      //   "Sec-Fetch-Site": "same-origin",
      //   "Accept-Encoding": "gzip, deflate, br"
      // })
      let corrWord;
      const headers = new Headers({
        "Cookie": "nyt-gdpr=0"
      });
      console.log(formattedDate);
      await fetch('http://108.24.100.247:5000/solution/' + formattedDate, {
        method: "GET"
      }).then(res => res.text())
        .then(data => {
          corrWord = data;
        })
        .catch(err => console.log(err));
      setCorrectWord(corrWord.toUpperCase());
    }
    getWordleWord();
  }, []);

  const findTilePlacement = (guess, guessNum, returnWrongTile, corrWord, tiles = ['','','','','']) => {
    let additor = 5 - guess.length;
    let letter, idx;
    let lCorrectLetters = [];
    let lWrongPlaceLetters = [];
    let lWrongLetters = [];
    let lettersLeft = corrWord.split('');
    for (let i = 0; i < guess.length; i++) {
      idx = i + additor;
      letter = guess[i];
      if (letter !== '' && guessNum + 1 < guessNumber) {
        if (corrWord[idx] === letter) {
          lCorrectLetters.push(letter);
          console.log(lCorrectLetters);
          lettersLeft[idx] = '-';
          tiles[idx] = <div className={`${flipAnimationClass[guessNum]}-${idx + 1} correct-${idx + 1}`} style={{transition: `background-color 0.2s linear ${idx * 0.45}s`, backgroundColor: correctColor}}>{letter}</div>
          // if (!returnWrongTile) {
          //   break;
          // }
        } else if (lettersLeft.includes(letter)) {
          if (guess.slice(idx + 1, guess.length)) {
            if (guess.slice(idx + 1, guess.length).includes(letter)) {
              [tiles, lettersLeft] = findTilePlacement(guess.slice(idx + 1, guess.length), guessNum, false, tiles, lettersLeft);
              if (tiles[idx] === '') {
                if (lettersLeft.includes(letter)) {
                  tiles[idx] = <div className={`${flipAnimationClass[guessNum]}-${idx + 1} wrong-place-${idx + 1}`} style={{transition: `background-color 0.2s linear ${idx * 0.45}s`, backgroundColor: wrongColor}}>{letter}</div>
                } else {
                  lWrongLetters.push(letter)
                  tiles[idx] = <div className={`${flipAnimationClass[guessNum]}-${idx + 1} wrong-${idx + 1}`}>{letter}</div>;
                }
              }
              continue;
            }
          }
          if (returnWrongTile) {
            let removeIdx = lettersLeft.findIndex((removedLetter) => removedLetter === letter);
            lettersLeft[removeIdx] = '-';
            lWrongPlaceLetters.push(letter);
            tiles[idx] = <div className={`${flipAnimationClass[guessNum]}-${idx + 1} wrong-place-${idx + 1}`} style={{transition: `background-color 0.2s linear ${idx * 0.45}s`, backgroundColor: wrongColor}}>{letter}</div>
          }
        } else {
          if (returnWrongTile) {
            lWrongLetters.push(letter);
            tiles[idx] = <div className={`${flipAnimationClass[guessNum]}-${idx + 1} wrong-${idx + 1}`}>{letter}</div>
          }
        }
      } else {
        if (returnWrongTile) {
          lWrongLetters.push(letter);
          tiles[idx] = <div className={`${flipAnimationClass[guessNum]}-${idx + 1} wrong-${idx + 1}`}>{letter}</div>
        }
      }
    }
    if (returnWrongTile && guessNum + 1 < guessNumber) {
      // setCorrectLetters(prevCorrectLetters => [...prevCorrectLetters, ...lCorrectLetters]);
      // setWrongPlaceLetters(prevWrongPlaceLetters => [...prevWrongPlaceLetters, ...lWrongPlaceLetters]);
      // setCorrectLetters(prevWrongLetters => [...prevWrongLetters, ...lWrongLetters]);
      correctLetters = [...correctLetters, ...lCorrectLetters];
      wrongPlaceLetters = [...wrongPlaceLetters, ...lWrongPlaceLetters];
      wrongLetters = [...wrongLetters, ...lWrongLetters];
    }
    return [tiles, lettersLeft];
  }

  return (
    <>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content" style={{backgroundColor: victoryColor, color: getFontColor(victoryColor)}}>
            <div className="statistics">
              STATISTICS
              <div className="stats">
                <div className="played-num">62</div>
                <div className="win-perc-num">100</div>
                <div className="curr-strk-num">2</div>
                <div className="max-strk-num">11</div>
              </div>
              <div className="stat-names">
                <div className="played name">Played</div>
                <div className="win-perc name">Win %</div>
                <div className="curr-strk name">Current Streak</div>
                <div className="max-strk name">Max Streak</div>
              </div>
            </div>
            <div className="guess-dist">
              GUESS DISTRIBUTION <br></br><br></br>
              <div className="all-guesses">
                <div className="bar">
                  <div className="outer-num">1</div><div className="one guesses-num">0</div>
                </div>
                <div className="bar">
                  <div className="outer-num">2</div><div className="one guesses-num">0</div>
                </div>
                <div className="bar">
                  <div className="outer-num">3</div><div className="one guesses-num">0</div>
                </div>
                <div className="bar">
                  <div className="outer-num">4</div><div className="one guesses-num">0</div>
                </div>
                <div className="bar">
                  <div className="outer-num">5</div><div className="one guesses-num">0</div>
                </div>
                <div className="bar">
                  <div className="outer-num">6</div><div className="one guesses-num">0</div>
                </div>
              </div>
            </div>
            <div className="btns">
              <div className="share btn" onClick={() => setShowPopup(false)}>SHARE</div>
              <div className="close btn" onClick={() => setShowPopup(false)}>CLOSE</div>
            </div>
          </div>
        </div>
      )}
      <div className="top-bar">
        <ColorPickerButton text={"correct tile"} defaultColor={"#0c6b11"} setColor={setCorrectColor}/>
        <ColorPickerButton text={"wrong place tile"} defaultColor={"#61690f"} setColor={setWrongColor}/>
        <ColorPickerButton text={"victory message"} defaultColor={"#37edb6"} setColor={setVictoryColor}/>
        <div className="title">wordle</div>
      </div>
      <div className="line-sep"></div>
      <div className="guesses">
        {guesses.map((guess, guessNum) => {
          return (
            <>
              <div className="guess">
                {findTilePlacement(guess, guessNum, true, correctWord)[0].map(tile => {
                  return (
                    tile
                  )
                })}
              </div>
            </>
          )
        })}
      </div>
      <Keyboard
        setGuess={setGuess}
        guesses={[...guesses]}
        guessNumber={guessNumber}
        setGuessNumber={setGuessNumber}
        correctWord={correctWord}
        correctLetters={correctLetters}
        wrongPlaceLetters={wrongPlaceLetters}
        wrongLetters={wrongLetters}
        correctColor={correctColor}
        wrongColor={wrongColor}
        flipAnimationClass={flipAnimationClass}
        setFlipAnimationClass={setFlipAnimationClass}
        showPopup={showPopup}
        setShowPopup={setShowPopup}
      />
    </>
  )
}

export default Wordle
