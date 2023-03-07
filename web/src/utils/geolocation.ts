type Position = {
  lat: number
  lng: number
}

export const getCurrentPositon = (options?: PositionOptions): Promise<Position> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }),
      (err) => reject(err),
      options
    )
  })
}
