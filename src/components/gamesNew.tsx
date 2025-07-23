import '../styles/games.scss'
import type { ReactNode } from 'react'
import { forwardRef, useEffect } from 'react'
import { proxy, useSnapshot } from 'valtio'
import { Dropdown, Button, Input, Spin } from 'antd'
import { Link } from 'react-router-dom'
//import { If } from './If'
import { category, gameSorting, interest, interestObj, translationType } from '../constants';
import { cln, getGameVersion } from '../utils/utils';
import { VirtuosoGrid } from 'react-virtuoso';
import * as Fa from 'react-icons/fa';

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
        (a: Game, b: Game) => (a.name || "").localeCompare(b.name || "", "cs", { sensitivity: 'variant', caseFirst: 'upper' }),
        (b: Game, a: Game) => (a.name || "").localeCompare(b.name || "", "cs", { sensitivity: 'variant', caseFirst: 'upper' })
    ]
});

const Games: React.FC = () => {
    const stats = useSnapshot(state);

    useEffect(() => {
        const loadGames = async () => {
            try {
                const response = await fetch('/games.json');
                if (!response.ok) throw new Error('Failed to load games');
                const gamesData = await response.json();
                state.games = gamesData;
            } catch (error) {
                console.error('Error loading games:', error);
            } finally {
                state.loading = false;
            }
        };

        loadGames();
    }, []);

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

    const createMenuItems = (items: any[], keyPrefix: string, onClick: (value: any) => void): MenuItem[] => {
        return items.map((item, index) => ({
            key: `${keyPrefix}-${index}`,
            label: typeof item === 'string' ? item : item.toString(),
            onClick: () => onClick(index)
        }));
    };

    const sortingMenu = createMenuItems(gameSorting, 'sort', (i) => {
        state.sort = i;
        localStorage.gameSort = i;
        filterGames(1);
    });

    const categoryMenu = createMenuItems(category, 'category', (i) => {
        state.category = i;
        filterGames(1);
    });

    const sizeGameMenu = createMenuItems(Object.values(interestObj), 'size', (num) => {
        state.size = num;
        filterGames(1);
    });


    const transTypeMenu = createMenuItems(Object.values(translationType), 'trans', (num) => {
        state.transType = num;
        filterGames(1);
    });

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

    }

    return (
        <div className="games">
            <div className="filterBar">
                <span className="gameBar">
                    <Dropdown menu={{ items: sortingMenu }} trigger={['click']}>
                        <Button>Řazení</Button>
                    </Dropdown>
                    <Dropdown menu={{ items: categoryMenu }} trigger={['click']}>
                        <Button>Žánr</Button>
                    </Dropdown>
                    <Dropdown menu={{ items: sizeGameMenu }} trigger={['click']}>
                        <Button>Velikost</Button>
                    </Dropdown>
                    <Dropdown menu={{ items: transTypeMenu }} trigger={['click']}>
                        <Button>Kvalita</Button>
                    </Dropdown>

                    <Button onClick={resetFilters}>Reset</Button>

                    <Input
                        placeholder="Hledat"
                        className="gameSearch"
                        onChange={(e) => {
                            state.search = e.target.value;
                            filterGames(1);
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
                                <Link className={cln({ game: 1, ht: game.handTranslation == 1, ce: game.completeEdited == 1 })}
                                    to={`/game/${game.shortcut}`}
                                    aria-label={`Detail hry ${game.name}`}
                                >
                                    <img
                                        className={cln({ gameImg: 1, loaded: game.loaded })}

                                        src={`https://komunitni-preklady.org/img/hry/${game.shortcut}.webp?v${game.imgCount || 0}`}
                                        alt={`${game.name} čeština ke stažení - download`}
                                        onLoad={(e: any) => state.games[i].loaded = true}
                                        onError={(e: any) => (e.target.src = "https://komunitni-preklady.org/img/hry/bez-obrazku.png?v1")}
                                    />
                                    <div className='gameInfo'>
                                        <div className="gameName">{game.name}</div>
                                        <div className="gameNumDl">
                                            v{getGameVersion(game?.version || "") || "?"} <Fa.FaDownload /> {game.numDl}x
                                        </div>
                                        <div className="gameDate">
                                            <span title="Změněno">{game.changed ? new Date(game.changed).toLocaleDateString([], { weekday: 'long' }) : "-"}</span> 
                                            <span> / </span>
                                            <span title="Přidáno">{game.added ? new Date(game.added).toLocaleDateString([], { weekday: 'long' }) : "-"}</span> 
                                        </div>
                                        <div className="gameAutor">
                                            {game.autors ? game.autors.split(",")?.[0] : ""}
                                        </div>
                                    </div>

                                </Link>
                            )
                        }}
                    />
                </div>
            )}



        </div>
    )
}

export default Games;
