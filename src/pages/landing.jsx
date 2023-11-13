import { useState, useEffect } from 'react'
import Calendar from '../objects/calendar.jsx'
import '../css/landing.css'

function Landing() {
  const [wordleAnimationClass, setWordleAnimationClass] = useState('');
  const [withAnimationClass, setWithAnimationClass] = useState('');

  return (
    <>
      <h1>Choose Your WORDLE</h1>
      <Calendar />
    </>
  )
}

export default Landing
