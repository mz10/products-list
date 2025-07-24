import '../styles/GameDetail.scss'
import { useParams } from 'react-router-dom'
import { Spin, Alert } from 'antd'
import { useGamesStore } from '../stores/gamesStore'
import type { Game } from '../types/game'
import { interest } from '../constants'
import { formatDate } from '../utils/utils'

export default function GameDetail() {
  const { shortcut } = useParams()
  const { games, isLoading, error } = useGamesStore()
  const game = games?.find((g: Game) => g.shortcut === shortcut)

  if (isLoading) {
    return <div className="game-detail__loading"><Spin size="large" /></div>
  }

  if (error) {
    return (
      <div className="game-detail">
        <Alert 
          message="Error"
          description={error.message}
          type="error"
          className="game-detail__error"
        />
      </div>
    )
  }

  if (!game) {
    return (
      <div className="game-detail">
        <Alert 
          message="Not Found" 
          description="The requested game was not found"
          type="warning"
          className="game-detail__error"
        />
      </div>
    )
  }
  
  return (
    <div className="game-detail">
      <h1>{game.name}</h1>
      <div className="details-section">
        <ul>
          {game.autors && <li><strong>Autoři:</strong> {game.autors}</li>}
          {game.version && <li><strong>Verze:</strong> {game.version}</li>}
          {game.numDl && <li><strong>Počet stažení:</strong> {game.numDl}x</li>}
          {game.changed && <li><strong>Poslední změna:</strong> {String(game.changed)}</li>}
          {game.added && <li><strong>Přidáno:</strong> {String(game.added)}</li>}
          {game.rank !== undefined && <li><strong>Velikost:</strong> {interest[game.rank] || game.rank}</li>}
          {game.handTranslation && <li><strong>Kvalita překladu:</strong> {game.handTranslation ? 'Ruční' : 'Automatický'}</li>}
          {game.completeEdited && <li><strong>Kompletní editace:</strong> {game.completeEdited ? 'Ano' : 'Ne'}</li>}
        </ul>
      </div>
    </div>
  )
}
