import { useState, useEffect } from 'react'
import '../css/calendar.css';
import { ip } from '../config/ip';

function Calendar({setSelectedDate, playerName, todayWordleId}) {
  const [wordleAnimationClass, setWordleAnimationClass] = useState('');
  const [withAnimationClass, setWithAnimationClass] = useState('');
  const day_abbr = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const current_day = currentDate.getDate();
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);
  const [selectedDateLong, setSelectedDateLong] = useState(currentDate.toLocaleString('default', { month: 'long' }) + "  " + year.toString());
  const [selectedBox, setSelectedBox] = useState(current_day);
  const [thisWordleId, setThisWordleId] = useState(0);
  const [idRecords, setIdRecords] = useState({});
  const [currMonthWId, setCurrMonthWId] = useState(0);

  const handleBoxClick = (boxIndex) => {
    setSelectedBox(boxIndex >= current_day && selectedMonth === month ? current_day : boxIndex);
    setSelectedDate(boxIndex >= current_day && selectedMonth === month ? selectedYear + "-" + selectedMonth.toString().padStart(2, '0') + "-" + current_day.toString().padStart(2, '0') : selectedYear + "-" + selectedMonth.toString().padStart(2, '0') + "-" + boxIndex.toString().padStart(2, '0'))
    sessionStorage.setItem('wordleDate', boxIndex >= current_day && selectedMonth === month ? selectedYear + "-" + selectedMonth.toString().padStart(2, '0') + "-" + current_day.toString().padStart(2, '0') : selectedYear + "-" + selectedMonth.toString().padStart(2, '0') + "-" + boxIndex.toString().padStart(2, '0'));
  };

  useEffect(() => {
    const didWin = async () => {
      let records = {};
      let otherPlayerName;
      let id;
      if (playerName === "Vic") {
        otherPlayerName = "Bailey";
      } else {
        otherPlayerName = "Vic";
      }
      try {
        const resDate = await fetch(ip + `/api/get/wordle/wordle_date/${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-01`);
        const dataDate = await resDate.json();
        if (!dataDate || !dataDate[0] || !dataDate[0].wordle_id) {
          const resExternal = await fetch(ip + `/solution/${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-01`);
          const dataExternal = await resExternal.json();
          id = dataExternal.days_since_launch
          const insertRes = await fetch(ip + `/api/insert/wordle/wordle_id/${dataExternal.days_since_launch}`, {method: 'POST'})
          const throwawayData1 = await insertRes.json();
          const update1Res = await fetch(ip + `/api/update/wordle/wordle_date/${encodeURIComponent(dataExternal.print_date)}/wordle_id/${dataExternal.days_since_launch}`, {method: 'POST'})
          const throwawayData2 = await update1Res.json();
          const update2Res = await fetch(ip + `/api/update/wordle/solution/${dataExternal.solution.toUpperCase()}/wordle_id/${dataExternal.days_since_launch}`, {method: 'POST'})
          const throwawayData3 = await update2Res.json();
        } else {
          id = dataDate[0].wordle_id;
        }
        console.log(id);
        setCurrMonthWId(id);
        const res = await fetch(ip + `/api/getrecentrecord/${todayWordleId}/${id}`);
        const data = await res.json();
        // const sortedData = data.sort((a,b) => {
        //   if (a.wordle_id < b.wordle_id) return -1;
        //   if (a.wordle_id > b.wordle_id) return 1;
  
        //   return a.name.localeCompare(b.name);
        // });
        // sortedData.forEach((guess, idx) => {
        //   if (guess.player_name === otherPlayerName) {
  
        //   }
        // })
        data.forEach((record) => {
          if (record.player_name === playerName) {
            const wordleId = record.wordle_id;
            const guesses = record.guess_number;
            const opponentGuesses = data.find(
              (r) => r.wordle_id === wordleId && r.player_name !== playerName
            );
  
            if (opponentGuesses) {
              if (guesses < opponentGuesses.guess_number) {
                records[record.wordle_id] = "win";
              } else if (guesses > opponentGuesses.guess_number) {
                records[record.wordle_id] = "loss";
              } else {
                records[record.wordle_id] = "tie";
              }
            } else {
              records[record.wordle_id] = "no match";
            }
          }
        });
        console.log(records);
        setIdRecords(records);
      } catch (error) {
        console.log(error);
      }
    }
    didWin();
  }, [todayWordleId, selectedMonth])

  

  const handleMonthChange = (direction) => {
    let newMonth = selectedMonth;
    let newYear = selectedYear;
    if (direction === "+") {
      newMonth += 1;
      if (newMonth > 12) {
        newMonth = 1;
        newYear += 1
      }
      if ((newYear === year && newMonth > month) || newYear > year) {
        return;
      }
    } else if(direction === "-") {
      newMonth -= 1;
      if (newMonth < 1) {
        newMonth = 12;
        newYear -= 1;
      }
    }
    if (newMonth === month && newYear === year) {
      setSelectedBox(current_day);
    } else {
      setSelectedBox(null);
    }
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
    setSelectedDateLong(
      new Date(newYear, newMonth, 0).toLocaleString('default', { month: 'long' }) + "  " + newYear.toString()
    );
  }

  function getFirstDayOfMonth(year, month) {
    // Months are zero-based in JavaScript, so we subtract 1 from the input month
    const firstDayOfMonth = new Date(year, month - 1, 1);
    return firstDayOfMonth.getDay() === 0 ? 7 : firstDayOfMonth.getDay();
  }

  const renderBoxes = (year, month) => {
    const days = [];
    let color;
    const additor = currMonthWId - 1;
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    for (let i = 1; i <= lastDayOfMonth; i++) {
      const isSelected = i === selectedBox;
      // Fetch wordle date from database
      // const res = await fetch(ip + `/api/get/wordle/wordle_date/${year}-${month.toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`);
      // const data = await res.json();
      // if (data[0]) {
      //   const result = await didWin(data[0].wordle_id)
      //   if (result === "win") {
      //     color = "green";
      //   } else if (result === "loss") {
      //     color = "red";
      //   } else if (result === "tie") {
      //     color = "yellow";
      //   } else {
      //     color = "lightgray";
      //   }
      // }
      // if exists get who won
      let backgroundColor = '';
      if (idRecords[(i + additor).toString()] === "win") {
        color = "green";
      } else if (idRecords[(i + additor).toString()] === "loss") {
        color = "red";
      } else if (idRecords[(i + additor).toString()] === "tie") {
        color = "yellow";
      } else {
        color = "lightgray";
      }
      if (!idRecords[(i + additor).toString()]) {
        backgroundColor = '#784d4a';
      }
      days.push(
        <div
          key={i}
          className={`day ${isSelected ? 'selected-day' : ''}`}
          onClick={() => handleBoxClick(i)}
          style={{color: color, backgroundColor: backgroundColor}}
        >{i}</div>
      );
    }
    const displacement = getFirstDayOfMonth(selectedYear, selectedMonth);
    for (let i = 0; i < displacement; i++) {
      days.unshift(
        <div
          key={`unshift-${i}`}
          className={`fake-day`}
        ></div>
      )
    }
    return days;
  };

  return (
    <>
      <div className="calendar">
        <div className="month-name">
          <div className="decrease-month" onClick={() => handleMonthChange("-")}>&larr;</div>
          {selectedDateLong}
          <div className="increase-month" onClick={() => handleMonthChange("+")}>&rarr;</div>
        </div>
        <div className="days-of-week">
          {
            day_abbr.map(day => {
              return (
                <div className="day-header" key={day}>{day}</div>
              )
            })
          }
        </div>
        <div className="days-container">
          {renderBoxes(selectedYear, selectedMonth)}
        </div>
      </div>
    </>
  )
}

export default Calendar