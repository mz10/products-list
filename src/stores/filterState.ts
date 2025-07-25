import { proxy } from 'valtio'
import type { Game } from '../types/types'

export const filterState = proxy({
    games: [] as Game[],
    loading: true,
    sort: 0,
    search: "",
    category: 0,
    size: 0,
    transType: 0,
})