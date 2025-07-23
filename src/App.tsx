import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Games from './components/games'
import GameDetail from './components/GameDetail'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Games />} />
        <Route path="/game/:shortcut" element={<GameDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
