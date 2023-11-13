import { useState, useEffect } from 'react'
import '../css/calendar.css'

function Calendar() {
  const [wordleAnimationClass, setWordleAnimationClass] = useState('');
  const [withAnimationClass, setWithAnimationClass] = useState('');

  return (
    <>
      <div className="calendar">
        <div className="month-name">
            <div className="days-container">

            </div>
        </div>
      </div>
    </>
  )
}

export default Calendar