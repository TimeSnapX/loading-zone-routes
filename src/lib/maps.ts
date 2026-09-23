/** Build a Google Maps directions URL for a destination. */
export function directionsUrl(lat: number, lng: number, address?: string): string {
  const dest =
    Number.isFinite(lat) && Number.isFinite(lng)
      ? `${lat},${lng}`
      : encodeURIComponent(address || '')
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}`
}

export function openDirections(lat: number, lng: number, address?: string) {
  window.open(directionsUrl(lat, lng, address), '_blank', 'noopener,noreferrer')
}
