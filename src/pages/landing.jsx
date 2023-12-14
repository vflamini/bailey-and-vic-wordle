import { useState, useEffect } from 'react';
import Calendar from '../objects/calendar.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import '../css/landing.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

function Landing() {
  const [wordleAnimationClass, setWordleAnimationClass] = useState('');
  const [withAnimationClass, setWithAnimationClass] = useState('');
  const [sepClass, setSepClass] = useState('full-page first-page');

  useEffect(() => {
    // Add the animation class after the component mounts
    setWordleAnimationClass('wordleFadeInAnimation');
  }, []); // Empty dependency array means this effect runs once after the initial render

  const handlePageSlide = () => {
    if (sepClass.includes("first-page")) {
      setSepClass("full-page sec-page");
    } else if (sepClass.includes("sec-page")) {
      setSepClass("full-page first-page");
    }
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
        <Calendar />
        <div className="play-btn">
          <div className="shine"></div>
          <FontAwesomeIcon icon={faPlay} className="play-ico" />
          PLAY
        </div>
        <div className="WLT">
          20 W / 17 L / 370 T
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
          <div className="spread">
            
          </div>
        </div>
      </div>
    </>
  )
}

export default Landing
