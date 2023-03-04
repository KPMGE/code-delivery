type Position = {
  lat: number
  lng: number
}

export type Route = {
  id: string
  title: string
  startPosition: Position
  endPosition: Position
}
