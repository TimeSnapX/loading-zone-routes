export type ZoneCategory = 'liquor' | 'supermarket' | 'depot' | 'other'

export interface Zone {
  id: string
  name: string
  suburb: string
  address: string
  lat: number
  lng: number
  accessNotes: string
  typicalWindow: string
  truckConstraints: string
  tips: string
  category: ZoneCategory
  starter?: boolean
  custom?: boolean
}

export type ZoneNotesMap = Record<string, string>
