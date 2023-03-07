import { Button, Grid, MenuItem, Select } from "@material-ui/core"
import { Loader } from "google-maps";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react"
import { getCurrentPositon } from "../utils/geolocation";
import { Route } from "../utils/models";

const API_URL = process.env.REACT_APP_API_URL
const googleMapsLoader = new Loader(process.env.REACT_APP_GOOGLE_API_KEY)

export const Mapping = () => {
  const [routes, setRoutes] = useState<Route[]>([])
  const [routeIdSelected, setRouteIdSelected] = useState<string>('')
  const mapRef = useRef<google.maps.Map>()

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch(`${API_URL}/routes`)
        const jsonResponse = await response.json()
        // console.log('routes: ', jsonResponse)
        setRoutes(jsonResponse)
      } catch (error) {
        console.error('ERROR: ', error)
      }
    }

    fetchRoutes()
  }, [])

  useEffect(() => {
    (async () => {
      const [, position] = await Promise.all([
        googleMapsLoader.load(), 
        getCurrentPositon({ enableHighAccuracy: true })
      ])
      const divMap = document.getElementById('map') as HTMLElement
      mapRef.current = new google.maps.Map(divMap, {
        zoom: 15,
        center: position
      })
    })()

  }, [])

  const startRoute = useCallback((event: FormEvent) => {
    event.preventDefault()
  }, [])

  return (
    <Grid container>
      <Grid item xs={12} sm={3}>
        <form onSubmit={startRoute}>
          <Select
            fullWidth
            displayEmpty
            value={routeIdSelected}
            onChange={(event) => setRouteIdSelected(event.target.value as string)}
          >
            <MenuItem value=''>Selecione uma rota</MenuItem>
            {routes.map((route, key) => <MenuItem key={key} value={route.id}>{route.title}</MenuItem>)}
          </Select>

          <Button type='submit' color='primary' variant='contained'>
            Iniciar corrida
          </Button>
        </form>
      </Grid>
      <Grid item xs={12} sm={9}>
        <div id='map' style={{ width: '100%', height: '100vh' }}></div>
      </Grid>
    </Grid>
  )
}
