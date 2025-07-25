import type { ReactNode } from 'react'
import { forwardRef, useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { Spin, Alert } from 'antd'
import { VirtuosoGrid } from 'react-virtuoso';

import { If } from './If'
import '../styles/Games.scss'
import FilterBar, { stat } from './FilterBar'
import { useGamesStore } from '../stores/gamesStore'
import GameItemContent from './GameItemContent'
import type { Game } from '../types/types'

const collator = new Intl.Collator('cs', { sensitivity: 'variant', caseFirst: 'upper' });

const sortFn = [
    (a: Game, b: Game) => collator.compare(a.name || "", b.name || ""),
    (a: Game, b: Game) => collator.compare(b.name || "", a.name || ""),
    (a: Game, b: Game) => (b.numDl ? 1 : 0) - (a.numDl ? 1 : 0),
    (a: Game, b: Game) => (b.changed?.getTime() || 0) - (a.changed?.getTime() || 0),
    (a: Game, b: Game) => (b.added?.getTime() || 0) - (a.added?.getTime() || 0),
];

const Games: React.FC = () => {
    const stats = useSnapshot(stat);
    const { games, isLoading, error } = useGamesStore();

    useEffect(() => {
        stat.games = [...games];
        stat.loading = isLoading;
        if (!isLoading) {
            filterGames();
        }
    }, [games, isLoading]);

    const gridComponents = {
        List: forwardRef<HTMLDivElement, { style?: React.CSSProperties, children?: ReactNode }>(({ style, children, ...props }, ref) => (
            <div
                ref={ref}
                className="gameFlex"
                {...props}
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "0.5rem",
                    margin: "0.5rem",
                    ...style,
                }}
            >
                {children}
            </div>
        )),
        Item: ({ children }: { children?: ReactNode }) => children
    }

    const filterGames = () => {
        const searchLower = stat.search.toLowerCase();

        const filtered = games.filter((game: Game) => {
            return (
                (stat.category === 0 || game.category === stat.category)
                && game.version !== "" && game.name !== ""
                && (stat.size === 0 || game.size === stat.size)
                && (stat.transType === 0 || game.translationType === stat.transType)
                && (stat.search === "" || game.name.toLowerCase().includes(searchLower))
            )
        });

        filtered.sort(sortFn[stat.sort]);
        stat.games = filtered;
    }

    return (
        <div className="games">
            <FilterBar
                onFilter={filterGames}
                gamesCount={stats.games.length}
                loading={stats.loading}
            />
            <If is={stats.loading}>
                <div className="loading-spinner">
                    <Spin size="large" />
                </div>
            </If>
            <If is={error}>
                <Alert
                    message="Error"
                    description={error?.message}
                    type="error"
                    className="game-detail__error"
                />
            </If>
            <If is={!error}>
                <div className="gameList">
                    <VirtuosoGrid
                        style={{
                            height: "100%",
                            width: "100%",
                            flex: "1 1 auto",
                            minHeight: "0"
                        }}
                        totalCount={stats.games.length}
                        components={gridComponents}
                        itemContent={(i) => {
                            const game = stats.games[i] as Game;
                            return (
                                <GameItemContent
                                    game={game}
                                    index={i}
                                    onImageLoad={() => {
                                        const updatedGames = [...stat.games];
                                        updatedGames[i] = { ...updatedGames[i], loaded: true };
                                        stat.games = updatedGames;
                                    }}
                                />
                            )
                        }}
                    />
                </div>
            </If>
        </div>
    )
}

export default Games;