import '../styles/games.scss'
import type { ReactNode } from 'react'
import { forwardRef, useEffect } from 'react'
import { proxy, useSnapshot } from 'valtio'
import { useQuery } from '@tanstack/react-query'
import { Dropdown, Button, Input, Spin } from 'antd'
import { Link } from 'react-router-dom'
import GameItemContent from './GameItemContent'
//import { If } from './If'
import { category, gameSorting, interest, interestObj, translationType } from '../constants';
import { cln, getGameVersion } from '../utils/utils';
import { VirtuosoGrid } from 'react-virtuoso';
import * as Fa from 'react-icons/fa';

export interface Game {
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

const state = proxy({
    games: [] as Game[],
    loading: true,
    dynamicFilters: [],
    sort: +localStorage.gameSort || 1,
    search: "",
    type: 0,
    category: 0,
    size: 0,
    team: 0,
    transType: 0,
    hidden: 0,
    o18: false,
    hideFilters: false,
    filtersOpen: false,
    sortFn: [
        (a: Game, b: Game) => (a.rank || 0) - (b.rank || 0),
        (a: Game, b: Game) => (b.numDl || 0) - (a.numDl || 0),
        (a: Game, b: Game) => ((b.changed as any) || 0) - ((a.changed as any) || 0),
        (a: Game, b: Game) => (b.added as any) - (a.added as any),
        (a: Game, b: Game) => (a.rank || 0) - (b.rank || 0),
        (() => {
            const collator = new Intl.Collator('cs', { sensitivity: 'variant', caseFirst: 'upper' });
            return (a: Game, b: Game) => collator.compare(a.name || "", b.name || "");
        })(),
        (() => {
            const collator = new Intl.Collator('cs', { sensitivity: 'variant', caseFirst: 'upper' });
            return (a: Game, b: Game) => collator.compare(b.name || "", a.name || "");
        })()
    ]
});

const Games: React.FC = () => {
    const stats = useSnapshot(state);

    const { data: gamesData, isLoading } = useQuery<Game[]>({
        queryKey: ['games'],
        queryFn: async () => {
            const response = await fetch('/games.json');
            if (!response.ok) throw new Error('Failed to load games');
            return response.json();
        }
    });

    useEffect(() => {
        if (gamesData) {
            state.games = gamesData;
        }
    }, [gamesData]);

    useEffect(() => {
        state.loading = isLoading;
    }, [isLoading]);

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

    const createMenuItems = (items: any[], keyPrefix: string, currentValue: number, onClick: (value: any) => void): MenuItem[] => {
        return items.map((item, index) => ({
            key: `${keyPrefix}-${index}`,
            label: typeof item === 'string' ? item : item.toString(),
            onClick: () => onClick(index),
            style: currentValue === index ? { 
                backgroundColor: '#f0f0f0',
                fontWeight: 'bold'
            } : {}
        }));
    };

    const sortingMenu = createMenuItems(gameSorting, 'sort', stats.sort, (i: number) => {
        state.sort = i;
        localStorage.gameSort = i;
        filterGames(1);
    });

    const categoryMenu = createMenuItems(category, 'category', stats.category, (i: number) => {
        state.category = i;
        filterGames(1);
    });

    const sizeGameMenu = createMenuItems(
        Object.entries(interestObj).map(([key, value]) => `${key} (${value})`), 
        'size',
        stats.size,
        (num: number) => {
            state.size = num;
            filterGames(1);
        }
    );

    const transTypeMenu = createMenuItems(
        Object.entries(translationType).map(([key, value]) => `${key} (${value})`),
        'trans',
        stats.transType,
        (num: number) => {
            state.transType = num;
            filterGames(1);
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
        state.o18 = false;
        localStorage.gameSort = 1;
        filterGames(1);
    };

    const addFilter = () => {
        state.filtersOpen = !state.filtersOpen;
    };

    const filterGames = (filterFn: any) => {
        // Reset to all games first
        const allGames = (window as any).gamesData || [];
        
        const filtered = allGames.filter((game: Game) => {
            // Search by name
            if (state.search && !game.name?.toLowerCase().includes(state.search.toLowerCase())) {
                return false;
            }

            // Filter by category (0-based index)
            if (state.category > 0 && game.autor !== state.category - 1) {
                return false;
            }

            // Filter by size (0-based index)
            if (state.size > 0 && game.rank !== state.size - 1) {
                return false;
            }

            // Filter by quality (0-based index)
            if (state.transType > 0 && game.handTranslation !== state.transType - 1) {
                return false;
            }

            return true;
        });

        // Apply sorting
        filtered.sort(state.sortFn[state.sort]);
        state.games = filtered;
    }

    return (
        <div className="games">
            <div className="filterBar">
                <span className="gameBar">
                    <Dropdown menu={{ items: sortingMenu }} trigger={['click']}>
                        <Button style={stats.sort > 0 ? { fontWeight: 'bold', background: '#f0f0f0' } : {}}>
                            {stats.sort > 0 ? `${gameSorting[stats.sort]}` : 'Řazení'}
                        </Button>
                    </Dropdown>
                    <Dropdown menu={{ items: categoryMenu }} trigger={['click']}>
                        <Button style={stats.category > 0 ? { fontWeight: 'bold', background: '#f0f0f0' } : {}}>
                            {stats.category > 0 ? `${category[stats.category]}` : 'Žánr'}
                        </Button>
                    </Dropdown>
                    <Dropdown menu={{ items: sizeGameMenu }} trigger={['click']}>
                        <Button style={stats.size > 0 ? { fontWeight: 'bold', background: '#f0f0f0' } : {}}>
                            {stats.size > 0 ? `${Object.keys(interestObj)[stats.size-1]}` : 'Velikost'}
                        </Button>
                    </Dropdown>
                    <Dropdown menu={{ items: transTypeMenu }} trigger={['click']}>
                        <Button style={stats.transType > 0 ? { fontWeight: 'bold', background: '#f0f0f0' } : {}}>
                            {stats.transType > 0 ? `${Object.keys(translationType)[stats.transType-1]}` : 'Kvalita'}
                        </Button>
                    </Dropdown>

                    <Button onClick={resetFilters}>Reset</Button>

                    <Input
                        placeholder="Hledat"
                        className="gameSearch"
                        value={state.search}
                        onChange={(e) => {
                            state.search = e.target.value;
                            filterGames(1);
                        }}
                        onPressEnter={() => filterGames(1)}
                        allowClear={{
                            clearIcon: <span onClick={() => {
                                state.search = "";
                                filterGames(1);
                            }}>✕</span>
                        }}
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
