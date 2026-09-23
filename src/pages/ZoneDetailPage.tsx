import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { openDirections } from '../lib/maps'
import {
  destCoords,
  hasParkCoords,
  type Zone,
  type ZoneNotesMap,
} from '../types/zone'
import { ZoneMap } from '../components/ZoneMap'

interface Props {
  getZone: (id: string) => Zone | undefined
  notes: ZoneNotesMap
  saveNote: (id: string, note: string) => void
  updateZone: (id: string, patch: Partial<Zone>) => void
  deleteCustomZone: (id: string) => void
}

export function ZoneDetailPage({
  getZone,
  notes,
  saveNote,
  updateZone,
  deleteCustomZone,
}: Props) {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const zone = getZone(id)
  const [editingNote, setEditingNote] = useState(false)
  const [noteDraft, setNoteDraft] = useState(notes[id] ?? '')
  const [editingTips, setEditingTips] = useState(false)
  const [tipsDraft, setTipsDraft] = useState(
    zone ? zone.tips.join('\n') : '',
  )

  if (!zone) {
    return (
      <div className="page">
        <Link to="/" className="detail__back">
          ← Back
        </Link>
        <div className="card empty">Store not found.</div>
      </div>
    )
  }

  const personalNote = notes[zone.id] ?? ''
  const dest = destCoords(zone)
  const parkOk = hasParkCoords(zone)

  return (
    <div className="page">
      <button type="button" className="detail__back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <header>
        <p className="detail__suburb-strong">{zone.suburb}</p>
        <h1 className="detail__name">{zone.name}</h1>
        <p className="detail__suburb">
          {zone.brand}
          {zone.region ? ` · ${zone.region}` : ''}
        </p>
        <div className="zone-card__tags" style={{ marginTop: '0.55rem' }}>
          {zone.starter ? <span className="badge">Starter data</span> : null}
          {zone.custom ? <span className="badge badge--muted">Custom</span> : null}
          <span className="badge badge--muted">
            {dest.kind === 'dock' ? 'Dock pin ready' : 'Store pin · dock TBD'}
          </span>
        </div>
      </header>

      <ZoneMap zones={[zone]} selectedId={zone.id} showParkMarkers />

      <div className="btn-row">
        <button
          type="button"
          className="btn btn--primary btn--block"
          onClick={() =>
            openDirections(dest.lat, dest.lng, `${zone.name} ${zone.suburb}`)
          }
        >
          Get there → {dest.kind === 'dock' ? 'Dock' : 'Store'} (Maps)
        </button>
        {parkOk ? (
          <button
            type="button"
            className="btn btn--secondary btn--block"
            onClick={() =>
              openDirections(
                zone.parkLat!,
                zone.parkLng!,
                `Park-up ${zone.name}`,
              )
            }
          >
            Park-up → Maps
          </button>
        ) : null}
      </div>

      <section className="card detail__section">
        <p className="detail__label">Dock notes</p>
        <p className="detail__body">{zone.dockNotes || '—'}</p>
        {dest.kind === 'store' ? (
          <p className="muted" style={{ margin: 0 }}>
            No verified dock GPS yet — Get there uses the store pin.
          </p>
        ) : null}
      </section>

      <section className="card detail__section">
        <p className="detail__label">Best park for storefront</p>
        <p className="detail__body">{zone.parkNotes || '—'}</p>
        {!parkOk ? (
          <p className="muted" style={{ margin: 0 }}>
            No park-up coords yet — guidance above only.
          </p>
        ) : null}
      </section>

      <section className="card detail__section">
        <p className="detail__label">Access notes</p>
        <p className="detail__body">{zone.accessNotes || '—'}</p>
      </section>

      <section className="card detail__section">
        <p className="detail__label">Typical window</p>
        <p className="detail__body">{zone.window || '—'}</p>
      </section>

      <section className="card detail__section">
        <p className="detail__label">Truck constraints</p>
        <p className="detail__body">{zone.constraints || '—'}</p>
      </section>

      <section className="card detail__section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="detail__label">Tips</p>
          <button
            type="button"
            className="btn btn--ghost"
            style={{ minHeight: 36, padding: '0.35rem 0.7rem', fontSize: '0.85rem' }}
            onClick={() => {
              setTipsDraft(zone.tips.join('\n'))
              setEditingTips((v) => !v)
            }}
          >
            {editingTips ? 'Cancel' : 'Edit'}
          </button>
        </div>
        {editingTips ? (
          <div className="form-grid">
            <textarea
              value={tipsDraft}
              onChange={(e) => setTipsDraft(e.target.value)}
              rows={3}
              placeholder="One tip per line"
            />
            <button
              type="button"
              className="btn btn--secondary btn--block"
              onClick={() => {
                const tips = tipsDraft
                  .split('\n')
                  .map((t) => t.trim())
                  .filter(Boolean)
                updateZone(zone.id, { tips })
                setEditingTips(false)
              }}
            >
              Save tips
            </button>
          </div>
        ) : zone.tips.length ? (
          <ul className="detail__tips">
            {zone.tips.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        ) : (
          <p className="detail__body">—</p>
        )}
      </section>

      <section className="card detail__section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="detail__label">Your notes</p>
          <button
            type="button"
            className="btn btn--ghost"
            style={{ minHeight: 36, padding: '0.35rem 0.7rem', fontSize: '0.85rem' }}
            onClick={() => {
              setNoteDraft(personalNote)
              setEditingNote((v) => !v)
            }}
          >
            {editingNote ? 'Cancel' : personalNote ? 'Edit' : 'Add'}
          </button>
        </div>
        {editingNote ? (
          <div className="form-grid">
            <textarea
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="Gate codes, quirks from real drops…"
              rows={4}
            />
            <button
              type="button"
              className="btn btn--secondary btn--block"
              onClick={() => {
                saveNote(zone.id, noteDraft)
                setEditingNote(false)
              }}
            >
              Save note
            </button>
          </div>
        ) : (
          <p className="detail__body muted">
            {personalNote || 'No personal notes yet — add what you learn on the run.'}
          </p>
        )}
      </section>

      {zone.custom ? (
        <div className="btn-row">
          <button
            type="button"
            className="btn btn--secondary btn--block"
            onClick={() => navigate(`/edit/${zone.id}`)}
          >
            Edit custom store
          </button>
          <button
            type="button"
            className="btn btn--danger btn--block"
            onClick={() => {
              if (confirm(`Delete “${zone.name}”?`)) {
                deleteCustomZone(zone.id)
                navigate('/')
              }
            }}
          >
            Delete custom store
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="btn btn--secondary btn--block"
          onClick={() => navigate(`/edit/${zone.id}`)}
        >
          Edit store details
        </button>
      )}
    </div>
  )
}
