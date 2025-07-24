import { Link } from 'react-router-dom'
import { cln, getGameVersion, formatDate } from '../utils/utils'
import * as Fa from 'react-icons/fa'
import type { Game } from './gamesNew'

interface GameItemContentProps {
    game: Game
    index: number
    onImageLoad?: () => void
}

const GameItemContent = ({ game, index, onImageLoad }: GameItemContentProps) => {
    return (
        <Link 
            className={cln({ game: 1, ht: game.handTranslation == 1, ce: game.completeEdited == 1 })}
            to={`/game/${game.shortcut}`}
            aria-label={`Detail hry ${game.name}`}
        >
            <img
                className={cln({ gameImg: 1, loaded: game.loaded })}
                style={{ opacity: game.loaded ? 1 : 0, transition: 'opacity 0.5s ease' }}
                src={`https://komunitni-preklady.org/img/hry/${game.shortcut}.webp?v${game.imgCount || 0}`}
                alt={`${game.name} čeština`}
                onLoad={onImageLoad}
                onError={(e: any) => (e.target.src = "https://komunitni-preklady.org/img/hry/bez-obrazku.png?v1")}
            />
            <div className='gameInfo'>
                <div className="gameName">{game.name}</div>
                <div className="gameNumDl">
                    v{getGameVersion(game?.version || "") || "?"} <Fa.FaDownload /> {game.numDl}x
                </div>
                <div className="gameDate">
                    <span title="Změněno">{game.changed ? formatDate(game.changed) : "-"}</span> 
                    <span> / </span>
                    <span title="Přidáno">{game.added ? formatDate(game.added) : "-"}</span> 
                </div>
                <div className="gameAutor">
                    {game.autors ? game.autors.split(",")?.[0] : ""}
                </div>
            </div>
        </Link>
    )
}

export default GameItemContent
