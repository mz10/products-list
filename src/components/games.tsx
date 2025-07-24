import '../styles/Games.scss'
import type { ReactNode } from 'react'
import { forwardRef, useEffect } from 'react'
import { useSnapshot } from 'valtio'
import FilterBar, { state } from './FilterBar'
import { useGamesStore } from '../stores/gamesStore'
import { Dropdown, Button, Input, Spin, Alert } from 'antd'
import GameItemContent from './GameItemContent'
import { category, gameSorting, interestObj, translationType } from '../constants';
import { VirtuosoGrid } from 'react-virtuoso';
import type { Game } from '../types/game'

const collator = new Intl.Collator('cs', { sensitivity: 'variant', caseFirst: 'upper' });

const sortFn = [
    (a: Game, b: Game) => collator.compare(a.name || "", b.name || ""),
    (a: Game, b: Game) => collator.compare(b.name || "", a.name || ""),
    (a: Game, b: Game) => (b.numDl ? 1 : 0) - (a.numDl ? 1 : 0),
    (a: Game, b: Game) => (b.changed?.getTime() || 0) - (a.changed?.getTime() || 0),
    (a: Game, b: Game) => (b.added?.getTime() || 0) - (a.added?.getTime() || 0),
];

const Games: React.FC = () => {
    const stats = useSnapshot(state);
    const { games, isLoading, error } = useGamesStore();

    useEffect(() => {
        state.games = [...games];
        state.loading = isLoading;
        if (!isLoading) {
            filterGames();
        }
    }, [games, isLoading]);

    const gridComponents = {
        List: forwardRef<HTMLDivElement, { style?: React.CSSProperties, children?: ReactNode }>(({ style, children, ...props }, ref) => (
            <div
                ref={ref as any}
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
        Item: ({ children, ...props }: { children?: ReactNode }) => children
    }

    type MenuItem = {
        key: string;
        label: string;
        onClick: () => void;
    };

    const createMenuItems = (items: any[], keyPrefix: string, currentValue: number, onClick: (value: any, item: any) => void): MenuItem[] => {
        return items.map((item, index) => ({
            key: `${keyPrefix}-${index}`,
            label: typeof item === 'string' ? item : item.toString(),
            onClick: () => onClick(index, item),
            style: currentValue === index ? {
                backgroundColor: '#f0f0f0',
                fontWeight: 'bold'
            } : {}
        }));
    };

    const sortingMenu = createMenuItems(gameSorting, 'sort', stats.sort, (i: number) => {
        state.sort = i;
        filterGames();
    });

    const categoryMenu = createMenuItems(category, 'category', stats.category, (i: number) => {
        state.category = i;
        filterGames();
    });

    const sizeGameMenu = createMenuItems(
        Object.entries(interestObj).map(([key, val]) => key),
        'size',
        stats.size,
        (num: number, item: keyof typeof interestObj) => {
            state.size = interestObj[item];
            filterGames();
        }
    );

    const transTypeMenu = createMenuItems(
        Object.entries(translationType).map(([key, value]) => `${key} (${value})`),
        'trans', 
        stats.transType,
        (num: number, item: any) => {
            state.transType = num;
            filterGames();
        }
    );

    const resetFilters = () => {
        state.sort = 1;
        state.search = "";
        state.category = 0;
        state.size = 0;
        state.transType = 0;
        filterGames();
    };

    const filterGames = () => {
        const searchLower = state.search.toLowerCase();

        const filtered = games.filter((game: Game) => {
            return (
                (state.category === 0 || game.category === state.category)
                && game.version !== "" && game.name !== ""
                && (state.size === 0 || game.size === state.size)
                && (state.transType === 0 || game.translationType === state.transType)
                && (state.search === "" || game.name.toLowerCase().includes(searchLower))
            )
        });

        filtered.sort(sortFn[state.sort]);
        state.games = filtered;
    }

    return (
        <div className="games">
            <FilterBar 
                onFilter={filterGames}
                gamesCount={stats.games.length}
                loading={stats.loading}
            />
            {stats.loading ? (
                <div className="loading-spinner">
                    <Spin size="large" />
                </div>
            ) : error ? (
                <Alert
                    message="Error"
                    description={error.message}
                    type="error"
                    className="game-detail__error"
                />
            ) : (
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
                                        const updatedGames = [...state.games];
                                        updatedGames[i] = { ...updatedGames[i], loaded: true };
                                        state.games = updatedGames;
                                    }}
                                />
                            )
                        }}
                    />
                </div>
            )}
        </div>
    )
}

export default Games;
