import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ip } from '../config/ip';
import Keyboard from '../objects/keyboard.jsx';
import ColorPickerButton from '../objects/colorpickerbutton.jsx';
import getFontColor from '../functions/getFontColor.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import '../css/wordle.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

function Wordle() {
  const location = useLocation();
  const {wordleDate, playerName} = location.state || {};
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
  const [otherGuesses, setOtherGuesses] = useState(
    [
      ['','','','',''],
      ['','','','',''],
      ['','','','',''],
      ['','','','',''],
      ['','','','',''],
      ['','','','','']
    ]
  );
  const [wordleId, setWordleId] = useState(0);
  const [isCorrect, setCorrect] = useState(false);
  const [otherCorrect, setOtherCorrect] = useState(false);
  const [guessNumber, setGuessNumber] = useState(1);
  const [otherGuessNumber, setOtherGuessNumber] = useState(null);
  const [correctColor, setCorrectColor] = useState('');
  const [wrongColor, setWrongColor] = useState('');
  const [victoryColor, setVictoryColor] = useState('');
  const [flipAnimationClass, setFlipAnimationClass] = useState(["letter-guess flip-card-inner","letter-guess flip-card-inner","letter-guess flip-card-inner","letter-guess flip-card-inner","letter-guess flip-card-inner","letter-guess flip-card-inner"]);
  const [withAnimationClass, setWithAnimationClass] = useState('');
  const [sepClass, setSepClass] = useState('full-page first-page');
  const [correctWord, setCorrectWord] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  let correctLetters = [];
  let wrongPlaceLetters = [];
  let wrongLetters = [];

  const shareGuesses = [
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
    ['','','','','']
  ];

  // Get today's date
  const today = new Date();

  // Extract year, month, and day
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(today.getDate()).padStart(2, '0');

  // Format the date as "YYYY-MM-DD"
  const formattedDate = `${year}-${month}-${day}`;

  const getPlayerInfo = async () => {
    await fetch(ip + `/api/get/players/player_name/${playerName}`)
      .then(res => res.json())
      .then(data => {
        const player_entry = data[0];
        setCorrectColor(player_entry.correct_tile_color !== null ? player_entry.correct_tile_color : '#0c6b11');
        setWrongColor(player_entry.wrong_place_tile_color !== null ? player_entry.wrong_place_tile_color : '#61690f');
        setVictoryColor(player_entry.victory_message_color !== null ? player_entry.victory_message_color : '#37edb6');
        getGuesses();
      })
      .catch(err => console.log(err))
  }

  const getOtherGuesses = async () => {
    let otherPlayerName;
    if (playerName === "Vic") {
      otherPlayerName = "Bailey";
    } else {
      otherPlayerName = "Vic"
    }
    await fetch(ip + `/api/getguesses/${wordleId}/${otherPlayerName}`)
      .then(res => res.json())
      .then(data => {
        data.forEach(guess => {
          if (guess.is_correct) {
            setOtherCorrect(true);
            setOtherGuessNumber(guess.guess_number);
          }
          setOtherGuesses((prevGuesses) => {
            const newGuesses = [...prevGuesses];
            newGuesses[guess.guess_number - 1] = guess.guess.split('');
            return newGuesses;
          })
        })
      })
  }

  const getGuesses = async () => {
    await fetch(ip + `/api/getguesses/${wordleId}/${playerName}`)
      .then(res => res.json())
      .then(data => {
        data.forEach(guess => {
          if (guess.is_correct) {
            setCorrect(true);
            setShowPopup(true);
          }
          setGuess((prevGuesses) => {
            const newGuesses = [...prevGuesses];
            newGuesses[guess.guess_number - 1] = guess.guess.split('');
            return newGuesses;
          })
          setGuessNumber(guess.guess_number + 1);
        })
      })
    let otherPlayerName;
    if (playerName === "Vic") {
      otherPlayerName = "Bailey";
    } else {
      otherPlayerName = "Vic";
    }
    await fetch(ip + `/api/getguesses/${wordleId}/${otherPlayerName}`)
      .then(res => res.json())
      .then(data => {
        data.forEach(guess => {
          if (guess.is_correct) {
            setOtherCorrect(true);
            setOtherGuessNumber(guess.guess_number);
          }
          setOtherGuesses((prevGuesses) => {
            const newGuesses = [...prevGuesses];
            newGuesses[guess.guess_number - 1] = guess.guess.split('');
            return newGuesses;
          })
        })
      })
  }

  const handleRefreshGuesses = async () => {
    await getOtherGuesses();
  }

  useEffect(() => {
    const wordleStored = async () => {
      await fetch(ip + `/api/get/wordle/wordle_date/${encodeURIComponent(wordleDate) + ' 00:00:00'}`)
        .then(res => res.json())
        .then(data => {
          if (data[0]) {
            setCorrectWord(data[0].solution);
            setWordleId(data[0].wordle_id);
            getGuesses();
          } else {
            setCorrectWord('');
          }
        })
    }

    const getWordleWordExternal = async () => {
      let corrWord;
      let wid;
      const headers = new Headers({
        "Cookie": "nyt-gdpr=0"
      });
      console.log(formattedDate);
      await fetch(ip + '/solution/' + wordleDate, {
        method: "GET"
      }).then(res => res.json())
        .then(async data => {
          console.log(data);
          corrWord = data.solution;
          wid = data.days_since_launch;
          await fetch(ip + `/api/insert/wordle/wordle_id/${data.days_since_launch}`, {method: 'POST'})
            .then(async res => {
              await fetch(ip + `/api/update/wordle/wordle_date/${encodeURIComponent(data.print_date + ' 00:00:00')}/wordle_id/${data.days_since_launch}`, {method: 'POST'})
                .then(async res => {
                  await fetch(ip + `/api/update/wordle/solution/${data.solution.toUpperCase()}/wordle_id/${data.days_since_launch}`, {method: 'POST'})
                })
            })
            .catch(err => {
              console.log(err);
            })
        })
        .catch(err => console.log(err));
      setCorrectWord(corrWord.toUpperCase());
      setWordleId(wid);
      getGuesses();
    }
    wordleStored();
    if (correctWord === '') {
      getWordleWordExternal();
    }
    getPlayerInfo();
  }, [wordleId]);

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
          lettersLeft[idx] = '-';
          tiles[idx] = <div className={`${flipAnimationClass[guessNum]}-${idx + 1} correct-${idx + 1}`} style={{transition: `background-color 0.2s linear ${idx * 0.45}s`, backgroundColor: correctColor}}>{letter}</div>
          shareGuesses[guessNum][idx] = '🟩';
          // if (!returnWrongTile) {
          //   break;
          // }
        } else if (lettersLeft.includes(letter)) {
          if (guess.slice(idx + 1, guess.length)) {
            if (guess.slice(idx + 1, guess.length).includes(letter)) {
              [tiles, lettersLeft] = findTilePlacement(guess.slice(idx + 1, guess.length), guessNum, false, lettersLeft.join(''), tiles);
              if (tiles[idx] === '') {
                if (lettersLeft.includes(letter)) {
                  tiles[idx] = <div className={`${flipAnimationClass[guessNum]}-${idx + 1} wrong-place-${idx + 1}`} style={{transition: `background-color 0.2s linear ${idx * 0.45}s`, backgroundColor: wrongColor}}>{letter}</div>
                  shareGuesses[guessNum][idx] = '🟨';
                  let removeIdx = lettersLeft.findIndex((removedLetter) => removedLetter === letter);
                  lettersLeft[removeIdx] = '-';
                  lWrongPlaceLetters.push(letter);
                } else {
                  lWrongLetters.push(letter)
                  tiles[idx] = <div className={`${flipAnimationClass[guessNum]}-${idx + 1} wrong-${idx + 1}`}>{letter}</div>;
                  if (letter && letter !== '') {
                    shareGuesses[guessNum][idx] = '⬜';
                  }
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
            shareGuesses[guessNum][idx] = '🟨';
          }
        } else {
          if (returnWrongTile) {
            lWrongLetters.push(letter);
            tiles[idx] = <div className={`${flipAnimationClass[guessNum]}-${idx + 1} wrong-${idx + 1}`}>{letter}</div>
            if (letter && letter !== '') {
              shareGuesses[guessNum][idx] = '⬜';
            }
          }
        }
      } else {
        if (returnWrongTile) {
          lWrongLetters.push(letter);
          tiles[idx] = <div className={`${flipAnimationClass[guessNum]}-${idx + 1} wrong-${idx + 1}`}>{letter}</div>
          if (letter && letter !== '') {
            console.log(letter);
            shareGuesses[guessNum][idx] = '⬜';
          }
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

  const handleCorrectColorChange = (color) => {
    setCorrectColor(color);
    changeCorrectColor(color);
  }

  const changeCorrectColor = async (color) => {
    await fetch(ip + `/api/update/players/correct_tile_color/${encodeURIComponent(color)}/player_name/${playerName}`, {method: 'POST'})
  }

  const handleWrongColorChange = (color) => {
    setWrongColor(color);
    changeWrongColor(color);
  }

  const changeWrongColor = async (color) => {
    await fetch(ip + `/api/update/players/wrong_place_tile_color/${encodeURIComponent(color)}/player_name/${playerName}`, {method: 'POST'})
  }

  const handleVictoryColorChange = (color) => {
    setVictoryColor(color);
    changeVictoryColor(color);
  }

  const changeVictoryColor = async (color) => {
    await fetch(ip + `/api/update/players/victory_message_color/${encodeURIComponent(color)}/player_name/${playerName}`, {method: 'POST'})
  }

  const handleShareClick = async () => {
    try {
      console.log(shareGuesses);
      const formattedString = `Wordle ${wordleId} ${guessNumber - 1}/6\n\n` + shareGuesses
        .map((list) => list.filter((item) => item !== '').join(''))
        .join("\n")
        .trim();
      console.log(formattedString);
      if (navigator.share) {
        await navigator.share({
          title: 'Share via',
          text: formattedString,
        });
      } else {
        throw new Error('Web Share API not supported');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Handle the error or provide a fallback option
    }
  };

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
              <div style={{width: "80vw", textAlign: "center", color: "red", fontSize: "20px"}}>SOLVE SCORE: 106789</div> <br></br>
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
              <div className="share btn" onClick={handleShareClick}>SHARE</div>
              <div className="close btn" onClick={() => setShowPopup(false)}>CLOSE</div>
            </div>
          </div>
        </div>
      )}
      <div className="top-bar">
        {correctColor !== '' && (<ColorPickerButton text={"correct tile"} defaultColor={correctColor} setColor={handleCorrectColorChange}/>)}
        {wrongColor !== '' && (<ColorPickerButton text={"wrong place tile"} defaultColor={wrongColor} setColor={handleWrongColorChange}/>)}
        {victoryColor !== '' && (<ColorPickerButton text={"victory message"} defaultColor={victoryColor} setColor={handleVictoryColorChange}/>)}
        <Link to="/landing" className="no-underline" state={{playerName: playerName}}><div className="title">wordle</div></Link>
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
        wordleDate={wordleDate}
        playerName={playerName}
        wordleId={wordleId}
        isCorrect={isCorrect}
        otherCorrect={otherCorrect}
        otherGuessNumber={otherGuessNumber}
        handleRefreshGuesses={handleRefreshGuesses}
        shareGuesses={shareGuesses}
      />
    </>
  )
}

export default Wordle
