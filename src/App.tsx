import './styles/App.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GameDetail from './components/GameDetail'
import Games from './components/Games'

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
