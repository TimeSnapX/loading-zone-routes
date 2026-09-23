import type { Zone } from '../types/zone'

const categoryLabel: Record<string, string> = {
  liquor: 'Liquor',
  supermarket: 'Supermarket',
  depot: 'Depot',
  other: 'Other',
}

interface Props {
  zone: Zone
  onClick: () => void
}

export function ZoneCard({ zone, onClick }: Props) {
  return (
    <button type="button" className="card zone-card" onClick={onClick}>
      <div className="zone-card__row">
        <div className="zone-card__pin" aria-hidden>
          📍
        </div>
        <div className="zone-card__meta">
          <h3 className="zone-card__name">{zone.name}</h3>
          <p className="zone-card__suburb">{zone.suburb}</p>
        </div>
      </div>
      <p className="zone-card__notes">{zone.accessNotes}</p>
      <div className="zone-card__tags">
        <span className={`tag tag--${zone.category}`}>
          {categoryLabel[zone.category] ?? zone.category}
        </span>
        {zone.typicalWindow ? <span className="tag">{zone.typicalWindow}</span> : null}
        {zone.custom ? <span className="tag tag--custom">Custom</span> : null}
        {zone.starter ? <span className="tag">Starter</span> : null}
      </div>
    </button>
  )
}
