import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Calendar from '../objects/calendar.jsx';
import { ip } from '../config/ip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import '../css/landing.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

function Landing() {
  const [wordleAnimationClass, setWordleAnimationClass] = useState('');
  const [withAnimationClass, setWithAnimationClass] = useState('');
  const [sepClass, setSepClass] = useState('full-page first-page');
  const [arrowClass, setArrowClass] = useState('arrow-down');
  const [playerWins, setPlayerWins] = useState(0);
  const [playerLosses, setPlayerLosses] = useState(0);
  const [playerTies, setPlayerTies] = useState(0);
  const [recentPlayerWins, setRecentPlayerWins] = useState(0);
  const [recentPlayerLosses, setRecentPlayerLosses] = useState(0);
  const [recentPlayerTies, setRecentPlayerTies] = useState(0);
  const [guessDist, setGuessDist] = useState([0,0,0,0,0,0]);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [bestStart, setBestStart] = useState("N/A");
  const [guessesWithBest, setGuessesWithBest] = useState(0.0);
  const [bestSolveScore, setBestSolveScore] = useState(0);
  const [bestSolveStart, setBestSolveStart] = useState("N/A");
  const [bestSolveSol, setBestSolveSol] = useState("N/A");
  const [bestSolveNum, setBestSolveNum] = useState(0);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const current_day = currentDate.getDate();
  const [selectedDate, setSelectedDate] = useState(year + "-" + month.toString().padStart(2, '0') + "-" + current_day.toString().padStart(2, '0'));
  const location = useLocation();
  let {playerName} = location.state || {};

  const getPlayerInfo = async () => {
    await fetch(ip + `/api/get/players/player_name/${playerName}`)
      .then(res => res.json())
      .then(data => {
        const player_entry = data[0];
        setPlayerWins(player_entry.wins !== null ? player_entry.wins : 0);
        setPlayerLosses(player_entry.losses !== null ? player_entry.losses : 0);
        setPlayerTies(player_entry.ties !== null ? player_entry.ties : 0);
        setStreak(player_entry.current_streak !== null ? player_entry.current_streak : 0);
        setMaxStreak(player_entry.max_streak !== null ? player_entry.max_streak : 0);
        setGuessDist([player_entry['1_guesses'], player_entry['2_guesses'], player_entry['3_guesses'], player_entry['4_guesses'], player_entry['5_guesses'], player_entry['6_guesses']])
      })
      .catch(err => console.log(err))
  }

  function getIndexesByPropertyValues(array, properties) {
    return array.reduce((indexes, obj, index) => {
      const matches = Object.entries(properties).every(([prop, value]) => obj[prop] === value);
      if (matches) {
        indexes.push(index);
      }
      return indexes;
    }, []);
  }

  const incrementOrAdd = (obj, key, amount) => {
    if (obj.hasOwnProperty(key)) {
      obj[key].push(amount);
    } else {
      obj[key] = [amount];
    }
  }

  function getMaxAverageWord(obj) {
    let minAverage = Infinity;
    let minWord = null;
  
    // Iterate through each key-value pair in the object
    for (const [word, numbers] of Object.entries(obj)) {
      // Calculate the average of the numbers array
      const average = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  
      // Update maxAverage and maxWord if the current average is greater
      if (average < minAverage) {
        minAverage = average;
        minWord = word;
      }
    }
    return { word: minWord, average: minAverage };
  }

  const getBestStartingWord = async () => {
    let words = {};
    let amounts = {};
    let indexes;
    let bestStarter;
    await fetch(ip + `/api/get/guesses/player_name/${playerName}`)
      .then(res => res.json())
      .then(data => {
        data.forEach(guess => {
          if (guess.is_correct) {
            amounts[guess.wordle_id] = guess.guess_number;
            indexes = getIndexesByPropertyValues(data, {guess_number: 1, wordle_id: guess.wordle_id})
            incrementOrAdd(words, data[indexes[0]].guess, guess.guess_number);
          }
        })
        console.log(words);
        bestStarter = getMaxAverageWord(words);
        setBestStart(bestStarter.word);
        setGuessesWithBest(bestStarter.average);
      })
  }

  useEffect(() => {
    sessionStorage.setItem('playerName', playerName);
  }, [playerName]);

  useEffect(() => {
    const pName = sessionStorage.getItem('playerName');
    if (pName) {
      playerName = pName;
    }
  }, []);

  useEffect(() => {
    // Add the animation class after the component mounts
    setWordleAnimationClass('wordleFadeInAnimation');
    getPlayerInfo();
    getBestStartingWord();
    sessionStorage.setItem('playerName', playerName);
  }, [bestStart]); // Empty dependency array means this effect runs once after the initial render

  const handlePageSlide = () => {
    if (sepClass.includes("first-page")) {
      setSepClass("full-page sec-page");
    } else if (sepClass.includes("sec-page")) {
      setSepClass("full-page first-page");
    }
  }

  const handlePageSlide2 = () => {
    if (sepClass.includes("sec-page")) {
      setSepClass("full-page third-page");
      setArrowClass("arrow-up");
    } else if (sepClass.includes("third-page")) {
      setSepClass("full-page sec-page");
      setArrowClass("arrow-down");
    }
  }

  const sum = (arr) => {
    let total = 0;
    arr.forEach(num => {
      total += num
    })
    return total;
  }

  return (
    <>
      <div className={`${sepClass}`}>
        <h1>Choose Your &nbsp;
          <div>
            <span>W</span>
            <span>O</span>
            <span>R</span>
            <span>D</span>
            <span>L</span>
            <span>E</span>
          </div>
        </h1>
        <Calendar setSelectedDate={setSelectedDate}/>
        <Link to="/wordle" className='no-underline' state={{wordleDate: selectedDate, playerName: playerName}}>
          <div className="play-btn">
            <div className="shine"></div>
            <FontAwesomeIcon icon={faPlay} className="play-ico" />
            PLAY
          </div>
        </Link>
        <div className="WLT">
          {playerWins} W / {playerLosses} L / {playerTies} T
        </div>
        <div className="separator" onClick={() => handlePageSlide()}>
          <div className="dot first-dot" style={{fontSize: "75px", marginTop: "-7vh", color: "rgb(58, 58, 58)"}}>
            .
          </div>
          <div className="dot sec-dot" style={{fontSize: "55px", marginTop: "-7vh", color: "rgb(73, 73, 73)"}}>
            .
          </div>
          <div className="dot third-dot" style={{fontSize: "35px", marginTop: "-4vh", color: "rgb(139, 139, 139)"}}>
            .
          </div>
        </div>
        <div className="more-stats">
          <div className="guess-dist">
              GUESS DISTRIBUTION <br></br><br></br>
              <div className="all-guesses">
                <div className="bar">
                  <div className="outer-num">1</div><div className="one guesses-num" style={{width: `calc((${guessDist[0]}/${sum(guessDist)})*300px + 20px)`}}>{guessDist[0]}</div>
                </div>
                <div className="bar">
                  <div className="outer-num">2</div><div className="one guesses-num" style={{width: `calc((${guessDist[1]}/${sum(guessDist)})*300px + 20px)`}}>{guessDist[1]}</div>
                </div>
                <div className="bar">
                  <div className="outer-num">3</div><div className="one guesses-num" style={{width: `calc((${guessDist[2]}/${sum(guessDist)})*300px + 20px)`}}>{guessDist[2]}</div>
                </div>
                <div className="bar">
                  <div className="outer-num">4</div><div className="one guesses-num" style={{width: `calc((${guessDist[3]}/${sum(guessDist)})*300px + 20px)`}}>{guessDist[3]}</div>
                </div>
                <div className="bar">
                  <div className="outer-num">5</div><div className="one guesses-num" style={{width: `calc((${guessDist[4]}/${sum(guessDist)})*300px + 20px)`}}>{guessDist[4]}</div>
                </div>
                <div className="bar">
                  <div className="outer-num">6</div><div className="one guesses-num" style={{width: `calc((${guessDist[5]}/${sum(guessDist)})*300px + 20px)`}}>{guessDist[5]}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="more-stats-streak">
            <div className="streak-label">STREAK</div>
            <div className="max-streak">LONGEST: {maxStreak}</div>
          </div>
          <div className="streak-value">{streak}</div>
          <div className="more-stats-start">
            <div className="start-label">BEST STARTING WORD</div>
            <div className="avg-guess">AVG. GUESSES: {guessesWithBest}</div>
            <div className="word-value">{bestStart}</div>
          </div>
          <div className="scroll-down-more-stats" onClick={() => handlePageSlide2()}>
            <FontAwesomeIcon icon={faArrowRight} className={`${arrowClass}`}/>
          </div>
          <div className="more-stats-solve">
            <div className="solve-label">MOST UNLIKELY SOLVE</div>
            <div className="solve-score">SOLVE SCORE: {bestSolveScore}</div>
            <div className="solve-shower">
              <div className="first-word">{bestSolveStart}</div>
              <FontAwesomeIcon icon={faArrowRight} className="arrow-to-solve" />
              <div className="second-word">{bestSolveSol}</div>
              <div className="decoration">...</div>
              <div className="how-many">IN {bestSolveNum}</div>
            </div>
            <div className="in-last">RECORD IN LAST <select className="in-last-input" type="select"><option value="week">7 DAYS</option><option value="week2">14 DAYS</option><option value="month">30 DAYS</option><option value="year">YEAR</option></select></div>
            <div className="record-labels">
              <div className="W">W</div>
              <div className="L">L</div>
              <div className="T">T</div>
            </div>
            <div className="record">
              <div className="W">{recentPlayerWins}</div>
              <div className="L">{recentPlayerLosses}</div>
              <div className="T">{recentPlayerTies}</div>
            </div>
          </div>          
      </div>
    </>
  )
}

export default Landing
