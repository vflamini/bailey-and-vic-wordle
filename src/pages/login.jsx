import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ip } from '../config/ip';
import '../css/login.css';

function Login() {
  const [wordleAnimationClass, setWordleAnimationClass] = useState('');
  const [withAnimationClass, setWithAnimationClass] = useState('');
  const [showPasswordEnter, setShowPasswordEnter] = useState(false);
  const [createPasswordEnter, setCreatePasswordEnter] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [passValue, setPassValue] = useState("");
  const [showIncorrectPass, setShowIncorrectPass] = useState(false);

  const navigate = useNavigate();

  const handlePassChange = (event) => {
    setPassValue(event.target.value);
  }

  const hasPassword = async (playerName) => {
    try {
      const response = await fetch(ip + `/api/get/players/player_name/${playerName}`);
      const data = await response.json();
      return data[0].password !== null && data[0].password !== "";
    } catch {
      return false;
    }
  }

  const handleCreatePassword = async () => {
    const success = await createPassword();
    console.log(success);
  }

  const handleLogin = async() => {
    const success = await authenticateUser();
    console.log(success);
  }

  const createPassword = async () => {
    try {
      const response = await fetch(ip + `/api/password/${passValue}/${selectedPlayer}`, {method: 'POST'});
      const data = await response.json();
      setCreatePasswordEnter(false);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  const authenticateUser = async () => {
    try {
      const response = await fetch(ip + `/api/login/${passValue}/${selectedPlayer}`);
      const data = await response.json();
      if (data.authenticated) {
        navigate('/landing', {state: {playerName: selectedPlayer}})
      } else {
        setShowIncorrectPass(true);
      }
      setShowPasswordEnter(false);
      setPassValue("");
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  const logPlayerIn = async (event) => {
    const playerName = event.target.innerText;
    setSelectedPlayer(playerName);
    if (await hasPassword(playerName)) {
      setShowPasswordEnter(true);
    } else {
      setCreatePasswordEnter(true);
    }
  }

  useEffect(() => {
    // Add the animation class after the component mounts
    setWordleAnimationClass('wordleFadeInAnimation');
    setWithAnimationClass('withFadeInAnimation');
  }, []); // Empty dependency array means this effect runs once after the initial render
  return (
    <>
    {showIncorrectPass && (
        <div className="password-overlay">
          <div className="incorrect-content">
            <div>INCORRECT PASSWORD</div>
            <div className="btns">
              <div className="close-pass btn" onClick={() => setShowIncorrectPass(false)}>CLOSE</div>
            </div>
          </div>
        </div>
      )}
      {showPasswordEnter && (
        <div className="password-overlay">
          <div className="password-content">
            <label htmlFor="password">ENTER PASSWORD:</label>
            <input type="password" id="password" value={passValue} onChange={handlePassChange}></input>
            <div className="btns">
              <div className="enter btn" onClick={handleLogin}>ENTER</div>
              <div className="close-pass btn" onClick={() => setShowPasswordEnter(false)}>CLOSE</div>
            </div>
          </div>
        </div>
      )}
      {createPasswordEnter && (
        <div className="password-overlay">
          <div className="password-content">
            <label htmlFor="password">ENTER PASSWORD:</label>
            <input type="password" id="password" value={passValue} onChange={handlePassChange}></input>
            <div className="btns">
              <div className="enter btn" onClick={handleCreatePassword}>CREATE</div>
              <div className="close-pass btn" onClick={() => setCreatePasswordEnter(false)}>CLOSE</div>
            </div>
          </div>
        </div>
      )}
      <div className="main-title">
        <h1 style={{fontFamily: "Roboto", fontSize: "50px", opacity: "0"}} className={`${wordleAnimationClass}`}>WORDLE</h1>
        <br></br>
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
        <div className={"login-button bailey-button"} onClick={logPlayerIn}>
          Bailey
        </div>
        <div className={"login-button vic-button"} onClick={logPlayerIn}>
          Vic
        </div>
      </div>
    </>
  )
}

export default Login
