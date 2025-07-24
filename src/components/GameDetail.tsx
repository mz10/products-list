import '../styles/GameDetail.scss'
import { useParams } from 'react-router-dom'
import { Spin, Alert } from 'antd'
import { useGamesStore } from '../stores/gamesStore'
import type { Game } from '../types/game'
import { formatDate, getGameVersion } from '../utils/utils'
import { interestObj, translationType, category } from '../constants'
import { If } from './If'

export default function GameDetail() {
  const { shortcut } = useParams()
  const { games, isLoading, error } = useGamesStore()
  const game = games?.find((g: Game) => g.shortcut === shortcut)

  if (isLoading) {
    return <div className="game-detail__loading"><Spin size="large" /></div>
  }

  if (error) {
    return (
    <div className="game-detail light-theme">
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
    <div className="game-detail light-theme">
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
    <div className="game-detail light-theme">
      <div className="game-card">
        <h1 className="game-title">{game.name}</h1>
        <div className="details-section">
          <ul className="details-list">
            <If is={game.category} and={category[game.category]}>
              <li className="detail-item">
                <span className="detail-label">Žánr:</span> 
                <span className="detail-value">{category[game.category]}</span>
              </li>
            </If>
            <If is={game.autors}>
              <li className="detail-item">
                <span className="detail-label">Autoři:</span> 
                <span className="detail-value">{game.autors}</span>
              </li>
            </If>
            <If is={game.version}>
              <li className="detail-item">
                <span className="detail-label">Verze:</span> 
                <span className="detail-value">{game.version ? getGameVersion(game.version) : ''}</span>
              </li>
            </If>
            <If is={game.numDl}>
              <li className="detail-item">
                <span className="detail-label">Počet stažení:</span> 
                <span className="detail-value">{game.numDl?.toLocaleString()}x</span>
              </li>
            </If>
            <If is={game.changed}>
              <li className="detail-item">
                <span className="detail-label">Změněno:</span> 
                <span className="detail-value">{game.changed ? formatDate(game.changed) : ''}</span>
              </li>
            </If>
            <If is={game.added}>
              <li className="detail-item">
                <span className="detail-label">Přidáno:</span> 
                <span className="detail-value">{game.added ? formatDate(game.added) : ''}</span>
              </li>
            </If>
            <If is={game.size}>
              <li className="detail-item">
                <span className="detail-label">Velikost hry:</span> 
                <span className="detail-value">{
                  Object.keys(interestObj).find(key =>
                    interestObj[key as keyof typeof interestObj] === game.size
                  ) || "-"
                }</span>
              </li>
            </If>
            <If is={game.translationType}>
              <li className="detail-item">
                <span className="detail-label">Kvalita překladu:</span>
                <span className="detail-value">{
                  Object.entries(translationType).find(([_, value]) => 
                    value === game.translationType
                  )?.[0] || "-"
                }</span>
              </li>
            </If>
          </ul>
        </div>
      </div>
    </div>
  )
}
