import React, { useState, useEffect, useRef } from 'react';
import { BsArrowReturnLeft } from "react-icons/bs";
import { MdOutlineBackspace } from "react-icons/md";
import '../css/keyboard.css';

const Keyboard = ({setGuess, guesses, guessNumber, setGuessNumber, correctWord, correctLetters, wrongPlaceLetters, wrongLetters, correctColor, wrongColor, flipAnimationClass, setFlipAnimationClass, showPopup, setShowPopup}) => {
  const firstRowKeys = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const secRowKeys = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const thirdRowKeys = ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DELETE'];
  const validWord = true;

  const handleKeyPress = (key) => {
    let current_guesses = guesses[guessNumber - 1];
    let current_letter = current_guesses.findIndex((letter) => letter === '');
    guesses[guessNumber - 1][current_letter] = key;
    setGuess([...guesses]);
  }

  const handleSubmit = () => {
    let current_guesses = guesses[guessNumber - 1];
    let current_letter = current_guesses.findIndex((letter) => letter === '');
    let anClass = [...flipAnimationClass];
    if (current_letter < 0) {
      if (validWord) {
        anClass[guessNumber - 1] = "letter-guess flip-card-inner flip-card-flipper";
        setFlipAnimationClass(anClass);
        setGuessNumber(guessNumber + 1);
        console.log(current_guesses.toString().replaceAll(',',''));
        if (current_guesses.toString().replaceAll(',','') === correctWord) {
          console.log("correct!!")
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
