import { useCallback, useEffect, useMemo, useState } from 'react'
import seedZones from '../data/zones.json'
import type { Zone, ZoneNotesMap } from '../types/zone'

const CUSTOM_KEY = 'lzr-custom-zones'
const NOTES_KEY = 'lzr-zone-notes'
const EDITS_KEY = 'lzr-zone-edits'

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

/** Normalise legacy localStorage / seed shapes into the current Zone model. */
function normaliseZone(raw: Record<string, unknown>): Zone {
  const tipsRaw = raw.tips
  let tips: string[] = []
  if (Array.isArray(tipsRaw)) tips = tipsRaw.map(String)
  else if (typeof tipsRaw === 'string' && tipsRaw.trim()) tips = [tipsRaw.trim()]

  const brand =
    (typeof raw.brand === 'string' && raw.brand) ||
    (raw.category === 'liquor' ? 'Liquorland' : 'Other')

  return {
    id: String(raw.id ?? ''),
    name: String(raw.name ?? ''),
    brand,
    suburb: String(raw.suburb ?? ''),
    region: String(raw.region ?? ''),
    lat: Number(raw.lat),
    lng: Number(raw.lng),
    dockLat: raw.dockLat == null ? null : Number(raw.dockLat),
    dockLng: raw.dockLng == null ? null : Number(raw.dockLng),
    dockNotes: String(raw.dockNotes ?? ''),
    parkLat: raw.parkLat == null ? null : Number(raw.parkLat),
    parkLng: raw.parkLng == null ? null : Number(raw.parkLng),
    parkNotes: String(raw.parkNotes ?? ''),
    accessNotes: String(raw.accessNotes ?? ''),
    window: String(raw.window ?? raw.typicalWindow ?? ''),
    constraints: String(raw.constraints ?? raw.truckConstraints ?? ''),
    tips,
    tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
    starter: Boolean(raw.starter),
    custom: Boolean(raw.custom),
  }
}

const seed = (seedZones as Partial<Zone>[]).map(normaliseZone)

export function useZones() {
  const [customZones, setCustomZones] = useState<Zone[]>(() =>
    readJson<Partial<Zone>[]>(CUSTOM_KEY, []).map(normaliseZone),
  )
  const [edits, setEdits] = useState<Record<string, Partial<Zone>>>(() =>
    readJson(EDITS_KEY, {}),
  )
  const [notes, setNotes] = useState<ZoneNotesMap>(() =>
    readJson(NOTES_KEY, {}),
  )

  useEffect(() => {
    writeJson(CUSTOM_KEY, customZones)
  }, [customZones])

  useEffect(() => {
    writeJson(EDITS_KEY, edits)
  }, [edits])

  useEffect(() => {
    writeJson(NOTES_KEY, notes)
  }, [notes])

  const zones = useMemo(() => {
    const base = seed.map((z) => normaliseZone({ ...z, ...edits[z.id] }))
    const customIds = new Set(customZones.map((z) => z.id))
    const customs = customZones.map((z) =>
      normaliseZone({ ...z, ...edits[z.id], custom: true }),
    )
    return [...base.filter((z) => !customIds.has(z.id)), ...customs]
  }, [customZones, edits])

  const getZone = useCallback(
    (id: string) => zones.find((z) => z.id === id),
    [zones],
  )

  const saveNote = useCallback((id: string, note: string) => {
    setNotes((prev) => {
      const next = { ...prev }
      if (!note.trim()) delete next[id]
      else next[id] = note
      return next
    })
  }, [])

  const addCustomZone = useCallback(
    (zone: Omit<Zone, 'id' | 'custom' | 'starter'>) => {
      const id = `custom-${Date.now()}`
      const newZone: Zone = { ...zone, id, custom: true, starter: false }
      setCustomZones((prev) => [...prev, newZone])
      return id
    },
    [],
  )

  const updateZone = useCallback(
    (id: string, patch: Partial<Zone>) => {
      const isCustom = customZones.some((z) => z.id === id)
      if (isCustom) {
        setCustomZones((prev) =>
          prev.map((z) => (z.id === id ? { ...z, ...patch } : z)),
        )
      } else {
        setEdits((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }))
      }
    },
    [customZones],
  )

  const deleteCustomZone = useCallback((id: string) => {
    setCustomZones((prev) => prev.filter((z) => z.id !== id))
    setNotes((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setEdits((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [])

  return {
    zones,
    notes,
    getZone,
    saveNote,
    addCustomZone,
    updateZone,
    deleteCustomZone,
  }
}
