import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Zone, ZoneCategory } from '../types/zone'

interface Props {
  getZone: (id: string) => Zone | undefined
  addCustomZone: (zone: Omit<Zone, 'id' | 'custom' | 'starter'>) => string
  updateZone: (id: string, patch: Partial<Zone>) => void
}

const empty = {
  name: '',
  suburb: '',
  address: '',
  lat: -27.47,
  lng: 153.02,
  accessNotes: '',
  typicalWindow: '',
  truckConstraints: '',
  tips: '',
  category: 'other' as ZoneCategory,
}

export function ZoneFormPage({ getZone, addCustomZone, updateZone }: Props) {
  const { id } = useParams()
  const navigate = useNavigate()
  const existing = id ? getZone(id) : undefined
  const isEdit = Boolean(existing)

  const [form, setForm] = useState(() =>
    existing
      ? {
          name: existing.name,
          suburb: existing.suburb,
          address: existing.address,
          lat: existing.lat,
          lng: existing.lng,
          accessNotes: existing.accessNotes,
          typicalWindow: existing.typicalWindow,
          truckConstraints: existing.truckConstraints,
          tips: existing.tips,
          category: existing.category,
        }
      : empty,
  )

  const set =
    (key: keyof typeof form) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const raw = e.target.value
      if (key === 'lat' || key === 'lng') {
        setForm((f) => ({ ...f, [key]: Number(raw) }))
      } else if (key === 'category') {
        setForm((f) => ({ ...f, category: raw as ZoneCategory }))
      } else {
        setForm((f) => ({ ...f, [key]: raw }))
      }
    }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.suburb.trim()) return
    if (!Number.isFinite(form.lat) || !Number.isFinite(form.lng)) return

    const payload = {
      name: form.name.trim(),
      suburb: form.suburb.trim(),
      address: form.address.trim(),
      lat: form.lat,
      lng: form.lng,
      accessNotes: form.accessNotes.trim(),
      typicalWindow: form.typicalWindow.trim(),
      truckConstraints: form.truckConstraints.trim(),
      tips: form.tips.trim(),
      category: form.category,
    }

    if (isEdit && id) {
      updateZone(id, payload)
      navigate(`/zone/${id}`)
    } else {
      const newId = addCustomZone(payload)
      navigate(`/zone/${newId}`)
    }
  }

  return (
    <div className="page">
      <button type="button" className="detail__back" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h1 className="detail__name">{isEdit ? 'Edit zone' : 'Add custom zone'}</h1>
      <p className="muted" style={{ margin: 0 }}>
        {isEdit
          ? 'Changes are saved on this device (localStorage).'
          : 'Custom zones stay on this device until you clear site data.'}
      </p>

      <form className="form-grid" onSubmit={submit}>
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" required value={form.name} onChange={set('name')} />
        </div>
        <div className="field">
          <label htmlFor="suburb">Suburb</label>
          <input id="suburb" required value={form.suburb} onChange={set('suburb')} />
        </div>
        <div className="field">
          <label htmlFor="address">Address</label>
          <input id="address" value={form.address} onChange={set('address')} />
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor="lat">Latitude</label>
            <input
              id="lat"
              type="number"
              step="any"
              required
              value={form.lat}
              onChange={set('lat')}
            />
          </div>
          <div className="field">
            <label htmlFor="lng">Longitude</label>
            <input
              id="lng"
              type="number"
              step="any"
              required
              value={form.lng}
              onChange={set('lng')}
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" value={form.category} onChange={set('category')}>
            <option value="liquor">Liquor</option>
            <option value="supermarket">Supermarket</option>
            <option value="depot">Depot</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="access">Access notes</label>
          <textarea id="access" value={form.accessNotes} onChange={set('accessNotes')} rows={3} />
        </div>
        <div className="field">
          <label htmlFor="window">Typical window</label>
          <input id="window" value={form.typicalWindow} onChange={set('typicalWindow')} />
        </div>
        <div className="field">
          <label htmlFor="truck">Truck constraints</label>
          <textarea
            id="truck"
            value={form.truckConstraints}
            onChange={set('truckConstraints')}
            rows={2}
          />
        </div>
        <div className="field">
          <label htmlFor="tips">Tips</label>
          <textarea id="tips" value={form.tips} onChange={set('tips')} rows={2} />
        </div>
        <button type="submit" className="btn btn--primary btn--block">
          {isEdit ? 'Save changes' : 'Add zone'}
        </button>
      </form>
    </div>
  )
}
