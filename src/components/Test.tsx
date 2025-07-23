import { useSnapshot } from 'valtio'
import { proxy } from 'valtio'
import { useMemo } from 'react'

export default function Test() {
  const state = useMemo(() => proxy({ open: false, count: 0 }), [])
  const snap = useSnapshot(state)

  return (
    <div>
      <p>Počet: {snap.count}</p>
      <button onClick={() => state.count++}>+1</button>
      <button onClick={() => state.open = !state.open}>
        {snap.open ? 'Zavřít' : 'Otevřít'}
      </button>
    </div>
  )
}