import { useState, useEffect } from 'react'
import '../css/calendar.css'

function Calendar({setSelectedDate}) {
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

  const handleBoxClick = (boxIndex) => {
    setSelectedBox(boxIndex >= current_day && selectedMonth === month ? current_day : boxIndex);
    setSelectedDate(boxIndex >= current_day && selectedMonth === month ? selectedYear + "-" + selectedMonth.toString().padStart(2, '0') + "-" + current_day.toString().padStart(2, '0') : selectedYear + "-" + selectedMonth.toString().padStart(2, '0') + "-" + boxIndex.toString().padStart(2, '0'))
  };

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
    setSelectedDateLong(new Date(newYear, newMonth, 0).toLocaleString('default', { month: 'long' }) + "  " + newYear.toString());
  }

  function getFirstDayOfMonth(year, month) {
    // Months are zero-based in JavaScript, so we subtract 1 from the input month
    const firstDayOfMonth = new Date(year, month - 1, 1);
    return firstDayOfMonth.getDay() === 0 ? 7 : firstDayOfMonth.getDay();
  }

  const renderBoxes = (year, month) => {
    const days = [];
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    for (let i = 1; i <= lastDayOfMonth; i++) {
      const isSelected = i === selectedBox;
      days.push(
        <div
          key={i}
          className={`day ${isSelected ? 'selected-day' : ''}`}
          onClick={() => handleBoxClick(i)}
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