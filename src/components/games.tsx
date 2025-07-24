import '../styles/Games.scss'
import type { ReactNode } from 'react'
import { forwardRef, useEffect } from 'react'
import { proxy, useSnapshot } from 'valtio'
import { useGamesStore } from '../stores/gamesStore'
import { Dropdown, Button, Input, Spin } from 'antd'
import GameItemContent from './GameItemContent'
import { category, gameSorting, interestObj, translationType } from '../constants';
import { VirtuosoGrid } from 'react-virtuoso';
import type { Game } from '../types/game'

const collator = new Intl.Collator('cs', { sensitivity: 'variant', caseFirst: 'upper' });

const state = proxy({
    games: [] as Game[],
    loading: true,
    dynamicFilters: [],
    sort: 0,
    search: "",
    type: 0,
    category: 0,
    size: 0,
    team: 0,
    transType: 0,
    hidden: 0,
    hideFilters: false,
    filtersOpen: false,
    sortFn: [
        (a: Game, b: Game) => collator.compare(a.name || "", b.name || ""),
        (a: Game, b: Game) => collator.compare(b.name || "", a.name || ""),
        (a: Game, b: Game) => (b.numDl ? 1 : 0) - (a.numDl ? 1 : 0),
        (a: Game, b: Game) => (b.changed?.getTime() || 0) - (a.changed?.getTime() || 0),
        (a: Game, b: Game) => (b.added?.getTime() || 0) - (a.added?.getTime() || 0),
    ]
});

const Games: React.FC = () => {
    const stats = useSnapshot(state);
    const { games, isLoading } = useGamesStore();

    useEffect(() => {
        state.games = [...games];
        state.loading = isLoading;
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
        Object.entries(translationType).map(([key,]) => key),
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
        state.type = 0;
        state.category = 0;
        state.size = 0;
        state.team = 0;
        state.transType = 0;
        state.hidden = 0;
        filterGames();
    };

    const filterGames = () => {
        const searchLower = state.search.toLowerCase();
        const filtered = games.filter((game: Game) => {
            let res = true;
            res = res && (state.category === 0 || game.category === state.category);
            res = res && (state.size === 0 || game.size === state.size);
            res = res && (state.transType === 0 || state.transType > 0 && game.translationType === state.transType);
            res = res && (state.search === "" || game.name.toLowerCase().includes(searchLower));
            return res;
        });
        filtered.sort(state.sortFn[state.sort]);
        state.games = filtered;
    }

    return (
        <div className="games">
            <div className="filterBar">
                <span className="gameBar">
                    <Dropdown menu={{ items: sortingMenu }} trigger={['click']}>
                        <Button style={stats.sort > 0 ? { fontWeight: 'bold', background: '#f0f0f0' } : {}}>
                            Řazení
                        </Button>
                    </Dropdown>
                    <Dropdown menu={{ items: categoryMenu }} trigger={['click']}>
                        <Button style={stats.category > 0 ? { fontWeight: 'bold', background: '#f0f0f0' } : {}}>
                            Žánr
                        </Button>
                    </Dropdown>
                    <Dropdown menu={{ items: sizeGameMenu }} trigger={['click']}>
                        <Button style={stats.size > 0 ? { fontWeight: 'bold', background: '#f0f0f0' } : {}}>
                            Velikost
                        </Button>
                    </Dropdown>
                    <Dropdown menu={{ items: transTypeMenu }} trigger={['click']}>
                        <Button style={stats.transType > 0 ? { fontWeight: 'bold', background: '#f0f0f0' } : {}}>
                            Kvalita
                        </Button>
                    </Dropdown>
                    <Button onClick={resetFilters}>Reset</Button>
                    <Input
                        placeholder="Hledat"
                        className="gameSearch"
                        value={state.search}
                        onChange={(e) => {
                            state.search = e.target.value;
                            filterGames();
                        }}
                        allowClear
                    />
                </span>
                <span className="rightBar">
                    {!stats.loading && (
                        <div className="gameCount">Zobrazeno {stats.games.length} překladů</div>
                    )}
                </span>
            </div>
            {stats.loading ? (
                <div className="loading-spinner">
                    <Spin size="large" />
                </div>
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
                                    onImageLoad={() => state.games[i].loaded = true}
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
