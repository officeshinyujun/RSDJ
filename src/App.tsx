import MainPage from "./page/mainPage/mainPage.tsx";
import StartPage from "./page/startPage/startPage.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import EndPage from "./page/endPage/endPage.tsx";
import styles from "./index.module.scss"


function App() {

  return (
      <div style={styles}>
          <BrowserRouter>
              <Routes>
                  <Route path="/" element={<StartPage/>}/>
                  <Route path="/ingame" element={<MainPage/>}/>
                  <Route path="/end" element={<EndPage/>}/>
              </Routes>
          </BrowserRouter>
      </div>
  )
}

export default App
