import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Login from './pages/login.jsx'
import Landing from './pages/landing.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'></link>
      <link href='https://fonts.googleapis.com/css?family=Dancing+Script' rel='stylesheet'></link>
      <Landing />
    </>
  )
}

export default App
