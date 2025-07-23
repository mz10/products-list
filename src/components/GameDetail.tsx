import { useParams } from 'react-router-dom'
import './GameDetail.css'

interface Game {
  shortcut: string
  name: string
  version?: string
  numDl?: number
  changed?: { dmy: string }
  added?: { dmy: string }
  autors?: string
  imgCount?: number
}

export default function GameDetail() {
  const { shortcut } = useParams()
  const game: Game | undefined = (window as any).gamesData?.find(
    (g: Game) => g.shortcut === shortcut
  )

  if (!game) {
    return <div>Game not found</div>
  }

  // Generate some fictional details
  const fictionalDetails = {
    releaseDate: '2023-11-15',
    rating: 4.5,
    players: '1-4',
    playtime: '30-60 minutes',
    designer: 'John Smith',
    publisher: 'BoardGame Co.'
  }

  return (
    <div className="game-detail">
      <h1>{game.name}</h1>
      <img 
        src={`/img/hry/${game.shortcut}.webp?v${game.imgCount || 0}`} 
        alt={game.name}
        onError={(e: any) => (e.target.src = "/img/hry/bez-obrazku.png?v1")}
      />
      {game.autors && <p>Autor: {game.autors}</p>}
      {game.version && <p>Verze: {game.version}</p>}
      {game.numDl && <p>Stažení: {game.numDl}x</p>}
      
      <div className="details-section">
        <h2>Game Details</h2>
        <ul>
          <li><strong>Release Date:</strong> {fictionalDetails.releaseDate}</li>
          <li><strong>Rating:</strong> {fictionalDetails.rating}/5</li>
          <li><strong>Players:</strong> {fictionalDetails.players}</li>
          <li><strong>Playtime:</strong> {fictionalDetails.playtime}</li>
          <li><strong>Designer:</strong> {fictionalDetails.designer}</li>
          <li><strong>Publisher:</strong> {fictionalDetails.publisher}</li>
        </ul>
      </div>
    </div>
  )
}
