import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchBar } from '../components/SearchBar'
import { ZoneCard } from '../components/ZoneCard'
import { ZoneMap } from '../components/ZoneMap'
import type { Zone } from '../types/zone'

interface Props {
  zones: Zone[]
}

export function HomePage({ zones }: Props) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<'map' | 'list'>('map')
  const [selectedId, setSelectedId] = useState<string | undefined>()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return zones
    return zones.filter(
      (z) =>
        z.name.toLowerCase().includes(q) ||
        z.suburb.toLowerCase().includes(q) ||
        z.address.toLowerCase().includes(q),
    )
  }, [zones, query])

  return (
    <div className="page">
      <div className="badge" role="status">
        Starter zones — refine from real drops
      </div>

      <SearchBar value={query} onChange={setQuery} />

      <div className="tabs" role="tablist" aria-label="View">
        <button
          type="button"
          className="tabs__btn"
          role="tab"
          aria-selected={tab === 'map'}
          onClick={() => setTab('map')}
        >
          Map
        </button>
        <button
          type="button"
          className="tabs__btn"
          role="tab"
          aria-selected={tab === 'list'}
          onClick={() => setTab('list')}
        >
          List
        </button>
      </div>

      {tab === 'map' ? (
        <>
          <ZoneMap
            zones={filtered}
            selectedId={selectedId}
            onSelect={(id) => {
              setSelectedId(id)
            }}
          />
          <p className="muted" style={{ margin: 0 }}>
            {filtered.length} zone{filtered.length === 1 ? '' : 's'}
            {selectedId
              ? ` · tap a pin, then open below`
              : ' · tap a pin or switch to List'}
          </p>
          {selectedId ? (
            (() => {
              const z = filtered.find((x) => x.id === selectedId)
              return z ? (
                <ZoneCard zone={z} onClick={() => navigate(`/zone/${z.id}`)} />
              ) : null
            })()
          ) : (
            <div className="list">
              {filtered.slice(0, 3).map((z) => (
                <ZoneCard key={z.id} zone={z} onClick={() => navigate(`/zone/${z.id}`)} />
              ))}
              {filtered.length > 3 ? (
                <button
                  type="button"
                  className="btn btn--ghost btn--block"
                  onClick={() => setTab('list')}
                >
                  Show all {filtered.length} in list
                </button>
              ) : null}
            </div>
          )}
        </>
      ) : (
        <div className="list">
          {filtered.length === 0 ? (
            <div className="card empty">No zones match “{query}”.</div>
          ) : (
            filtered.map((z) => (
              <ZoneCard key={z.id} zone={z} onClick={() => navigate(`/zone/${z.id}`)} />
            ))
          )}
        </div>
      )}

      <div className="fab-bar">
        <button
          type="button"
          className="btn btn--primary btn--block"
          onClick={() => navigate('/add')}
        >
          + Add custom zone
        </button>
      </div>
    </div>
  )
}
