import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Test from './components/Test'
import GameDetail from './components/GameDetail'
import Games from './components/gamesNew'
//import Games from './components/games'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Games/>} />
        <Route path="/game/:shortcut" element={<GameDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
