import { proxy, useSnapshot } from 'valtio'
import { useQuery } from '@tanstack/react-query'
import type { Game } from '../types/types'

const state = proxy({
  games: [] as Game[],
  isLoading: true,
  error: null as Error | null
})

export function useGamesStore() {
  const { data, error } = useQuery<Game[]>({
    queryKey: ['games'],
    queryFn: async () => {
      const response = await fetch('/games.json')
      if (!response.ok) throw new Error('Failed to load games')
      const data = await response.json()
      
      return data.map((game: Game) => ({
        ...game,
        category: Number(game.category),
        size: Number(game.size),
        numDl: Number(game.numDl),
        translationType: Number(game.translationType),
        hiddenWeb: game.hiddenWeb === "1",
        changed: game.changed ? new Date(game.changed) : undefined,
        added: game.added ? new Date(game.added) : undefined
      }))
    },
    staleTime: Infinity // Never refetch automatically
  })

  // Update state when data changes
  if (data && state.games !== data) {
    state.games = data
    state.isLoading = false
    state.error = null
  } else if (error) {
    state.error = error
    state.isLoading = false
  }

  return useSnapshot(state)
}
