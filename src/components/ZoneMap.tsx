import { useEffect, useMemo } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Zone } from '../types/zone'
import { useNavigate } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'

const pinIcon = (selected: boolean) =>
  L.divIcon({
    className: 'lzr-marker',
    html: `<div class="lzr-pin${selected ? ' lzr-pin--selected' : ''}"></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  })

function FitBounds({ zones, selectedId }: { zones: Zone[]; selectedId?: string }) {
  const map = useMap()

  useEffect(() => {
    if (!zones.length) return
    if (selectedId) {
      const z = zones.find((x) => x.id === selectedId)
      if (z) {
        map.flyTo([z.lat, z.lng], 14, { duration: 0.6 })
        return
      }
    }
    const bounds = L.latLngBounds(zones.map((z) => [z.lat, z.lng] as [number, number]))
    map.fitBounds(bounds.pad(0.15), { animate: false })
  }, [map, zones, selectedId])

  return null
}

interface Props {
  zones: Zone[]
  selectedId?: string
  onSelect?: (id: string) => void
}

export function ZoneMap({ zones, selectedId, onSelect }: Props) {
  const navigate = useNavigate()
  const centre = useMemo<[number, number]>(() => {
    if (!zones.length) return [-27.47, 153.02]
    const lat = zones.reduce((s, z) => s + z.lat, 0) / zones.length
    const lng = zones.reduce((s, z) => s + z.lng, 0) / zones.length
    return [lat, lng]
  }, [zones])

  return (
    <div className="map-wrap" role="region" aria-label="Loading zone map">
      <MapContainer
        center={centre}
        zoom={11}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds zones={zones} selectedId={selectedId} />
        {zones.map((z) => (
          <Marker
            key={z.id}
            position={[z.lat, z.lng]}
            icon={pinIcon(z.id === selectedId)}
            eventHandlers={{
              click: () => {
                onSelect?.(z.id)
              },
            }}
          >
            <Popup>
              <strong>{z.name}</strong>
              <br />
              {z.suburb}
              <br />
              <button
                type="button"
                onClick={() => navigate(`/zone/${z.id}`)}
                style={{
                  marginTop: 6,
                  cursor: 'pointer',
                  fontWeight: 700,
                  background: '#ffbf00',
                  border: 'none',
                  borderRadius: 8,
                  padding: '6px 10px',
                }}
              >
                Open
              </button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
