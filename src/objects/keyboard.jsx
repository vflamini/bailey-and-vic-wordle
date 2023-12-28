import React, { useState, useEffect, useRef } from 'react';
import { BsArrowReturnLeft } from "react-icons/bs";
import { MdOutlineBackspace } from "react-icons/md";
import { ip } from '../config/ip';
import '../css/keyboard.css';

const Keyboard = ({setGuess, guesses, guessNumber, setGuessNumber, correctWord, correctLetters, wrongPlaceLetters, wrongLetters, correctColor, wrongColor, flipAnimationClass, setFlipAnimationClass, showPopup, setShowPopup, wordleDate, playerName, wordleId, isCorrect, otherCorrect, otherGuessNumber, handleRefreshGuesses, shareGuesses, wordList, maxStreak, currStreak, setMaxStreak, setCurrStreak}) => {
  const firstRowKeys = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const secRowKeys = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const thirdRowKeys = ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DELETE'];
  const validWord = true;
  const [isInWordList, setIsWordInList] = useState(false);
  const [inputWord, setInputWord] = useState('');

  const isValidWord = (word) => {
    return(wordList.includes(word));
  }

  const handleKeyPress = (key) => {
    if (!isCorrect && guessNumber <= 6) {
      console.log(guessNumber);
      let current_guesses = guesses[guessNumber - 1];
      let current_letter = current_guesses.findIndex((letter) => letter === '');
      guesses[guessNumber - 1][current_letter] = key;
      setGuess([...guesses]);
    }
  }

  const storeGuess = async (guess) => {
    await fetch(ip + `/api/insert/guesses/guess_id/${wordleDate.replaceAll('-','') + guessNumber + playerName}`, {method: 'POST'})
      .then(async res => {
        await fetch(ip + `/api/update/guesses/player_name/${playerName}/guess_id/${wordleDate.replaceAll('-','') + guessNumber + playerName}`, {method: 'POST'})
          .then(async res => {
            await fetch(ip + `/api/update/guesses/wordle_id/${wordleId}/guess_id/${wordleDate.replaceAll('-','') + guessNumber + playerName}`, {method: 'POST'})
              .then(async res => {
                await fetch(ip + `/api/update/guesses/guess/${guess}/guess_id/${wordleDate.replaceAll('-','') + guessNumber + playerName}`, {method: 'POST'})
                .then(async res => {
                  await fetch(ip + `/api/update/guesses/guess_number/${guessNumber}/guess_id/${wordleDate.replaceAll('-','') + guessNumber + playerName}`, {method: 'POST'})
                })
              })
          })
      })
  }

  const storeGuessAsCorrect = async () => {
    console.log(wordleDate.replaceAll('-','') + guessNumber + playerName);
    let fetchRes = await fetch(ip + `/api/update/guesses/is_correct/1/guess_id/${wordleDate.replaceAll('-','') + guessNumber + playerName}`, {method: 'POST'})
    let fetchData = await fetchRes.text();
    console.log(fetchData);
    let otherPlayerName;
    if (playerName === "Vic") {
      otherPlayerName = "Bailey"
    } else {
      otherPlayerName = "Vic"
    }
    await fetch(ip + `/api/increment/players/games_played/player_name/${playerName}`, {method: 'POST'})
    if (otherCorrect) {
      if (guessNumber < otherGuessNumber) {
        await fetch(ip + `/api/increment/players/wins/player_name/${playerName}`, {method: 'POST'})
        await fetch(ip + `/api/increment/players/losses/player_name/${otherPlayerName}`, {method: 'POST'})
      } else if (guessNumber > otherGuessNumber) {
        await fetch(ip + `/api/increment/players/wins/player_name/${otherPlayerName}`, {method: 'POST'})
        await fetch(ip + `/api/increment/players/losses/player_name/${playerName}`, {method: 'POST'})       
      } else {
        await fetch(ip + `/api/increment/players/ties/player_name/${otherPlayerName}`, {method: 'POST'})
        await fetch(ip + `/api/increment/players/ties/player_name/${playerName}`, {method: 'POST'})   
      }
    }
    if (guessNumber <= 6) {
      await fetch(ip + `/api/increment/players/${guessNumber}_guesses/player_name/${playerName}`, {method: 'POST'})
    } else {
      await fetch(ip + `/api/increment/players/failures/player_name/${playerName}`, {method: 'POST'})
    }
    let solvedRes = await fetch(ip + `/api/issolved/${parseInt(wordleId) - 1}/${playerName}`)
    let isStreak = await solvedRes.json();
    console.log(isStreak.isSolved);
    if (isStreak.isSolved) {
      await fetch(ip + `/api/update/players/current_streak/${currStreak + 1}/player_name/${playerName}`, {method: 'POST'})   
      if (currStreak + 1 > maxStreak) {
        await fetch(ip + `/api/update/players/max_streak/${currStreak + 1}/player_name/${playerName}`, {method: 'POST'});
        setMaxStreak(currStreak + 1);
      }
      setCurrStreak(currStreak + 1);
    } else {
      await fetch(ip + `/api/update/players/current_streak/${1}/player_name/${playerName}`, {method: 'POST'})   
      setCurrStreak(1);
    }
  }

  const storeGuessAsFailure = async () => {
    let otherPlayerName;
    if (playerName === "Vic") {
      otherPlayerName = "Bailey";
    } else {
      otherPlayerName = "Vic";
    }
    await fetch(ip + `/api/increment/players/games_played/player_name/${playerName}`, {method: 'POST'})
    if (otherCorrect) {
      await fetch(ip + `/api/increment/players/wins/player_name/${otherPlayerName}`, {method: 'POST'})
      await fetch(ip + `/api/increment/players/losses/player_name/${playerName}`, {method: 'POST'})        
    } else if(!otherCorrect && otherGuessNumber === 6) {
      await fetch(ip + `/api/increment/players/ties/player_name/${otherPlayerName}`, {method: 'POST'})
      await fetch(ip + `/api/increment/players/ties/player_name/${playerName}`, {method: 'POST'})   
    }
    await fetch(ip + `/api/increment/players/failures/player_name/${playerName}`, {method: 'POST'})
  }

  const handleSubmit = async () => {
    await handleRefreshGuesses();
    let current_guesses = guesses[guessNumber - 1];
    let current_letter = current_guesses.findIndex((letter) => letter === '');
    let anClass = [...flipAnimationClass];
    if (current_letter < 0) {
      if (isValidWord(current_guesses.join(''))) {
        anClass[guessNumber - 1] = "letter-guess flip-card-inner flip-card-flipper";
        setFlipAnimationClass(anClass);
        setGuessNumber(guessNumber + 1);
        storeGuess(current_guesses.toString().replaceAll(',',''));
        console.log(guessNumber);
        if (current_guesses.toString().replaceAll(',','') === correctWord && guessNumber <= 6) {
          storeGuessAsCorrect();
          console.log("correct!!")
          setShowPopup(true);
        } else if (guessNumber === 6) {
          storeGuessAsFailure();
          setShowPopup(true);
        }
      }
    }
  }

  const handleBackSpace = (key) => {
    let current_guesses = guesses[guessNumber - 1];
    let current_letter = current_guesses.findIndex((letter) => letter === '');
    if (current_letter > 0) {
      guesses[guessNumber - 1][current_letter - 1] = '';
      setGuess([...guesses]);
    } else if (current_letter < 0) {
      guesses[guessNumber - 1][4] = '';
      setGuess([...guesses]);
    } else {
      return;
    }
  }

  const getColor = (letter) => {
    if (correctLetters.includes(letter)) {
      return correctColor;
    }
    if (wrongPlaceLetters.includes(letter)) {
      return wrongColor;
    }
    if (wrongLetters.includes(letter)) {
      return "#a8a7a7"
    }
    return "#242424";
  }

  return (
    <div>
      <div className="keyboard">
        <div className="first row">
          {firstRowKeys.map(key => {
            return (
              <div className="key" key={key} style={{backgroundColor: getColor(key)}} onClick={() => handleKeyPress(key)}>{key}</div>
            )
          })}
        </div>
        <div className="sec row">
          {secRowKeys.map(key => {
            return (
              <div className="key" key={key} style={{backgroundColor: getColor(key)}} onClick={() => handleKeyPress(key)}>{key}</div>
            )
          })}
        </div>
        <div className="third row">
          {thirdRowKeys.map(key => {
            if (key === 'ENTER') {
              return (
                <div className="key" key={key} onClick={() => handleSubmit()}><BsArrowReturnLeft /></div>
              )
            } else if (key === 'DELETE') {
              return (
                <div className="key" key={key} onClick={() => handleBackSpace()}><MdOutlineBackspace /></div>
              )
            } else {
              return (
                <div className="key" key={key} style={{backgroundColor: getColor(key)}} onClick={() => handleKeyPress(key)}>{key}</div>
              )
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default Keyboard;
