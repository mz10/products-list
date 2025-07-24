import { Dropdown, Button, Input } from 'antd'
import type { MenuProps } from 'antd'
import { useSnapshot } from 'valtio'
import { proxy } from 'valtio'
import type { Game } from '../types/game'
import { category, gameSorting, interestObj, translationType } from '../constants'

export const state = proxy({
    games: [] as Game[],
    loading: true,
    sort: 0,
    search: "",
    category: 0,
    size: 0,
    transType: 0,
})

type FilterBarProps = {
    onFilter: () => void
    gamesCount: number
    loading: boolean
}

const FilterBar = ({ onFilter, gamesCount, loading }: FilterBarProps) => {
    const stats = useSnapshot(state)

    const createMenuItems = (items: any[], keyPrefix: string, currentValue: number, onClick: (value: any, item: any) => void): MenuProps['items'] => {
        return items.map((item, index) => ({
            key: `${keyPrefix}-${index}`,
            label: typeof item === 'string' ? item : item.toString(),
            onClick: () => {
                onClick(index, item)
                onFilter()
            },
            style: currentValue === index ? {
                backgroundColor: '#f0f0f0',
                fontWeight: 'bold'
            } : {}
        }))
    }

    const sortingMenu = createMenuItems(gameSorting, 'sort', stats.sort, (i: number) => {
        state.sort = i
    })

    const categoryMenu = createMenuItems(category, 'category', stats.category, (i: number) => {
        state.category = i
    })

    const sizeGameMenu = createMenuItems(
        Object.entries(interestObj).map(([key]) => key),
        'size', 
        stats.size,
        (num: number, item: keyof typeof interestObj) => {
            state.size = interestObj[item]
        }
    )

    const transTypeMenu = createMenuItems(
        Object.entries(translationType).map(([key, value]) => key),
        'trans',
        stats.transType,
        (num: number) => {
            state.transType = num
        }
    )

    const resetFilters = () => {
        state.sort = 1
        state.search = ""
        state.category = 0
        state.size = 0
        state.transType = 0
        onFilter()
    }

    return (
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
                    value={stats.search}
                    onChange={(e) => {
                        state.search = e.target.value
                        onFilter()
                    }}
                    allowClear={false}
                />
            </span>
            <span className="rightBar">
                {!loading && (
                    <div className="gameCount">Zobrazeno {gamesCount} překladů</div>
                )}
            </span>
        </div>
    )
}

export default FilterBar
