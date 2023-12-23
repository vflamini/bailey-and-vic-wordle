import { useState } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet
} from "react-router-dom";
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import Login from './pages/login.jsx';
import Landing from './pages/landing.jsx';
import Wordle from './pages/wordle.jsx';

function App() {
  const [count, setCount] = useState(0)
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Login />} />
        <Route path="landing" element={<Landing />} />
        <Route path="wordle" element={<Wordle />} />
      </>
    )
  );

  return (
    <>
      <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'></link>
      <link href='https://fonts.googleapis.com/css?family=Dancing+Script' rel='stylesheet'></link>
      <RouterProvider router={router}>
        <Outlet />
      </RouterProvider>
    </>
  )
}

export default App
