import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import MainPage from "./page/mainPage/mainPage.tsx";
import StartPage from "./page/startPage/startPage.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import EndPage from "./page/endPage/endPage.tsx";

function App() {

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<StartPage/>}/>
            <Route path="/ingame" element={<MainPage/>}/>
            <Route path="/end" element={<EndPage/>}/>
        </Routes>
    </BrowserRouter>
  )
}

export default App
