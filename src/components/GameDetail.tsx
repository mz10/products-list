import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Spin } from 'antd'
import { proxy, useSnapshot } from 'valtio'
import './GameDetail.css'
import { interest } from '../constants'

interface Game {
    shortcut: string;
    name: string;
    loaded?: boolean;
    imgCount?: number;
    handTranslation?: number;
    completeEdited?: number;
    version?: string;
    numDl?: number;
    changed?: string;
    added?: string;
    autors?: string;
    autor?: number;
    rank?: number;
}

export default function GameDetail() {
  const { shortcut } = useParams()
  const state = proxy({
    game: null as Game | null,
    loading: true
  })
  const { game, loading } = useSnapshot(state)

  useEffect(() => {
    const loadGame = async () => {
      try {
        // Try to find in existing data first
        const existingGame = (window as any).gamesData?.find(
          (g: Game) => g.shortcut === shortcut
        )
        
        if (existingGame) {
          state.game = existingGame
          state.loading = false
          return
        }

        // If not found, load fresh data
        const response = await fetch('/games.json')
        if (!response.ok) {
          state.loading = false
          throw new Error('Failed to load games')
        }
        const gamesData = await response.json()
        const foundGame = gamesData.find((g: Game) => g.shortcut === shortcut)
        state.game = foundGame || null
      } catch (error) {
        console.error('Error loading game:', error)
      } finally {
        state.loading = false
      }
    }

    loadGame()
  }, [shortcut])

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spin size="large" />
      </div>
    )
  }

  if (!game) {
    return <div>Game not found</div>
  }

  const { formatDate } = (window as any).utils || {};

  return (
    <div className="game-detail">
      <h1>{game.name}</h1>
      <img 
        src={`/img/hry/${game.shortcut}.webp?v${game.imgCount || 0}`} 
        alt={game.name}
        onError={(e: any) => (e.target.src = "/img/hry/bez-obrazku.png?v1")}
      />
      <div className="details-section">
        <h2>Detaily hry</h2>
        <ul>
          {game.autors && <li><strong>Autoři:</strong> {game.autors}</li>}
          {game.version && <li><strong>Verze:</strong> {game.version}</li>}
          {game.numDl && <li><strong>Počet stažení:</strong> {game.numDl}x</li>}
          {game.changed && <li><strong>Poslední změna:</strong> {formatDate ? formatDate(game.changed) : game.changed}</li>}
          {game.added && <li><strong>Přidáno:</strong> {formatDate ? formatDate(game.added) : game.added}</li>}
          {game.rank !== undefined && <li><strong>Velikost:</strong> {interest[game.rank] || game.rank}</li>}
          {game.handTranslation && <li><strong>Kvalita překladu:</strong> {game.handTranslation === 1 ? 'Ruční' : 'Automatický'}</li>}
          {game.completeEdited && <li><strong>Kompletní editace:</strong> {game.completeEdited === 1 ? 'Ano' : 'Ne'}</li>}
        </ul>
      </div>
    </div>
  )
}
