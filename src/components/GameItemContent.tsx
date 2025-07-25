import { Link } from 'react-router-dom'

import { cln, getGameVersion, formatDate } from '../utils/utils'
import * as Fa from 'react-icons/fa'
import type { Game } from '../types/types'

interface GameItemContentProps {
    game: Game
    index: number
    onImageLoad?: () => void
}

const GameItemContent = ({ game, onImageLoad }: GameItemContentProps) => {
    return (
        <Link 
            className={cln({ game: 1 })}
            to={`/game/${game.shortcut}`}
            aria-label={`Detail hry ${game.name}`}
        >
            <img
                className={cln({ gameImg: 1, loaded: game.loaded })}
                src={`https://komunitni-preklady.org/img/hry/${game.shortcut}.webp?v${game.imgCount || 0}`}
                alt={`${game.name} čeština`}
                onLoad={onImageLoad}
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/no-img.png?v1";
                }}
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