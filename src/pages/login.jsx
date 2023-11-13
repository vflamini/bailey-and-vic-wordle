import { useState, useEffect } from 'react'
import '../css/login.css'

function Login() {
  const [wordleAnimationClass, setWordleAnimationClass] = useState('');
  const [withAnimationClass, setWithAnimationClass] = useState('');
  useEffect(() => {
    // Add the animation class after the component mounts
    setWordleAnimationClass('wordleFadeInAnimation');
    setWithAnimationClass('withFadeInAnimation');
  }, []); // Empty dependency array means this effect runs once after the initial render
  return (
    <>
      <div className="main-title">
        <h1 style={{fontFamily: "Roboto", fontSize: "50px", opacity: "0"}} className={`${wordleAnimationClass}`}>WORDLE</h1>
        <h1 style={{fontFamily: "Dancing Script", opacity: "0"}} className={`${withAnimationClass}`}>with</h1>
        <div className="curved-text">
          <svg viewBox="0 0 500 500">
            <path id="curve" d="M73.2,148.6c4-6.1,65.5-96.8,178.6-95.6c111.3,1.2,170.8,90.3,175.1,97" />
            <text width="500" lengthAdjust="spacing">
              <textPath id="text-path" xlinkHref="#curve">
                <tspan className="letter">B</tspan>
                <tspan className="letter">a</tspan>
                <tspan className="letter">i</tspan>
                <tspan className="letter">l</tspan>
                <tspan className="letter">e</tspan>
                <tspan className="letter">y</tspan>
                <tspan className="letter">&nbsp;</tspan>
                <tspan className="letter">&</tspan>
                <tspan className="letter">&nbsp;</tspan>
                <tspan className="letter">V</tspan>
                <tspan className="letter">i</tspan>
                <tspan className="letter">c</tspan>
              </textPath>
            </text>
          </svg>
        </div>
        <div className="who-are-you">
          Who Are You?
        </div>
        <div className={"login-button bailey-button"}>
          Bailey
        </div>
        <div className={"login-button vic-button"}>
          Victor
        </div>
      </div>
    </>
  )
}

export default Login
