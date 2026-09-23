import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { openDirections } from '../lib/maps'
import type { Zone, ZoneNotesMap } from '../types/zone'
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
  const [tipsDraft, setTipsDraft] = useState(zone?.tips ?? '')

  if (!zone) {
    return (
      <div className="page">
        <Link to="/" className="detail__back">
          ← Back
        </Link>
        <div className="card empty">Zone not found.</div>
      </div>
    )
  }

  const personalNote = notes[zone.id] ?? ''

  return (
    <div className="page">
      <button type="button" className="detail__back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <header>
        <h1 className="detail__name">{zone.name}</h1>
        <p className="detail__suburb">
          {zone.suburb}
          {zone.address ? ` · ${zone.address}` : ''}
        </p>
        <div className="zone-card__tags" style={{ marginTop: '0.55rem' }}>
          {zone.starter ? <span className="badge">Starter data</span> : null}
          {zone.custom ? <span className="badge badge--muted">Custom</span> : null}
        </div>
      </header>

      <ZoneMap zones={[zone]} selectedId={zone.id} />

      <button
        type="button"
        className="btn btn--primary btn--block"
        onClick={() => openDirections(zone.lat, zone.lng, zone.address)}
      >
        Get there → Google Maps
      </button>

      <section className="card detail__section">
        <p className="detail__label">Access notes</p>
        <p className="detail__body">{zone.accessNotes || '—'}</p>
      </section>

      <section className="card detail__section">
        <p className="detail__label">Typical window</p>
        <p className="detail__body">{zone.typicalWindow || '—'}</p>
      </section>

      <section className="card detail__section">
        <p className="detail__label">Truck constraints</p>
        <p className="detail__body">{zone.truckConstraints || '—'}</p>
      </section>

      <section className="card detail__section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="detail__label">Tips</p>
          <button
            type="button"
            className="btn btn--ghost"
            style={{ minHeight: 36, padding: '0.35rem 0.7rem', fontSize: '0.85rem' }}
            onClick={() => {
              setTipsDraft(zone.tips)
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
            />
            <button
              type="button"
              className="btn btn--secondary btn--block"
              onClick={() => {
                updateZone(zone.id, { tips: tipsDraft.trim() })
                setEditingTips(false)
              }}
            >
              Save tips
            </button>
          </div>
        ) : (
          <p className="detail__body">{zone.tips || '—'}</p>
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
            Edit custom zone
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
            Delete custom zone
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="btn btn--secondary btn--block"
          onClick={() => navigate(`/edit/${zone.id}`)}
        >
          Edit zone details
        </button>
      )}
    </div>
  )
}
